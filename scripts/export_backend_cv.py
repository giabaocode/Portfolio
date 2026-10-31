"""Export the website's backend résumé into a one-page, text-selectable PDF."""
from pathlib import Path
from html import escape
from html.parser import HTMLParser
import shutil
import reportlab
from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Table, TableStyle, Spacer, KeepTogether

ROOT = Path(__file__).resolve().parents[1]


class Node:
    def __init__(self, tag, attrs=()):
        self.tag, self.attrs, self.children = tag, dict(attrs), []

    def text(self):
        return ''.join(x.text() if isinstance(x, Node) else x for x in self.children).strip()

    def find(self, tag):
        for child in self.children:
            if isinstance(child, Node):
                if child.tag == tag: return child
                found = child.find(tag)
                if found: return found


class Parser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.root = Node('root')
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs)
        self.stack[-1].children.append(node)
        if tag not in {'meta', 'link', 'br', 'img', 'input', 'hr'}: self.stack.append(node)

    def handle_endtag(self, tag):
        for index in range(len(self.stack)-1, 0, -1):
            if self.stack[index].tag == tag:
                del self.stack[index:]
                break

    def handle_data(self, data):
        self.stack[-1].children.append(data)


def main():
    # ReportLab ships these fonts; PDF generation is identical on macOS and CI.
    font_dir = Path(reportlab.__file__).parent/'fonts'
    normal, bold = font_dir/'Vera.ttf', font_dir/'VeraBd.ttf'
    pdfmetrics.registerFont(TTFont('CV', str(normal)))
    pdfmetrics.registerFont(TTFont('CV-Bold', str(bold)))
    pdfmetrics.registerFontFamily('CV', normal='CV', bold='CV-Bold')
    ink = colors.HexColor('#213c2c')
    muted = colors.HexColor('#526454')
    styles = {
        'name': ParagraphStyle('name',fontName='CV-Bold',fontSize=21,leading=25,textColor=ink,spaceAfter=5),
        'label': ParagraphStyle('label',fontName='CV-Bold',fontSize=7.8,leading=11,textColor=muted,spaceAfter=5),
        'contact': ParagraphStyle('contact',fontName='CV',fontSize=8,leading=11,textColor=muted,spaceAfter=3),
        'heading': ParagraphStyle('heading',fontName='CV-Bold',fontSize=8.5,leading=12,textColor=ink,spaceBefore=12,spaceAfter=6,borderWidth=.4,borderColor=colors.HexColor('#cbd6c8'),borderPadding=4),
        'body': ParagraphStyle('body',fontName='CV',fontSize=9,leading=12.1,textColor=ink,spaceAfter=3),
        'title': ParagraphStyle('title',fontName='CV-Bold',fontSize=9,leading=12,textColor=ink),
        'date': ParagraphStyle('date',fontName='CV',fontSize=7.6,leading=12,textColor=muted,alignment=TA_RIGHT),
        'sub': ParagraphStyle('sub',fontName='CV',fontSize=7.8,leading=10.5,textColor=muted,spaceAfter=3),
        'bullet': ParagraphStyle('bullet',fontName='CV',fontSize=8.8,leading=11.8,textColor=ink,leftIndent=10,firstLineIndent=-7,spaceAfter=3),
        'foot': ParagraphStyle('foot',fontName='CV',fontSize=6.7,leading=9,textColor=muted,spaceBefore=9),
    }
    parser = Parser()
    parser.feed((ROOT/'assets/Resume.html').read_text())
    main_node = parser.root.find('main')
    header = main_node.find('header')
    story = []
    def para(text, style='body'):
        # Keep the PDF's typography portable and its dashes simple.
        text = text.replace('—','-').replace('–','-').replace('\u2011','-')
        return Paragraph(escape(text), styles[style])
    for child in header.children:
        if not isinstance(child,Node): continue
        kind = 'name' if child.tag == 'h1' else ('label' if child.attrs.get('class') == 'resume-label' else 'contact')
        if kind == 'contact':
            parts=[]
            for item in child.children:
                if isinstance(item,Node) and item.tag=='a':
                    parts.append(f'<link href="{escape(item.attrs["href"],quote=True)}">{escape(item.text())}</link>')
                elif isinstance(item,str): parts.append(escape(item))
            story.append(Paragraph(''.join(parts), styles[kind]))
        else: story.append(para(child.text(),kind))
    content_width = A4[0] - 30*mm
    def render(node):
        if node.tag == 'h2': return [para(node.text().upper(),'heading')]
        if node.tag == 'p': return [para(node.text(),'sub' if node.attrs.get('class')=='resume-sub' else 'body')]
        if node.attrs.get('class') == 'resume-row':
            row=Table([[para(node.find('h3').text(),'title'),para(node.find('span').text(),'date')]],colWidths=[content_width*.77,content_width*.23])
            row.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),0),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),2)]))
            return [row]
        if node.tag == 'li': return [para('• '+node.text(),'bullet')]
        pieces=[]
        for child in node.children:
            if isinstance(child,Node): pieces.extend(render(child))
        if node.tag=='article': return [KeepTogether(pieces),Spacer(1,4)]
        return pieces
    for child in main_node.children:
        if not isinstance(child,Node) or child.tag=='header': continue
        if child.attrs.get('class')=='resume-foot': story.append(para(child.text(),'foot'))
        else: story.extend(render(child))
    output=ROOT/'output/pdf/Pham_Ngoc_Gia_Bao_Java_Backend.pdf'
    output.parent.mkdir(parents=True,exist_ok=True)
    doc=SimpleDocTemplate(str(output),pagesize=A4,leftMargin=15*mm,rightMargin=15*mm,topMargin=13*mm,bottomMargin=12*mm,title='Pham Ngoc Gia Bao - Java Backend Intern / Fresher',author='Pham Ngoc Gia Bao')
    doc.build(story)
    shutil.copy2(output,ROOT/'assets'/output.name)
    print(output)


if __name__=='__main__': main()
