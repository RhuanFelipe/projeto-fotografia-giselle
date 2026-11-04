/**
 * SCRIPT PRINCIPAL DO SITE DE FOTOGRAFIA (100% JAVASCRIPT PURO)
 * Controla navegação, filtros, modal com slide de fotos, página de detalhes do evento
 * e processamento local de formulários de orçamento e reserva.
 */

const PORTFOLIO_ITEMS = {
  casamento: {
    id: 'casamento',
    title: 'O Sim de Mariana & Rodrigo',
    shortTitle: 'Mariana & Rodrigo',
    categoryLabel: 'Casamento Real',
    orcamentoKey: 'casamento',
    location: 'Jardim Imperial • Holambra, SP',
    date: '18 de Outubro de 2026',
    duration: '8 Horas de Cobertura Integral',
    team: '2 Fotógrafos + Assistente de Luz',
    deliveryCount: '420 Fotos Tratadas em Alta Resolução',
    lightingStyle: 'Luz Natural Golden Hour & Flash Difuso Quente',
    coverImg: 'assets/images/casamento.jpg',
    summary: 'Uma celebração rústico-chique ao ar livre envolta por roseiras, votos emocionantes e a luz dourada do fim de tarde no interior paulista.',
    storyParagraphs: [
      'O casamento de Mariana e Rodrigo foi planejado para refletir a leveza e a cumplicidade do casal. Realizado nos jardins floridos de Holambra, o evento começou no meio da tarde para aproveitar a transição suave da luz do sol entre as árvores centenárias.',
      'Durante o making-of, priorizamos retratos intimistas e serenos, registrando a troca de cartas manuscritas e o carinho da família. Na cerimônia ao ar livre, trabalhamos com duas câmeras em ângulos complementares para capturar tanto a reação emocionante do noivo no altar quanto os olhares marejados dos convidados.',
      'Logo após os votos, conduzimos um ensaio de 25 minutos pelo campo durante o pôr do sol (Golden Hour), sem poses rígidas — apenas caminhando, conversando e deixando a emoção do momento fluir antes da abertura animada da pista de dança.'
    ],
    timeline: [
      { time: '14:30', title: 'Making-of da Noiva & Detalhes', desc: 'Registro do vestido, joias de família, buquê orgânico e preparação com mãe e madrinhas.' },
      { time: '16:15', title: 'Cerimônia sob as Figueiras', desc: 'Entrada do cortejo, votos autorais ao ar livre e chuva de pétalas naturais na saída.' },
      { time: '17:30', title: 'Ensaio Golden Hour do Casal', desc: 'Sessão exclusiva nos jardins com luz lateral dourada de fim de tarde.' },
      { time: '19:00', title: 'Jantar Intimista & Primeira Dança', desc: 'Brinde sob varal de luzes quentes, corte do bolo e valsa contemporânea.' },
      { time: '20:30', title: 'Festa & Pista de Dança', desc: 'Cobertura dinâmica e espontânea da celebração com amigos até a madrugada.' }
    ],
    highlights: [
      'Cobertura completa de 8 horas com 2 fotógrafos',
      'Making-of da noiva e do noivo simultâneos',
      'Ensaio exclusivo no pôr do sol pós-cerimônia',
      'Galeria online privativa entregue em 15 dias úteis',
      'Álbum Fine Art 30x30cm em linho cru com 40 páginas',
      'Prévia expressa com 30 fotos entregue em 48 horas'
    ],
    testimonial: {
      quote: 'Quando abrimos a galeria pela primeira vez, choramos tudo de novo! O Rhuan capturou sorrisos e abraços que nem tínhamos visto acontecer no dia. As fotos do pôr do sol parecem pinturas.',
      author: 'Mariana & Rodrigo Vasconcelos',
      role: 'Noivos • Casamento em Holambra'
    },
    slides: [
      {
        src: 'assets/images/casamento.jpg',
        moment: 'Foto 01 • Ensaio no Pôr do Sol',
        caption: 'Mariana e Rodrigo nos jardins de Holambra logo após o "Sim", banhados pela luz dourada das 17h40.',
        imgStyle: 'object-position: center center; filter: contrast(1.02);'
      },
      {
        src: 'assets/images/hero.jpg',
        moment: 'Foto 02 • Making-of da Noiva',
        caption: 'Retrato editorial nos momentos finais da preparação, valorizando a luz de janela suave e a delicadeza do véu.',
        imgStyle: 'object-position: center 25%; filter: sepia(0.08) contrast(1.03);'
      },
      {
        src: 'assets/images/casamento.jpg',
        moment: 'Foto 03 • Detalhes & Afeto no Altar',
        caption: 'Enquadramento aproximado destacando a conexão espontânea e o buquê autoral em tons de rosa seco e folhagens.',
        imgStyle: 'object-position: 65% 30%; transform: scale(1.12); filter: brightness(1.03) saturate(0.95);'
      },
      {
        src: 'assets/images/feminino.jpg',
        moment: 'Foto 04 • Retrato da Noiva no Campo',
        caption: 'Breve pausa individual na natureza antes do início da recepção noturna no Jardim Imperial.',
        imgStyle: 'object-position: center 35%; filter: sepia(0.05) brightness(1.02);'
      },
      {
        src: 'assets/images/casamento.jpg',
        moment: 'Foto 05 • Estética Fine Art P&B',
        caption: 'Versão monocromática atemporal ressaltando as texturas, o olhar cúmplice e a poesia visual do grande dia.',
        imgStyle: 'object-position: center 40%; filter: grayscale(100%) contrast(1.12);'
      }
    ]
  },

  '15anos': {
    id: '15anos',
    title: 'Noite Inesquecível de Clara',
    shortTitle: 'O Baile da Clara',
    categoryLabel: '15 Anos & Debutante',
    orcamentoKey: 'festa-15anos',
    location: 'Salão Villa Real • São Paulo, SP',
    date: '24 de Outubro de 2026',
    duration: '6 Horas de Cobertura Contínua',
    team: '2 Fotógrafos + Iluminação Criativa de Pista',
    deliveryCount: '240 Fotos Tratadas em Alta Resolução',
    lightingStyle: 'Luz Contínua Quente & Flash Criativo de Movimento',
    coverImg: 'assets/images/15anos.jpg',
    summary: 'Cenas vibrantes com luzes pontuais, vestido rodado champanhe, valsa emocionante com o pai e celebração intensa com os amigos.',
    storyParagraphs: [
      'A festa de 15 anos da Clara uniu a tradição clássica do baile de debutante a uma atmosfera moderna e cheia de personalidade. Desde a chegada ao Salão Villa Real, nosso objetivo foi deixá-la completamente à vontade para curtir cada segundo ao lado da família e das melhores amigas.',
      'Realizamos um mini-ensaio editorial nos jardins e nas escadarias do espaço antes da entrada dos convidados, aproveitando a arquitetura clássica e o caimento impecável do vestido champanhe.',
      'Durante o cerimonial das 15 rosas, a valsa com o pai e a abertura da pista com coreografia especial, utilizamos iluminação de recorte que destacou o brilho do salão sem perder a naturalidade e o calor humano de cada abraço.'
    ],
    timeline: [
      { time: '19:00', title: 'Ensaio Editorial Pré-Festa', desc: 'Sessão exclusiva com o primeiro vestido no salão decorado antes da abertura das portas.' },
      { time: '20:30', title: 'Recepção com Família & Amigos', desc: 'Registros espontâneos na chegada dos convidados e fotos com avós e padrinhos.' },
      { time: '22:00', title: 'Cerimonial & Valsa dos 15 Anos', desc: 'Entrada triunfal, homenagem dos pais, troca do anel e as três valsas clássicas.' },
      { time: '23:15', title: 'Parabéns & Abertura de Pista', desc: 'Segundo look moderno, coreografia com as amigas e muita energia na pista.' }
    ],
    highlights: [
      '6 horas de cobertura fotográfica ininterrupta',
      'Mini-ensaio no salão vazio antes da recepção',
      'Cobertura dos 2 looks da debutante',
      'Técnica de longa exposição para fotos vibrantes na balada',
      'Seleção especial de 25 fotos em formato vertical para Reels/Stories',
      'Entrega em estojo personalizado e galeria em nuvem'
    ],
    testimonial: {
      quote: 'O aniversário de 15 anos da minha filha foi mágico! O Rhuan conseguiu captar toda a empolgação dos jovens e a emoção dos avós na valsa. A entrega foi antes do prazo prometido.',
      author: 'Patrícia Almeida',
      role: 'Mãe da Debutante Clara'
    },
    slides: [
      {
        src: 'assets/images/15anos.jpg',
        moment: 'Foto 01 • A Grande Valsa no Salão',
        caption: 'Clara no centro do Salão Villa Real durante o giro principal da valsa sob lustres de cristal e luz âmbar.',
        imgStyle: 'object-position: center center;'
      },
      {
        src: 'assets/images/hero.jpg',
        moment: 'Foto 02 • Retrato Editorial da Debutante',
        caption: 'Retrato clássico realizado 30 minutos antes da recepção, destacando a maquiagem iluminada e a delicadeza dos 15 anos.',
        imgStyle: 'object-position: center 20%; filter: contrast(1.04) saturate(1.05);'
      },
      {
        src: 'assets/images/15anos.jpg',
        moment: 'Foto 03 • Detalhes do Vestido Champanhe',
        caption: 'Close artístico no movimento dos tules bordados e na iluminação pontual de fundo.',
        imgStyle: 'object-position: 35% 40%; transform: scale(1.14); filter: brightness(1.05);'
      },
      {
        src: 'assets/images/feminino.jpg',
        moment: 'Foto 04 • Ensaio Pré-15 Anos ao Ar Livre',
        caption: 'Prévia do ensaio externo realizado no mês anterior para compor o telão e o livro de assinaturas da festa.',
        imgStyle: 'object-position: center 30%; filter: sepia(0.06);'
      },
      {
        src: 'assets/images/15anos.jpg',
        moment: 'Foto 05 • Emoção em Preto & Branco',
        caption: 'Registro documental em preto e branco eternizando a alegria genuína da noite de estreia.',
        imgStyle: 'object-position: center center; filter: grayscale(100%) contrast(1.15);'
      }
    ]
  },

  gestante: {
    id: 'gestante',
    title: 'A Doce Espera por Lívia',
    shortTitle: 'A Espera por Lívia',
    categoryLabel: 'Maternidade Fine Art',
    orcamentoKey: 'ensaio-gestante',
    location: 'Estúdio Luz & Poesia • São Paulo, SP',
    date: '10 de Outubro de 2026',
    duration: '2h30 de Sessão com Pausas Confortáveis',
    team: 'Fotógrafo Principal + Consultora de Styling',
    deliveryCount: '35 Fotos Fine Art Tratadas Minuciosamente',
    lightingStyle: 'Luz de Janela Difusa & Rebatedor Acetinado',
    coverImg: 'assets/images/gestante.jpg',
    summary: 'Textura suave, tons terrosos, tecidos fluidos de seda e conexão profunda entre a mãe e a pequena Lívia a caminho.',
    storyParagraphs: [
      'Realizado na 30ª semana de gestação, este ensaio foi desenhado para celebrar a maternidade com serenidade, conforto e estética de pintura clássica. No Estúdio Luz & Poesia, preparamos o ambiente com temperatura agradável, música suave e três propostas de figurino em tons de rosa antigo, areia e off-white.',
      'A direção fotográfica priorizou movimentos orgânicos das mãos, a silhueta iluminada contra a luz natural das grandes janelas e a expressão tranquila de quem já sente o amor transbordar antes mesmo do nascimento.',
      'O tratamento de pós-produção seguiu a escola Fine Art: preservação total da textura natural da pele, suavização cromática em paleta pastel e acabamento digno de porta-retratos e álbuns de herança familiar.'
    ],
    timeline: [
      { time: '09:00', title: 'Acolhimento & Escolha de Figurinos', desc: 'Café de boas-vindas no estúdio e prova dos vestidos autorais em linho, tule e seda.' },
      { time: '09:30', title: 'Set 01 • Luz Natural Minimalista', desc: 'Fotos em fundo neutro claro valorizando a silhueta materna e a leveza dos gestos.' },
      { time: '10:20', title: 'Set 02 • Tecidos Fluidos & Tons Terrosos', desc: 'Composição artística com movimento de tecido rose e iluminação lateral poética.' },
      { time: '11:00', title: 'Set 03 • Retratos Intimistas & Detalhes', desc: 'Closes afetivos das mãos, sapatinhos da Lívia e retratos emocionantes.' }
    ],
    highlights: [
      'Acesso completo ao acervo de figurinos exclusivos para gestantes',
      'Sessão sem pressa respeitando o ritmo e conforto da mãe',
      'Participação do companheiro(a) e filhos mais velhos inclusa',
      'Tratamento de pele artesanal sem aspecto artificial',
      'Galeria privativa para escolha tranquila das fotos favoritas',
      'Opção de impressão em papel algodão museológico'
    ],
    testimonial: {
      quote: 'Me senti acolhida do início ao fim! Estava insegura com as mudanças do corpo na gravidez, mas o olhar delicado do Rhuan me fez enxergar a fase mais linda da minha vida. A Lívia terá uma lembrança eterna.',
      author: 'Camila & Bruno Fontes',
      role: 'Pais da Lívia • Ensaio 30 Semanas'
    },
    slides: [
      {
        src: 'assets/images/gestante.jpg',
        moment: 'Foto 01 • Poesia em Tons Rose',
        caption: 'Iluminação lateral suave destacando a silhueta das 30 semanas e a fluidez do vestido em seda rose.',
        imgStyle: 'object-position: center center;'
      },
      {
        src: 'assets/images/gestante.jpg',
        moment: 'Foto 02 • Conexão & Afeto Materno',
        caption: 'Enquadramento fechado valorizando o toque delicado das mãos e a serenidade da espera pela Lívia.',
        imgStyle: 'object-position: center 60%; transform: scale(1.15); filter: brightness(1.03);'
      },
      {
        src: 'assets/images/hero.jpg',
        moment: 'Foto 03 • Retrato Fine Art Iluminado',
        caption: 'Olhar sereno em direção à luz natural da janela principal do estúdio.',
        imgStyle: 'object-position: center 25%; filter: sepia(0.08) brightness(1.02);'
      },
      {
        src: 'assets/images/feminino.jpg',
        moment: 'Foto 04 • Leveza ao Ar Livre no Jardim do Estúdio',
        caption: 'Momentos finais do ensaio realizados na área externa arborizada com luz dourada filtrada.',
        imgStyle: 'object-position: center 40%;'
      },
      {
        src: 'assets/images/gestante.jpg',
        moment: 'Foto 05 • Clássico Monocromático',
        caption: 'Estudo de luz e sombra em preto e branco com estética atemporal de galeria.',
        imgStyle: 'object-position: center center; filter: grayscale(100%) contrast(1.1);'
      }
    ]
  },

  feminino: {
    id: 'feminino',
    title: 'A Serenidade de Helena',
    shortTitle: 'Retrato de Helena',
    categoryLabel: 'Retrato Feminino Autoral',
    orcamentoKey: 'ensaio-feminino',
    location: 'Campos do Jordão, SP • Refúgio da Serra',
    date: '04 de Outubro de 2026',
    duration: '2 Horas de Sessão ao Pôr do Sol',
    team: 'Fotógrafo Principal + Direção Afetiva',
    deliveryCount: '30 Fotos Autorais em Alta Resolução',
    lightingStyle: '100% Luz Natural de Fim de Tarde na Serra',
    coverImg: 'assets/images/feminino.jpg',
    summary: 'Retrato individual espontâneo em meio à natureza serrana, valorizando a autenticidade, a autoestima e a essência feminina.',
    storyParagraphs: [
      'Helena procurou o estúdio com o desejo de celebrar um novo ciclo pessoal e profissional através de retratos que transmitissem força, leveza e verdade — longe de poses engessadas de estúdio tradicional.',
      'Escolhemos um campo aberto em Campos do Jordão no final da tarde, onde a brisa suave e a luz âmbar de outono criaram a atmosfera perfeita. Conversamos sobre suas músicas favoritas e sua trajetória enquanto caminhávamos pela trilha, permitindo que cada clique surgisse de forma orgânica.',
      'O resultado foi uma série luminosa de retratos que resgatam a autoestima e revelam a beleza real, com cores quentes, grão sutil de cinema e zero artificialidade.'
    ],
    timeline: [
      { time: '15:30', title: 'Encontro & Alinhamento de Estilo', desc: 'Conversa inicial no café da serra e escolha das duas combinações de roupas em tons neutros.' },
      { time: '16:10', title: 'Caminhada Fotográfica no Bosques', desc: 'Primeiros cliques sob a sombra filtrada das araucárias para soltar o corpo e o sorriso.' },
      { time: '17:00', title: 'Luz Dourada no Campo Aberto', desc: 'Retratos em contraluz poética aproveitando os últimos raios dourados do sol na montanha.' },
      { time: '17:45', title: 'Retratos Intimistas na Hora Azul', desc: 'Closes expressivos com luz suave e difusa do entardecer.' }
    ],
    highlights: [
      'Consultoria prévia de paleta de cores e figurino via WhatsApp',
      'Direção leve e acolhedora (ideal para quem é tímida diante da câmera)',
      '2 horas de experiência fotográfica em locação externa ou estúdio',
      '30 fotografias tratadas com color grading autoral',
      'Direito de uso pessoal e para posicionamento profissional',
      'Entrega digital em alta resolução e versão otimizada para Instagram'
    ],
    testimonial: {
      quote: 'Eu tinha muita vergonha de fazer ensaio feminino, mas o acolhimento me fez esquecer que havia uma câmera ali. Foi um momento de reencontro com minha autoestima. O resultado ficou deslumbrante!',
      author: 'Helena Prado',
      role: 'Arquiteta • Ensaio Feminino Autoral'
    },
    slides: [
      {
        src: 'assets/images/feminino.jpg',
        moment: 'Foto 01 • Contraluz Dourada no Campo',
        caption: 'Helena em conexão com a natureza serrana durante os minutos mais dourados do entardecer.',
        imgStyle: 'object-position: center center;'
      },
      {
        src: 'assets/images/hero.jpg',
        moment: 'Foto 02 • Olhar & Presença Editorial',
        caption: 'Retrato aproximado destacando a expressão confiante e a suavidade da luz natural.',
        imgStyle: 'object-position: center 20%;'
      },
      {
        src: 'assets/images/feminino.jpg',
        moment: 'Foto 03 • Espontaneidade em Movimento',
        caption: 'Enquadramento fechado capturando a brisa da tarde e a naturalidade sem poses forçadas.',
        imgStyle: 'object-position: 60% 25%; transform: scale(1.14); filter: contrast(1.04);'
      },
      {
        src: 'assets/images/gestante.jpg',
        moment: 'Foto 04 • Texturas & Tons Quentes',
        caption: 'Harmonia cromática entre os tons terrosos do figurino e a paleta suave do ensaio.',
        imgStyle: 'object-position: center 30%; filter: sepia(0.08);'
      },
      {
        src: 'assets/images/feminino.jpg',
        moment: 'Foto 05 • Retrato Autoral em P&B',
        caption: 'Poesia visual em preto e branco ressaltando a força e a delicadeza do retrato.',
        imgStyle: 'object-position: center center; filter: grayscale(100%) contrast(1.12);'
      }
    ]
  }
};

// Sincronização com dados do Painel Administrativo via localStorage
try {
  const savedPortfolio = localStorage.getItem('rhuan_portfolio_items');
  if (savedPortfolio) {
    const parsed = JSON.parse(savedPortfolio);
    Object.assign(PORTFOLIO_ITEMS, parsed);
  }
} catch (e) {
  console.warn('Erro ao carregar portfólio customizado:', e);
}

window.PORTFOLIO_ITEMS = PORTFOLIO_ITEMS;

// =========================================================================
// SISTEMA DE DARK MODE / TEMA DO SITE
// =========================================================================
(function initTheme() {
  try {
    const savedTheme = localStorage.getItem('rhuan_theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (document.body) document.body.classList.add('dark-mode');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (document.body) document.body.classList.remove('dark-mode');
    }
  } catch (e) {}
})();

function setupThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const newTheme = isDark ? 'light' : 'dark';

      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.body.classList.add('dark-mode');
      } else {
        document.documentElement.removeAttribute('data-theme');
        document.body.classList.remove('dark-mode');
      }

      try {
        localStorage.setItem('rhuan_theme', newTheme);
      } catch (e) {}

      if (window.showToast) {
        window.showToast(newTheme === 'dark' ? 'Modo Escuro Luxury ativado 🌙' : 'Modo Claro Feminino ativado ☀️', 2500);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setupThemeToggle();
  // 1. Header scroll effect
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // 2. Mobile Menu
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // 3. Sistema de Toast Notifications
  window.showToast = function (message, duration = 3800) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'globalToast';
      toast.className = 'toast-notification';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>✓</span> <span>${message}</span>`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  };

  // 4. Fechar Modais
  const closeAllModals = () => {
    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.classList.remove('active');
    });
  };

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeAllModals();
      }
    });
  });

  // 5. Filtros do Portfólio de Ensaios
  const filterBtns = document.querySelectorAll('.portfolio-filters .filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.dataset.filter;
      galleryCards.forEach(card => {
        if (filterValue === 'all' || card.dataset.category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 6. Controlador do Modal com Slide / Carrossel de Fotos
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxCategory = document.getElementById('lightboxCategory');
  const lightboxCounter = document.getElementById('lightboxCounter');
  const lightboxMoment = document.getElementById('lightboxMoment');
  const lightboxDots = document.getElementById('lightboxDots');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const lightboxDetailsLink = document.getElementById('lightboxDetailsLink');

  let currentSlideCategory = 'casamento';
  let currentSlideIndex = 0;
  let touchStartX = 0;

  function renderCurrentSlide() {
    const itemData = PORTFOLIO_ITEMS[currentSlideCategory] || PORTFOLIO_ITEMS.casamento;
    const slides = itemData.slides || [];
    if (!slides.length || !lightboxImg) return;

    if (currentSlideIndex < 0) currentSlideIndex = slides.length - 1;
    if (currentSlideIndex >= slides.length) currentSlideIndex = 0;

    const currentSlide = slides[currentSlideIndex];

    // Efeito suave de transição na troca da foto do slide
    lightboxImg.style.opacity = '0.25';
    setTimeout(() => {
      lightboxImg.src = currentSlide.src;
      lightboxImg.alt = `${itemData.title} - ${currentSlide.moment}`;
      lightboxImg.setAttribute('style', `max-height: 62vh; width: 100%; object-fit: cover; transition: opacity 0.28s ease, transform 0.4s ease; ${currentSlide.imgStyle || ''}`);
      lightboxImg.style.opacity = '1';
    }, 90);

    if (lightboxTitle) lightboxTitle.textContent = itemData.title;
    if (lightboxCategory) lightboxCategory.textContent = `${itemData.categoryLabel} • ${itemData.location}`;
    if (lightboxCounter) lightboxCounter.textContent = `Foto ${currentSlideIndex + 1} de ${slides.length}`;
    if (lightboxMoment) lightboxMoment.textContent = currentSlide.moment;
    if (lightboxCaption) lightboxCaption.textContent = currentSlide.caption;
    if (lightboxDetailsLink) {
      lightboxDetailsLink.href = `detalhes-evento.html?id=${itemData.id}`;
    }

    // Atualiza indicadores (dots / miniaturas)
    if (lightboxDots) {
      lightboxDots.innerHTML = '';
      slides.forEach((slide, idx) => {
        const dotBtn = document.createElement('button');
        dotBtn.type = 'button';
        dotBtn.className = `lightbox-dot ${idx === currentSlideIndex ? 'active' : ''}`;
        dotBtn.setAttribute('aria-label', `Ir para foto ${idx + 1}`);
        dotBtn.innerHTML = `<span class="lightbox-dot-num">${idx + 1}</span>`;
        dotBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          currentSlideIndex = idx;
          renderCurrentSlide();
        });
        lightboxDots.appendChild(dotBtn);
      });
    }
  }

  window.openPortfolioSlideModal = function (categoryId, startIndex = 0) {
    currentSlideCategory = PORTFOLIO_ITEMS[categoryId] ? categoryId : 'casamento';
    currentSlideIndex = startIndex;
    renderCurrentSlide();
    if (lightboxModal) {
      lightboxModal.classList.add('active');
    }
  };

  if (lightboxPrev) {
    lightboxPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      currentSlideIndex--;
      renderCurrentSlide();
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener('click', (e) => {
      e.stopPropagation();
      currentSlideIndex++;
      renderCurrentSlide();
    });
  }

  // Suporte a swipe no mobile para o slide do modal
  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      if (e.changedTouches && e.changedTouches.length > 0) {
        touchStartX = e.changedTouches[0].screenX;
      }
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      if (!lightboxModal.classList.contains('active')) return;
      if (e.changedTouches && e.changedTouches.length > 0) {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(diff) > 45) {
          if (diff < 0) {
            currentSlideIndex++;
          } else {
            currentSlideIndex--;
          }
          renderCurrentSlide();
        }
      }
    }, { passive: true });
  }

  // Navegação por teclado (Setas esquerda/direita e ESC)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      return;
    }
    if (lightboxModal && lightboxModal.classList.contains('active')) {
      if (e.key === 'ArrowRight') {
        currentSlideIndex++;
        renderCurrentSlide();
      } else if (e.key === 'ArrowLeft') {
        currentSlideIndex--;
        renderCurrentSlide();
      }
    }
  });

  // Conecta todos os botões "Ver Ensaio" dos cards
  document.querySelectorAll('.btn-ver-ensaio, .gallery-overlay-btn[data-action="slide"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const card = btn.closest('.gallery-card');
      const categoryId = (btn.dataset && btn.dataset.id) || (card && (card.dataset.id || card.dataset.category)) || 'casamento';
      window.openPortfolioSlideModal(categoryId, 0);
    });
  });

  // 7. Renderização Dinâmica da Página de Detalhes do Evento (detalhes-evento.html)
  const eventDetailRoot = document.getElementById('eventDetailsPageRoot');
  if (eventDetailRoot) {
    const params = new URLSearchParams(window.location.search);
    const currentId = params.get('id') && PORTFOLIO_ITEMS[params.get('id')] ? params.get('id') : 'casamento';

    function renderEventDetailsPage(eventId) {
      const data = PORTFOLIO_ITEMS[eventId] || PORTFOLIO_ITEMS.casamento;
      document.title = `${data.title} • Detalhes do Evento • Rhuan Fotografia`;

      // Atualiza pílulas seletoras de evento no topo
      document.querySelectorAll('.event-switcher-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.eventId === data.id);
      });

      const setElText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };

      setElText('detailCategoryTag', data.categoryLabel);
      setElText('detailTitle', data.title);
      setElText('detailSummary', data.summary);
      setElText('detailLocation', data.location);
      setElText('detailDate', data.date);
      setElText('detailDuration', data.duration);
      setElText('detailTeam', data.team);
      setElText('detailDelivery', data.deliveryCount);
      setElText('detailLighting', data.lightingStyle);

      const coverImgEl = document.getElementById('detailCoverImg');
      if (coverImgEl) {
        coverImgEl.src = data.coverImg;
        coverImgEl.alt = data.title;
      }

      // Botões de ação principais do cabeçalho de detalhes
      const openSlideBtn = document.getElementById('detailOpenSlideBtn');
      if (openSlideBtn) {
        openSlideBtn.onclick = () => window.openPortfolioSlideModal(data.id, 0);
      }

      const orcamentoLink = document.getElementById('detailOrcamentoLink');
      if (orcamentoLink) {
        orcamentoLink.href = `orcamentos.html?tipo=${data.orcamentoKey}`;
      }

      // História completa do evento
      const storyContainer = document.getElementById('detailStoryContent');
      if (storyContainer) {
        storyContainer.innerHTML = data.storyParagraphs
          .map(p => `<p class="event-story-paragraph">${p}</p>`)
          .join('');
      }

      // Cronograma / Momentos registrados
      const timelineContainer = document.getElementById('detailTimelineList');
      if (timelineContainer) {
        timelineContainer.innerHTML = data.timeline
          .map(item => `
            <div class="event-timeline-item">
              <div class="event-timeline-time">${item.time}</div>
              <div class="event-timeline-body">
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
              </div>
            </div>
          `)
          .join('');
      }

      // Diferenciais e itens entregues
      const highlightsContainer = document.getElementById('detailHighlightsList');
      if (highlightsContainer) {
        highlightsContainer.innerHTML = data.highlights
          .map(h => `
            <li class="event-highlight-item">
              <span class="pricing-check-icon">✓</span>
              <span>${h}</span>
            </li>
          `)
          .join('');
      }

      // Galeria de Fotos do Evento (clicável para abrir no modal slide)
      const galleryGrid = document.getElementById('detailPhotosGrid');
      if (galleryGrid) {
        galleryGrid.innerHTML = data.slides
          .map((slide, idx) => `
            <figure class="event-photo-card" data-slide-idx="${idx}">
              <div class="event-photo-img-wrap">
                <img src="${slide.src}" alt="${slide.moment}" style="${slide.imgStyle || ''}">
                <div class="event-photo-hover">
                  <span>Ver no Slide (${idx + 1}/${data.slides.length})</span>
                </div>
              </div>
              <figcaption class="event-photo-caption">
                <strong>${slide.moment}</strong>
                <p>${slide.caption}</p>
              </figcaption>
            </figure>
          `)
          .join('');

        galleryGrid.querySelectorAll('.event-photo-card').forEach(card => {
          card.addEventListener('click', () => {
            const idx = parseInt(card.dataset.slideIdx, 10) || 0;
            window.openPortfolioSlideModal(data.id, idx);
          });
        });
      }

      // Depoimento do cliente
      setElText('detailTestimonialQuote', `"${data.testimonial.quote}"`);
      setElText('detailTestimonialAuthor', data.testimonial.author);
      setElText('detailTestimonialRole', data.testimonial.role);
      const avatarEl = document.getElementById('detailTestimonialAvatar');
      if (avatarEl && data.testimonial.author) {
        avatarEl.textContent = data.testimonial.author.charAt(0).toUpperCase();
      }
    }

    renderEventDetailsPage(currentId);

    // Permite alternar entre os eventos sem recarregar a página
    document.querySelectorAll('.event-switcher-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = pill.dataset.eventId;
        if (PORTFOLIO_ITEMS[targetId]) {
          const newUrl = `${window.location.pathname}?id=${targetId}`;
          window.history.pushState({ id: targetId }, '', newUrl);
          renderEventDetailsPage(targetId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // 8. Formulário de Contato / Orçamento (100% JavaScript Puro + localStorage)
  const contactForm = document.getElementById('formContatoOrcamento');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';

      const formData = new FormData(contactForm);
      const payload = {
        id: Date.now(),
        nome: (formData.get('nome') || '').toString().trim(),
        email: (formData.get('email') || '').toString().trim(),
        telefone: (formData.get('telefone') || '').toString().trim(),
        categoria: (formData.get('categoria') || '').toString().trim(),
        data_evento: (formData.get('data_evento') || '').toString().trim(),
        mensagem: (formData.get('mensagem') || '').toString().trim(),
        criado_em: new Date().toISOString()
      };

      if (!payload.nome || !payload.email || !payload.telefone) {
        window.showToast('Por favor, preencha Nome, E-mail e Telefone.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Registrando solicitação...</span>`;
      }

      setTimeout(() => {
        try {
          const historico = JSON.parse(localStorage.getItem('rhuan_orcamentos_enviados') || '[]');
          historico.push(payload);
          localStorage.setItem('rhuan_orcamentos_enviados', JSON.stringify(historico));
        } catch (err) {
          // Ignora se localStorage estiver bloqueado
        }

        if (window.agendaApp && payload.data_evento) {
          window.agendaApp.registerLocalPreBooking(payload.data_evento, payload.nome, payload.categoria);
        }

        window.showToast(`Obrigado, ${payload.nome}! Solicitação registrada com sucesso.`);
        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }, 350);
    });
  }

  // 9. Formulário do Modal de Reserva Direta (100% JavaScript Puro)
  const modalBookingForm = document.getElementById('modalBookingForm');
  if (modalBookingForm) {
    modalBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = modalBookingForm.querySelectorAll('input');
      const nome = inputs[0] ? inputs[0].value.trim() : 'Cliente';
      const whatsapp = inputs[1] ? inputs[1].value.trim() : '';
      const dataPretendida = inputs[2] ? inputs[2].value : '';
      const pacoteTitulo = document.getElementById('modalServiceTitle')?.textContent || 'Pacote';

      try {
        const reservas = JSON.parse(localStorage.getItem('rhuan_pacotes_reservados') || '[]');
        reservas.push({
          id: Date.now(),
          nome,
          whatsapp,
          dataPretendida,
          pacote: pacoteTitulo,
          criado_em: new Date().toISOString()
        });
        localStorage.setItem('rhuan_pacotes_reservados', JSON.stringify(reservas));
      } catch (err) {
        // Ignora erro de armazenamento
      }

      if (window.agendaApp && dataPretendida) {
        window.agendaApp.registerLocalPreBooking(dataPretendida, nome, pacoteTitulo);
      }

      window.showToast(`Pré-reserva de "${pacoteTitulo}" registrada! Entraremos em contato pelo WhatsApp.`);
      closeAllModals();
      modalBookingForm.reset();
    });
  }
});
