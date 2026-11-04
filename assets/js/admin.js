/**
 * RHUAN FOTOGRAFIA - MOTOR JAVASCRIPT DO PAINEL ADMINISTRATIVO (100% JS PURO)
 * Controle de Fotos & Portfólio, Agenda & Pré-reservas, e Modificação de Orçamentos
 * Credenciais: usuario: 'admin', senha: '123'
 */

(function () {
  'use strict';

  // =========================================================================
  // DADOS INICIAIS DE REPO / BACKEND LOCAL
  // =========================================================================

  const DEFAULT_PRICING = {
    basePrices: {
      'ensaio-feminino': { name: 'Ensaio Feminino / Retrato', base: 650, baseHours: 2, photoCount: 25 },
      'ensaio-gestante': { name: 'Ensaio Gestante Fine Art', base: 750, baseHours: 2, photoCount: 30 },
      'festa-15anos': { name: 'Festa de 15 Anos / Debutante', base: 1800, baseHours: 5, photoCount: 150 },
      'casamento': { name: 'Casamento Completo', base: 3200, baseHours: 8, photoCount: 350 },
      'evento-social': { name: 'Evento Social / Aniversário', base: 1200, baseHours: 4, photoCount: 100 }
    },
    hourlyRate: 220,
    addons: {
      'album-fineart': { name: 'Álbum Fine Art Luxo (30x30cm)', price: 780 },
      'segundo-fotografo': { name: 'Segundo Fotógrafo Especialista', price: 600 },
      'ensaio-pre': { name: 'Ensaio Pré-Evento (Externo)', price: 550 },
      'drone': { name: 'Imagens Aéreas com Drone', price: 450 },
      'express': { name: 'Entrega Expressa em 48 Horas', price: 350 }
    }
  };

  const DEFAULT_PORTFOLIO = {
    casamento: {
      id: 'casamento',
      title: 'O Sim de Mariana & Rodrigo',
      categoryLabel: 'Casamento Real',
      location: 'Jardim Imperial • Holambra, SP',
      date: '18 de Outubro de 2026',
      duration: '8 Horas de Cobertura Integral',
      team: '2 Fotógrafos + Assistente de Luz',
      deliveryCount: '420 Fotos Tratadas',
      coverImg: 'assets/images/casamento.jpg',
      summary: 'Celebração rústico-chique ao ar livre envolta por roseiras e a luz dourada do fim de tarde.',
      slides: [
        { src: 'assets/images/casamento.jpg', moment: 'Foto 01 • Ensaio no Pôr do Sol', caption: 'Mariana e Rodrigo nos jardins de Holambra logo após o "Sim".' },
        { src: 'assets/images/hero.jpg', moment: 'Foto 02 • Making-of da Noiva', caption: 'Retrato editorial nos momentos finais da preparação com véu.' },
        { src: 'assets/images/casamento.jpg', moment: 'Foto 03 • Detalhes no Altar', caption: 'Enquadramento aproximado destacando a conexão e o buquê autoral.' },
        { src: 'assets/images/feminino.jpg', moment: 'Foto 04 • Retrato Individual no Campo', caption: 'Breve pausa individual na natureza antes da recepção.' },
        { src: 'assets/images/casamento.jpg', moment: 'Foto 05 • Estética Fine Art P&B', caption: 'Versão monocromática atemporal ressaltando as texturas.' }
      ]
    },
    '15anos': {
      id: '15anos',
      title: 'Noite Inesquecível de Clara',
      categoryLabel: '15 Anos & Debutante',
      location: 'Salão Villa Real • São Paulo, SP',
      date: '24 de Outubro de 2026',
      duration: '6 Horas de Cobertura',
      team: '2 Fotógrafos + Iluminação Criativa',
      deliveryCount: '240 Fotos Tratadas',
      coverImg: 'assets/images/15anos.jpg',
      summary: 'Cenas vibrantes com luzes pontuais, vestido rodado champanhe e valsa emocionante.',
      slides: [
        { src: 'assets/images/15anos.jpg', moment: 'Foto 01 • A Grande Valsa', caption: 'Clara no centro do salão durante o giro principal da valsa.' },
        { src: 'assets/images/hero.jpg', moment: 'Foto 02 • Retrato Editorial Debutante', caption: 'Retrato clássico realizado 30 minutos antes da recepção.' },
        { src: 'assets/images/15anos.jpg', moment: 'Foto 03 • Movimento do Vestido', caption: 'Close artístico no movimento dos tules bordados.' },
        { src: 'assets/images/feminino.jpg', moment: 'Foto 04 • Ensaio Pré-15 Anos', caption: 'Prévia do ensaio externo realizado no mês anterior.' },
        { src: 'assets/images/15anos.jpg', moment: 'Foto 05 • Emoção em Preto & Branco', caption: 'Registro documental eternizando a alegria genuína.' }
      ]
    },
    gestante: {
      id: 'gestante',
      title: 'A Doce Espera por Lívia',
      categoryLabel: 'Maternidade Fine Art',
      location: 'Estúdio Luz & Poesia • SP',
      date: '10 de Outubro de 2026',
      duration: '2h30 de Sessão Confortável',
      team: 'Fotógrafo + Consultora de Styling',
      deliveryCount: '35 Fotos Fine Art',
      coverImg: 'assets/images/gestante.jpg',
      summary: 'Textura suave, tons terrosos, tecidos fluidos de seda e conexão profunda.',
      slides: [
        { src: 'assets/images/gestante.jpg', moment: 'Foto 01 • Poesia em Tons Rose', caption: 'Iluminação lateral suave destacando a silhueta materna.' },
        { src: 'assets/images/gestante.jpg', moment: 'Foto 02 • Conexão & Afeto Materno', caption: 'Enquadramento fechado valorizando o toque delicado das mãos.' },
        { src: 'assets/images/hero.jpg', moment: 'Foto 03 • Retrato Fine Art Iluminado', caption: 'Olhar sereno em direção à luz natural da janela.' },
        { src: 'assets/images/feminino.jpg', moment: 'Foto 04 • Jardim do Estúdio', caption: 'Momentos finais na área arborizada com luz dourada.' },
        { src: 'assets/images/gestante.jpg', moment: 'Foto 05 • Clássico Monocromático', caption: 'Estudo de luz e sombra em preto e branco.' }
      ]
    },
    feminino: {
      id: 'feminino',
      title: 'A Serenidade de Helena',
      categoryLabel: 'Retrato Feminino Autoral',
      location: 'Campos do Jordão, SP',
      date: '04 de Outubro de 2026',
      duration: '2 Horas de Sessão ao Pôr do Sol',
      team: 'Fotógrafo Principal + Direção Afetiva',
      deliveryCount: '30 Fotos Autorais',
      coverImg: 'assets/images/feminino.jpg',
      summary: 'Retrato individual espontâneo valorizando a autenticidade e a essência feminina.',
      slides: [
        { src: 'assets/images/feminino.jpg', moment: 'Foto 01 • Luz Dourada na Serra', caption: 'Helena em meio à natureza no instante mágico do pôr do sol.' },
        { src: 'assets/images/hero.jpg', moment: 'Foto 02 • Retrato Editorial Intimista', caption: 'Enquadramento próximo com luz natural suave de janela.' },
        { src: 'assets/images/feminino.jpg', moment: 'Foto 03 • Expressão & Liberdade', caption: 'Gesto espontâneo capturado durante uma caminhada despretensiosa.' },
        { src: 'assets/images/gestante.jpg', moment: 'Foto 04 • Texturas & Tons Quentes', caption: 'Harmonia cromática entre os tons terrosos e a paleta suave.' },
        { src: 'assets/images/feminino.jpg', moment: 'Foto 05 • Retrato Autoral em P&B', caption: 'Poesia visual em preto e branco ressaltando a força feminina.' }
      ]
    }
  };

  const DEFAULT_AGENDA = {
    '2026-10-18': { status: 'booked', title: 'Casamento Mariana & Rodrigo', categoria: 'Casamento', slots: [{ time: '16:00 - 02:00', desc: 'Cerimônia & Recepção (Reservado)' }] },
    '2026-10-24': { status: 'booked', title: 'Festa de 15 Anos - Clara', categoria: 'Festa 15 Anos', slots: [{ time: '19:00 - 03:00', desc: 'Festa de Gala (Reservado)' }] },
    '2026-10-25': { status: 'limited', title: 'Ensaios Externos', categoria: 'Ensaio', slots: [{ time: '08:30 - 10:30', desc: 'Ensaio Gestante - Lívia' }, { time: '16:00 - 18:00', desc: 'Golden Hour (Disponível!)' }] },
    '2026-10-31': { status: 'booked', title: 'Casamento Beatriz & Guilherme', categoria: 'Casamento', slots: [{ time: '15:30 - 01:00', desc: 'Evento Completo' }] },
    '2026-11-07': { status: 'booked', title: 'Festa de 15 Anos - Larissa', categoria: 'Festa 15 Anos', slots: [{ time: '19:30 - 03:30', desc: 'Espaço Villa Real' }] },
    '2026-11-14': { status: 'limited', title: 'Ensaios em Estúdio', categoria: 'Ensaio', slots: [{ time: '10:00 - 12:00', desc: 'Ensaio Feminino (Disponível!)' }] },
    '2026-11-21': { status: 'booked', title: 'Casamento Fernanda & Thiago', categoria: 'Casamento', slots: [{ time: '16:30 - 02:00', desc: 'Cerimônia ao Ar Livre' }] },
    '2026-11-28': { status: 'available', title: 'Data Aberta para Evento', categoria: 'Livre', slots: [{ time: 'Dia Todo', desc: 'Disponível para Casamento ou 15 Anos' }] },
    '2026-12-05': { status: 'booked', title: 'Casamento Camila & André', categoria: 'Casamento', slots: [{ time: '17:00 - 02:30', desc: 'Casamento Clássico' }] }
  };

  // =========================================================================
  // CLASSE PRINCIPAL DO ADMIN CONTROLLER
  // =========================================================================

  class AdminStudioController {
    constructor() {
      this.portfolio = {};
      this.agenda = {};
      this.pricing = {};
      this.leads = [];
      this.activeSeriesId = 'casamento';
      this.selectedCalendarDate = '2026-10-25';
      this.currentCalendarDate = new Date(2026, 9, 1); // Outubro 2026
      this.monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      
      this.init();
    }

    init() {
      this.loadStorage();
      this.checkAuth();
      this.bindThemeToggle();
      this.bindAuthEvents();
      this.bindNavigation();
      this.bindPhotosModule();
      this.bindAgendaModule();
      this.bindPricingModule();
      this.bindLeadsModule();
      this.renderAll();
    }

    // ---------- STORAGE LOCAL ----------
    loadStorage() {
      // 1. Portfólio
      try {
        const savedPort = localStorage.getItem('rhuan_portfolio_items');
        this.portfolio = savedPort ? JSON.parse(savedPort) : JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO));
      } catch (e) {
        this.portfolio = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO));
      }

      // 2. Agenda
      try {
        const savedAgenda = localStorage.getItem('rhuan_agenda_reservas');
        this.agenda = savedAgenda ? JSON.parse(savedAgenda) : JSON.parse(JSON.stringify(DEFAULT_AGENDA));
      } catch (e) {
        this.agenda = JSON.parse(JSON.stringify(DEFAULT_AGENDA));
      }

      // 3. Preços
      try {
        const savedPricing = localStorage.getItem('rhuan_precos_orcamento');
        this.pricing = savedPricing ? JSON.parse(savedPricing) : JSON.parse(JSON.stringify(DEFAULT_PRICING));
      } catch (e) {
        this.pricing = JSON.parse(JSON.stringify(DEFAULT_PRICING));
      }

      // 4. Leads / Solicitações do site
      try {
        const orcamentos = JSON.parse(localStorage.getItem('rhuan_orcamentos_enviados') || '[]');
        const pacotes = JSON.parse(localStorage.getItem('rhuan_pacotes_reservados') || '[]');
        
        // Se ainda não houver leads do site, gera exemplos elegantes
        if (orcamentos.length === 0 && pacotes.length === 0) {
          this.leads = [
            {
              id: 1729940100000,
              nome: 'Mariana Vasconcelos',
              email: 'mariana.vasc@gmail.com',
              telefone: '(11) 98765-4321',
              categoria: 'Casamento Completo',
              data_evento: '2026-11-21',
              mensagem: 'Gostaria de saber se a data de 21/11 está disponível para cerimônia em Holambra.',
              status: 'new',
              tipo: 'orcamento',
              criado_em: '2026-10-24T14:30:00.000Z'
            },
            {
              id: 1729940200000,
              nome: 'Patrícia Guimarães',
              email: 'patricia.gui@hotmail.com',
              telefone: '(11) 99123-8877',
              categoria: 'Festa 15 Anos',
              data_evento: '2026-12-12',
              mensagem: 'Orçamento para festa de debutante com álbum e drone.',
              status: 'contacted',
              tipo: 'reserva',
              criado_em: '2026-10-25T10:15:00.000Z'
            },
            {
              id: 1729940300000,
              nome: 'Carolina & Felipe',
              email: 'carol.felipe@gmail.com',
              telefone: '(11) 97766-5544',
              categoria: 'Ensaio Gestante',
              data_evento: '2026-11-14',
              mensagem: 'Queremos realizar as fotos de 32 semanas no estúdio.',
              status: 'closed',
              tipo: 'orcamento',
              criado_em: '2026-10-25T16:45:00.000Z'
            }
          ];
          localStorage.setItem('rhuan_orcamentos_enviados', JSON.stringify(this.leads));
        } else {
          // Unifica os dados
          const combined = [
            ...orcamentos.map(item => ({ ...item, tipo: item.tipo || 'orcamento', status: item.status || 'new' })),
            ...pacotes.map(item => ({
              id: item.id || Date.now(),
              nome: item.nome,
              telefone: item.whatsapp,
              categoria: item.pacote,
              data_evento: item.dataPretendida,
              mensagem: `Pré-reserva rápida do pacote: ${item.pacote}`,
              status: item.status || 'new',
              tipo: 'reserva',
              criado_em: item.criado_em
            }))
          ];
          this.leads = combined.sort((a, b) => (new Date(b.criado_em || 0)) - (new Date(a.criado_em || 0)));
        }
      } catch (e) {
        this.leads = [];
      }
    }

    savePortfolio() {
      localStorage.setItem('rhuan_portfolio_items', JSON.stringify(this.portfolio));
      this.showToast('Galeria de fotos sincronizada com o site público!', 'success');
    }

    saveAgenda() {
      localStorage.setItem('rhuan_agenda_reservas', JSON.stringify(this.agenda));
      this.showToast('Agenda de eventos atualizada com sucesso!', 'success');
    }

    savePricing() {
      localStorage.setItem('rhuan_precos_orcamento', JSON.stringify(this.pricing));
      this.showToast('Tabela de orçamentos atualizada no site!', 'success');
    }

    saveLeads() {
      localStorage.setItem('rhuan_orcamentos_enviados', JSON.stringify(this.leads));
    }

    // ---------- AUTENTICAÇÃO ----------
    checkAuth() {
      const isAuth = sessionStorage.getItem('rhuan_admin_auth') === 'true' || localStorage.getItem('rhuan_admin_auth') === 'true';
      const authGateway = document.getElementById('adminAuthGateway');
      const adminLayout = document.getElementById('adminAppLayout');

      if (isAuth) {
        if (authGateway) authGateway.style.display = 'none';
        if (adminLayout) adminLayout.style.display = 'flex';
      } else {
        if (authGateway) authGateway.style.display = 'flex';
        if (adminLayout) adminLayout.style.display = 'none';
      }
    }

    bindAuthEvents() {
      const loginForm = document.getElementById('adminLoginForm');
      const errorMsg = document.getElementById('loginErrorMessage');
      const togglePwdBtn = document.getElementById('togglePasswordVisibility');
      const pwdInput = document.getElementById('loginPassword');
      const logoutBtn = document.getElementById('sidebarLogoutBtn');

      if (togglePwdBtn && pwdInput) {
        togglePwdBtn.addEventListener('click', () => {
          const isPwd = pwdInput.type === 'password';
          pwdInput.type = isPwd ? 'text' : 'password';
          togglePwdBtn.innerHTML = isPwd 
            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
        });
      }

      if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const user = document.getElementById('loginUsername').value.trim();
          const pass = document.getElementById('loginPassword').value.trim();
          const remember = document.getElementById('loginRemember').checked;

          if (user === 'admin' && pass === '123') {
            if (errorMsg) errorMsg.style.display = 'none';
            if (remember) {
              localStorage.setItem('rhuan_admin_auth', 'true');
            } else {
              sessionStorage.setItem('rhuan_admin_auth', 'true');
            }
            this.showToast('Login realizado com sucesso! Bem-vindo, Rhuan.', 'success');
            this.checkAuth();
            this.renderAll();
          } else {
            if (errorMsg) {
              errorMsg.style.display = 'flex';
              errorMsg.innerHTML = '<span>⚠️ Usuário ou senha inválidos. Tente: <b>admin</b> / <b>123</b></span>';
            }
          }
        });
      }

      if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
          if (confirm('Deseja realmente sair do painel administrativo?')) {
            sessionStorage.removeItem('rhuan_admin_auth');
            localStorage.removeItem('rhuan_admin_auth');
            this.checkAuth();
            this.showToast('Sessão encerrada com segurança.');
          }
        });
      }
    }

    // ---------- ALTERNÂNCIA DE TEMA (DARK / LIGHT MODE) ----------
    bindThemeToggle() {
      const themeBtn = document.getElementById('adminThemeToggleBtn');
      if (!themeBtn) return;

      themeBtn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const nextTheme = isDark ? 'light' : 'dark';

        if (nextTheme === 'dark') {
          document.documentElement.setAttribute('data-theme', 'dark');
          localStorage.setItem('rhuan_admin_theme', 'dark');
          this.showToast('Modo Escuro (Studio Dark) ativado.', 'info');
        } else {
          document.documentElement.removeAttribute('data-theme');
          localStorage.setItem('rhuan_admin_theme', 'light');
          this.showToast('Modo Claro (Atelier) ativado.', 'info');
        }
      });
    }

    // ---------- NAVEGAÇÃO ENTRE TABS ----------
    bindNavigation() {
      const navLinks = document.querySelectorAll('.sidebar-link[data-tab]');
      const tabPanes = document.querySelectorAll('.admin-tab-pane');
      const mobileToggle = document.getElementById('mobileSidebarToggle');
      const sidebar = document.getElementById('adminSidebar');

      if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
          sidebar.classList.toggle('open');
        });

        // Fechar ao clicar fora no mobile
        document.addEventListener('click', (e) => {
          if (window.innerWidth <= 860 && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
              sidebar.classList.remove('open');
            }
          }
        });
      }

      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          const targetTab = link.dataset.tab;
          navLinks.forEach(l => l.classList.remove('active'));
          tabPanes.forEach(p => p.classList.remove('active'));

          link.classList.add('active');
          const targetPane = document.getElementById(targetTab);
          if (targetPane) targetPane.classList.add('active');

          const breadcrumbCurrent = document.getElementById('breadcrumbCurrent');
          if (breadcrumbCurrent) {
            const label = link.querySelector('.sidebar-link-title')?.textContent || 'Painel';
            breadcrumbCurrent.textContent = label;
          }

          if (sidebar && window.innerWidth <= 860) {
            sidebar.classList.remove('open');
          }

          window.scrollTo({ top: 0, behavior: 'smooth' });
        });
      });
    }

    // ---------- TAB 2: CADASTRAMENTO DE FOTOS & PORTFÓLIO ----------
    bindPhotosModule() {
      // 1. Upload e Drop de fotos
      const dropZone = document.getElementById('photoDropZone');
      const fileInput = document.getElementById('photoFileInput');
      const previewImg = document.getElementById('photoPreviewImg');
      const previewSlot = document.getElementById('photoPreviewSlot');
      const urlInput = document.getElementById('photoUrlInput');
      const momentInput = document.getElementById('photoMomentInput');
      const captionInput = document.getElementById('photoCaptionInput');
      const addPhotoBtn = document.getElementById('btnAddPhotoToSeries');

      let currentPhotoDataUrl = '';

      const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) {
          this.showToast('Por favor selecione um arquivo de imagem válido (JPG, PNG, WEBP).', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          currentPhotoDataUrl = e.target.result;
          if (previewImg) {
            previewImg.src = currentPhotoDataUrl;
            previewImg.style.display = 'block';
          }
          if (previewSlot) {
            previewSlot.querySelector('.photo-drop-hint')?.remove();
          }
          if (urlInput) urlInput.value = ''; // Limpa se foi arquivo
        };
        reader.readAsDataURL(file);
      };

      if (dropZone && fileInput) {
        dropZone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        });

        const uploadCard = document.getElementById('photoUploadCardBox');
        if (uploadCard) {
          ['dragenter', 'dragover'].forEach(name => {
            uploadCard.addEventListener(name, (e) => {
              e.preventDefault();
              uploadCard.classList.add('dragover');
            });
          });
          ['dragleave', 'drop'].forEach(name => {
            uploadCard.addEventListener(name, (e) => {
              e.preventDefault();
              uploadCard.classList.remove('dragover');
            });
          });
          uploadCard.addEventListener('drop', (e) => {
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFile(e.dataTransfer.files[0]);
            }
          });
        }
      }

      if (urlInput) {
        urlInput.addEventListener('input', (e) => {
          const val = e.target.value.trim();
          if (val) {
            currentPhotoDataUrl = val;
            if (previewImg) {
              previewImg.src = val;
              previewImg.style.display = 'block';
            }
          }
        });
      }

      // Adicionar a foto à série ativa
      if (addPhotoBtn) {
        addPhotoBtn.addEventListener('click', () => {
          const src = currentPhotoDataUrl || (urlInput ? urlInput.value.trim() : '');
          const moment = (momentInput ? momentInput.value.trim() : '') || 'Foto da Série';
          const caption = (captionInput ? captionInput.value.trim() : '') || 'Fotografia autoral de momentos espontâneos.';

          if (!src) {
            this.showToast('Selecione uma imagem ou informe a URL/caminho da foto.', 'error');
            return;
          }

          const currentSeries = this.portfolio[this.activeSeriesId];
          if (!currentSeries) return;

          currentSeries.slides = currentSeries.slides || [];
          currentSeries.slides.push({
            src: src,
            moment: moment,
            caption: caption
          });

          this.savePortfolio();
          this.renderPhotosModule();
          this.renderOverviewMetrics();

          // Limpa formulário
          if (previewImg) {
            previewImg.src = '';
            previewImg.style.display = 'none';
          }
          if (fileInput) fileInput.value = '';
          if (urlInput) urlInput.value = '';
          if (momentInput) momentInput.value = '';
          if (captionInput) captionInput.value = '';
          currentPhotoDataUrl = '';

          this.showToast(`Nova foto cadastrada com sucesso em "${currentSeries.title}"!`, 'success');
        });
      }

      // Modal de Criar Nova Série
      const btnOpenNewSeriesModal = document.getElementById('btnOpenNewSeriesModal');
      const newSeriesModal = document.getElementById('newSeriesModal');
      const newSeriesForm = document.getElementById('newSeriesForm');

      if (btnOpenNewSeriesModal && newSeriesModal) {
        btnOpenNewSeriesModal.addEventListener('click', () => {
          newSeriesModal.classList.add('active');
        });
      }

      if (newSeriesForm) {
        newSeriesForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const title = document.getElementById('newSeriesTitle').value.trim();
          const category = document.getElementById('newSeriesCategory').value.trim();
          const location = document.getElementById('newSeriesLocation').value.trim();
          const coverImg = document.getElementById('newSeriesCover').value.trim() || 'assets/images/hero.jpg';
          const summary = document.getElementById('newSeriesSummary').value.trim();

          const id = 'serie-' + Date.now();
          this.portfolio[id] = {
            id: id,
            title: title,
            categoryLabel: category,
            location: location,
            date: 'Data a Definir',
            duration: '4 Horas',
            team: '1 Fotógrafo',
            deliveryCount: '50 Fotos',
            coverImg: coverImg,
            summary: summary,
            slides: [
              {
                src: coverImg,
                moment: 'Foto 01 • Foto de Abertura',
                caption: summary || 'Ensaio fotográfico autoral.'
              }
            ]
          };

          this.savePortfolio();
          this.activeSeriesId = id;
          if (newSeriesModal) newSeriesModal.classList.remove('active');
          newSeriesForm.reset();
          this.renderPhotosModule();
          this.renderOverviewMetrics();
          this.showToast(`Série "${title}" criada com sucesso!`, 'success');
        });
      }

      // Botão Restaurar Portfólio Padrão
      const btnResetPortfolio = document.getElementById('btnResetPortfolio');
      if (btnResetPortfolio) {
        btnResetPortfolio.addEventListener('click', () => {
          if (confirm('Deseja restaurar as séries e fotos originais do portfólio?')) {
            this.portfolio = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO));
            this.savePortfolio();
            this.activeSeriesId = 'casamento';
            this.renderPhotosModule();
            this.renderOverviewMetrics();
            this.showToast('Portfólio restaurado para o padrão original.', 'info');
          }
        });
      }
    }

    renderPhotosModule() {
      // 1. Renderiza lista de séries na coluna lateral
      const seriesListContainer = document.getElementById('adminSeriesList');
      if (seriesListContainer) {
        seriesListContainer.innerHTML = Object.entries(this.portfolio)
          .map(([id, item]) => `
            <button type="button" class="series-item-btn ${id === this.activeSeriesId ? 'active' : ''}" data-series-id="${id}">
              <img src="${item.coverImg || 'assets/images/hero.jpg'}" alt="${item.title}" class="series-thumb">
              <div class="series-meta">
                <h4>${item.title}</h4>
                <span>${item.categoryLabel} • ${(item.slides || []).length} fotos</span>
              </div>
            </button>
          `).join('');

        seriesListContainer.querySelectorAll('.series-item-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            this.activeSeriesId = btn.dataset.seriesId;
            this.renderPhotosModule();
          });
        });
      }

      // 2. Renderiza dados da série ativa
      const current = this.portfolio[this.activeSeriesId];
      if (!current) return;

      const seriesTitleEl = document.getElementById('activeSeriesTitle');
      const seriesBadgeEl = document.getElementById('activeSeriesCategoryBadge');
      const seriesCountEl = document.getElementById('activeSeriesPhotoCount');
      if (seriesTitleEl) seriesTitleEl.textContent = current.title;
      if (seriesBadgeEl) seriesBadgeEl.textContent = current.categoryLabel;
      if (seriesCountEl) seriesCountEl.textContent = `${(current.slides || []).length} fotos na série`;

      // 3. Renderiza grid de fotos
      const photosGrid = document.getElementById('activeSeriesPhotosGrid');
      if (photosGrid) {
        const slides = current.slides || [];
        if (slides.length === 0) {
          photosGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; background: var(--admin-bg-alt); border-radius: var(--admin-radius-md); color: var(--admin-text-muted);">
              <p>Nenhuma foto cadastrada nesta série ainda.</p>
              <span style="font-size: 0.85rem;">Use a área acima para adicionar sua primeira foto!</span>
            </div>
          `;
          return;
        }

        photosGrid.innerHTML = slides.map((slide, idx) => {
          const isCover = current.coverImg === slide.src;
          return `
            <div class="photo-card-item">
              <div class="photo-card-thumb-wrap">
                <img src="${slide.src}" alt="${slide.moment}" class="photo-card-thumb">
                ${isCover ? '<span class="cover-badge-tag">⭐ Capa Principal</span>' : ''}
              </div>
              <div class="photo-card-body">
                <div>
                  <h5 class="photo-card-moment">${slide.moment || `Foto ${idx + 1}`}</h5>
                  <p class="photo-card-caption">${slide.caption || 'Sem legenda'}</p>
                </div>
                <div class="photo-card-actions">
                  <button type="button" class="photo-action-btn btn-set-cover" data-idx="${idx}" title="Definir esta foto como capa da série">
                    ${isCover ? '✓ É Capa' : '⭐ Tornar Capa'}
                  </button>
                  <button type="button" class="photo-action-btn delete btn-delete-photo" data-idx="${idx}" title="Excluir foto">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('');

        // Eventos dos botões de ação de cada foto
        photosGrid.querySelectorAll('.btn-set-cover').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx, 10);
            current.coverImg = current.slides[idx].src;
            this.savePortfolio();
            this.renderPhotosModule();
            this.showToast('Foto definida como capa principal da série!', 'success');
          });
        });

        photosGrid.querySelectorAll('.btn-delete-photo').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx, 10);
            if (confirm('Tem certeza que deseja remover esta foto?')) {
              current.slides.splice(idx, 1);
              this.savePortfolio();
              this.renderPhotosModule();
              this.renderOverviewMetrics();
              this.showToast('Foto excluída com sucesso.', 'info');
            }
          });
        });
      }
    }

    // ---------- TAB 3: GESTÃO DE AGENDA ----------
    bindAgendaModule() {
      const prevMonthBtn = document.getElementById('adminPrevMonthBtn');
      const nextMonthBtn = document.getElementById('adminNextMonthBtn');
      const currentMonthTitle = document.getElementById('adminCalendarMonthTitle');

      if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
          this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() - 1);
          this.renderAgendaCalendar();
        });
      }

      if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
          this.currentCalendarDate.setMonth(this.currentCalendarDate.getMonth() + 1);
          this.renderAgendaCalendar();
        });
      }

      // Painel lateral de status do dia
      const statusBtns = document.querySelectorAll('.day-status-btn');
      statusBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetStatus = btn.dataset.status;
          const dateStr = this.selectedCalendarDate;
          if (!this.agenda[dateStr]) {
            this.agenda[dateStr] = {
              status: targetStatus,
              title: targetStatus === 'booked' ? 'Evento Agendado' : 'Data Aberta',
              categoria: 'Evento',
              slots: []
            };
          } else {
            this.agenda[dateStr].status = targetStatus;
          }
          this.saveAgenda();
          this.renderAgendaCalendar();
          this.renderDayDetails(dateStr);
          this.renderOverviewMetrics();
        });
      });

      // Adicionar novo slot de horário no dia
      const addSlotBtn = document.getElementById('btnAddSlotToDay');
      const slotTimeInput = document.getElementById('slotTimeInput');
      const slotDescInput = document.getElementById('slotDescInput');

      if (addSlotBtn) {
        addSlotBtn.addEventListener('click', () => {
          const time = slotTimeInput ? slotTimeInput.value.trim() : '';
          const desc = slotDescInput ? slotDescInput.value.trim() : '';
          if (!desc) {
            this.showToast('Informe a descrição do compromisso (ex: Casamento Clara).', 'error');
            return;
          }

          const dateStr = this.selectedCalendarDate;
          if (!this.agenda[dateStr]) {
            this.agenda[dateStr] = {
              status: 'booked',
              title: desc,
              categoria: 'Evento',
              slots: []
            };
          }

          this.agenda[dateStr].slots = this.agenda[dateStr].slots || [];
          this.agenda[dateStr].slots.push({
            time: time || 'Horário a definir',
            desc: desc
          });

          this.saveAgenda();
          this.renderAgendaCalendar();
          this.renderDayDetails(dateStr);
          if (slotTimeInput) slotTimeInput.value = '';
          if (slotDescInput) slotDescInput.value = '';
          this.showToast('Horário agendado com sucesso!', 'success');
        });
      }
    }

    renderAgendaCalendar() {
      const year = this.currentCalendarDate.getFullYear();
      const month = this.currentCalendarDate.getMonth();

      const titleEl = document.getElementById('adminCalendarMonthTitle');
      if (titleEl) {
        titleEl.textContent = `${this.monthNames[month]} de ${year}`;
      }

      const daysGrid = document.getElementById('adminCalendarDaysGrid');
      if (!daysGrid) return;

      daysGrid.innerHTML = '';

      const firstDayIndex = new Date(year, month, 1).getDay();
      const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
      const prevMonthLastDay = new Date(year, month, 0).getDate();

      // Dias do mês anterior
      for (let i = firstDayIndex; i > 0; i--) {
        const cell = document.createElement('div');
        cell.className = 'calendar-day-cell inactive';
        cell.innerHTML = `<span class="calendar-day-num">${prevMonthLastDay - i + 1}</span>`;
        daysGrid.appendChild(cell);
      }

      // Dias do mês atual
      for (let day = 1; day <= totalDaysInMonth; day++) {
        const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayData = this.agenda[dStr];

        const cell = document.createElement('div');
        cell.className = `calendar-day-cell ${dStr === this.selectedCalendarDate ? 'selected' : ''}`;
        cell.dataset.date = dStr;

        let indicatorHtml = '';
        if (dayData) {
          const statusLabels = {
            booked: 'Reservado',
            limited: 'Poucas Vagas',
            available: 'Livre'
          };
          indicatorHtml = `<span class="calendar-day-indicator ${dayData.status}">${statusLabels[dayData.status] || dayData.status}</span>`;
        }

        cell.innerHTML = `
          <span class="calendar-day-num">${day}</span>
          ${indicatorHtml}
        `;

        cell.addEventListener('click', () => {
          document.querySelectorAll('.calendar-day-cell').forEach(c => c.classList.remove('selected'));
          cell.classList.add('selected');
          this.selectedCalendarDate = dStr;
          this.renderDayDetails(dStr);
        });

        daysGrid.appendChild(cell);
      }

      this.renderDayDetails(this.selectedCalendarDate);
    }

    renderDayDetails(dateStr) {
      const dateTitle = document.getElementById('dayDetailsDateTitle');
      if (dateTitle) {
        const parts = dateStr.split('-');
        dateTitle.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`;
      }

      const dayData = this.agenda[dateStr];
      const statusBtns = document.querySelectorAll('.day-status-btn');
      statusBtns.forEach(btn => {
        btn.classList.remove('active');
        if (dayData && btn.dataset.status === dayData.status) {
          btn.classList.add('active');
        }
      });

      const slotsList = document.getElementById('dayDetailsSlotsList');
      if (slotsList) {
        if (!dayData || !dayData.slots || dayData.slots.length === 0) {
          slotsList.innerHTML = `
            <div style="font-size: 0.8rem; color: var(--admin-text-muted); text-align: center; padding: 1rem; background: var(--admin-bg-alt); border-radius: 6px;">
              Nenhum evento registrado nesta data.
            </div>
          `;
          return;
        }

        slotsList.innerHTML = dayData.slots.map((slot, idx) => `
          <div class="slot-item-card">
            <div class="slot-item-info">
              <h5>${slot.desc}</h5>
              <p>${slot.time}</p>
            </div>
            <button type="button" class="slot-item-delete" data-idx="${idx}" title="Remover este horário">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        `).join('');

        slotsList.querySelectorAll('.slot-item-delete').forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.idx, 10);
            dayData.slots.splice(idx, 1);
            if (dayData.slots.length === 0 && dayData.status === 'booked') {
              dayData.status = 'available';
            }
            this.saveAgenda();
            this.renderAgendaCalendar();
            this.renderDayDetails(dateStr);
            this.showToast('Horário removido.', 'info');
          });
        });
      }
    }

    // ---------- TAB 4: MODIFICAR ORÇAMENTOS ----------
    bindPricingModule() {
      const saveBtn = document.getElementById('btnSavePricing');
      const resetBtn = document.getElementById('btnResetPricing');
      const hourlyInput = document.getElementById('pricingHourlyRateInput');

      if (saveBtn) {
        saveBtn.addEventListener('click', () => {
          // Atualiza base prices
          Object.keys(this.pricing.basePrices).forEach(key => {
            const priceInput = document.getElementById(`price_base_${key}`);
            const hoursInput = document.getElementById(`hours_base_${key}`);
            const photosInput = document.getElementById(`photos_base_${key}`);

            if (priceInput && this.pricing.basePrices[key]) {
              this.pricing.basePrices[key].base = parseFloat(priceInput.value) || 0;
            }
            if (hoursInput && this.pricing.basePrices[key]) {
              this.pricing.basePrices[key].baseHours = parseInt(hoursInput.value, 10) || 2;
            }
            if (photosInput && this.pricing.basePrices[key]) {
              this.pricing.basePrices[key].photoCount = parseInt(photosInput.value, 10) || 30;
            }
          });

          // Atualiza hora adicional
          if (hourlyInput) {
            this.pricing.hourlyRate = parseFloat(hourlyInput.value) || 220;
          }

          // Atualiza addons
          Object.keys(this.pricing.addons).forEach(key => {
            const addonPriceInput = document.getElementById(`addon_price_${key}`);
            if (addonPriceInput && this.pricing.addons[key]) {
              this.pricing.addons[key].price = parseFloat(addonPriceInput.value) || 0;
            }
          });

          this.savePricing();
          this.renderSimulator();
          this.renderOverviewMetrics();
        });
      }

      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (confirm('Deseja restaurar a tabela de preços padrão de fábrica?')) {
            this.pricing = JSON.parse(JSON.stringify(DEFAULT_PRICING));
            this.savePricing();
            this.renderPricingModule();
            this.renderSimulator();
            this.showToast('Tabela de preços restaurada.', 'info');
          }
        });
      }

      // Simulador inputs
      const simType = document.getElementById('simTypeSelect');
      const simHours = document.getElementById('simHoursRange');
      const simHoursVal = document.getElementById('simHoursValue');

      if (simType) {
        simType.addEventListener('change', () => this.renderSimulator());
      }
      if (simHours && simHoursVal) {
        simHours.addEventListener('input', (e) => {
          simHoursVal.textContent = `${e.target.value}h`;
          this.renderSimulator();
        });
      }
    }

    renderPricingModule() {
      // 1. Tabela de Preços Base
      const container = document.getElementById('pricingBaseList');
      if (container) {
        container.innerHTML = Object.entries(this.pricing.basePrices).map(([key, item]) => `
          <div class="pricing-row-item">
            <div>
              <strong style="color: var(--admin-text-main); font-size: 0.95rem;">${item.name}</strong>
              <div style="font-size: 0.78rem; color: var(--admin-text-muted);">Slug do Pacote: <code>${key}</code></div>
            </div>
            <div>
              <label class="admin-label" style="font-size: 0.7rem;">Valor Base (R$)</label>
              <input type="number" id="price_base_${key}" value="${item.base}" class="pricing-input" step="50">
            </div>
            <div>
              <label class="admin-label" style="font-size: 0.7rem;">Horas Inc.</label>
              <input type="number" id="hours_base_${key}" value="${item.baseHours}" class="pricing-input" min="1" max="14">
            </div>
            <div>
              <label class="admin-label" style="font-size: 0.7rem;">Fotos Entr.</label>
              <input type="number" id="photos_base_${key}" value="${item.photoCount}" class="pricing-input" step="5">
            </div>
          </div>
        `).join('');
      }

      // 2. Hora Adicional
      const hourlyInput = document.getElementById('pricingHourlyRateInput');
      if (hourlyInput) {
        hourlyInput.value = this.pricing.hourlyRate || 220;
      }

      // 3. Opcionais / Addons
      const addonsContainer = document.getElementById('pricingAddonsList');
      if (addonsContainer) {
        addonsContainer.innerHTML = Object.entries(this.pricing.addons).map(([key, item]) => `
          <div class="addon-row-item">
            <div>
              <strong style="color: var(--admin-text-main); font-size: 0.9rem;">${item.name}</strong>
            </div>
            <div>
              <input type="number" id="addon_price_${key}" value="${item.price}" class="pricing-input" step="50">
            </div>
            <div style="text-align: right; font-size: 0.8rem; color: var(--admin-rose-dark); font-weight: 700;">
              R$
            </div>
          </div>
        `).join('');
      }

      // 4. Preenche Select do Simulador
      const simType = document.getElementById('simTypeSelect');
      if (simType) {
        simType.innerHTML = Object.entries(this.pricing.basePrices).map(([key, item]) => `
          <option value="${key}">${item.name}</option>
        `).join('');
      }

      this.renderSimulator();
    }

    renderSimulator() {
      const simTypeEl = document.getElementById('simTypeSelect');
      const simHoursEl = document.getElementById('simHoursRange');
      const simReceipt = document.getElementById('simReceiptContainer');
      const simTotalEl = document.getElementById('simTotalDisplay');

      if (!simTypeEl || !simHoursEl || !simReceipt || !simTotalEl) return;

      const typeKey = simTypeEl.value || 'casamento';
      const hours = parseInt(simHoursEl.value, 10) || 8;
      const typeData = this.pricing.basePrices[typeKey] || { name: 'Serviço', base: 1000, baseHours: 2 };
      const hourlyRate = this.pricing.hourlyRate || 220;

      let total = typeData.base;
      let rowsHtml = `
        <div class="receipt-row">
          <span>${typeData.name} (${typeData.baseHours}h base)</span>
          <span>R$ ${typeData.base.toLocaleString('pt-BR')}</span>
        </div>
      `;

      const extraHours = Math.max(0, hours - typeData.baseHours);
      if (extraHours > 0) {
        const extraCost = extraHours * hourlyRate;
        total += extraCost;
        rowsHtml += `
          <div class="receipt-row">
            <span>+ ${extraHours}h adicionais (R$ ${hourlyRate}/h)</span>
            <span>R$ ${extraCost.toLocaleString('pt-BR')}</span>
          </div>
        `;
      }

      rowsHtml += `
        <div class="receipt-row">
          <span>Álbum Fine Art (Opcional teste)</span>
          <span>+ R$ ${(this.pricing.addons['album-fineart']?.price || 780).toLocaleString('pt-BR')}</span>
        </div>
      `;
      total += (this.pricing.addons['album-fineart']?.price || 780);

      simReceipt.innerHTML = rowsHtml;
      simTotalEl.textContent = `R$ ${total.toLocaleString('pt-BR')}`;
    }

    // ---------- TAB 5: LEADS E SOLICITAÇÕES ----------
    bindLeadsModule() {
      const filterSelect = document.getElementById('leadsStatusFilter');
      if (filterSelect) {
        filterSelect.addEventListener('change', () => {
          this.renderLeadsTable(filterSelect.value);
        });
      }
    }

    renderLeadsTable(filter = 'all') {
      const tbody = document.getElementById('leadsTableBody');
      if (!tbody) return;

      let filtered = this.leads;
      if (filter !== 'all') {
        filtered = this.leads.filter(lead => lead.status === filter);
      }

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; padding: 2rem; color: var(--admin-text-muted);">
              Nenhuma solicitação encontrada para o filtro selecionado.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map((lead, idx) => {
        const statusMap = {
          new: '<span class="status-badge new">● Novo</span>',
          contacted: '<span class="status-badge contacted">● Contatado</span>',
          closed: '<span class="status-badge closed">✓ Fechado</span>'
        };

        const dateStr = lead.criado_em ? new Date(lead.criado_em).toLocaleDateString('pt-BR') : 'Hoje';
        const phoneClean = (lead.telefone || '').replace(/\D/g, '');
        const whatsappMsg = encodeURIComponent(`Olá ${lead.nome}! Aqui é o Rhuan Fotógrafo. Vi sua solicitação para ${lead.categoria} no dia ${lead.data_evento || 'a combinar'}. Como posso te ajudar?`);

        return `
          <tr>
            <td>
              <strong style="color: var(--admin-text-main); font-weight: 700;">${lead.nome}</strong>
              <div style="font-size: 0.75rem; color: var(--admin-text-muted);">${lead.email || ''}</div>
            </td>
            <td>
              <span style="font-size: 0.85rem; font-weight: 600;">${lead.categoria}</span>
              <div style="font-size: 0.75rem; color: var(--admin-rose-dark); font-weight: 600;">📅 Data: ${lead.data_evento || 'A combinar'}</div>
            </td>
            <td>
              <a href="tel:${phoneClean}" style="color: var(--admin-text-main); font-weight: 600;">${lead.telefone}</a>
            </td>
            <td>${dateStr}</td>
            <td>${statusMap[lead.status] || lead.status}</td>
            <td>
              <div class="table-actions">
                ${phoneClean ? `
                  <a href="https://wa.me/55${phoneClean}?text=${whatsappMsg}" target="_blank" class="btn-table-action whatsapp" title="Conversar no WhatsApp">
                    WhatsApp
                  </a>
                ` : ''}
                <button type="button" class="btn-table-action btn-change-lead-status" data-id="${lead.id}">
                  Alterar Status
                </button>
                <button type="button" class="btn-table-action btn-approve-agenda" data-id="${lead.id}" title="Bloquear esta data na Agenda">
                  Bloquear Agenda
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');

      // Ações dos leads
      tbody.querySelectorAll('.btn-change-lead-status').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id, 10);
          const target = this.leads.find(l => l.id === id);
          if (target) {
            const nextStatus = target.status === 'new' ? 'contacted' : target.status === 'contacted' ? 'closed' : 'new';
            target.status = nextStatus;
            this.saveLeads();
            this.renderLeadsTable(filter);
            this.renderOverviewMetrics();
            this.showToast(`Status atualizado para "${nextStatus}".`);
          }
        });
      });

      tbody.querySelectorAll('.btn-approve-agenda').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = parseInt(btn.dataset.id, 10);
          const target = this.leads.find(l => l.id === id);
          if (target && target.data_evento) {
            this.agenda[target.data_evento] = {
              status: 'booked',
              title: `${target.categoria} - ${target.nome}`,
              categoria: target.categoria,
              slots: [{ time: 'Evento Confirmado', desc: `${target.categoria} - ${target.nome} (${target.telefone})` }]
            };
            target.status = 'closed';
            this.saveAgenda();
            this.saveLeads();
            this.renderAgendaCalendar();
            this.renderLeadsTable(filter);
            this.renderOverviewMetrics();
            this.showToast(`Data ${target.data_evento} bloqueada e confirmada na agenda!`, 'success');
          } else {
            this.showToast('Esta solicitação não possui data preenchida.', 'error');
          }
        });
      });
    }

    // ---------- VISÃO GERAL (OVERVIEW) ----------
    renderOverviewMetrics() {
      // 1. Total de Fotos Cadastradas
      let totalPhotos = 0;
      Object.values(this.portfolio).forEach(s => {
        totalPhotos += (s.slides || []).length;
      });
      const photoMetric = document.getElementById('metricTotalPhotos');
      if (photoMetric) photoMetric.textContent = totalPhotos;

      // 2. Eventos Agendados
      let bookedCount = 0;
      Object.values(this.agenda).forEach(d => {
        if (d.status === 'booked' || d.status === 'limited') bookedCount++;
      });
      const agendaMetric = document.getElementById('metricBookedEvents');
      if (agendaMetric) agendaMetric.textContent = bookedCount;

      // 3. Solicitações Novas
      const newLeadsCount = this.leads.filter(l => l.status === 'new').length;
      const leadsMetric = document.getElementById('metricNewLeads');
      if (leadsMetric) leadsMetric.textContent = newLeadsCount;

      // Atualiza badge da sidebar
      const badgeLeads = document.getElementById('sidebarBadgeLeads');
      if (badgeLeads) badgeLeads.textContent = newLeadsCount;
      const badgeAgenda = document.getElementById('sidebarBadgeAgenda');
      if (badgeAgenda) badgeAgenda.textContent = bookedCount;

      // 4. Previsão de Faturamento da Agenda
      const revenueMetric = document.getElementById('metricRevenue');
      if (revenueMetric) {
        const avgTicket = (this.pricing.basePrices.casamento?.base + this.pricing.basePrices['festa-15anos']?.base) / 2 || 2500;
        const totalEst = bookedCount * avgTicket;
        revenueMetric.textContent = `R$ ${totalEst.toLocaleString('pt-BR')}`;
      }

      // 5. Lista de Próximos Compromissos na Overview
      const nextEventsList = document.getElementById('overviewNextEventsList');
      if (nextEventsList) {
        const sortedDates = Object.entries(this.agenda)
          .filter(([_, data]) => data.status === 'booked' || data.status === 'limited')
          .sort(([a], [b]) => a.localeCompare(b))
          .slice(0, 5);

        if (sortedDates.length === 0) {
          nextEventsList.innerHTML = `<p style="color: var(--admin-text-muted); font-size: 0.88rem;">Nenhum evento agendado para os próximos dias.</p>`;
        } else {
          nextEventsList.innerHTML = sortedDates.map(([dateStr, d]) => {
            const parts = dateStr.split('-');
            const formatted = `${parts[2]}/${parts[1]}`;
            const isBooked = d.status === 'booked';
            return `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem; background: var(--admin-bg-alt); border-radius: var(--admin-radius-sm); margin-bottom: 0.5rem; border-left: 3px solid ${isBooked ? 'var(--admin-danger)' : 'var(--admin-warning)'};">
                <div>
                  <strong style="font-size: 0.9rem; color: var(--admin-text-main);">${d.title || 'Evento'}</strong>
                  <div style="font-size: 0.76rem; color: var(--admin-text-muted);">${d.categoria || 'Fotografia'}</div>
                </div>
                <div style="text-align: right;">
                  <span style="font-weight: 700; font-size: 0.88rem; color: var(--admin-rose-dark);">${formatted}</span>
                </div>
              </div>
            `;
          }).join('');
        }
      }

      // 6. Últimos Leads na Overview
      const latestLeadsList = document.getElementById('overviewLatestLeadsList');
      if (latestLeadsList) {
        const recent = this.leads.slice(0, 4);
        latestLeadsList.innerHTML = recent.map(l => `
          <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem; background: var(--admin-bg-alt); border-radius: var(--admin-radius-sm); margin-bottom: 0.5rem; border: 1px solid var(--admin-border-subtle);">
            <div>
              <strong style="font-size: 0.9rem; color: var(--admin-text-main);">${l.nome}</strong>
              <div style="font-size: 0.76rem; color: var(--admin-text-muted);">${l.categoria} &bull; ${l.telefone}</div>
            </div>
            <a href="https://wa.me/55${(l.telefone || '').replace(/\D/g, '')}" target="_blank" class="btn-table-action whatsapp" style="padding: 0.35rem 0.65rem; font-size: 0.76rem;">
              WhatsApp
            </a>
          </div>
        `).join('');
      }
    }

    renderAll() {
      this.renderOverviewMetrics();
      this.renderPhotosModule();
      this.renderAgendaCalendar();
      this.renderPricingModule();
      this.renderLeadsTable();
    }

    // ---------- TOASTS ----------
    showToast(message, type = 'info') {
      let container = document.getElementById('adminToastContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'adminToastContainer';
        container.className = 'admin-toast-container';
        document.body.appendChild(container);
      }

      const toast = document.createElement('div');
      toast.className = `admin-toast ${type}`;
      
      const iconMap = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
      };

      toast.innerHTML = `
        <span style="font-weight: 800; font-size: 1.1rem; color: ${type === 'success' ? '#34d399' : type === 'error' ? '#f87171' : '#fbbf24'};">${iconMap[type] || 'ℹ'}</span>
        <span>${message}</span>
      `;

      container.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        toast.style.transition = 'all 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3500);
    }
  }

  // Inicialização no DOM
  document.addEventListener('DOMContentLoaded', () => {
    window.adminStudio = new AdminStudioController();
  });
})();
