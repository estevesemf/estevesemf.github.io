const STORAGE_KEY = 'portfolio_v2';
const DEBOUNCE_DELAY = 250;
const EDIT_MODE = new URLSearchParams(window.location.search).get('edit') === '1';

let debounceTimer;
let projectObserver;

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.toggle('edit-mode', EDIT_MODE);
  document.getElementById('currentYear').textContent = new Date().getFullYear();

  loadFromStorage();
  syncDerivedFields();

  if (EDIT_MODE) {
    enableEditableMode();
    setupEditableFields();
    setupFormBindings();
    setupButtonListeners();
    setupEditPanel();
    setupEditableLinks();
    updateFormFromPage();
  }

  initScrollReveal();
  initProjectShowcase();
  setupProfileOpenWorkButton();
});

function loadFromStorage() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const data = JSON.parse(saved);
    applyDataToPage(data);
  } catch (error) {
    console.error('Erro ao carregar dados do portfólio:', error);
  }
}

function applyDataToPage(data) {
  setText('fullName', data.fullName);
  setText('jobTitle', data.jobTitle);
  setText('shortBio', data.shortBio);
  setText('aboutLead', data.aboutLead);
  setText('aboutText', data.aboutText);
  setText('locationText', data.locationText);
  setText('profileTag', data.profileTag);

  document.getElementById('profilePhoto').src = normalizePhotoUrl(data.photoUrl);

  applyContactData(data.contact || {});

  if (Array.isArray(data.projects) && data.projects.length > 0) {
    const container = getProjectsContainer();
    container.innerHTML = '';
    data.projects.forEach((project, index) => {
      container.appendChild(createProjectCard(project, index));
    });
    syncProjectShowcase();
  }

  if (Array.isArray(data.education) && data.education.length > 0) {
    const container = document.getElementById('educationList');
    container.innerHTML = '';
    data.education.forEach((item, index) => {
      container.appendChild(createEducationItem(item, index));
    });
  }

  syncDerivedFields();
}

function applyContactData(contact) {
  if (contact.email) {
    const emailHref = contact.email.startsWith('mailto:') ? contact.email : `mailto:${contact.email}`;
    const emailText = contact.email.replace(/^mailto:/, '');
    setLink('contactEmail', emailHref, emailText);
  }

  if (contact.phone) {
    const phoneText = contact.phone.replace(/^tel:/, '');
    const phoneHref = contact.phone.startsWith('tel:') ? contact.phone : `tel:${contact.phone}`;
    setLink('contactPhone', phoneHref, phoneText);
  }

  if (contact.github) {
    setLink('heroGithub', contact.github, 'GitHub');
    setLink('contactGithub', contact.github, 'Perfil no GitHub');
  }

  if (contact.linkedin) {
    setLink('heroLinkedin', contact.linkedin, 'LinkedIn');
    setLink('contactLinkedin', contact.linkedin, 'Perfil no LinkedIn');
  }

  if (contact.resumeUrl) {
    setLink('heroResume', contact.resumeUrl, 'Currículo');
    setLink('contactResume', contact.resumeUrl, 'Baixar currículo');
  }
}

function getDataFromPage() {
  return {
    fullName: getText('fullName'),
    jobTitle: getText('jobTitle'),
    shortBio: getText('shortBio'),
    aboutLead: getText('aboutLead'),
    aboutText: getText('aboutText'),
    locationText: getText('locationText'),
    profileTag: getText('profileTag'),
    photoUrl: normalizePhotoUrl(document.getElementById('profilePhoto').src),
    contact: {
      email: document.getElementById('contactEmail').getAttribute('href') || '',
      phone: document.getElementById('contactPhone').getAttribute('href') || '',
      github: document.getElementById('contactGithub').getAttribute('href') || '',
      linkedin: document.getElementById('contactLinkedin').getAttribute('href') || '',
      resumeUrl: document.getElementById('contactResume').getAttribute('href') || '',
    },
    projects: getProjectsData(),
    education: getEducationData(),
  };
}

function getProjectsData() {
  return Array.from(getProjectsContainer().querySelectorAll('.project-card')).map((item) => ({
    badge: item.querySelector('.project-badge').textContent.trim(),
    type: item.querySelector('.project-type').textContent.trim(),
    title: item.querySelector('.project-title').textContent.trim(),
    description: item.querySelector('.project-description').textContent.trim(),
    stack: item.querySelector('.project-stack').textContent.trim(),
    github: item.querySelector('.project-link').getAttribute('href') || '',
    live: item.querySelector('.project-link.ghost').getAttribute('href') || '',
  }));
}

function getEducationData() {
  return Array.from(document.querySelectorAll('#educationList .timeline-item')).map((item) => {
    const details = item.querySelector('.timeline-details') || item.querySelector('p:last-child');

    return {
      period: item.querySelector('.timeline-period').textContent.trim(),
      title: item.querySelector('h3').textContent.trim(),
      institution: item.querySelector('.timeline-place').textContent.trim(),
      details: details ? details.textContent.trim() : '',
    };
  });
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getDataFromPage()));
}

function debouncedSave() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    saveToStorage();
    syncDerivedFields();
    syncProjectPosterText();
    updateFormFromPage();
  }, DEBOUNCE_DELAY);
}

function enableEditableMode() {
  document.querySelectorAll('[data-editable]').forEach((element) => {
    element.setAttribute('contenteditable', 'true');
    element.dataset.editable = 'true';
  });
}

function setupEditableFields() {
  document.querySelectorAll('[data-editable]').forEach((element) => {
    if (element.dataset.bound === 'true') return;
    element.dataset.bound = 'true';
    element.addEventListener('input', debouncedSave);
    element.addEventListener('blur', debouncedSave);
  });
}

function setupEditableLinks() {
  document.querySelectorAll('.editable-link').forEach((link) => {
    if (link.dataset.linkBound === 'true') return;
    link.dataset.linkBound = 'true';

    link.addEventListener('click', (event) => {
      if (!EDIT_MODE) return;

      event.preventDefault();
      const label = link.dataset.linkLabel || 'Informe a URL';
      const current = link.getAttribute('href') || '';
      const next = window.prompt(label, current);
      if (next === null) return;

      const normalized = normalizeLinkValue(link.id, next.trim());
      setInteractiveHref(link, normalized);
      syncRelatedContactLinks(link.id, normalized);

      const hasHref = normalized && normalized !== '#';
      if (link.id === 'contactEmail') {
        link.textContent = hasHref ? normalized.replace(/^mailto:/, '') : 'Email em breve';
      } else if (link.id === 'contactPhone') {
        link.textContent = hasHref ? normalized.replace(/^tel:/, '') : 'Telefone em breve';
      } else if (link.id === 'heroResume') {
        link.textContent = hasHref ? 'Currículo' : 'Currículo em breve';
      } else if (link.id === 'contactResume') {
        link.textContent = hasHref ? 'Baixar currículo' : 'Currículo em breve';
      } else if (link.classList.contains('project-link')) {
        link.textContent = getProjectLinkText(link, normalized);
      }

      syncDerivedFields();
      updateFormFromPage();
      debouncedSave();
    });
  });
}

function setupFormBindings() {
  const bindings = {
    formFullName: (value) => setText('fullName', value),
    formJobTitle: (value) => setText('jobTitle', value),
    formShortBio: (value) => setText('shortBio', value),
    formAboutText: (value) => setText('aboutText', value),
    formLocation: (value) => setText('locationText', value),
    formPhotoUrl: (value) => {
      if (value) {
        document.getElementById('profilePhoto').src = value;
      }
    },
    formEmail: (value) => {
      const href = normalizeLinkValue('contactEmail', value);
      setLink('contactEmail', href, href.replace(/^mailto:/, ''));
    },
    formPhone: (value) => {
      const href = normalizeLinkValue('contactPhone', value);
      setLink('contactPhone', href, href.replace(/^tel:/, ''));
    },
    formGithub: (value) => {
      setLink('heroGithub', value, 'GitHub');
      setLink('contactGithub', value, 'Perfil no GitHub');
    },
    formLinkedin: (value) => {
      setLink('heroLinkedin', value, 'LinkedIn');
      setLink('contactLinkedin', value, 'Perfil no LinkedIn');
    },
    formResumeUrl: (value) => {
      setLink('heroResume', value, 'Currículo');
      setLink('contactResume', value, 'Baixar currículo');
    },
  };

  Object.entries(bindings).forEach(([id, apply]) => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
      apply(input.value.trim());
      syncDerivedFields();
      debouncedSave();
    });
  });
}

function updateFormFromPage() {
  if (!EDIT_MODE) return;

  document.getElementById('formFullName').value = getText('fullName');
  document.getElementById('formJobTitle').value = getText('jobTitle');
  document.getElementById('formShortBio').value = getText('shortBio');
  document.getElementById('formAboutText').value = getText('aboutText');
  document.getElementById('formLocation').value = getText('locationText');
  document.getElementById('formPhotoUrl').value = normalizePhotoUrl(document.getElementById('profilePhoto').src);
  document.getElementById('formEmail').value = (document.getElementById('contactEmail').getAttribute('href') || '').replace(/^mailto:/, '');
  document.getElementById('formPhone').value = (document.getElementById('contactPhone').getAttribute('href') || '').replace(/^tel:/, '');
  document.getElementById('formGithub').value = document.getElementById('contactGithub').getAttribute('href') || '';
  document.getElementById('formLinkedin').value = document.getElementById('contactLinkedin').getAttribute('href') || '';
  document.getElementById('formResumeUrl').value = document.getElementById('contactResume').getAttribute('href') || '';
}

function setupEditPanel() {
  const editToggleBtn = document.getElementById('editToggleBtn');
  const closeBtn = document.getElementById('closePanelBtn');
  const panel = document.getElementById('editPanel');

  const closePanel = () => {
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    editToggleBtn.setAttribute('aria-expanded', 'false');
  };

  const openPanel = () => {
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    editToggleBtn.setAttribute('aria-expanded', 'true');
  };

  editToggleBtn.addEventListener('click', () => {
    if (panel.classList.contains('open')) {
      closePanel();
    } else {
      openPanel();
    }
  });

  closeBtn.addEventListener('click', closePanel);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePanel();
    }
  });
}

function setupButtonListeners() {
  document.getElementById('addProjectBtn').addEventListener('click', () => {
    const container = getProjectsContainer();
    container.appendChild(createProjectCard({
      badge: 'Novo projeto',
      type: 'Tipo do projeto',
      title: 'Nome do projeto',
      description: 'Explique rapidamente o problema resolvido, seu papel e o resultado mais importante.',
      stack: 'Stack principal, arquitetura, integração, responsividade',
      github: '',
      live: '',
    }, container.children.length));
    refreshEditableContent();
  });

  document.getElementById('addEducationBtn').addEventListener('click', () => {
    const container = document.getElementById('educationList');
    container.appendChild(createEducationItem({
      period: 'Ano / período',
      title: 'Nova formação ou curso',
      institution: 'Instituição',
      details: 'Explique o contexto relevante para sua carreira.',
    }, container.children.length));
    refreshEditableContent();
  });

  document.getElementById('exportBtn').addEventListener('click', exportJSON);
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('importFileInput').click();
  });
  document.getElementById('importFileInput').addEventListener('change', importJSON);
  document.getElementById('resetBtn').addEventListener('click', () => {
    if (!window.confirm('Deseja remover as alterações salvas e voltar ao conteúdo padrão?')) return;
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  });
}

function refreshEditableContent() {
  enableEditableMode();
  setupEditableFields();
  setupEditableLinks();
  syncProjectShowcase();
  debouncedSave();
}

function createProjectCard(project, index) {
  const article = document.createElement('article');
  article.className = 'project-card';
  article.dataset.index = index;
  article.setAttribute('data-project-step', '');

  const number = document.createElement('p');
  number.className = 'project-number';
  number.setAttribute('aria-hidden', 'true');
  number.textContent = formatProjectNumber(index);

  const top = document.createElement('div');
  top.className = 'project-top';
  top.append(
    createEditableElement('span', 'project-badge editable-field', project.badge || 'Projeto'),
    createEditableElement('h3', 'project-title editable-field', project.title || 'Nome do projeto'),
  );

  const links = document.createElement('div');
  links.className = 'project-links';
  links.append(
    createProjectLink(project.github || '', 'Código no GitHub', 'Repositório do projeto'),
    createProjectLink(project.live || '', 'Ver demo', 'Demo do projeto', true),
  );

  article.append(
    number,
    top,
    createEditableElement('p', 'project-type editable-field', project.type || 'Tipo'),
    createEditableElement('p', 'project-description editable-field', project.description || 'Descrição do projeto'),
    createEditableElement('p', 'project-stack editable-field', project.stack || 'Stack do projeto'),
    links,
  );

  return article;
}

function createEducationItem(item, index) {
  const article = document.createElement('article');
  article.className = 'timeline-item';
  article.dataset.index = index;

  article.append(
    createEditableElement('p', 'timeline-period editable-field', item.period || 'Ano'),
    createEditableElement('h3', 'editable-field', item.title || 'Nova formação'),
    createEditableElement('p', 'timeline-place editable-field', item.institution || 'Instituição'),
    createEditableElement('p', 'timeline-details editable-field', item.details || 'Detalhes da formação'),
  );

  return article;
}

function createEditableElement(tagName, className, text) {
  const element = document.createElement(tagName);
  element.className = className;
  element.dataset.editable = '';
  element.textContent = text;
  return element;
}

function createProjectLink(href, text, label, isGhost = false) {
  const link = document.createElement('a');
  link.className = isGhost ? 'project-link ghost editable-link' : 'project-link editable-link';
  link.dataset.linkLabel = label;
  setInteractiveHref(link, href);
  link.textContent = getProjectLinkText(link, href) || text;
  return link;
}

function exportJSON() {
  const json = JSON.stringify(getDataFromPage(), null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `portfolio-export-${new Date().toISOString().split('T')[0]}.json`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    try {
      const data = JSON.parse(loadEvent.target.result);
      applyDataToPage(data);
      refreshEditableContent();
      alert('Portfólio importado com sucesso.');
    } catch (error) {
      alert(`Erro ao importar JSON: ${error.message}`);
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function syncDerivedFields() {
  const fullName = getText('fullName') || 'Seu Nome Aqui';
  document.title = `${fullName} | Portfólio`;
  document.getElementById('footerName').textContent = fullName;
  syncProfileContactLinks();
}

function syncProfileContactLinks() {
  syncProfileContactLink('contactEmail', 'profileEmail', 'Email em breve');
  syncProfileContactLink('contactPhone', 'profilePhone', 'Telefone em breve');
}

function syncProfileContactLink(sourceId, targetId, fallbackText) {
  const source = document.getElementById(sourceId);
  const target = document.getElementById(targetId);
  if (!source || !target) return;

  const href = source.getAttribute('href') || '';
  const value = source.textContent.trim() || fallbackText;
  const text = target.querySelector('strong');

  if (text) {
    text.textContent = value;
  }

  if (href && href !== '#') {
    target.setAttribute('href', href);
    target.removeAttribute('aria-disabled');
    syncProfileContactLinkTabIndex(target);
    return;
  }

  target.removeAttribute('href');
  target.setAttribute('aria-disabled', 'true');
  syncProfileContactLinkTabIndex(target);
}

function syncProfileContactLinkTabIndex(link) {
  const panel = document.getElementById('profileContactActions');
  const isOpen = panel && panel.classList.contains('is-open');
  const canFocus = isOpen && link.hasAttribute('href') && link.getAttribute('aria-disabled') !== 'true';
  link.tabIndex = canFocus ? 0 : -1;
}

function setupProfileOpenWorkButton() {
  const button = document.querySelector('.profile-open-work');
  const panel = document.getElementById('profileContactActions');
  if (!button || !panel) return;

  const setOpen = (isOpen) => {
    button.setAttribute('aria-expanded', String(isOpen));
    panel.classList.toggle('is-open', isOpen);
    panel.setAttribute('aria-hidden', String(!isOpen));
    panel.querySelectorAll('a').forEach((link) => {
      syncProfileContactLinkTabIndex(link);
    });
  };

  setOpen(false);

  button.addEventListener('click', (event) => {
    if (EDIT_MODE && event.target.closest('[contenteditable="true"]')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      button.focus();
    }
  });
}

function setText(id, value) {
  if (typeof value !== 'string' || value === '') return;
  document.getElementById(id).textContent = value;
}

function getText(id) {
  return document.getElementById(id).textContent.trim();
}

function setLink(id, href, text) {
  const link = document.getElementById(id);
  const hasHref = href && href !== '#';
  setInteractiveHref(link, href);
  if (!hasHref && id === 'contactEmail') {
    link.textContent = 'Email em breve';
  } else if (!hasHref && id === 'contactPhone') {
    link.textContent = 'Telefone em breve';
  } else if (!hasHref && (id === 'heroResume' || id === 'contactResume')) {
    link.textContent = 'Currículo em breve';
  } else if (text) {
    link.textContent = text;
  }
}

function setInteractiveHref(link, href) {
  if (href && href !== '#') {
    link.setAttribute('href', href);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    link.removeAttribute('aria-disabled');
    return;
  }

  link.removeAttribute('href');
  link.removeAttribute('target');
  link.removeAttribute('rel');
  link.setAttribute('aria-disabled', 'true');
}

function getProjectLinkText(link, href) {
  const hasHref = href && href !== '#';
  if (link.classList.contains('ghost')) {
    return hasHref ? 'Ver demo' : 'Demo em breve';
  }
  return hasHref ? 'Código no GitHub' : 'Código em breve';
}

function syncRelatedContactLinks(id, href) {
  const pairs = {
    heroGithub: 'contactGithub',
    contactGithub: 'heroGithub',
    heroLinkedin: 'contactLinkedin',
    contactLinkedin: 'heroLinkedin',
    heroResume: 'contactResume',
    contactResume: 'heroResume',
  };
  const relatedId = pairs[id];
  if (!relatedId) return;

  const relatedLink = document.getElementById(relatedId);
  const hasHref = href && href !== '#';
  setInteractiveHref(relatedLink, href);

  if (relatedId === 'heroResume') {
    relatedLink.textContent = hasHref ? 'Currículo' : 'Currículo em breve';
  } else if (relatedId === 'contactResume') {
    relatedLink.textContent = hasHref ? 'Baixar currículo' : 'Currículo em breve';
  }
}

function normalizeLinkValue(id, value) {
  if (!value) return '';
  if (id === 'contactEmail') {
    return value.startsWith('mailto:') ? value : `mailto:${value}`;
  }
  if (id === 'contactPhone') {
    return value.startsWith('tel:') ? value : `tel:${value}`;
  }
  return value;
}

function initScrollReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -32px 0px' }
  );

  document.querySelectorAll('.section').forEach((section, i) => {
    section.classList.add('reveal');
    section.style.transitionDelay = '0ms';
    observer.observe(section);
  });
}

function initProjectShowcase() {
  const showcase = document.getElementById('projectsList');
  if (!showcase) return;

  syncProjectShowcase();

  const nav = showcase.querySelector('.project-nav');
  if (nav && nav.dataset.bound !== 'true') {
    nav.dataset.bound = 'true';
    nav.addEventListener('click', (event) => {
      const button = event.target.closest('[data-project-target]');
      if (!button) return;

      const target = getProjectsContainer().querySelector(`.project-card[data-index="${button.dataset.projectTarget}"]`);
      if (target) {
        const rect = target.getBoundingClientRect();
        const targetY = rect.top + window.scrollY + (rect.height - window.innerHeight) / 2;
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        window.scrollTo({ top: Math.max(0, Math.min(targetY, maxY)), behavior: 'smooth' });
      }
      setActiveProject(button.dataset.projectTarget);
    });
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', updateProjectParallax, { passive: true });
    updateProjectParallax();
  }
}

function syncProjectShowcase() {
  const showcase = document.getElementById('projectsList');
  const container = getProjectsContainer();
  if (!showcase || !container) return;

  const cards = Array.from(container.querySelectorAll('.project-card'));
  const frame = showcase.querySelector('.project-frame');
  const nav = showcase.querySelector('.project-nav');
  if (!frame || !nav || cards.length === 0) return;

  cards.forEach((card, index) => {
    card.dataset.index = index;
    card.setAttribute('data-project-step', '');

    let number = card.querySelector('.project-number');
    if (!number) {
      number = document.createElement('p');
      number.className = 'project-number';
      number.setAttribute('aria-hidden', 'true');
      card.prepend(number);
    }
    number.textContent = formatProjectNumber(index);

    let poster = frame.querySelector(`.project-poster[data-index="${index}"]`);
    if (!poster) {
      poster = createProjectPoster(index);
      frame.insertBefore(poster, nav);
    }

    let button = nav.querySelector(`.project-nav-button[data-project-target="${index}"]`);
    if (!button) {
      button = createProjectNavButton(index);
      nav.appendChild(button);
    }

    syncProjectPoster(card, poster, index);
  });

  frame.querySelectorAll('.project-poster').forEach((poster) => {
    if (Number(poster.dataset.index) >= cards.length) {
      poster.remove();
    }
  });

  nav.querySelectorAll('.project-nav-button').forEach((button) => {
    if (Number(button.dataset.projectTarget) >= cards.length) {
      button.remove();
    }
  });

  const active = container.querySelector('.project-card.is-active') || cards[0];
  setActiveProject(active.dataset.index || '0');
  observeProjectCards();
}

function syncProjectPosterText() {
  const showcase = document.getElementById('projectsList');
  const container = getProjectsContainer();
  if (!showcase || !container) return;

  container.querySelectorAll('.project-card').forEach((card) => {
    const poster = showcase.querySelector(`.project-poster[data-index="${card.dataset.index}"]`);
    if (poster) {
      syncProjectPoster(card, poster, Number(card.dataset.index));
    }
  });
}

function syncProjectPoster(card, poster, index) {
  const badge = card.querySelector('.project-badge')?.textContent.trim() || 'Projeto';
  const title = card.querySelector('.project-title')?.textContent.trim() || 'Projeto em destaque';

  poster.querySelector('.poster-count').textContent = formatProjectNumber(index);
  poster.querySelector('.poster-eyebrow').textContent = badge;
  poster.querySelector('.poster-title').textContent = title;
}

function createProjectPoster(index) {
  const poster = document.createElement('article');
  poster.className = 'project-poster';
  poster.dataset.index = index;
  poster.setAttribute('data-project-poster', '');

  const art = document.createElement('div');
  art.className = 'poster-art';
  art.dataset.variant = ['court', 'agro', 'lab'][index % 3];
  art.setAttribute('aria-hidden', 'true');

  ['a', 'b', 'c'].forEach((suffix) => {
    const crop = document.createElement('span');
    crop.className = `poster-crop poster-crop-${suffix}`;
    art.appendChild(crop);
  });

  ['a', 'b'].forEach((suffix) => {
    const line = document.createElement('span');
    line.className = `poster-line poster-line-${suffix}`;
    art.appendChild(line);
  });

  const caption = document.createElement('div');
  caption.className = 'poster-caption';

  const count = document.createElement('span');
  count.className = 'poster-count';

  const eyebrow = document.createElement('p');
  eyebrow.className = 'poster-eyebrow';

  const title = document.createElement('h3');
  title.className = 'poster-title';

  caption.append(count, eyebrow, title);
  poster.append(art, caption);

  return poster;
}

function createProjectNavButton(index) {
  const button = document.createElement('button');
  button.className = 'project-nav-button';
  button.type = 'button';
  button.dataset.projectTarget = index;
  button.setAttribute('aria-label', `Ir para o projeto ${index + 1}`);
  button.textContent = formatProjectNumber(index);
  return button;
}

function observeProjectCards() {
  const container = getProjectsContainer();
  const cards = Array.from(container.querySelectorAll('.project-card'));
  if (cards.length === 0) return;

  if (projectObserver) {
    projectObserver.disconnect();
  }

  if (!('IntersectionObserver' in window)) {
    setActiveProject(0);
    return;
  }

  projectObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) {
        setActiveProject(visibleEntry.target.dataset.index);
      }
    },
    { threshold: [0.2, 0.45, 0.7], rootMargin: '-22% 0px -35% 0px' }
  );

  cards.forEach((card) => projectObserver.observe(card));
}

function setActiveProject(index) {
  const showcase = document.getElementById('projectsList');
  const container = getProjectsContainer();
  if (!showcase || !container) return;

  const normalizedIndex = Number(index) || 0;
  showcase.dataset.activeProject = normalizedIndex;

  showcase.querySelectorAll('[data-project-poster]').forEach((poster) => {
    poster.classList.toggle('is-active', Number(poster.dataset.index) === normalizedIndex);
  });

  container.querySelectorAll('.project-card').forEach((card) => {
    card.classList.toggle('is-active', Number(card.dataset.index) === normalizedIndex);
  });

  showcase.querySelectorAll('.project-nav-button').forEach((button) => {
    const isActive = Number(button.dataset.projectTarget) === normalizedIndex;
    button.classList.toggle('is-active', isActive);
    if (isActive) {
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('aria-current');
    }
  });

  updateProjectParallax();
}

function updateProjectParallax() {
  const poster = document.querySelector('.project-poster.is-active');
  const stage = document.querySelector('.project-stage');
  if (!poster || !stage) return;

  const rect = stage.getBoundingClientRect();
  const midpoint = window.innerHeight / 2;
  const distance = midpoint - (rect.top + rect.height / 2);
  const shift = Math.max(-28, Math.min(28, distance * 0.035));
  poster.style.setProperty('--poster-shift', `${shift.toFixed(2)}px`);
}

function getProjectsContainer() {
  return document.querySelector('#projectsList .project-story-list') || document.getElementById('projectsList');
}

function formatProjectNumber(index) {
  return String(Number(index) + 1).padStart(2, '0');
}

function normalizePhotoUrl(value) {
  if (!value) return 'perfil.jpg';
  if (value.startsWith('data:image/svg+xml')) return 'perfil.jpg';
  if (value === 'perfil/perfil.jpg' || value.endsWith('/perfil/perfil.jpg')) return 'perfil.jpg';
  return value;
}
