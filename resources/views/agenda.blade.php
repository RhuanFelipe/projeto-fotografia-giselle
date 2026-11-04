<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Consulte a agenda de eventos, casamentos, festas de debutante e ensaios fotográficos. Reserve sua data online com Rhuan Fotografia.">
  <title>Agenda de Eventos & Datas &bull; Rhuan Fotografia</title>
  
  <link rel="stylesheet" href="assets/css/style.css">
  <link rel="stylesheet" href="assets/css/datepicker.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <script>try{if(localStorage.getItem('rhuan_theme')==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}</script>
  <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body>

  <!-- ==================== HEADER ==================== -->
  <header class="header" id="header">
    <div class="container nav-container">
      <a href="index.html" class="logo">
        <span class="logo-main">RHUAN</span>
        <span class="logo-sub">Fotografia Autoral</span>
      </a>

      <nav class="nav-menu" id="navMenu">
        <a href="index.html" class="nav-link">Início</a>
        <a href="agenda.html" class="nav-link active">Agenda de Eventos</a>
        <a href="ensaios.html" class="nav-link">Ensaios & Festas</a>
        <a href="orcamentos.html" class="nav-link">Orçamentos</a>
        <a href="index.html#sobre" class="nav-link">Sobre</a>
        <a href="index.html#contato" class="nav-link">Contato</a>
      </nav>

      <div class="nav-actions">
        <button type="button" class="theme-toggle-btn" id="themeToggleBtn" aria-label="Alternar tema claro/escuro" title="Alternar Modo Escuro / Claro">
          <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>
        <a href="orcamentos.html" class="btn btn-primary btn-sm">Simular Orçamento</a>
        <button class="mobile-toggle" id="mobileMenuToggle" aria-label="Abrir Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>

  <!-- ==================== BANNER ==================== -->
  <section class="section section-tint" style="padding-top: 130px; padding-bottom: 3.5rem;">
    <div class="container text-center" style="text-align: center; max-width: 720px; margin: 0 auto;">
      <span class="sub-tag">Disponibilidade Oficial</span>
      <h1>Agenda de Eventos & Festas</h1>
      <p style="color: var(--color-text-muted); font-size: 1.1rem; margin-top: 1rem;">
        Consulte as datas disponíveis em tempo real. Trabalhamos com apenas <strong>um grande evento por final de semana</strong> para garantir dedicação exclusiva à sua história.
      </p>
    </div>
  </section>

  <!-- ==================== CALENDÁRIO INTERATIVO ==================== -->
  <section class="section" style="padding-top: 3rem;">
    <div class="container">
      <div class="agenda-card-wrapper">
        <div class="agenda-top-bar">
          <div class="agenda-current-month">
            <button class="month-nav-btn" id="prevMonthBtn" aria-label="Mês anterior">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <h3 id="agendaMonthTitle" class="font-serif">Outubro de 2026</h3>
            <button class="month-nav-btn" id="nextMonthBtn" aria-label="Próximo mês">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </button>
          </div>

          <div class="agenda-legend">
            <div class="legend-item">
              <span class="legend-dot available"></span>
              <span>Data Totalmente Livre</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot limited"></span>
              <span>Vagas para Ensaio Externo</span>
            </div>
            <div class="legend-item">
              <span class="legend-dot booked"></span>
              <span>Data Fechada / Evento</span>
            </div>
          </div>
        </div>

        <div class="agenda-layout-grid">
          <div class="agenda-calendar-pane">
            <div class="calendar-weekdays">
              <span><span class="weekday-full">Dom</span><span class="weekday-short">D</span></span>
              <span><span class="weekday-full">Seg</span><span class="weekday-short">S</span></span>
              <span><span class="weekday-full">Ter</span><span class="weekday-short">T</span></span>
              <span><span class="weekday-full">Qua</span><span class="weekday-short">Q</span></span>
              <span><span class="weekday-full">Qui</span><span class="weekday-short">Q</span></span>
              <span><span class="weekday-full">Sex</span><span class="weekday-short">S</span></span>
              <span><span class="weekday-full">Sáb</span><span class="weekday-short">S</span></span>
            </div>
            <div class="calendar-days-grid" id="calendarDaysGrid">
              <!-- Renderizado via agenda.js -->
            </div>
          </div>

          <div class="agenda-sidebar-pane">
            <div>
              <div class="selected-date-card">
                <span class="sub-tag" id="selectedDateStatus">Dia Selecionado</span>
                <h4 id="selectedDateFormatted">25 de Outubro, 2026</h4>
                <p style="font-size: 0.85rem; color: var(--color-text-muted);">
                  Detalhes e horários registrados:
                </p>

                <div class="event-slot-list" id="agendaSlotList"></div>
              </div>

              <div class="agenda-note">
                <strong>Dica de Planejamento:</strong> Se a data que você deseja consta como <em>Vagas para Ensaio</em>, você pode agendar ensaios de até 2 horas. Para casamentos e festas completas, escolha uma data com status <em>Livre</em>.
              </div>
            </div>

            <div style="margin-top: 2rem;">
              <button class="btn btn-primary" id="requestDateBtn" style="width: 100%;">
                Garantir / Reservar Esta Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- FAQ DA AGENDA -->
      <div style="margin-top: 5rem; max-width: 800px; margin-left: auto; margin-right: auto;">
        <h3 class="font-serif" style="text-align: center; font-size: 2.2rem; margin-bottom: 2rem;">Perguntas Frequentes sobre a Agenda</h3>
        
        <div style="display: flex; flex-direction: column; gap: 1.2rem;">
          <div style="background-color: var(--color-surface); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <h4 style="font-size: 1.1rem; margin-bottom: 0.4rem; color: var(--color-text);">Como funciona o processo de reserva de data?</h4>
            <p style="font-size: 0.9rem; color: var(--color-text-muted);">
              A data só é bloqueada formalmente na agenda mediante assinatura do contrato eletrônico e pagamento do sinal de 30%. Enquanto isso, a data permanece disponível para outros clientes.
            </p>
          </div>

          <div style="background-color: var(--color-surface); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <h4 style="font-size: 1.1rem; margin-bottom: 0.4rem; color: var(--color-text);">E se chover no dia do ensaio externo agendado?</h4>
            <p style="font-size: 0.9rem; color: var(--color-text-muted);">
              Não cobramos taxa de remarcação por motivos meteorológicos! Caso o clima inviabilize a iluminação natural, reagendamos para a próxima data disponível na agenda sem nenhum custo adicional.
            </p>
          </div>

          <div style="background-color: var(--color-surface); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
            <h4 style="font-size: 1.1rem; margin-bottom: 0.4rem; color: var(--color-text);">Vocês atendem fora da cidade?</h4>
            <p style="font-size: 0.9rem; color: var(--color-text-muted);">
              Sim! Realizamos casamentos (destination weddings) e festas em todo o Brasil. Os custos de deslocamento e hospedagem são adicionados com transparência na proposta.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ==================== FOOTER ==================== -->
  <footer class="footer">
    <div class="container text-center" style="text-align: center;">
      <a href="index.html" class="logo">
        <span class="logo-main" style="color: #FFFFFF;">RHUAN</span>
        <span class="logo-sub">Fotografia Autoral</span>
      </a>
      <p style="color: #A39690; font-size: 0.9rem; margin-top: 1rem;">
        &copy; 2026 Rhuan Fotografia. Agenda oficial para casamentos, debutantes e ensaios. &bull; 
        <a href="admin.html" style="color: var(--color-accent); font-weight: 600;">🔒 Área Admin</a>
      </p>
    </div>
  </footer>

  <script src="assets/js/agenda.js"></script>
  <script src="assets/js/datepicker.js"></script>
  <script src="assets/js/orcamento.js"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>

