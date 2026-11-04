/**
 * CALCULADORA & SIMULADOR DE ORÇAMENTOS INTERATIVO (100% JAVASCRIPT PURO)
 * Permite que o cliente calcule orçamentos em tempo real, escolha pacotes
 * e envie proposta diretamente via WhatsApp ou formulário local.
 */

class OrcamentoCalculator {
  constructor() {
    this.basePrices = {
      'ensaio-feminino': { name: 'Ensaio Feminino / Retrato', base: 650, baseHours: 2, photoCount: 25 },
      'ensaio-gestante': { name: 'Ensaio Gestante Fine Art', base: 750, baseHours: 2, photoCount: 30 },
      'festa-15anos': { name: 'Festa de 15 Anos / Debutante', base: 1800, baseHours: 5, photoCount: 150 },
      'casamento': { name: 'Casamento Completo', base: 3200, baseHours: 8, photoCount: 350 },
      'evento-social': { name: 'Evento Social / Aniversário', base: 1200, baseHours: 4, photoCount: 100 }
    };

    this.hourlyRate = 220; // Valor por hora adicional

    this.addons = {
      'album-fineart': { name: 'Álbum Fine Art Luxo (30x30cm)', price: 780 },
      'segundo-fotografo': { name: 'Segundo Fotógrafo Especialista', price: 600 },
      'ensaio-pre': { name: 'Ensaio Pré-Evento (Externo)', price: 550 },
      'drone': { name: 'Imagens Aéreas com Drone', price: 450 },
      'express': { name: 'Entrega Expressa em 48 Horas', price: 350 }
    };

    this.currentTotal = 0;
    this.selectedType = 'ensaio-feminino';
    this.selectedHours = 2;
    this.selectedAddons = new Set();

    this.loadLocalPrices();
    this.init();
  }

  loadLocalPrices() {
    try {
      const saved = localStorage.getItem('rhuan_precos_orcamento');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.basePrices) this.basePrices = { ...this.basePrices, ...parsed.basePrices };
        if (parsed.hourlyRate !== undefined) this.hourlyRate = Number(parsed.hourlyRate);
        if (parsed.addons) this.addons = { ...this.addons, ...parsed.addons };
      }
    } catch (e) {
      console.warn('Erro ao carregar precos locais:', e);
    }
  }

  init() {
    this.updateDisplayedPrices();
    this.bindTabs();
    this.bindInputs();
    this.applyUrlParameters();
    this.calculate();
  }

  updateDisplayedPrices() {
    // Atualiza subtítulos com valor mínimo nos seletores de tipo
    Object.entries(this.basePrices).forEach(([key, val]) => {
      const radio = document.querySelector(`input[name="tipoEnsaio"][value="${key}"]`);
      if (radio) {
        const labelEl = radio.closest('label');
        if (labelEl) {
          const small = labelEl.querySelector('small');
          if (small) small.textContent = `A partir de R$ ${Number(val.base).toLocaleString('pt-BR')}`;
        }
      }
    });

    // Atualiza tags de valor dos adicionais
    Object.entries(this.addons).forEach(([key, val]) => {
      const check = document.querySelector(`.addon-check[value="${key}"]`);
      if (check) {
        const labelEl = check.closest('label');
        if (labelEl) {
          const tag = labelEl.querySelector('.addon-price-tag');
          if (tag) tag.textContent = `+ R$ ${Number(val.price).toLocaleString('pt-BR')}`;
        }
      }
    });
  }

  applyUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const tipoParam = params.get('tipo');
    const dataParam = params.get('data');

    const mapCategoryToType = {
      'casamento': 'casamento',
      '15anos': 'festa-15anos',
      'festa-15anos': 'festa-15anos',
      'gestante': 'ensaio-gestante',
      'ensaio-gestante': 'ensaio-gestante',
      'feminino': 'ensaio-feminino',
      'ensaio-feminino': 'ensaio-feminino'
    };

    if (tipoParam && mapCategoryToType[tipoParam]) {
      const targetValue = mapCategoryToType[tipoParam];
      const radio = document.querySelector(`input[name="tipoEnsaio"][value="${targetValue}"]`);
      if (radio) {
        radio.checked = true;
        this.selectedType = targetValue;
        const config = this.basePrices[this.selectedType];
        const hoursSlider = document.getElementById('calcHoras');
        const hoursDisplay = document.getElementById('calcHorasDisplay');
        if (hoursSlider && config) {
          hoursSlider.min = config.baseHours;
          hoursSlider.value = config.baseHours;
          this.selectedHours = config.baseHours;
          if (hoursDisplay) hoursDisplay.textContent = `${config.baseHours} horas`;
        }
      }
    }

    if (dataParam) {
      const dateInput = document.getElementById('orcamentoData');
      if (dateInput) {
        dateInput.value = dataParam;
      }
    }
  }

  bindTabs() {
    const tabBtns = document.querySelectorAll('.pricing-tab-btn');
    const tabPanes = document.querySelectorAll('.pricing-tab-pane');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target;
        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.style.display = 'none');

        btn.classList.add('active');
        const targetPane = document.getElementById(target);
        if (targetPane) {
          targetPane.style.display = 'block';
        }
      });
    });
  }

  bindInputs() {
    // Tipo de Ensaio/Evento
    const typeInputs = document.querySelectorAll('input[name="tipoEnsaio"]');
    typeInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        this.selectedType = e.target.value;
        const config = this.basePrices[this.selectedType];
        
        // Ajusta as horas mínimas
        const hoursSlider = document.getElementById('calcHoras');
        const hoursDisplay = document.getElementById('calcHorasDisplay');
        if (hoursSlider && config) {
          hoursSlider.min = config.baseHours;
          if (parseInt(hoursSlider.value, 10) < config.baseHours) {
            hoursSlider.value = config.baseHours;
          }
          if (hoursDisplay) hoursDisplay.textContent = `${hoursSlider.value} horas`;
          this.selectedHours = parseInt(hoursSlider.value, 10);
        }

        this.calculate();
      });
    });

    // Slider de Horas
    const hoursSlider = document.getElementById('calcHoras');
    const hoursDisplay = document.getElementById('calcHorasDisplay');
    if (hoursSlider) {
      hoursSlider.addEventListener('input', (e) => {
        this.selectedHours = parseInt(e.target.value, 10);
        if (hoursDisplay) {
          hoursDisplay.textContent = `${this.selectedHours} horas`;
        }
        this.calculate();
      });
    }

    // Opcionais / Add-ons
    const addonCheckboxes = document.querySelectorAll('.addon-check');
    addonCheckboxes.forEach(chk => {
      chk.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.selectedAddons.add(e.target.value);
        } else {
          this.selectedAddons.delete(e.target.value);
        }
        this.calculate();
      });
    });

    // Botão Enviar Orçamento por WhatsApp
    const sendWhatsAppBtn = document.getElementById('sendOrcamentoWhatsApp');
    if (sendWhatsAppBtn) {
      sendWhatsAppBtn.addEventListener('click', () => {
        this.sendViaWhatsApp();
      });
    }

    // Botões dos pacotes pré-definidos
    document.querySelectorAll('.btn-pacote-select').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pacoteNome = e.target.dataset.pacote;
        const pacoteValor = e.target.dataset.valor;
        this.selectPackageModal(pacoteNome, pacoteValor);
      });
    });
  }

  calculate() {
    const typeData = this.basePrices[this.selectedType] || this.basePrices['ensaio-feminino'];
    let total = typeData.base;

    const receiptContainer = document.getElementById('calcReceiptItems');
    const totalDisplay = document.getElementById('calcTotalValue');
    if (!receiptContainer || !totalDisplay) return;

    let itemsHtml = `
      <div class="receipt-item">
        <span>${typeData.name} (${typeData.baseHours}h base)</span>
        <span>R$ ${typeData.base.toLocaleString('pt-BR')}</span>
      </div>
    `;

    // Horas adicionais
    const extraHours = Math.max(0, this.selectedHours - typeData.baseHours);
    if (extraHours > 0) {
      const extraCost = extraHours * this.hourlyRate;
      total += extraCost;
      itemsHtml += `
        <div class="receipt-item">
          <span>+ ${extraHours}h de cobertura adicional</span>
          <span>R$ ${extraCost.toLocaleString('pt-BR')}</span>
        </div>
      `;
    }

    // Opcionais
    this.selectedAddons.forEach(addonKey => {
      const addon = this.addons[addonKey];
      if (addon) {
        total += addon.price;
        itemsHtml += `
          <div class="receipt-item">
            <span>+ ${addon.name}</span>
            <span>R$ ${addon.price.toLocaleString('pt-BR')}</span>
          </div>
        `;
      }
    });

    this.currentTotal = total;
    receiptContainer.innerHTML = itemsHtml;
    totalDisplay.textContent = `R$ ${total.toLocaleString('pt-BR')}`;
  }

  sendViaWhatsApp() {
    const typeData = this.basePrices[this.selectedType];
    const dataInput = document.getElementById('orcamentoData');
    const dataEscolhida = dataInput && dataInput.value ? dataInput.value : 'A definir';

    let msg = `Olá! Estive no seu site e montei uma proposta de orçamento:%0A%0A`;
    msg += `📸 *Serviço:* ${typeData.name}%0A`;
    msg += `⏱ *Duração:* ${this.selectedHours} horas%0A`;
    msg += `📅 *Data Desejada:* ${dataEscolhida}%0A`;

    if (this.selectedAddons.size > 0) {
      msg += `✨ *Opcionais Inclusos:*%0A`;
      this.selectedAddons.forEach(key => {
        const addon = this.addons[key];
        if (addon) {
          msg += ` • ${addon.name}%0A`;
        }
      });
    }

    msg += `%0A💰 *Investimento Estimado:* R$ ${this.currentTotal.toLocaleString('pt-BR')}%0A%0A`;
    msg += `Gostaria de verificar a disponibilidade na agenda e tirar algumas dúvidas!`;

    const phone = '5511999999999';
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  }

  selectPackageModal(nome, valor) {
    const modal = document.getElementById('bookingModal');
    const modalTitle = document.getElementById('modalServiceTitle');
    const modalPrice = document.getElementById('modalServicePrice');

    if (modal && modalTitle && modalPrice) {
      modalTitle.textContent = nome;
      modalPrice.textContent = `Investimento: ${valor}`;
      modal.classList.add('active');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.orcamentoApp = new OrcamentoCalculator();
});
