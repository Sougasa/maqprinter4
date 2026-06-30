document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('header nav');
  const navLinks = document.querySelectorAll('nav a.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  const btnTopo = document.getElementById('btnTopo');
  const bannerSlides = document.querySelectorAll('.banner-slider img');
  const btnSolicitarRetirada = document.getElementById('btnSolicitarRetirada');
  const popupRetirada = document.getElementById('popupRetirada');
  const btnFecharPopup = document.getElementById('btnClosePopup');
  const formRetirada = document.getElementById('formRetirada');
  const btnMenuMobile = document.getElementById('btnMenuMobile');
  const navOverlay = document.getElementById('navOverlay');
  const formContato = document.getElementById('form');
  const mensagemTextarea = document.getElementById('mensagem');

  const WHATSAPP_NUMBER = '5511930021008';

  // ----- Menu mobile -----
  function openNav() {
    nav?.classList.add('open');
    navOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    btnMenuMobile?.setAttribute('aria-expanded', 'true');
  }

  function closeNav() {
    nav?.classList.remove('open');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
    btnMenuMobile?.setAttribute('aria-expanded', 'false');
  }

  btnMenuMobile?.addEventListener('click', () => {
    nav?.classList.contains('open') ? closeNav() : openNav();
  });

  navOverlay?.addEventListener('click', closeNav);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeNav();
      closePopup();
    }
  });

  // ----- Navegação suave -----
  navLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href')?.substring(1);
      const targetEl = targetId ? document.getElementById(targetId) : null;
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        navLinks.forEach((l) => l.classList.remove('active'));
        link.classList.add('active');
        closeNav();
      }
    });
  });

  // ----- Scrollspy -----
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { threshold: 0.35, rootMargin: '-80px 0px -40% 0px' }
  );

  sections.forEach((section) => observer.observe(section));

  // ----- Botão voltar ao topo -----
  window.addEventListener('scroll', () => {
    btnTopo?.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btnTopo?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ----- Banner automático -----
  if (bannerSlides.length > 0) {
    let currentSlideIndex = 0;
    const showSlide = (index) => {
      bannerSlides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    };
    showSlide(0);
    setInterval(() => {
      currentSlideIndex = (currentSlideIndex + 1) % bannerSlides.length;
      showSlide(currentSlideIndex);
    }, 5000);
  }

  // ----- Popup retirada -----
  function openPopup() {
    popupRetirada?.removeAttribute('hidden');
    requestAnimationFrame(() => popupRetirada?.classList.add('show'));
    document.body.style.overflow = 'hidden';
    setTimeout(() => document.getElementById('nomeRetirada')?.focus(), 150);
  }

  function closePopup() {
    popupRetirada?.classList.remove('show');
    popupRetirada?.setAttribute('hidden', '');
    document.body.style.overflow = '';
    btnSolicitarRetirada?.focus();
  }

  btnSolicitarRetirada?.addEventListener('click', openPopup);
  btnFecharPopup?.addEventListener('click', closePopup);

  popupRetirada?.addEventListener('click', (e) => {
    if (e.target === popupRetirada) closePopup();
  });

  // Máscaras de input
  const cepInput = document.getElementById('cepRetirada');
  const telInput = document.getElementById('telefoneRetirada');

  cepInput?.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (v.length > 5) v = `${v.slice(0, 5)}-${v.slice(5)}`;
    e.target.value = v;
  });

  telInput?.addEventListener('input', (e) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    } else if (v.length > 6) {
      v = v.replace(/^(\d{2})(\d{4,5})(\d{0,4}).*/, '($1) $2-$3');
    } else if (v.length > 2) {
      v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (v.length > 0) {
      v = `(${v}`;
    }
    e.target.value = v;
  });

  formRetirada?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeRetirada')?.value.trim();
    const cep = document.getElementById('cepRetirada')?.value.trim();
    const telefone = document.getElementById('telefoneRetirada')?.value.trim();
    const modelo = document.getElementById('modeloRetirada')?.value.trim();

    if (!nome || !cep || !telefone || !modelo) return;

    const mensagem =
      `Olá, gostaria de solicitar a retirada.\n` +
      `Nome: ${nome}\n` +
      `CEP: ${cep}\n` +
      `Telefone: ${telefone}\n` +
      `Modelo da Impressora: ${modelo}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensagem)}`, '_blank', 'noopener');

    formRetirada.reset();
    closePopup();
  });

  // ----- Textarea auto-resize -----
  mensagemTextarea?.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = `${this.scrollHeight}px`;
  });

  // ----- Formulário de contato (feedback visual) -----
  formContato?.addEventListener('submit', async (e) => {
    const statusEl = document.getElementById('formStatus');
    const submitBtn = formContato.querySelector('button[type="submit"]');

    if (!statusEl) return;

    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    try {
      const response = await fetch(formContato.action, {
        method: 'POST',
        body: new FormData(formContato),
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        statusEl.className = 'form-status success';
        statusEl.textContent = 'Mensagem enviada com sucesso! Entraremos em contato em breve.';
        formContato.reset();
      } else {
        throw new Error('Erro ao enviar');
      }
    } catch {
      statusEl.className = 'form-status error';
      statusEl.textContent = 'Não foi possível enviar. Tente novamente ou ligue para (11) 3864-9611.';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar Mensagem';
    }
  });
});
