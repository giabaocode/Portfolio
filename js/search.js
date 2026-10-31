export function initSearch(dialogs) {
  const dialog = document.querySelector('#search-dialog');
  const input = document.querySelector('#search-input');
  const results = document.querySelector('#search-results');
  const source = document.querySelector('#search-data');
  if (!dialog || !input || !results || !source) return;
  const entries = JSON.parse(source.textContent);
  let matches = entries;
  let active = 0;
  const empty = document.createElement('p');
  empty.className = 'search-empty';
  empty.setAttribute('role', 'status');
  empty.hidden = true;
  results.after(empty);
  function select(index) {
    active = index;
    const options = [...results.children];
    options.forEach((option, i) => option.setAttribute('aria-selected', String(i === active)));
    if (options[active]) {
      input.setAttribute('aria-activedescendant', options[active].id);
      options[active].scrollIntoView({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
  }
  function render() {
    const query = input.value.trim().toLocaleLowerCase();
    matches = entries.filter(entry => !query || `${entry.title} ${entry.description} ${entry.category} ${entry.keywords || ''}`.toLocaleLowerCase().includes(query));
    results.replaceChildren();
    empty.hidden = matches.length !== 0;
    // Search text is always a text node. It never passes through an HTML parser.
    empty.textContent = `No results for “${input.value}”. Try Java, SSTC, AI or résumé.`;
    matches.forEach((entry, index) => {
      const option = document.createElement('a');
      option.className = 'search-result';
      option.id = `search-option-${index}`;
      option.href = entry.href;
      option.setAttribute('role', 'option');
      option.tabIndex = -1;
      const copy = document.createElement('div');
      const title = document.createElement('strong');
      const description = document.createElement('small');
      const badge = document.createElement('span');
      title.textContent = entry.title;
      description.textContent = entry.description;
      badge.textContent = entry.category;
      badge.className = 'mono';
      copy.append(title, description);
      option.append(copy, badge);
      option.addEventListener('click', () => dialogs.close(dialog));
      results.append(option);
    });
    select(0);
  }
  function open(trigger) {
    input.value = '';
    render();
    dialogs.open(dialog, trigger);
    input.focus();
  }
  document.querySelectorAll('.search-trigger').forEach(button => button.addEventListener('click', () => open(button)));
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      if (dialog.open) dialogs.close(dialog); else open(document.activeElement);
    }
  });
  input.addEventListener('input', render);
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (matches.length) select((active + (event.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length);
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      results.children[active]?.click();
    }
  });
}
