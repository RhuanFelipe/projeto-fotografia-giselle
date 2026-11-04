<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Simulador de orçamento de fotografia para festas, casamentos, 15 anos e ensaios. Veja pacotes, preços transparentes e envie sua proposta online.">
  <title>Simulador de Orçamento & Pacotes &bull; Rhuan Fotografia</title>
  
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
        <a href="agenda.html" class="nav-link">Agenda de Eventos</a>
        <a href="ensaios.html" class="nav-link">Ensaios & Festas</a>
        <a href="orcamentos.html" class="nav-link active">Orçamentos</a>
        <a href="index.html#sobre" class="nav-link">Sobre</a>
        <a href="index.html#contato" class="nav-link">Contato</a>
      </nav>

      <div class="nav-actions">
        <button type="button" class="theme-toggle-btn" id="themeToggleBtn" aria-label="Alternar tema claro/escuro" title="Alternar Modo Escuro / Claro">
          <svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
          <svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
        </button>
        <a href="agenda.html" class="btn btn-outline btn-sm">Ver Agenda</a>
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
      <span class="sub-tag">Transparência & Facilidade</span>
      <h1>Simulador de Orçamento & Pacotes</h1>
      <p style="color: var(--color-text-muted); font-size: 1.1rem; margin-top: 1rem;">
        Monte o plano ideal para a sua celebração. Calcule o investimento em tempo real e receba a proposta pronta no seu WhatsApp.
      </p>
    </div>
  </section>

  <!-- ==================== SEÇÃO PRINCIPAL DE ORÇAMENTOS ==================== -->
  <section class="section" style="padding-top: 3rem;">
    <div class="container">
      
      <!-- Abas de Alternância -->
      <div class="pricing-tabs">
        <button class="pricing-tab-btn active" data-target="tabSimulador">Simulador Sob Medida</button>
        <button class="pricing-tab-btn" data-target="tabPacotes">Pacotes Prontos</button>
      </div>

      <!-- SIMULADOR SOB MEDIDA -->
      <div class="pricing-tab-pane" id="tabSimulador">
        <div class="calculator-box">
          <div class="calculator-grid">
            <!-- Controles do Simulador -->
            <div>
              <div class="form-group">
                <label class="form-label">1. Escolha a Categoria do Ensaio ou Celebração</label>
                <div class="options-pill-group">
                  <label>
                    <input type="radio" name="tipoEnsaio" value="ensaio-feminino" class="option-pill-input" checked>
                    <span class="option-pill-label">
                      <strong>Ensaio Feminino</strong>
                      <small style="color: var(--color-text-muted);">A partir de R$ 650</small>
                    </span>
                  </label>
                  <label>
                    <input type="radio" name="tipoEnsaio" value="ensaio-gestante" class="option-pill-input">
                    <span class="option-pill-label">
                      <strong>Gestante Fine Art</strong>
                      <small style="color: var(--color-text-muted);">A partir de R$ 750</small>
                    </span>
                  </label>
                  <label>
                    <input type="radio" name="tipoEnsaio" value="festa-15anos" class="option-pill-input">
                    <span class="option-pill-label">
                      <strong>Festa 15 Anos</strong>
                      <small style="color: var(--color-text-muted);">A partir de R$ 1.800</small>
                    </span>
                  </label>
                  <label>
                    <input type="radio" name="tipoEnsaio" value="casamento" class="option-pill-input">
                    <span class="option-pill-label">
                      <strong>Casamento</strong>
                      <small style="color: var(--color-text-muted);">A partir de R$ 3.200</small>
                    </span>
                  </label>
                  <label>
                    <input type="radio" name="tipoEnsaio" value="evento-social" class="option-pill-input">
                    <span class="option-pill-label">
                      <strong>Evento Social</strong>
                      <small style="color: var(--color-text-muted);">A partir de R$ 1.200</small>
                    </span>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                  <label class="form-label" style="margin-bottom: 0;">2. Horas de Cobertura Desejadas</label>
                  <span id="calcHorasDisplay" style="font-weight: 700; color: var(--color-primary-dark);">2 horas</span>
                </div>
                <input type="range" id="calcHoras" min="2" max="10" step="1" value="2" class="form-control" style="cursor: pointer; padding: 0.5rem 0;">
                <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 0.3rem;">
                  Ajuste conforme a duração da cerimônia, festa ou trocas de figurino.
                </p>
              </div>

              <div class="form-group">
                <label class="form-label">3. Opcionais & Upgrades Exclusivos</label>
                <div class="addons-list">
                  <label class="addon-checkbox-label">
                    <div class="addon-left">
                      <input type="checkbox" class="addon-check" value="album-fineart">
                      <span>Álbum Fine Art com Caixa em Linho Cru (30x30cm - 40 págs)</span>
                    </div>
                    <span class="addon-price-tag">+ R$ 780</span>
                  </label>

                  <label class="addon-checkbox-label">
                    <div class="addon-left">
                      <input type="checkbox" class="addon-check" value="segundo-fotografo">
                      <span>Segundo Fotógrafo (Imprescindível para casamentos acima de 100 pessoas)</span>
                    </div>
                    <span class="addon-price-tag">+ R$ 600</span>
                  </label>

                  <label class="addon-checkbox-label">
                    <div class="addon-left">
                      <input type="checkbox" class="addon-check" value="ensaio-pre">
                      <span>Ensaio Pré-Evento Externo (Pré-Wedding ou Pré-15 Anos)</span>
                    </div>
                    <span class="addon-price-tag">+ R$ 550</span>
                  </label>

                  <label class="addon-checkbox-label">
                    <div class="addon-left">
                      <input type="checkbox" class="addon-check" value="drone">
                      <span>Tomadas Aéreas com Drone (Fotos e vídeos panorâmicos)</span>
                    </div>
                    <span class="addon-price-tag">+ R$ 450</span>
                  </label>

                  <label class="addon-checkbox-label">
                    <div class="addon-left">
                      <input type="checkbox" class="addon-check" value="express">
                      <span>Entrega Expressa de Prévia em 48 Horas para Redes Sociais</span>
                    </div>
                    <span class="addon-price-tag">+ R$ 350</span>
                  </label>
                </div>
              </div>

              <div class="form-group">
                <label for="orcamentoData" class="form-label">4. Data Prevista na Agenda</label>
                <input type="date" id="orcamentoData" class="form-control" value="2026-10-25">
              </div>
            </div>

            <!-- Resumo e Ação -->
            <div class="summary-receipt-card">
              <div>
                <h4 class="receipt-title">Orçamento Estimado</h4>
                <div class="receipt-line-items" id="calcReceiptItems">
                  <!-- Gerado dinamicamente via orcamento.js -->
                </div>
                <div class="receipt-item total">
                  <span>Total Estimado:</span>
                  <div class="receipt-total-value" id="calcTotalValue">R$ 650</div>
                </div>
                
                <div style="background-color: #FFFFFF; border-radius: var(--radius-sm); padding: 1rem; margin-top: 1.5rem; border: 1px solid var(--color-border-light);">
                  <div style="font-weight: 600; font-size: 0.85rem; color: var(--color-text); margin-bottom: 0.3rem;">Condições de Pagamento:</div>
                  <ul style="font-size: 0.78rem; color: var(--color-text-muted); line-height: 1.5;">
                    <li>&bull; 5% de desconto para pagamento à vista no PIX</li>
                    <li>&bull; Parcelamento em até 6x no cartão de crédito sem juros</li>
                    <li>&bull; Sinal de 30% na reserva e saldo quitado até a semana do evento</li>
                  </ul>
                </div>
              </div>

              <div style="margin-top: 2rem; display: flex; flex-direction: column; gap: 0.8rem;">
                <button class="btn btn-primary" id="sendOrcamentoWhatsApp">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Enviar Proposta por WhatsApp
                </button>
                <a href="index.html#contato" class="btn btn-outline" style="text-align: center;">
                  Enviar por E-mail Formal
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PACOTES PRONTOS -->
      <div class="pricing-tab-pane" id="tabPacotes" style="display: none;">
        <div class="pricing-cards-grid">
          <div class="pricing-card">
            <div class="pricing-header">
              <span class="sub-tag">Ensaio Individual</span>
              <h3>Ensaio Essencial</h3>
              <p class="pricing-subtitle">Para quem quer fotos artísticas, leves e atemporais.</p>
            </div>
            <div class="pricing-price">
              <span class="pricing-currency">R$</span>
              <span class="pricing-value">650</span>
              <span class="pricing-period">/ sessão</span>
            </div>
            <div class="pricing-features">
              <div class="pricing-feature-item">
                <span class="pricing-check-icon">✓</span>
                <span>2 horas de ensaio com luz natural</span>
              </div>
              <div class="pricing-feature-item">
                <span class="pricing-check-icon">✓</span>
                <span>25 fotos digitais em alta resolução tratadas</span>
              </div>
              <div class="pricing-feature-item">
                <span class="pricing-check-icon">✓</span>
                <span>Guia de estilo e figurino</span>
              </div>
            </div>
            <button class="btn btn-outline btn-pacote-select" data-pacote="Ensaio Essencial" data-valor="R$ 650">
              Contratar Este Pacote
            </button>
          </div>

          <div class="pricing-card featured">
            <span class="popular-badge">Mais Pedido</span>
            <div class="pricing-header">
              <span class="sub-tag">15 Anos</span>
              <h3>Baile de Debutante</h3>
              <p class="pricing-subtitle">A emoção completa do aniversário de 15 anos.</p>
            </div>
            <div class="pricing-price">
              <span class="pricing-currency">R$</span>
              <span class="pricing-value">1.800</span>
              <span class="pricing-period">/ evento</span>
            </div>
            <div class="pricing-features">
              <div class="pricing-feature-item">
                <span class="pricing-check-icon">✓</span>
                <span>5 horas de cobertura completa</span>
              </div>
              <div class="pricing-feature-item">
                <span class="pricing-check-icon">✓</span>
                <span>150+ fotos tratadas individualmente</span>
              </div>
              <div class="pricing-feature-item">
                <span class="pricing-check-icon">✓</span>
                <span>Making-of e cerimônia da valsa</span>
              </div>
              <div class="pricing-feature-item">
                <span class="pricing-check-icon">✓</span>
                <span>Vídeo teaser para redes sociais</span>
              </div>
            </div>
            <button class="btn btn-primary btn-pacote-select" data-pacote="Baile de Debutante" data-valor="R$ 1.800">
              Contratar Este Pacote
            </button>
          </div>

          <div class="pricing-card">
            <div class="pricing-header">
              <span class="sub-tag">Casamento</span>
              <h3>Casamento Completo</h3>
              <p class="pricing-subtitle">Cobertura completa do making-of à festa.</p>
            </div>
            <div class="pricing-price">
              <span class="pricing-currency">R$</span>
              <span class="pricing-value">3.200</span>
              <span class="pricing-period">/ evento</span>
            </div>
            <div class="pricing-features">
              <div class="pricing-feature-item">
                <span class="pricing-check-icon">✓</span>
                <span>8 horas com 2 fotógrafos presentes</span>
              </div>
              <div class="pricing-feature-item">
                <span class="pricing-check-icon">✓</span>
                <span>350+ fotos tratadas</span>
              </div>
              <div class="pricing-feature-item">
                <span class="pricing-check-icon">✓</span>
                <span>Ensaio Pré-Wedding incluso</span>
              </div>
            </div>
            <button class="btn btn-outline btn-pacote-select" data-pacote="Casamento Completo" data-valor="R$ 3.200">
              Contratar Este Pacote
            </button>
          </div>
        </div>
      </div>

    </div>
  </section>

  <!-- MODAL DE RESERVA -->
  <div class="modal-backdrop" id="bookingModal">
    <div class="modal-container">
      <button class="modal-close-btn" aria-label="Fechar Modal">&times;</button>
      <span class="sub-tag">Reserva de Pacote</span>
      <h3 id="modalServiceTitle" style="font-size: 1.8rem; margin-bottom: 0.3rem;">Nome do Pacote</h3>
      <p id="modalServicePrice" style="color: var(--color-primary-dark); font-weight: 700; font-size: 1.2rem; margin-bottom: 1.5rem;">Investimento: R$ 0,00</p>
      
      <form id="modalBookingForm">
        <div class="form-group">
          <label class="form-label">Seu Nome Completo *</label>
          <input type="text" class="form-control" required placeholder="Nome do contratante">
        </div>
        <div class="form-group">
          <label class="form-label">WhatsApp *</label>
          <input type="tel" class="form-control" required placeholder="(11) 99999-9999">
        </div>
        <div class="form-group">
          <label class="form-label">Data Pretendida *</label>
          <input type="date" class="form-control" required value="2026-10-25">
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
          Confirmar Solicitação de Reserva
        </button>
      </form>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="footer">
    <div class="container text-center" style="text-align: center;">
      <a href="index.html" class="logo">
        <span class="logo-main" style="color: #FFFFFF;">RHUAN</span>
        <span class="logo-sub">Fotografia Autoral</span>
      </a>
      <p style="color: #A39690; font-size: 0.9rem; margin-top: 1rem;">
        &copy; 2026 Rhuan Fotografia. Orçamentos transparentes e personalizados. &bull; 
        <a href="admin.html" style="color: var(--color-accent); font-weight: 600;">🔒 Área Admin</a>
      </p>
    </div>
  </footer>

  <script src="assets/js/datepicker.js"></script>
  <script src="assets/js/orcamento.js"></script>
  <script src="assets/js/main.js"></script>
</body>
</html>

