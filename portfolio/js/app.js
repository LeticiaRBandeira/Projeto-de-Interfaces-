/* Portfólio Estudantil — lógica da interface alimentada por js/data.js */

const EMPRESAS = [
  { n: "Serpro", tipo: "Público e bancos", sobre: "Empresa pública de tecnologia do governo federal; abre processos seletivos de estágio e concursos na área de TI.", areas: "Desenvolvimento, infraestrutura, dados", site: "https://www.serpro.gov.br" },
  { n: "Banco do Brasil", tipo: "Público e bancos", sobre: "Forte atuação em tecnologia digital em Brasília, com programas de estágio e concursos específicos para TI.", areas: "Engenharia de software, dados, segurança", site: "https://www.bb.com.br" },
  { n: "Dataprev", tipo: "Público e bancos", sobre: "Empresa de tecnologia da Previdência Social, com vagas periódicas para estudantes e analistas.", areas: "Dados, desenvolvimento, suporte", site: "https://www.dataprev.gov.br" },
  { n: "Stefanini", tipo: "Consultoria e software", sobre: "Multinacional brasileira com forte presença no DF e programas recorrentes para quem está começando na área.", areas: "Desenvolvimento, suporte, qualidade", site: "https://www.stefanini.com" },
  { n: "CI&T", tipo: "Consultoria e software", sobre: "Empresa de engenharia digital que costuma abrir programas estruturados de estágio e trainee.", areas: "Software, design de produto, dados", site: "https://ciandt.com" },
  { n: "TOTVS", tipo: "Consultoria e software", sobre: "Referência brasileira em sistemas de gestão (ERP), com oportunidades em produto e desenvolvimento.", areas: "Desenvolvimento, produto, suporte", site: "https://www.totvs.com" },
  { n: "Nubank", tipo: "Consultoria e software", sobre: "Fintech com times remotos e forte cultura de engenharia de software e análise de dados.", areas: "Engenharia, dados, design", site: "https://nubank.com.br" },
  { n: "CIEE", tipo: "Portais de estágio", sobre: "Principal ponte entre estudantes universitários e vagas de estágio em órgãos públicos e empresas privadas.", areas: "Estágios em TI e administração", site: "https://www.ciee.org.br" },
  { n: "IEL", tipo: "Portais de estágio", sobre: "Instituto ligado à indústria que divulga programas de estágio e bolsas de inovação para universitários.", areas: "Estágios e projetos de inovação", site: "https://www.iel.org.br" }
];

const DICAS = [
  ["Currículo direto ao ponto (1 página)", "Como estudante, você não precisa encher linguiça: destaque seu curso, semestre, projetos da faculdade, ferramentas que já usou e links para GitHub e LinkedIn."],
  ["GitHub organizado conta muito", "Mesmo projetos simples de aula ganham outro peso quando têm um README explicando o que o sistema faz, como rodar e prints da tela."],
  ["Entenda as portas de entrada", "Estágio tem carga horária reduzida e foco em aprendizado; programas de trainee costumam pedir graduação concluída ou no fim; concursos públicos exigem edital e prova."],
  ["Preparação para entrevista técnica", "Revise os projetos que você colocou no currículo — quase sempre perguntam qual problema você resolveu e que dificuldade enfrentou no código."],
  ["Converse com colegas e professores", "Muita vaga de estágio em Brasília circula primeiro em grupos da faculdade ou por indicação de veteranos que já estão estagiando."]
];

const CHECK = [
  "Currículo em PDF revisado e com 1 página",
  "Perfil no LinkedIn com foto e resumo atualizados",
  "Pelo menos 2 repositórios com README no GitHub",
  "Portfólio publicado no GitHub Pages",
  "Cadastro ativo no CIEE e no IEL",
  "Carteira de Trabalho Digital verificada"
];

const $ = s => document.querySelector(s);
const ler = (k, p) => { try { return JSON.parse(localStorage.getItem(k)) ?? p; } catch { return p; } };
const gravar = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch { return false; } };

function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.i);
  toast.i = setTimeout(() => t.classList.remove("show"), 2400);
}

function preencherDadosPessoais() {
  if (typeof DADOS === "undefined") return;
  $("#nav-marca").textContent = DADOS.marca;
  $("#hero-curso").textContent = DADOS.curso;
  $("#hero-nome").textContent = DADOS.nomeCurto;
  $("#hero-frase").textContent = DADOS.frase;
  $("#footer-nome").textContent = DADOS.nomeCompleto;

  $("#sobre-texto").innerHTML = DADOS.sobreParagrafos.map(p => `<p>${p}</p>`).join("");
  $("#sobre-status").innerHTML = DADOS.statusAtual.map(item => `<li>${item}</li>`).join("");

  $("#lista-curriculo").innerHTML = DADOS.curriculo.map((c, idx) => `
    <li class="timeline-item" tabindex="0" data-idx="${idx}">
      <span class="tipo-item">${c.tipo}</span>
      <strong>${c.titulo}</strong>
      <span class="onde">${c.onde}</span>
      ${c.desc ? `<p>${c.desc}</p>` : ""}
    </li>
  `).join("");

  $("#skills").innerHTML = DADOS.habilidades.map(h => `
    <button type="button" class="skill-pill" aria-pressed="false">${h}</button>
  `).join("");

  $("#mail-link").href = "mailto:" + DADOS.email;
  $("#mail-link").textContent = DADOS.email;
  $("#link-github").href = DADOS.github;
  $("#link-github").textContent = DADOS.github.replace(/^https?:\/\//, "");
  $("#link-linkedin").href = DADOS.linkedin;
  $("#link-linkedin").textContent = DADOS.linkedin.replace(/^https?:\/\/(www\.)?/, "");
}

/* Interatividade nas skills: filtra/relaciona projetos e mostra feedback visual */
function iniciarSkillsInterativas() {
  const box = $("#skills");
  const detalhe = $("#skill-detalhe");
  if (!box || !detalhe) return;

  const mapaSkillTag = {
    "HTML5 semântico": "Web",
    "CSS3 & Layout Responsivo": "Web",
    "JavaScript (ES6+)": "Web",
    "SQL & Modelagem MER": "Banco de Dados",
    "NoSQL (conceitos)": "Banco de Dados",
    "Prototipação no Figma": "Design",
    "Git e GitHub": "Bootcamp"
  };

  box.addEventListener("click", e => {
    const btn = e.target.closest(".skill-pill");
    if (!btn) return;
    const jaAtivo = btn.getAttribute("aria-pressed") === "true";
    box.querySelectorAll(".skill-pill").forEach(b => b.setAttribute("aria-pressed", "false"));

    if (jaAtivo) {
      detalhe.innerHTML = "";
      detalhe.classList.remove("ativo");
      return;
    }

    btn.setAttribute("aria-pressed", "true");
    const skill = btn.textContent;
    const tagRelacionada = mapaSkillTag[skill];
    const relacionados = (typeof DADOS !== "undefined" ? DADOS.projetos : [])
      .filter(p => tagRelacionada && p.tags.includes(tagRelacionada));

    detalhe.classList.add("ativo");
    detalhe.innerHTML = relacionados.length
      ? `<strong>${skill}</strong> · ${relacionados.map(r => `<a href="#projetos" data-ir-tag="${tagRelacionada}">${r.titulo}</a>`).join(", ")}`
      : `<strong>${skill}</strong>`;
  });

  detalhe.addEventListener("click", e => {
    const link = e.target.closest("[data-ir-tag]");
    if (!link) return;
    const tag = link.dataset.irTag;
    const chip = [...document.querySelectorAll("#filtros-proj .chip")].find(c => c.textContent === tag);
    if (chip) chip.click();
  });
}

function criarFiltros(alvo, valores, aoMudar) {
  const box = $(alvo);
  box.innerHTML = ["Todos", ...valores]
    .map(v => `<button type="button" class="chip" aria-pressed="${v === "Todos"}">${v}</button>`)
    .join("");
  box.addEventListener("click", e => {
    const b = e.target.closest(".chip");
    if (!b) return;
    box.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b));
    aoMudar(b.textContent);
  });
}

function abrirModalProjeto(p) {
  const modal = $("#modal-projeto");
  if (!modal) return;
  const imgEl = $("#modal-img");
  if (p.imagem) {
    imgEl.src = p.imagem;
    imgEl.alt = p.titulo;
    imgEl.hidden = false;
  } else {
    imgEl.hidden = true;
  }
  $("#modal-titulo").textContent = p.titulo;
  $("#modal-desc").textContent = p.desc;
  $("#modal-tags").innerHTML = (p.tags || []).map(t => `<span class="badge">${t}</span>`).join("");
  $("#modal-acoes").innerHTML = p.link && p.link !== "#"
    ? `<a class="btn" href="${p.link}" target="_blank" rel="noopener">Abrir projeto ↗</a>`
    : `<span class="muda" style="font-size:.86rem">Em documentação</span>`;

  if (typeof modal.showModal === "function") {
    modal.showModal();
  } else {
    modal.setAttribute("open", "");
  }
}

function iniciarModal() {
  const modal = $("#modal-projeto");
  const fechar = $("#modal-fechar");
  if (!modal) return;

  fechar.addEventListener("click", () => modal.close());
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.close();
  });
}

function renderProjetos(filtro = "Todos") {
  const todos = typeof DADOS !== "undefined" ? DADOS.projetos : [];
  const lista = todos.filter(p => filtro === "Todos" || p.tags.includes(filtro));

  $("#lista-proj").innerHTML = lista.map(p => {
    const idxGlobal = todos.indexOf(p);
    return `
      <article class="card card-projeto" data-proj-idx="${idxGlobal}" data-tilt>
        ${p.imagem ? `
          <div class="card-thumb" role="button" tabindex="0" aria-label="Ampliar ${p.titulo}">
            <img src="${p.imagem}" alt="Visualização de ${p.titulo}" loading="lazy">
            <span class="thumb-zoom" aria-hidden="true">+</span>
          </div>
        ` : ""}
        <h3>${p.titulo}</h3>
        <p>${p.desc}</p>
        <div class="tags-linha">${p.tags.map(t => `<span class="badge">${t}</span>`).join("")}</div>
        <div class="card-rodape">
          ${p.link && p.link !== "#" ? `<a href="${p.link}" target="_blank" rel="noopener">Abrir projeto ↗</a>` : `<span class="muda" style="font-size:.82rem">Em documentação</span>`}
          <button type="button" class="chip chip-mini btn-detalhes" data-proj-idx="${idxGlobal}">Detalhes</button>
        </div>
      </article>
    `;
  }).join("");

  $("#lista-proj").querySelectorAll(".card-thumb, .btn-detalhes").forEach(el => {
    const abrir = () => {
      const card = el.closest("[data-proj-idx]");
      const proj = todos[+card.dataset.projIdx];
      if (proj) abrirModalProjeto(proj);
    };
    el.addEventListener("click", abrir);
    el.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrir();
      }
    });
  });

  aplicarTiltCards();
}

let tipoEmp = "Todos";
let apenasFavEmp = false;

function renderEmpresas() {
  const q = $("#busca").value.trim().toLowerCase();
  const favs = ler("portfolio:emp_fav", []);
  const contEl = $("#cont-fav-emp");
  if (contEl) contEl.textContent = favs.length;

  const filtradas = EMPRESAS.filter(e =>
    (tipoEmp === "Todos" || e.tipo === tipoEmp) &&
    (!apenasFavEmp || favs.includes(e.n)) &&
    (e.n + e.areas + e.sobre).toLowerCase().includes(q)
  );

  $("#lista-emp").innerHTML = filtradas.length
    ? filtradas.map(e => {
        const isFav = favs.includes(e.n);
        return `
          <article class="card">
            <div class="card-topo-flex">
              <span class="badge">${e.tipo}</span>
              <button type="button" class="btn-fav ${isFav ? "ativo" : ""}" data-fav="${e.n}" aria-label="Favoritar ${e.n}" aria-pressed="${isFav}" title="Favoritar">${isFav ? "★" : "☆"}</button>
            </div>
            <h3>${e.n}</h3>
            <p>${e.sobre}</p>
            <p><strong>Áreas:</strong> ${e.areas}</p>
            <a href="${e.site}" target="_blank" rel="noopener">Página de carreiras ↗</a>
          </article>
        `;
      }).join("")
    : '<p class="muda">Nenhuma empresa encontrada com esse termo.</p>';
}

function iniciarFavoritosEmpresas() {
  $("#lista-emp").addEventListener("click", e => {
    const btn = e.target.closest("[data-fav]");
    if (!btn) return;
    const nome = btn.dataset.fav;
    const favs = ler("portfolio:emp_fav", []);
    const idx = favs.indexOf(nome);
    if (idx > -1) {
      favs.splice(idx, 1);
    } else {
      favs.push(nome);
    }
    gravar("portfolio:emp_fav", favs);
    renderEmpresas();
  });

  const btnFiltroFav = $("#btn-favoritos-emp");
  if (btnFiltroFav) {
    btnFiltroFav.addEventListener("click", () => {
      apenasFavEmp = !apenasFavEmp;
      btnFiltroFav.setAttribute("aria-pressed", apenasFavEmp);
      renderEmpresas();
    });
  }
}

function iniciarChecklist() {
  const feitos = ler("portfolio:check", []);
  $("#checklist").innerHTML = CHECK.map((item, i) => `
    <li class="${feitos.includes(i) ? "concluido" : ""}">
      <label>
        <input type="checkbox" data-i="${i}" ${feitos.includes(i) ? "checked" : ""}>
        <span>${item}</span>
      </label>
    </li>
  `).join("");

  const atualizar = () => {
    const lista = ler("portfolio:check", []);
    const n = lista.length;
    const pct = Math.round((n / CHECK.length) * 100);
    $("#barra-fill").style.width = pct + "%";
    $("#progresso").textContent = `${n} de ${CHECK.length} concluídos`;
    $("#checklist").querySelectorAll("li").forEach((li, idx) => {
      li.classList.toggle("concluido", lista.includes(idx));
    });
  };

  $("#checklist").addEventListener("change", e => {
    const i = +e.target.dataset.i;
    const lista = ler("portfolio:check", []);
    if (e.target.checked) {
      if (!lista.includes(i)) lista.push(i);
    } else {
      const idx = lista.indexOf(i);
      if (idx > -1) lista.splice(idx, 1);
    }
    gravar("portfolio:check", lista);
    atualizar();
    if (lista.length === CHECK.length) toast("Tudo pronto no checklist!");
  });

  const btnReset = $("#btn-reset-check");
  if (btnReset) {
    btnReset.addEventListener("click", () => {
      gravar("portfolio:check", []);
      $("#checklist").querySelectorAll("input[type='checkbox']").forEach(cb => { cb.checked = false; });
      atualizar();
    });
  }

  atualizar();
}

/* Mural local */
const MURAL_KEY = "portfolio:mural";
const MURAL_MAX = 12;
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function reduzirImagem(file) {
  return new Promise((ok, erro) => {
    const r = new FileReader();
    r.onerror = erro;
    r.onload = () => {
      const img = new Image();
      img.onerror = erro;
      img.onload = () => {
        const k = Math.min(1, 600 / img.width);
        const c = document.createElement("canvas");
        c.width = img.width * k;
        c.height = img.height * k;
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        ok(c.toDataURL("image/jpeg", 0.72));
      };
      img.src = r.result;
    };
    r.readAsDataURL(file);
  });
}

function renderMural() {
  const itens = ler(MURAL_KEY, []);
  $("#lista-mural").innerHTML = itens.length
    ? itens.map((m, i) => `
        <article class="card">
          ${/^data:image\/jpeg;base64,/.test(m.img || "") ? `
            <div class="card-thumb mural-zoom" data-mural-idx="${i}" role="button" tabindex="0">
              <img src="${m.img}" alt="Tela do projeto ${esc(m.titulo)}">
              <span class="thumb-zoom" aria-hidden="true">+</span>
            </div>
          ` : ""}
          <h3>${esc(m.titulo)}</h3>
          <p>${esc(m.desc)}</p>
          <p class="muda" style="font-size:.84rem">Enviado por ${esc(m.nome)}</p>
          ${/^https?:\/\//i.test(m.link || "") ? `<a href="${esc(m.link)}" target="_blank" rel="noopener noreferrer">Ver repositório ↗</a>` : ""}
          <div class="card-rodape">
            <button type="button" class="chip chip-mini" data-like="${i}">♥ ${m.likes || 0}</button>
            <button class="btn ghost" type="button" data-del="${i}">Remover</button>
          </div>
        </article>
      `).join("")
    : '<p class="muda">Ainda não há projetos publicados neste navegador. Use o formulário ao lado para testar.</p>';
}

function iniciarMural() {
  renderMural();

  /* Pré-visualização instantânea da imagem selecionada */
  const inputImg = $("#m-img");
  const prevBox = $("#m-preview-box");
  const prevImg = $("#m-preview-img");
  const btnRemPrev = $("#m-remover-preview");

  if (inputImg && prevBox && prevImg) {
    inputImg.addEventListener("change", () => {
      const f = inputImg.files[0];
      if (!f || !f.type.startsWith("image/")) {
        prevBox.hidden = true;
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        prevImg.src = reader.result;
        prevBox.hidden = false;
      };
      reader.readAsDataURL(f);
    });
    btnRemPrev.addEventListener("click", () => {
      inputImg.value = "";
      prevImg.src = "";
      prevBox.hidden = true;
    });
  }

  $("#form-mural").addEventListener("submit", async e => {
    e.preventDefault();
    const nome = $("#m-nome").value.trim();
    const titulo = $("#m-titulo").value.trim();
    const desc = $("#m-desc").value.trim();
    const link = $("#m-link").value.trim();
    const f = $("#m-img").files[0];
    const erro = msg => { $("#m-erro").textContent = msg; };

    if (!nome || !titulo || !desc) return erro("Preencha seu nome, o título e a descrição do projeto.");
    if (link && !/^https?:\/\/\S+$/i.test(link)) return erro("O link precisa começar com http:// ou https://.");
    if (f && !f.type.startsWith("image/")) return erro("Selecione um arquivo de imagem válido (JPG ou PNG).");

    const itens = ler(MURAL_KEY, []);
    if (itens.length >= MURAL_MAX) return erro(`Limite de ${MURAL_MAX} itens atingido. Remova algum para adicionar outro.`);

    let img = "";
    try {
      if (f) img = await reduzirImagem(f);
    } catch {
      return erro("Não foi possível processar essa imagem.");
    }

    itens.unshift({ nome, titulo, desc, link, img, likes: 0 });
    if (!gravar(MURAL_KEY, itens)) return erro("Espaço insuficiente no navegador. Tente uma imagem menor.");

    erro("");
    e.target.reset();
    if (prevBox) prevBox.hidden = true;
    renderMural();
    toast("Projeto adicionado ao mural.");
  });

  $("#lista-mural").addEventListener("click", e => {
    const b = e.target.closest("[data-del]");
    if (b) {
      const itens = ler(MURAL_KEY, []);
      itens.splice(+b.dataset.del, 1);
      gravar(MURAL_KEY, itens);
      renderMural();
      toast("Item removido do mural.");
      return;
    }

    const likeBtn = e.target.closest("[data-like]");
    if (likeBtn) {
      const idx = +likeBtn.dataset.like;
      const itens = ler(MURAL_KEY, []);
      if (itens[idx]) {
        itens[idx].likes = (itens[idx].likes || 0) + 1;
        gravar(MURAL_KEY, itens);
        renderMural();
      }
      return;
    }

    const zoomEl = e.target.closest(".mural-zoom");
    if (zoomEl) {
      const idx = +zoomEl.dataset.muralIdx;
      const item = ler(MURAL_KEY, [])[idx];
      if (item) {
        abrirModalProjeto({
          titulo: item.titulo,
          desc: item.desc,
          tags: [item.nome],
          imagem: item.img,
          link: item.link || "#"
        });
      }
    }
  });
}

function aplicarTema(t) {
  document.documentElement.dataset.theme = t;
  $("#btn-tema").textContent = t === "dark" ? "Tema claro" : "Tema escuro";
  gravar("portfolio:tema", t);
}

function iniciarSeletorCor() {
  const corSalva = ler("portfolio:accent", "#c2593f");
  const aplicarCor = hex => {
    document.documentElement.style.setProperty("--ac", hex);
    document.documentElement.style.setProperty("--ac-soft", `color-mix(in srgb, ${hex} 14%, transparent)`);
    document.querySelectorAll(".dot-cor").forEach(d => {
      d.classList.toggle("ativo", d.dataset.accent === hex);
    });
    gravar("portfolio:accent", hex);
  };
  aplicarCor(corSalva);

  document.querySelectorAll(".dot-cor").forEach(dot => {
    dot.addEventListener("click", () => aplicarCor(dot.dataset.accent));
  });
}

function aplicarTiltCards() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll("[data-tilt]").forEach(el => {
    if (el.dataset.tiltBound) return;
    el.dataset.tiltBound = "1";
    el.addEventListener("mousemove", e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(700px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-2px)`;
    });
    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

function iniciarAnimacoes() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("vis");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".reveal").forEach(s => io.observe(s));

  const links = [...document.querySelectorAll("#menu a")];
  const spy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(a => a.classList.toggle("ativo", a.hash === "#" + entry.target.id));
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  document.querySelectorAll("main section").forEach(s => spy.observe(s));

  /* Barra de progresso de leitura + botão voltar ao topo */
  const bar = $("#scroll-progress");
  const btnTopo = $("#btn-topo");
  window.addEventListener("scroll", () => {
    const h = document.documentElement;
    const max = h.scrollHeight - h.clientHeight;
    if (bar && max > 0) {
      bar.style.width = `${(window.scrollY / max) * 100}%`;
    }
    if (btnTopo) {
      btnTopo.classList.toggle("vis", window.scrollY > 420);
    }
  }, { passive: true });

  if (btnTopo) {
    btnTopo.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function init() {
  $("#ano").textContent = new Date().getFullYear();
  preencherDadosPessoais();
  iniciarSkillsInterativas();
  iniciarModal();

  const tagsProjetos = typeof DADOS !== "undefined" ? [...new Set(DADOS.projetos.flatMap(p => p.tags))] : [];
  criarFiltros("#filtros-proj", tagsProjetos, renderProjetos);
  renderProjetos();

  criarFiltros("#filtros-emp", [...new Set(EMPRESAS.map(e => e.tipo))], t => {
    tipoEmp = t;
    renderEmpresas();
  });
  iniciarFavoritosEmpresas();
  renderEmpresas();
  $("#busca").addEventListener("input", renderEmpresas);

  $("#dicas").innerHTML = DICAS.map(([t, d]) => `<details><summary>${t}</summary><p>${d}</p></details>`).join("");

  const btnExpandirDicas = $("#btn-expandir-dicas");
  if (btnExpandirDicas) {
    btnExpandirDicas.addEventListener("click", () => {
      const todos = [...document.querySelectorAll("#dicas details")];
      const algumFechado = todos.some(d => !d.open);
      todos.forEach(d => { d.open = algumFechado; });
    });
  }

  iniciarChecklist();
  iniciarMural();

  const temaInicial = ler("portfolio:tema", "light");
  aplicarTema(temaInicial);
  $("#btn-tema").addEventListener("click", () => {
    aplicarTema(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  });

  iniciarSeletorCor();

  const btnCopiarEmail = $("#btn-copiar-email");
  if (btnCopiarEmail) {
    btnCopiarEmail.addEventListener("click", async () => {
      const email = typeof DADOS !== "undefined" ? DADOS.email : "seu.email@exemplo.com";
      try {
        await navigator.clipboard.writeText(email);
        toast("E-mail copiado!");
      } catch {
        toast(email);
      }
    });
  }

  $("#btn-menu").addEventListener("click", e => {
    const aberto = $("#menu").classList.toggle("aberto");
    e.currentTarget.setAttribute("aria-expanded", aberto);
  });
  $("#menu").addEventListener("click", e => {
    if (e.target.tagName === "A") $("#menu").classList.remove("aberto");
  });

  $("#form-contato").addEventListener("submit", e => {
    e.preventDefault();
    const n = $("#c-nome").value.trim();
    const m = $("#c-mail").value.trim();
    const t = $("#c-msg").value.trim();
    if (!n || !/^\S+@\S+\.\S+$/.test(m) || !t) {
      $("#c-erro").textContent = "Preencha seu nome, um e-mail válido e a mensagem.";
      return;
    }
    $("#c-erro").textContent = "";
    const destino = typeof DADOS !== "undefined" ? DADOS.email : "seu.email@exemplo.com";
    location.href = `mailto:${destino}?subject=${encodeURIComponent("Contato pelo portfólio – " + n)}&body=${encodeURIComponent(t + "\n\n" + n + " (" + m + ")")}`;
    toast("Abrindo seu cliente de e-mail...");
  });

  aplicarTiltCards();
  iniciarAnimacoes();
}

init();
