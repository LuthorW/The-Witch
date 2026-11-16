// Luthor Corporation Editions — catálogo, carrinho e pedidos (demonstração estática).
// Todos os dados ficam no localStorage do navegador; nenhuma cobrança real é feita.

(() => {
  const SHIPPING = 3.6;
  const MAX_QTY = 9;
  const KEYS = { cart: 'lc-cart', orders: 'lc-orders', users: 'lc-users', session: 'lc-session' };
  const MIN_PASSWORD = 6;

  const BOOKS = [
    {
      id: 'the-witch',
      person: 'Letícia Luthor',
      monogram: 'LL',
      title: 'The Witch',
      subtitle: 'A Acusada',
      theme: 'witch',
      portrait: 'imagens/leticia.jpg',
      coverImage: 'imagens/cover-witch.webp',
      blurb: 'Escritora maldita e matemática profana, enfrentou acusações e perseguições sem jamais pedir clemência.',
      intro: 'Não foi apenas escritora: foi escândalo, desejo e resistência. Letícia Luthor viveu intensamente e deixou um legado que atravessou gerações.',
      dossierLine: 'Dossiê 06·04·1830 · Milão, Itália · Arquivo místico',
      description: 'Reunindo diários proibidos, cartas nunca enviadas e os fragmentos de seus últimos escritos, The Witch — A Acusada reconstrói a trajetória de uma mulher que desafiou a moral de seu tempo e fez da própria vida um legado.',
      facts: ['312 páginas', '10 capítulos', '18 fragmentos restaurados'],
      dossierUrl: 'index.html',
      editions: [
        { id: 'brochura', name: 'Brochura', price: 24.9 },
        { id: 'capa-dura', name: 'Capa dura', price: 34.9 },
        { id: 'colecionador', name: 'Colecionador', price: 69.9 }
      ]
    },
    {
      id: 'the-matriarch',
      person: 'Lena Luthor',
      monogram: 'LL',
      title: 'The Matriarch',
      subtitle: 'A Guardiã',
      theme: 'matriarch',
      portrait: 'imagens/lena.jpg',
      coverImage: 'imagens/cover-matriarch.webp',
      blurb: 'Matriarca da linhagem Luthor, protegeu sua família enquanto guardava conhecimentos antigos que jamais poderiam ser revelados.',
      intro: 'Antes de Letícia se tornar lenda, Lena Luthor ergueu o nome que atravessaria gerações. Matriarca implacável e guardiã de conhecimentos antigos, fez do silêncio sua fortaleza e da família seu maior legado.',
      dossierLine: 'Dossiê 24·10·1817 · Milão, Itália · Arquivo místico',
      description: 'Reunindo cartas seladas, registros familiares e relatos mantidos em segredo durante gerações, The Matriarch — A Guardiã revela a mulher que construiu os alicerces da família Luthor e protegeu conhecimentos capazes de mudar o destino de toda a sua linhagem.',
      facts: ['284 páginas', '9 capítulos', 'Cartas seladas inéditas'],
      dossierUrl: null,
      editions: [
        { id: 'brochura', name: 'Brochura', price: 29.9 },
        { id: 'capa-dura', name: 'Capa dura', price: 40.9 },
        { id: 'colecionador', name: 'Colecionador', price: 74.9 }
      ]
    },
    {
      id: 'the-painter',
      person: 'Lucy Williams',
      monogram: 'LW',
      title: 'The Painter',
      subtitle: 'Retratos do Silêncio',
      theme: 'painter',
      portrait: 'imagens/lucy.jpg',
      coverImage: 'imagens/cover-painter.webp',
      blurb: 'Pintora de olhar inquieto e sensibilidade incomum, transformou rostos, memórias e acontecimentos ocultos em obras que sobreviveram ao silêncio de sua época.',
      intro: 'Não foi apenas pintora: foi memória, testemunho e resistência. Lucy Williams transformou aquilo que sua época tentou esconder em imagens impossíveis de apagar.',
      dossierLine: 'Dossiê 22·10·1842 · Norwich, Inglaterra · Coleção restrita',
      description: 'Reunindo diários de ateliê, cartas, esboços e retratos jamais exibidos, The Painter — Retratos do Silêncio reconstrói a trajetória de Lucy Williams: uma artista que observou os bastidores de sua época e transformou lembranças, segredos e acontecimentos esquecidos em obras que sobreviveram ao tempo.',
      facts: ['296 páginas', 'Caderno de esboços', 'Retratos inéditos'],
      dossierUrl: null,
      editions: [
        { id: 'brochura', name: 'Brochura', price: 31.9 },
        { id: 'capa-dura', name: 'Capa dura', price: 42.9 },
        { id: 'colecionador', name: 'Colecionador', price: 76.9 }
      ]
    }
  ];

  const UPCOMING = [
    { person: 'Vittoria Ricci', monogram: 'VR', portrait: 'imagens/vittoria.jpg', blurb: 'Feiticeira habilidosa, Vittoria dominava encantamentos antigos e conhecia verdades capazes de alterar o destino daqueles que cruzavam seu caminho.' },
    { person: 'Giuseppe Verdi', monogram: 'GV', portrait: 'imagens/giuseppe.jpg', blurb: 'Pintor de talento refinado, Giuseppe transformou em retratos os acontecimentos e rostos que a história tentou apagar.' },
    { person: 'Querl Dox', monogram: 'QD', portrait: 'imagens/querl.jpg', blurb: 'Dono de um intelecto além de sua época, tornou-se aliado dos Luthor e investigador dos mistérios que cercavam a família.' }
  ];

  const EDITION_NOTES = {
    brochura: 'Papel marfim, capa fosca e marcador editorial.',
    'capa-dura': 'Encadernação rígida, hot stamping e marcador em fita.',
    colecionador: 'Volume numerado em estojo, fac-símiles e certificado LC.'
  };

  const currency = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });
  const money = (value) => currency.format(value);

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  // ---------- armazenamento ----------
  const read = (key, fallback) => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };

  const write = (key, value) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* armazenamento indisponível: a sessão segue sem persistência */
    }
  };

  const findBook = (id) => BOOKS.find((book) => book.id === id);
  const findEdition = (book, editionId) => book?.editions.find((edition) => edition.id === editionId);

  // ---------- contas (demonstração local) ----------
  // As contas ficam no localStorage deste navegador. A senha é guardada como hash SHA-256 com sal,
  // mas isto NÃO é autenticação segura: um site estático não tem servidor para proteger os dados.
  const normalizeEmail = (email) => String(email || '').trim().toLowerCase();
  const profileKey = (email) => `lc-profile:${normalizeEmail(email)}`;

  const toHex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');

  const hashPassword = async (password, salt) => {
    if (!window.crypto?.subtle) throw new Error('crypto-indisponivel');
    const bytes = new TextEncoder().encode(`${salt}:${password}`);
    return toHex(await window.crypto.subtle.digest('SHA-256', bytes));
  };

  const newSalt = () => toHex(window.crypto.getRandomValues(new Uint8Array(16)));

  const getUsers = () => read(KEYS.users, {});

  const currentUser = () => {
    const session = read(KEYS.session, null);
    if (!session?.email) return null;
    const user = getUsers()[session.email];
    return user ? { name: user.name, email: user.email } : null;
  };

  const startSession = (email) => write(KEYS.session, { email, since: new Date().toISOString() });

  const register = async ({ name, email, password }) => {
    const key = normalizeEmail(email);
    const users = getUsers();
    if (users[key]) return { ok: false, error: 'Já existe uma conta com este e-mail. Use "Entrar".' };
    const salt = newSalt();
    users[key] = { name: String(name).trim(), email: key, salt, hash: await hashPassword(password, salt), createdAt: new Date().toISOString() };
    write(KEYS.users, users);
    startSession(key);
    return { ok: true };
  };

  const login = async ({ email, password }) => {
    const key = normalizeEmail(email);
    const user = getUsers()[key];
    if (!user || (await hashPassword(password, user.salt)) !== user.hash) {
      return { ok: false, error: 'E-mail ou senha incorretos.' };
    }
    startSession(key);
    return { ok: true };
  };

  const logout = () => {
    try { window.localStorage.removeItem(KEYS.session); } catch { /* sem armazenamento */ }
  };

  // Só aceita páginas deste site como destino depois do login.
  const safeNext = (value, fallback = 'perfil.html') => (/^[a-z-]+\.html(\?[\w=&%.-]*)?(#[\w-]*)?$/i.test(value || '') ? value : fallback);

  const loginUrl = (next) => `login.html?next=${encodeURIComponent(next)}`;

  const requireUser = (next) => {
    const user = currentUser();
    if (!user) window.location.replace(loginUrl(next));
    return user;
  };

  const userOrders = (user) => read(KEYS.orders, []).filter((order) => order.userEmail === user?.email);

  const updateAccountLinks = () => {
    const user = currentUser();
    document.querySelectorAll('.shop-icon[href="perfil.html"]').forEach((link) => {
      link.setAttribute('aria-label', user ? `Seu perfil (${user.name})` : 'Entrar ou criar conta');
      link.title = user ? `Olá, ${user.name.split(/\s+/)[0]}` : 'Entrar';
      link.classList.toggle('is-signed-in', Boolean(user));
    });
  };

  // ---------- carrinho ----------
  const getCart = () => read(KEYS.cart, []).filter((item) => findEdition(findBook(item.bookId), item.editionId));
  const saveCart = (cart) => {
    write(KEYS.cart, cart);
    updateCartBadges();
  };

  const addToCart = (bookId, editionId, qty = 1) => {
    const cart = getCart();
    const existing = cart.find((item) => item.bookId === bookId && item.editionId === editionId);
    if (existing) {
      existing.qty = Math.min(MAX_QTY, existing.qty + qty);
    } else {
      cart.push({ bookId, editionId, qty: Math.min(MAX_QTY, Math.max(1, qty)) });
    }
    saveCart(cart);
  };

  const setQty = (bookId, editionId, qty) => {
    const cart = getCart()
      .map((item) => (item.bookId === bookId && item.editionId === editionId
        ? { ...item, qty: Math.min(MAX_QTY, qty) }
        : item))
      .filter((item) => item.qty > 0);
    saveCart(cart);
  };

  const cartLines = (cart = getCart()) => cart.map((item) => {
    const book = findBook(item.bookId);
    const edition = findEdition(book, item.editionId);
    return { ...item, book, edition, total: edition.price * item.qty };
  });

  const cartTotals = (lines) => {
    const subtotal = lines.reduce((sum, line) => sum + line.total, 0);
    const shipping = lines.length ? SHIPPING : 0;
    return { subtotal, shipping, total: subtotal + shipping };
  };

  const updateCartBadges = () => {
    const count = getCart().reduce((sum, item) => sum + item.qty, 0);
    document.querySelectorAll('[data-cart-count]').forEach((badge) => {
      badge.textContent = String(count);
      badge.hidden = count === 0;
    });
    document.querySelectorAll('[data-cart-link]').forEach((link) => {
      link.setAttribute('aria-label', count ? `Carrinho, ${count} ${count === 1 ? 'item' : 'itens'}` : 'Carrinho vazio');
    });
  };

  // ---------- componentes ----------
  const portrait = (entry, className = 'lc-portrait') => (entry.portrait
    ? `<span class="${className}"><img src="${entry.portrait}" alt="Retrato de ${escapeHtml(entry.person)}" loading="lazy"></span>`
    : `<span class="${className} is-monogram" role="img" aria-label="Monograma de ${escapeHtml(entry.person)}"><span>${entry.monogram}</span></span>`);

  const cover = (book, size = '') => (book.coverImage
    ? `<img class="lc-book-img ${size}" src="${book.coverImage}" alt="Capa de ${escapeHtml(book.title)} — ${escapeHtml(book.subtitle)}" loading="lazy">`
    : `
    <div class="lc-cover lc-cover-${book.theme} ${size}" aria-hidden="true">
      <span class="lc-cover-frame"></span>
      <span class="lc-cover-publisher">Luthor Corporation Editions</span>
      <strong class="lc-cover-title">${escapeHtml(book.title)}</strong>
      <span class="lc-cover-person">${escapeHtml(book.person)} · ${escapeHtml(book.subtitle)}</span>
      ${portrait(book, 'lc-cover-medallion')}
      <span class="lc-cover-seal">LC</span>
    </div>`);

  const divider = '<span class="lc-divider" aria-hidden="true"><i></i></span>';

  const productUrl = (book) => `produto.html?livro=${encodeURIComponent(book.id)}`;

  const stepper = (value, attrs, label) => `
    <div class="lc-stepper" ${attrs}>
      <button type="button" data-step="-1" aria-label="Diminuir quantidade${label ? ` de ${label}` : ''}">−</button>
      <output aria-live="polite">${value}</output>
      <button type="button" data-step="1" aria-label="Aumentar quantidade${label ? ` de ${label}` : ''}">+</button>
    </div>`;

  // ---------- páginas ----------
  const renderCatalog = (root) => {
    root.innerHTML = `
      <section class="lc-page-head section-shell reveal">
        <p class="section-label">Luthor Corporation Editions · Historical Archives</p>
        <h1 class="lc-title">Catálogo</h1>
        ${divider}
        <p class="lc-lead">Os dossiês da família Luthor e de seus contemporâneos, restaurados pelo Historical Archives e publicados em edições oficiais.</p>
      </section>

      <section class="section-shell lc-catalog" aria-label="Livros disponíveis">
        ${BOOKS.map((book) => `
          <article class="lc-card reveal">
            <a class="lc-card-cover" href="${productUrl(book)}" tabindex="-1">${cover(book, 'lc-cover-sm')}</a>
            <div class="lc-card-body">
              <div class="lc-card-person">
                ${portrait(book, 'lc-portrait lc-portrait-sm')}
                <div>
                  <h2>${escapeHtml(book.person)}</h2>
                  <p class="lc-card-book">${escapeHtml(book.title)} — ${escapeHtml(book.subtitle)}</p>
                </div>
              </div>
              <p class="lc-card-blurb">${escapeHtml(book.blurb)}</p>
              <div class="lc-card-foot">
                <span class="lc-from">a partir de <strong>${money(Math.min(...book.editions.map((e) => e.price)))}</strong></span>
                <a class="lc-btn lc-btn-gold" href="${productUrl(book)}">Ver livro</a>
              </div>
            </div>
          </article>`).join('')}
      </section>

      <section class="section-shell lc-upcoming reveal" aria-labelledby="lc-upcoming-title">
        <div class="lc-section-head">
          <span class="lc-flourish" aria-hidden="true"></span>
          <h2 id="lc-upcoming-title">Dossiês em restauração</h2>
        </div>
        <div class="lc-upcoming-grid">
          ${UPCOMING.map((entry) => `
            <article class="lc-mini">
              ${portrait(entry, 'lc-portrait lc-portrait-sm')}
              <div>
                <h3>${escapeHtml(entry.person)}</h3>
                <p>${escapeHtml(entry.blurb)}</p>
                <span class="lc-tag">Em breve</span>
              </div>
            </article>`).join('')}
        </div>
      </section>`;
  };

  const renderProduct = (root) => {
    const params = new URLSearchParams(window.location.search);
    const book = findBook(params.get('livro')) || BOOKS[0];
    let editionId = 'capa-dura';
    let qty = 1;

    document.title = `${book.title} — ${book.subtitle} · Luthor Corporation Editions`;

    root.innerHTML = `
      <section class="section-shell lc-product">
        <div class="lc-product-head reveal">
          <a class="lc-back" href="catalogo.html" aria-label="Voltar ao catálogo">←</a>
          <h1 class="lc-title lc-title-md">${escapeHtml(book.person)}</h1>
        </div>
        ${divider}
        <div class="lc-product-intro reveal">
          ${portrait(book, 'lc-portrait lc-portrait-lg')}
          <div>
            <p class="lc-lead">${escapeHtml(book.intro)}</p>
            <p class="lc-dossier-line">${escapeHtml(book.dossierLine)}</p>
          </div>
        </div>

        <div class="lc-section-head reveal">
          <span class="lc-flourish" aria-hidden="true"></span>
          <h2>Livro relacionado</h2>
        </div>

        <div class="lc-buy reveal">
          <div class="lc-buy-cover">${cover(book, 'lc-cover-lg')}</div>
          <form class="lc-buy-panel" id="lc-buy-form">
            <h3>${escapeHtml(book.title)} — <span>${escapeHtml(book.subtitle)}</span></h3>
            <fieldset class="lc-editions">
              <legend>Edição</legend>
              ${book.editions.map((edition) => `
                <label class="lc-edition">
                  <input type="radio" name="edition" value="${edition.id}" ${edition.id === editionId ? 'checked' : ''}>
                  <span>
                    <strong>${edition.name}</strong>
                    <small>${EDITION_NOTES[edition.id]}</small>
                    <em>${money(edition.price)}</em>
                  </span>
                </label>`).join('')}
            </fieldset>
            <div class="lc-buy-row">
              <strong class="lc-price" id="lc-price"></strong>
              ${stepper(qty, 'id="lc-qty"', book.title)}
            </div>
            <div class="lc-buy-actions">
              <button class="lc-btn lc-btn-gold" type="submit" name="intent" value="buy">Comprar</button>
              <button class="lc-btn lc-btn-ghost" type="submit" name="intent" value="add">Adicionar ao carrinho</button>
            </div>
            <p class="lc-feedback" id="lc-feedback" role="status" hidden></p>
          </form>
        </div>

        <div class="lc-section-head reveal">
          <span class="lc-flourish" aria-hidden="true"></span>
          <h2>Descrição</h2>
        </div>
        <div class="lc-description reveal">
          <p>${escapeHtml(book.description)}</p>
          <ul class="lc-facts">${book.facts.map((fact) => `<li>${escapeHtml(fact)}</li>`).join('')}</ul>
        </div>

        <div class="lc-center reveal">
          ${book.dossierUrl
            ? `<a class="lc-btn lc-btn-lilac" href="${book.dossierUrl}">Explorar dossiê completo</a>`
            : '<span class="lc-btn lc-btn-lilac is-disabled" aria-disabled="true">Dossiê completo em restauração</span>'}
        </div>
      </section>`;

    const form = root.querySelector('#lc-buy-form');
    const priceEl = root.querySelector('#lc-price');
    const qtyWrap = root.querySelector('#lc-qty');
    const qtyOut = qtyWrap.querySelector('output');
    const feedback = root.querySelector('#lc-feedback');

    const refresh = () => {
      const edition = findEdition(book, editionId);
      priceEl.textContent = money(edition.price * qty);
      qtyOut.textContent = String(qty);
      qtyWrap.querySelector('[data-step="-1"]').disabled = qty <= 1;
      qtyWrap.querySelector('[data-step="1"]').disabled = qty >= MAX_QTY;
    };

    form.addEventListener('change', (event) => {
      if (event.target.name === 'edition') {
        editionId = event.target.value;
        refresh();
      }
    });

    qtyWrap.addEventListener('click', (event) => {
      const step = Number(event.target.closest('[data-step]')?.dataset.step || 0);
      if (!step) return;
      qty = Math.min(MAX_QTY, Math.max(1, qty + step));
      refresh();
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      addToCart(book.id, editionId, qty);
      if (event.submitter?.value === 'buy') {
        window.location.href = 'carrinho.html';
        return;
      }
      const edition = findEdition(book, editionId);
      feedback.hidden = false;
      feedback.innerHTML = `${qty} × ${escapeHtml(book.title)} (${edition.name}) adicionado. <a href="carrinho.html">Ver carrinho →</a>`;
    });

    refresh();
  };

  const renderCart = (root) => {
    const user = currentUser();
    const profile = user ? { name: user.name, email: user.email, ...read(profileKey(user.email), {}) } : {};

    const draw = () => {
      const lines = cartLines();
      const totals = cartTotals(lines);

      if (!lines.length) {
        root.innerHTML = `
          <section class="section-shell lc-narrow">
            <div class="lc-product-head"><a class="lc-back" href="catalogo.html" aria-label="Voltar ao catálogo">←</a><h1 class="lc-title lc-title-md">Carrinho</h1></div>
            ${divider}
            <div class="lc-empty">
              <p>O seu carrinho ainda está vazio.</p>
              <a class="lc-btn lc-btn-gold" href="catalogo.html">Explorar o catálogo</a>
            </div>
          </section>`;
        return;
      }

      root.innerHTML = `
        <section class="section-shell lc-cart">
          <div class="lc-product-head"><a class="lc-back" href="catalogo.html" aria-label="Voltar ao catálogo">←</a><h1 class="lc-title lc-title-md">Carrinho</h1></div>
          ${divider}
          <div class="lc-cart-grid">
            <div class="lc-cart-items">
              ${lines.map((line) => `
                <article class="lc-item" data-book="${line.book.id}" data-edition="${line.edition.id}">
                  <a href="${productUrl(line.book)}" class="lc-item-cover">${cover(line.book, 'lc-cover-xs')}</a>
                  <div class="lc-item-info">
                    <small>Item</small>
                    <h2>${escapeHtml(line.book.title)} — ${escapeHtml(line.book.subtitle)}</h2>
                    <p>Edição: ${line.edition.name} · ${money(line.edition.price)}</p>
                    <div class="lc-item-row">
                      ${stepper(line.qty, 'data-line-qty', line.book.title)}
                      <button type="button" class="lc-link" data-remove>Remover</button>
                    </div>
                  </div>
                  <strong class="lc-item-total">${money(line.total)}</strong>
                </article>`).join('')}

              <div class="lc-summary">
                <div><span>Subtotal</span><strong>${money(totals.subtotal)}</strong></div>
                <div><span>Envio</span><strong>${money(totals.shipping)}</strong></div>
                <div class="lc-summary-total"><span>Total</span><strong>${money(totals.total)}</strong></div>
              </div>
            </div>

            ${user ? '' : `
            <div class="lc-ship lc-login-gate">
              <div class="lc-section-head">
                <span class="lc-flourish" aria-hidden="true"></span>
                <h2>Enviar para</h2>
              </div>
              <p>Entre na sua conta para informar o endereço e acompanhar o pedido no seu perfil.</p>
              <a class="lc-btn lc-btn-gold lc-btn-block" href="${loginUrl('carrinho.html')}">Entrar</a>
              <a class="lc-btn lc-btn-ghost lc-btn-block" href="${loginUrl('carrinho.html')}#criar">Criar conta</a>
            </div>`}
            <form class="lc-ship" id="lc-ship-form" novalidate ${user ? '' : 'hidden'}>
              <div class="lc-section-head">
                <span class="lc-flourish" aria-hidden="true"></span>
                <h2>Enviar para</h2>
              </div>
              <label class="lc-field"><span class="lc-ico" aria-hidden="true">♙</span><span class="sr-only">Nome completo</span>
                <input name="name" autocomplete="name" placeholder="Nome completo" required value="${escapeHtml(profile.name)}"></label>
              <label class="lc-field"><span class="lc-ico" aria-hidden="true">✉</span><span class="sr-only">E-mail</span>
                <input name="email" type="email" autocomplete="email" placeholder="E-mail" required readonly value="${escapeHtml(profile.email)}"></label>
              <label class="lc-field"><span class="lc-ico" aria-hidden="true">⌂</span><span class="sr-only">Endereço</span>
                <input name="street" autocomplete="street-address" placeholder="Rua, número e complemento" required value="${escapeHtml(profile.street)}"></label>
              <label class="lc-field"><span class="lc-ico" aria-hidden="true">⚑</span><span class="sr-only">Cidade e país</span>
                <input name="city" autocomplete="address-level2" placeholder="Cidade, país" required value="${escapeHtml(profile.city)}"></label>
              <label class="lc-field"><span class="lc-ico" aria-hidden="true">☏</span><span class="sr-only">Telefone</span>
                <input name="phone" type="tel" autocomplete="tel" placeholder="Telefone" required value="${escapeHtml(profile.phone)}"></label>
              <p class="lc-form-error" id="lc-form-error" role="alert" hidden></p>
              <button class="lc-btn lc-btn-green lc-btn-block" type="submit">Enviar pedido</button>
              <p class="lc-note">Demonstração estática: nenhuma cobrança é efetuada e os dados ficam apenas neste navegador.</p>
            </form>
          </div>
        </section>`;

      root.querySelectorAll('.lc-item').forEach((row) => {
        const { book, edition } = row.dataset;
        const current = getCart().find((item) => item.bookId === book && item.editionId === edition);
        row.querySelector('[data-step="1"]').disabled = current.qty >= MAX_QTY;
        row.addEventListener('click', (event) => {
          if (event.target.closest('[data-remove]')) {
            setQty(book, edition, 0);
            draw();
            return;
          }
          const step = Number(event.target.closest('[data-step]')?.dataset.step || 0);
          if (!step) return;
          setQty(book, edition, current.qty + step);
          draw();
        });
      });

      const form = root.querySelector('#lc-ship-form');
      const error = root.querySelector('#lc-form-error');
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        const buyer = currentUser();
        if (!buyer) {
          window.location.href = loginUrl('carrinho.html');
          return;
        }
        if (!form.checkValidity()) {
          const invalid = form.querySelector(':invalid');
          error.hidden = false;
          error.textContent = invalid?.type === 'email' && invalid.value
            ? 'Informe um e-mail válido.'
            : 'Preencha todos os campos de envio.';
          invalid?.focus();
          return;
        }
        const data = Object.fromEntries(new FormData(form).entries());
        const freshLines = cartLines();
        const freshTotals = cartTotals(freshLines);
        const orders = read(KEYS.orders, []);
        const lastNumber = Math.max(220660, ...orders.map((order) => Number(order.number) || 0));
        const number = String(lastNumber + 1 + Math.floor(Math.random() * 4));
        orders.unshift({
          number,
          date: new Date().toISOString(),
          items: freshLines.map((line) => ({ bookId: line.book.id, editionId: line.edition.id, qty: line.qty, price: line.edition.price })),
          ...freshTotals,
          userEmail: buyer.email,
          shipTo: data
        });
        write(KEYS.orders, orders);
        write(profileKey(buyer.email), { name: data.name, street: data.street, city: data.city, phone: data.phone });
        saveCart([]);
        window.location.href = `pedido.html?n=${number}`;
      });
    };

    draw();
  };

  const orderStatus = (order) => {
    const days = (Date.now() - new Date(order.date).getTime()) / 86400000;
    if (days >= 3) return { label: 'Entregue', tone: 'green', eta: 'Entregue' };
    if (days >= 1) return { label: 'Enviado', tone: 'lilac', eta: `${Math.max(1, Math.ceil(3 - days))} ${Math.ceil(3 - days) === 1 ? 'dia útil' : 'dias úteis'}` };
    return { label: 'Em preparação', tone: 'gold', eta: '3 dias úteis' };
  };

  const itemLabel = (item) => {
    const book = findBook(item.bookId);
    const edition = findEdition(book, item.editionId);
    return { book, edition };
  };

  const renderOrder = (root) => {
    const number = new URLSearchParams(window.location.search).get('n');
    const user = requireUser(`pedido.html${window.location.search}`);
    if (!user) return;
    const orders = userOrders(user);
    const order = orders.find((entry) => entry.number === number) || orders[0];

    if (!order) {
      root.innerHTML = `
        <section class="section-shell lc-narrow lc-empty">
          <p>Nenhum pedido encontrado neste navegador.</p>
          <a class="lc-btn lc-btn-gold" href="catalogo.html">Retornar ao catálogo</a>
        </section>`;
      return;
    }

    const status = orderStatus(order);
    root.innerHTML = `
      <section class="section-shell lc-narrow lc-done">
        <img class="lc-check-ornament reveal" src="imagens/ornament.webp" alt="" aria-hidden="true">
        <h1 class="lc-title lc-title-green reveal">Pedido Realizado</h1>
        ${divider}
        <div class="lc-receipt reveal">
          <div class="lc-receipt-row"><span>Pedido número</span><strong>${escapeHtml(order.number)}</strong></div>
          ${divider}
          ${order.items.map((item) => {
            const { book, edition } = itemLabel(item);
            return `
              <div class="lc-receipt-row"><span>Livro</span><strong>${escapeHtml(book?.title)} — ${escapeHtml(book?.subtitle)}</strong></div>
              <div class="lc-receipt-row"><span>Edição</span><strong>${escapeHtml(edition?.name)}</strong></div>
              <div class="lc-receipt-row"><span>Quantidade</span><strong>${item.qty}</strong></div>`;
          }).join('<hr class="lc-hr-soft">')}
          <hr>
          <div class="lc-receipt-row"><span>Envio</span><strong>${money(order.shipping)}</strong></div>
          <div class="lc-receipt-row lc-receipt-total"><span>Total</span><strong>${money(order.total)}</strong></div>
          <div class="lc-receipt-row"><span>Previsão de entrega</span><strong>${status.eta}</strong></div>
          <div class="lc-receipt-row"><span>Enviar para</span><strong>${escapeHtml(order.shipTo.name)} · ${escapeHtml(order.shipTo.city)}</strong></div>
        </div>
        <div class="lc-center lc-gap">
          <a class="lc-btn lc-btn-gold" href="catalogo.html">Retornar ao catálogo</a>
          <a class="lc-btn lc-btn-ghost" href="perfil.html">Ver meus pedidos</a>
        </div>
      </section>`;
  };

  const renderProfile = (root) => {
    const user = requireUser('perfil.html');
    if (!user) return;
    const saved = read(profileKey(user.email), null);
    const profile = saved?.street ? saved : null;
    const orders = userOrders(user);
    const firstName = user.name.trim().split(/\s+/)[0];

    root.innerHTML = `
      <section class="section-shell lc-narrow lc-profile">
        <div class="lc-product-head"><a class="lc-back" href="catalogo.html" aria-label="Voltar ao catálogo">←</a><h1 class="lc-title lc-title-md">Seu Perfil</h1></div>
        ${divider}

        <div class="lc-welcome reveal">
          <span class="lc-portrait lc-portrait-sm is-monogram"><span>${escapeHtml((firstName || 'LC').slice(0, 2).toUpperCase())}</span></span>
          <div>
            <h2>Bem-vinda de volta, ${escapeHtml(firstName)}!</h2>
            <p>${escapeHtml(user.name)}</p>
            <p>${escapeHtml(user.email)}</p>
            <button type="button" class="lc-link" data-logout>Sair da conta</button>
          </div>
        </div>

        <div class="lc-section-head reveal">
          <span class="lc-flourish" aria-hidden="true"></span>
          <h2>Endereço principal</h2>
        </div>
        <div class="lc-box reveal">
          ${profile
            ? `<p>${escapeHtml(profile.city)}</p><p>${escapeHtml(profile.street)}</p><p>${escapeHtml(profile.phone)}</p>`
            : '<p class="lc-muted">O endereço é salvo no seu primeiro pedido.</p>'}
        </div>

        <div class="lc-section-head reveal">
          <span class="lc-flourish" aria-hidden="true"></span>
          <h2>Meus pedidos</h2>
        </div>
        ${orders.length
          ? orders.map((order) => {
            const status = orderStatus(order);
            return `
              <a class="lc-receipt lc-order reveal" href="pedido.html?n=${encodeURIComponent(order.number)}">
                <div class="lc-receipt-row"><span>Pedido número</span><strong>${escapeHtml(order.number)}</strong></div>
                ${divider}
                <div class="lc-receipt-row"><span>${order.items.length > 1 ? 'Livros' : 'Livro'}</span><strong>${order.items.map((item) => {
                  const { book } = itemLabel(item);
                  return `${escapeHtml(book?.title)} — ${escapeHtml(book?.subtitle)}${item.qty > 1 ? ` ×${item.qty}` : ''}`;
                }).join('<br>')}</strong></div>
                <div class="lc-receipt-row"><span>Status</span><strong class="lc-tone-${status.tone}">${status.label}</strong></div>
                <div class="lc-receipt-row"><span>Previsão de entrega</span><strong class="lc-tone-green">${status.eta}</strong></div>
                <div class="lc-receipt-row"><span>Total</span><strong>${money(order.total)}</strong></div>
              </a>`;
          }).join('')
          : `<div class="lc-box lc-empty-inline reveal"><p class="lc-muted">Você ainda não fez nenhum pedido.</p><a class="lc-btn lc-btn-gold" href="catalogo.html">Explorar o catálogo</a></div>`}
      </section>`;

    root.querySelector('[data-logout]').addEventListener('click', () => {
      logout();
      window.location.href = 'catalogo.html';
    });
  };

  const renderLogin = (root) => {
    const next = safeNext(new URLSearchParams(window.location.search).get('next'));
    if (currentUser()) {
      window.location.replace(next);
      return;
    }
    let mode = window.location.hash === '#criar' ? 'register' : 'login';

    root.innerHTML = `
      <section class="section-shell lc-auth">
        <h1 class="lc-title lc-title-md" id="lc-auth-title"></h1>
        ${divider}
        <div class="lc-auth-tabs" role="tablist" aria-label="Acesso">
          <button type="button" role="tab" data-mode="login">Entrar</button>
          <button type="button" role="tab" data-mode="register">Criar conta</button>
        </div>
        <form class="lc-auth-card" id="lc-auth-form" novalidate>
          <label class="lc-field" data-only="register"><span class="lc-ico" aria-hidden="true">♙</span><span class="sr-only">Nome completo</span>
            <input name="name" autocomplete="name" placeholder="Nome completo"></label>
          <label class="lc-field"><span class="lc-ico" aria-hidden="true">✉</span><span class="sr-only">E-mail</span>
            <input name="email" type="email" autocomplete="email" placeholder="E-mail" required></label>
          <label class="lc-field"><span class="lc-ico" aria-hidden="true">⚿</span><span class="sr-only">Senha</span>
            <input name="password" type="password" placeholder="Senha" required minlength="${MIN_PASSWORD}"></label>
          <label class="lc-field" data-only="register"><span class="lc-ico" aria-hidden="true">⚿</span><span class="sr-only">Confirmar senha</span>
            <input name="confirm" type="password" autocomplete="new-password" placeholder="Confirmar senha"></label>
          <p class="lc-form-error" id="lc-auth-error" role="alert" hidden></p>
          <button class="lc-btn lc-btn-gold lc-btn-block" type="submit" id="lc-auth-submit"></button>
          <p class="lc-note">Conta de demonstração: fica salva apenas neste navegador. Não reutilize uma senha real.</p>
        </form>
      </section>`;

    const form = root.querySelector('#lc-auth-form');
    const error = root.querySelector('#lc-auth-error');
    const title = root.querySelector('#lc-auth-title');
    const submit = root.querySelector('#lc-auth-submit');

    const setMode = (value) => {
      mode = value;
      const isRegister = mode === 'register';
      title.textContent = isRegister ? 'Criar conta' : 'Entrar';
      submit.textContent = isRegister ? 'Criar conta' : 'Entrar';
      document.title = `${isRegister ? 'Criar conta' : 'Entrar'} — Luthor Corporation Editions`;
      root.querySelectorAll('[data-mode]').forEach((tab) => tab.setAttribute('aria-selected', String(tab.dataset.mode === mode)));
      root.querySelectorAll('[data-only="register"]').forEach((field) => {
        field.hidden = !isRegister;
        field.querySelector('input').required = isRegister;
      });
      form.password.autocomplete = isRegister ? 'new-password' : 'current-password';
      error.hidden = true;
    };

    root.querySelector('.lc-auth-tabs').addEventListener('click', (event) => {
      const tab = event.target.closest('[data-mode]');
      if (tab) setMode(tab.dataset.mode);
    });

    const fail = (message, field) => {
      error.hidden = false;
      error.textContent = message;
      field?.focus();
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (mode === 'register' && !data.name?.trim()) return fail('Informe seu nome.', form.name);
      if (!form.email.checkValidity()) return fail('Informe um e-mail válido.', form.email);
      if ((data.password || '').length < MIN_PASSWORD) return fail(`A senha precisa de pelo menos ${MIN_PASSWORD} caracteres.`, form.password);
      if (mode === 'register' && data.password !== data.confirm) return fail('As senhas não coincidem.', form.confirm);

      submit.disabled = true;
      try {
        const result = mode === 'register' ? await register(data) : await login(data);
        if (!result.ok) return fail(result.error, form.email);
        window.location.href = next;
      } catch {
        fail('Não foi possível acessar a conta neste navegador (o login precisa de HTTPS ou localhost).');
      } finally {
        submit.disabled = false;
      }
    });

    setMode(mode);
  };

  // ---------- inicialização ----------
  const pages = {
    catalog: renderCatalog,
    product: renderProduct,
    cart: renderCart,
    order: renderOrder,
    profile: renderProfile,
    login: renderLogin
  };

  const root = document.querySelector('[data-shop-root]');
  const page = document.body.dataset.shop;
  if (root && pages[page]) pages[page](root);

  updateCartBadges();
  updateAccountLinks();
  window.addEventListener('storage', () => {
    updateCartBadges();
    updateAccountLinks();
  });

  window.Loja = { BOOKS, addToCart, getCart, updateCartBadges, money, currentUser };
})();
