(() => {
  'use strict';
  const CONTACT_EMAIL = 'contact@example.com'; // change this to your email
  const CATS = ['Bollywood', 'Hollywood', 'South', 'Web Series'];
  const KEY = 'ff_movies';
  const app = document.getElementById('app');
  const $ = (s, r = document) => r.querySelector(s);
  let movies = [], timer;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const safeUrl = (u) => (/^https?:\/\//i.test((u || '').trim()) ? u.trim() : '');
  const quals = (m) => [['480p', m.dl480], ['720p', m.dl720], ['1080p', m.dl1080]].filter((x) => x[1]).map((x) => x[0]);
  const ytId = (u) => ((u || '').match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) || [])[1] || null;
  const genres = (m) => String(m.genre || '').split(',').map((g) => g.trim()).filter(Boolean);
  const setTitle = (t) => { document.title = t ? `${t} | FilmFlow` : 'FilmFlow – Find Your Favourite Movies'; };
  const setDesc = (d) => { let m = $('meta[name=description]'); if (m && d) m.content = d.slice(0, 155); };
  const sorted = (l) => l.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  const persist = () => localStorage.setItem(KEY, JSON.stringify(movies));

  async function load() {
    try { const l = localStorage.getItem(KEY); if (l) { movies = sorted(JSON.parse(l)); return; } } catch (e) {}
    try { movies = sorted(await (await fetch('data/movies.json')).json()); } catch (e) { movies = []; }
  }

  const card = (m) => {
    const q = quals(m).pop();
    return `<a class="card" href="#/movie/${encodeURIComponent(m.slug)}"><div class="poster">${m.poster ? `<img src="${esc(m.poster)}" alt="${esc(m.title)} poster" loading="lazy">` : `<span>${esc(m.title)}</span>`}${q ? `<b class="badge">${q}</b>` : ''}${m.rating > 0 ? `<b class="rate">★ ${(+m.rating).toFixed(1)}</b>` : ''}</div><h3>${esc(m.title)}</h3><p>${esc(m.year)}</p></a>`;
  };

  function slider(list) {
    const el = $('#slider');
    if (!list.length) { el.remove(); return; }
    let i = 0;
    const draw = () => {
      const m = list[i];
      el.innerHTML = `<section class="hero" aria-label="Trending movies">${m.poster ? `<img class="bg" src="${esc(m.poster)}" alt="">` : ''}<div class="heroin">${m.poster ? `<img class="hp" src="${esc(m.poster)}" alt="${esc(m.title)} poster">` : ''}<div><small>Trending now</small><h2>${esc(m.title)}</h2><p class="muted">${esc(m.year)} · ${esc(m.genre)} · ${esc(m.language)}</p><p class="desc">${esc(m.description)}</p><a class="btn" href="#/movie/${encodeURIComponent(m.slug)}">View details</a></div></div><div class="dots">${list.map((x, n) => `<button data-i="${n}" aria-label="Show ${esc(x.title)}" class="${n === i ? 'on' : ''}"></button>`).join('')}</div></section>`;
      el.querySelectorAll('.dots button').forEach((b) => { b.onclick = () => { i = +b.dataset.i; draw(); }; });
    };
    draw();
    if (list.length > 1 && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => { i = (i + 1) % list.length; draw(); }, 5500);
  }

  function home(p) {
    const q = p.get('q') || '', cat = p.get('cat') || '', g = p.get('genre') || '', y = p.get('year') || '';
    const list = movies.filter((m) => (!q || m.title.toLowerCase().includes(q.toLowerCase())) && (!cat || m.category === cat) && (!g || genres(m).includes(g)) && (!y || String(m.year) === y));
    const filtering = q || cat || g || y;
    const gs = [...new Set(movies.flatMap(genres))].sort();
    const ys = [...new Set(movies.map((m) => m.year))].sort((a, b) => b - a);
    setTitle(cat); setDesc('FilmFlow helps you find your favourite movies and web series across Bollywood, Hollywood and South cinema.');
    app.innerHTML = `${filtering ? '' : '<div id="slider"></div>'}<div class="bar"><h1>${q ? `Results for “${esc(q)}”` : esc(cat) || 'Latest movies'}</h1><div class="filters"><select id="fg" aria-label="Filter by genre"><option value="">All genres</option>${gs.map((x) => `<option ${x === g ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select><select id="fy" aria-label="Filter by year"><option value="">All years</option>${ys.map((x) => `<option ${String(x) === y ? 'selected' : ''}>${esc(x)}</option>`).join('')}</select>${filtering ? '<a href="#/">Clear filters</a>' : ''}</div></div>${list.length ? `<div class="grid">${list.map(card).join('')}</div>` : '<p class="muted">No movies match these filters. Try a different search or clear the filters.</p>'}`;
    const go = (k, v) => { const n = new URLSearchParams(p); v ? n.set(k, v) : n.delete(k); location.hash = '#/?' + n; };
    $('#fg').onchange = (e) => go('genre', e.target.value);
    $('#fy').onchange = (e) => go('year', e.target.value);
    if (!filtering) { const t = movies.filter((m) => m.trending).slice(0, 6); slider(t.length ? t : movies.slice(0, 5)); }
  }

  function movie(slug) {
    const m = movies.find((x) => x.slug === slug);
    if (!m) { setTitle('Not found'); app.innerHTML = '<h1>Movie not found</h1><p class="muted">It may have been removed. <a href="#/" style="color:var(--brand2)">Back to home</a></p>'; return; }
    setTitle(`${m.title} (${m.year})`); setDesc(m.description);
    const vid = ytId(m.trailer), gl = genres(m);
    const related = movies.filter((x) => x.id !== m.id && (x.category === m.category || genres(x).some((g) => gl.includes(g)))).slice(0, 6);
    const dl = [['480p', m.dl480], ['720p', m.dl720], ['1080p', m.dl1080]].map(([q, l]) => l ? `<a class="btn" href="${esc(l)}" target="_blank" rel="nofollow noopener noreferrer">Download ${q}</a>` : `<span class="off" aria-disabled="true">Download ${q}</span>`).join('');
    app.innerHTML = `<article><div class="detail"><div class="poster">${m.poster ? `<img src="${esc(m.poster)}" alt="${esc(m.title)} poster">` : `<span>${esc(m.title)}</span>`}</div><div><h1>${esc(m.title)} <span>(${esc(m.year)})</span></h1><dl><dt>Genre</dt><dd>${esc(m.genre)}</dd><dt>Language</dt><dd>${esc(m.language)}</dd><dt>Category</dt><dd>${esc(m.category)}</dd><dt>IMDb rating</dt><dd style="color:#fcd34d;font-weight:600">${m.rating > 0 ? `★ ${(+m.rating).toFixed(1)} / 10` : 'Not rated'}</dd></dl><h2 class="sec">Storyline</h2><p class="prose">${esc(m.description)}</p><h2 class="sec">Downloads</h2><div class="dls">${dl}</div><p class="muted small">Links open on an external site. FilmFlow does not host any files.</p></div></div>${vid ? `<h2 class="sec">Trailer</h2><div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${vid}" title="${esc(m.title)} trailer" loading="lazy" allowfullscreen></iframe></div>` : ''}${related.length ? `<h2 class="sec">Related movies</h2><div class="grid">${related.map(card).join('')}</div>` : ''}</article>`;
  }

  function text(title, html) { setTitle(title); app.innerHTML = `<div class="prose"><h1>${title}</h1>${html}</div>`; }

  function admin() {
    setTitle('Admin');
    const f = [['title', 'Title'], ['poster', 'Poster image URL'], ['genre', 'Genre (comma separated)'], ['year', 'Year'], ['language', 'Language'], ['rating', 'IMDb rating (0–10)'], ['trailer', 'YouTube trailer link'], ['dl480', 'Download link 480p'], ['dl720', 'Download link 720p'], ['dl1080', 'Download link 1080p']];
    let editId = null;
    app.innerHTML = `<h1>FilmFlow admin</h1><div class="note">Changes are saved in <b>this browser only</b>. To publish them, click <b>Export movies.json</b> and replace <code>data/movies.json</code> in your GitHub repository.</div><form id="mf" class="admin"><h2 class="full" style="margin:0" id="ft">Add new movie</h2>${f.map(([k, l]) => `<label>${l}<input name="${k}" ${k === 'title' ? 'required' : ''}></label>`).join('')}<label>Category<select name="category">${CATS.map((c) => `<option>${c}</option>`).join('')}</select></label><label class="chk"><input type="checkbox" name="trending"> Show in trending slider</label><label class="full">Description / storyline<textarea name="description" rows="4"></textarea></label><div class="full row"><button id="sb">Add movie</button><button type="button" id="cn" class="ghost" hidden>Cancel</button><span id="msg" class="muted"></span></div></form><div class="bar"><h2 style="margin:0" id="cnt"></h2><div class="row"><input id="aq" type="search" placeholder="Search movies" aria-label="Search movies" style="width:220px"><button id="ex" class="ghost">Export movies.json</button><button id="rs" class="ghost">Reset to published</button></div></div><ul class="list" id="ul"></ul>`;
    const form = $('#mf');
    const list = () => {
      const q = $('#aq').value.toLowerCase(), s = movies.filter((m) => m.title.toLowerCase().includes(q));
      $('#cnt').textContent = `All movies (${s.length})`;
      $('#ul').innerHTML = s.map((m) => `<li><div><b>${esc(m.title)}</b> <span class="muted">(${esc(m.year)})</span><div class="muted small">${esc(m.category)} · ${esc(m.language)}</div></div><div class="act"><button data-e="${esc(m.id)}">Edit</button><button class="del" data-d="${esc(m.id)}">Delete</button></div></li>`).join('') || '<li class="muted">No movies found.</li>';
    };
    const reset = () => { form.reset(); editId = null; $('#ft').textContent = 'Add new movie'; $('#sb').textContent = 'Add movie'; $('#cn').hidden = true; };
    form.onsubmit = (e) => {
      e.preventDefault();
      const d = Object.fromEntries(new FormData(form));
      const data = { title: d.title.trim(), poster: safeUrl(d.poster), description: d.description.trim(), genre: d.genre.split(',').map((x) => x.trim()).filter(Boolean).join(', '), year: parseInt(d.year, 10) || new Date().getFullYear(), language: d.language.trim(), category: CATS.includes(d.category) ? d.category : 'Bollywood', rating: Math.min(10, Math.max(0, parseFloat(d.rating) || 0)), trailer: safeUrl(d.trailer), dl480: safeUrl(d.dl480), dl720: safeUrl(d.dl720), dl1080: safeUrl(d.dl1080), trending: form.trending.checked };
      if (editId) movies = movies.map((m) => (m.id === editId ? { ...m, ...data } : m));
      else { const b = slugify(data.title) || 'movie'; let s = b, n = 2; while (movies.some((m) => m.slug === s)) s = `${b}-${n++}`; movies.unshift({ id: Date.now().toString(36), slug: s, createdAt: Date.now(), ...data }); }
      $('#msg').textContent = editId ? 'Movie updated' : 'Movie added';
      persist(); reset(); list();
    };
    $('#cn').onclick = reset;
    $('#aq').oninput = list;
    $('#ul').onclick = (e) => {
      const id = e.target.dataset.e || e.target.dataset.d, m = movies.find((x) => x.id === id);
      if (!m) return;
      if (e.target.dataset.d) { if (confirm(`Delete "${m.title}"?`)) { movies = movies.filter((x) => x.id !== id); persist(); list(); } return; }
      f.forEach(([k]) => { form[k].value = m[k] ?? ''; });
      form.category.value = m.category; form.description.value = m.description || ''; form.trending.checked = !!m.trending;
      editId = id; $('#ft').textContent = 'Edit movie'; $('#sb').textContent = 'Save changes'; $('#cn').hidden = false; scrollTo({ top: 0, behavior: 'smooth' });
    };
    $('#ex').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(movies, null, 2)], { type: 'application/json' })); a.download = 'movies.json'; a.click(); };
    $('#rs').onclick = async () => { if (confirm('Discard local changes and reload the published list?')) { localStorage.removeItem(KEY); await load(); list(); } };
    list();
  }

  function route() {
    clearInterval(timer);
    const [path, qs] = (location.hash.slice(1) || '/').split('?');
    scrollTo(0, 0);
    if (path.startsWith('/movie/')) movie(decodeURIComponent(path.slice(7)));
    else if (path === '/disclaimer') text('Disclaimer', '<p>FilmFlow is an information directory about movies and web series. We do not host, upload or store any video files.</p><p>Download buttons link to third-party websites. We do not own or control those sites and are not responsible for their content or availability.</p><p>All movie names, posters and trademarks belong to their respective owners. If you are a rights holder and want a listing removed, contact us and we will act on it promptly.</p><p>Please use FilmFlow only to access content you have the legal right to view.</p>');
    else if (path === '/contact') text('Contact', `<p>Questions, movie requests or removal requests? Write to us and we will reply as soon as we can.</p><p><a class="btn" href="mailto:${esc(CONTACT_EMAIL)}">${esc(CONTACT_EMAIL)}</a></p>`);
    else if (path === '/admin') admin();
    else home(new URLSearchParams(qs || ''));
  }

  $('#yr').textContent = new Date().getFullYear();
  $('#sf').onsubmit = (e) => { e.preventDefault(); const q = new FormData(e.target).get('q').trim(); location.hash = q ? `#/?q=${encodeURIComponent(q)}` : '#/'; };
  addEventListener('hashchange', route);
  load().then(route);
})();
