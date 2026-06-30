const descriptions = {
  plotter: {
    title: 'Plotter HP',
    body: 'Equipamento para impressão de grandes formatos com alta precisão. Ideal para engenheiros, arquitetos e empresas de comunicação visual.',
    services: [
      'Manutenção preventiva e corretiva de plotters HP DesignJet',
      'Substituição de cabeças de impressão e rolos',
      'Calibração e alinhamento de cores',
      'Venda de plotters novos e seminovos',
    ],
  },
  epson: {
    title: 'Epson L3250',
    body: 'Impressora jato de tinta multifuncional com sistema EcoTank, ideal para uso doméstico e pequenos escritórios com alto volume de impressão.',
    services: [
      'Limpeza de cabeças de impressão',
      'Recarga e manutenção de tanques de tinta',
      'Reparo de alimentador de papel e scanner',
      'Instalação de drivers e configuração de rede',
    ],
  },
  termica: {
    title: 'Impressora Térmica',
    body: 'Usada para impressão de recibos, etiquetas e documentos térmicos em comércios, restaurantes e logística.',
    services: [
      'Conserto de impressoras térmicas de balcão e portáteis',
      'Substituição de cabeças térmicas',
      'Manutenção de impressoras de etiquetas',
      'Venda de suprimentos e bobinas térmicas',
    ],
  },
  lexmark: {
    title: 'Lexmark',
    body: 'Marca reconhecida por impressoras corporativas robustas e soluções para grandes volumes de impressão.',
    services: [
      'Assistência técnica autorizada Lexmark',
      'Manutenção de impressoras laser e multifuncionais',
      'Reposição de toners e peças originais',
      'Contratos de manutenção preventiva',
    ],
  },
  brother: {
    title: 'Brother',
    body: 'Marca com impressoras confiáveis para escritórios, multifuncionais eficientes e equipamentos para pequenas empresas.',
    services: [
      'Conserto de impressoras Brother jato de tinta e laser',
      'Manutenção de multifuncionais',
      'Configuração de impressão wireless',
      'Venda de suprimentos originais Brother',
    ],
  },
  conserto: {
    title: 'Conserto de Impressoras',
    body: 'Serviços completos de manutenção e reparo para diversos modelos e marcas de impressoras, com orçamento gratuito.',
    services: [
      'Diagnóstico gratuito',
      'Retirada e entrega em domicílio (região de São Paulo)',
      'Peças originais e compatíveis de qualidade',
      'Garantia em todos os serviços realizados',
    ],
  },
  laser: {
    title: 'Impressora Laser',
    body: 'Impressoras rápidas e econômicas para grandes volumes de impressão em ambientes corporativos.',
    services: [
      'Manutenção de impressoras HP LaserJet, Samsung e Lexmark',
      'Recarga e substituição de toners',
      'Limpeza de fusores e unidades de imagem',
      'Venda de impressoras laser novas e seminovas',
    ],
  },
};

function renderContent(key) {
  const data = descriptions[key];
  const content = document.getElementById('content');
  if (!data || !content) return;

  const servicesList = data.services.map((s) => `<li>${s}</li>`).join('');

  content.innerHTML = `
    <h2>${data.title}</h2>
    <p>${data.body}</p>
    <div class="service-card">
      <h3>Serviços disponíveis</h3>
      <ul>${servicesList}</ul>
    </div>
    <p class="content-cta">
      <a href="../index.html#contato" class="btn-cta">Solicitar orçamento gratuito</a>
    </p>
  `;

  document.title = `${data.title} — Maqprinter | Assistência Técnica SP`;

  document.querySelectorAll('.sidebar a').forEach((link) => {
    link.classList.toggle('active', link.getAttribute('data-key') === key);
  });

  history.replaceState(null, '', `#${key}`);

  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
    metaDesc.setAttribute('content', `${data.body} Maqprinter — São Paulo, orçamento gratuito.`);
  }
}

function initIcons() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleTheme = document.getElementById('toggleTheme');
  const toggleSidebar = document.getElementById('toggleSidebar');
  const sidebar = document.getElementById('sidebar');
  const content = document.querySelector('.content');
  const menuRedirectButton = document.getElementById('menuRedirectButton');

  initIcons();

  // Restaurar tema salvo
  if (localStorage.getItem('maqprinter-theme') === 'dark') {
    document.body.classList.add('dark-theme');
  }

  toggleTheme?.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem(
      'maqprinter-theme',
      document.body.classList.contains('dark-theme') ? 'dark' : 'light'
    );
    initIcons();
  });

  toggleSidebar?.addEventListener('click', () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      sidebar.classList.toggle('open');
      toggleSidebar.setAttribute(
        'aria-expanded',
        sidebar.classList.contains('open') ? 'true' : 'false'
      );
    } else {
      sidebar.classList.toggle('closed');
      content?.classList.toggle('expanded');
    }
  });

  document.querySelectorAll('.sidebar a').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const key = link.getAttribute('data-key');
      if (key) renderContent(key);

      if (window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        toggleSidebar?.setAttribute('aria-expanded', 'false');
      }
    });
  });

  menuRedirectButton?.addEventListener('click', () => {
    window.location.href = '../index.html';
  });

  // Carregar conteúdo pelo hash da URL
  const hash = window.location.hash.replace('#', '');
  if (hash && descriptions[hash]) {
    renderContent(hash);
  }

  window.addEventListener('hashchange', () => {
    const key = window.location.hash.replace('#', '');
    if (key && descriptions[key]) renderContent(key);
  });
});
