/**
 * DATEPICKER CUSTOMIZADO (100% VANILLA JAVASCRIPT)
 * Estúdio Rhuan Fotografia
 * Não requer dependências externas (Zero jQuery, Zero NPM).
 */

(function () {
  'use strict';

  const MESES = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  class CustomDatePicker {
    constructor(inputElement, options = {}) {
      this.input = inputElement;
      this.options = {
        minDate: options.minDate || null,
        format: options.format || 'dd/mm/yyyy',
        placeholder: options.placeholder || 'Selecione uma data...',
        ...options
      };

      // Inicializa com a data do input ou hoje
      const initialVal = this.input.value;
      if (initialVal && /^\d{4}-\d{2}-\d{2}$/.test(initialVal)) {
        const parts = initialVal.split('-');
        this.selectedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
      } else {
        this.selectedDate = null;
      }

      this.viewDate = this.selectedDate ? new Date(this.selectedDate) : new Date(2026, 9, 1); // Outubro 2026
      this.isOpen = false;

      this.init();
    }

    init() {
      this.buildDOM();
      this.bindEvents();
      this.updateDisplay();
    }

    buildDOM() {
      // Oculta o input original mantendo-o no formulário
      this.input.style.display = 'none';

      // Cria o wrapper
      this.wrapper = document.createElement('div');
      this.wrapper.className = 'custom-datepicker-wrapper';

      // Cria a caixa de exibição
      this.display = document.createElement('div');
      this.display.className = 'custom-datepicker-display';
      this.display.tabIndex = 0;
      this.display.innerHTML = `
        <div class="datepicker-text">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-primary); flex-shrink: 0;">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span class="datepicker-value">${this.options.placeholder}</span>
        </div>
        <div class="datepicker-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </div>
      `;

      // Cria o popover flutuante
      this.popup = document.createElement('div');
      this.popup.className = 'custom-datepicker-popup';
      this.popup.innerHTML = `
        <div class="datepicker-header">
          <button type="button" class="datepicker-nav-btn btn-prev" aria-label="Mês Anterior">&larr;</button>
          <div class="datepicker-title"></div>
          <button type="button" class="datepicker-nav-btn btn-next" aria-label="Próximo Mês">&rarr;</button>
        </div>
        <div class="datepicker-weekdays">
          ${DIAS_SEMANA.map(d => `<span>${d}</span>`).join('')}
        </div>
        <div class="datepicker-days-grid"></div>
        <div class="datepicker-footer">
          <div class="datepicker-legend">
            <div class="datepicker-legend-item"><span style="background: #10b981;"></span>Livre</div>
            <div class="datepicker-legend-item"><span style="background: #ef4444;"></span>Ocupado</div>
          </div>
          <button type="button" class="datepicker-today-btn">Hoje</button>
        </div>
      `;

      // Insere o wrapper no DOM
      this.input.parentNode.insertBefore(this.wrapper, this.input);
      this.wrapper.appendChild(this.display);
      this.wrapper.appendChild(this.popup);
      this.wrapper.appendChild(this.input);
    }

    bindEvents() {
      // Toggle abrir/fechar ao clicar na display box
      this.display.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggle();
      });

      this.display.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.toggle();
        } else if (e.key === 'Escape') {
          this.close();
        }
      });

      // Navegação entre meses
      this.popup.querySelector('.btn-prev').addEventListener('click', (e) => {
        e.stopPropagation();
        this.viewDate.setMonth(this.viewDate.getMonth() - 1);
        this.renderCalendar();
      });

      this.popup.querySelector('.btn-next').addEventListener('click', (e) => {
        e.stopPropagation();
        this.viewDate.setMonth(this.viewDate.getMonth() + 1);
        this.renderCalendar();
      });

      // Botão "Hoje"
      this.popup.querySelector('.datepicker-today-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        const now = new Date();
        this.selectDate(now.getFullYear(), now.getMonth(), now.getDate());
        this.close();
      });

      // Fecha ao clicar fora
      document.addEventListener('click', (e) => {
        if (!this.wrapper.contains(e.target)) {
          this.close();
        }
      });

      // Fecha com a tecla Escape
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.isOpen) {
          this.close();
        }
      });

      // Atualiza quando o valor do input original mudar programaticamente
      this.input.addEventListener('change', () => {
        if (this.input.value && /^\d{4}-\d{2}-\d{2}$/.test(this.input.value)) {
          const parts = this.input.value.split('-');
          this.selectedDate = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
          this.updateDisplay();
        }
      });
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      // Fecha outros datepickers abertos
      document.querySelectorAll('.custom-datepicker-wrapper.is-open').forEach(el => {
        if (el !== this.wrapper) el.classList.remove('is-open');
      });

      this.isOpen = true;
      this.wrapper.classList.add('is-open');

      if (this.selectedDate) {
        this.viewDate = new Date(this.selectedDate);
      }
      this.renderCalendar();
    }

    close() {
      this.isOpen = false;
      this.wrapper.classList.remove('is-open');
    }

    renderCalendar() {
      const year = this.viewDate.getFullYear();
      const month = this.viewDate.getMonth();

      // Atualiza título do mês/ano
      const titleEl = this.popup.querySelector('.datepicker-title');
      titleEl.textContent = `${MESES[month]} ${year}`;

      const gridEl = this.popup.querySelector('.datepicker-days-grid');
      gridEl.innerHTML = '';

      const firstDayIndex = new Date(year, month, 1).getDay();
      const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
      const prevMonthLastDay = new Date(year, month, 0).getDate();

      const today = new Date();
      const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

      // Dias do mês anterior
      for (let i = firstDayIndex; i > 0; i--) {
        const dayNum = prevMonthLastDay - i + 1;
        const cell = document.createElement('div');
        cell.className = 'datepicker-day other-month';
        cell.textContent = dayNum;
        gridEl.appendChild(cell);
      }

      // Dados da agenda global se disponível
      const agenda = window.AgendaData || {};

      // Dias do mês atual
      for (let day = 1; day <= totalDaysInMonth; day++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'datepicker-day';
        cell.textContent = day;

        const isToday = isCurrentMonth && today.getDate() === day;
        if (isToday) cell.classList.add('today');

        const isSelected = this.selectedDate &&
          this.selectedDate.getFullYear() === year &&
          this.selectedDate.getMonth() === month &&
          this.selectedDate.getDate() === day;

        if (isSelected) cell.classList.add('selected');

        // Status da data na agenda (Livre, Ocupado, Vagas)
        const dateIso = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayAgenda = agenda[dateIso];
        if (dayAgenda) {
          const dot = document.createElement('span');
          dot.className = `status-dot ${dayAgenda.status || 'available'}`;
          dot.title = dayAgenda.title || (dayAgenda.status === 'booked' ? 'Data Reservada' : 'Data Livre');
          cell.appendChild(dot);
        }

        cell.addEventListener('click', (e) => {
          e.stopPropagation();
          this.selectDate(year, month, day);
          this.close();
        });

        gridEl.appendChild(cell);
      }

      // Preenche até fechar as semanas (grid de 7 colunas)
      const remainingCells = (7 - ((firstDayIndex + totalDaysInMonth) % 7)) % 7;
      for (let i = 1; i <= remainingCells; i++) {
        const cell = document.createElement('div');
        cell.className = 'datepicker-day other-month';
        cell.textContent = i;
        gridEl.appendChild(cell);
      }
    }

    selectDate(year, month, day) {
      this.selectedDate = new Date(year, month, day);
      const isoString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

      // Atualiza o input original (formato YYYY-MM-DD para o Laravel/MySQL)
      this.input.value = isoString;
      this.input.dispatchEvent(new Event('change', { bubbles: true }));

      this.updateDisplay();
    }

    updateDisplay() {
      const valueSpan = this.display.querySelector('.datepicker-value');
      if (this.selectedDate) {
        const d = String(this.selectedDate.getDate()).padStart(2, '0');
        const m = String(this.selectedDate.getMonth() + 1).padStart(2, '0');
        const y = this.selectedDate.getFullYear();
        const mesNome = MESES[this.selectedDate.getMonth()];

        valueSpan.innerHTML = `<strong>${d}/${m}/${y}</strong> <span style="font-size: 0.82rem; color: var(--color-text-muted); margin-left: 0.3rem;">(${d} de ${mesNome})</span>`;
      } else {
        valueSpan.innerHTML = `<span class="datepicker-placeholder">${this.options.placeholder}</span>`;
      }
    }
  }

  // Inicialização Automática em todos os inputs com data-datepicker ou tipo date
  function initAllDatePickers() {
    const inputs = document.querySelectorAll('input[data-datepicker="true"], input.custom-datepicker, form#formContatoOrcamento input[name="data_evento"], #modalBookingForm input[type="date"]');
    inputs.forEach(input => {
      if (!input._customDatePickerInstance) {
        input._customDatePickerInstance = new CustomDatePicker(input, {
          placeholder: 'Escolha a data do seu evento'
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllDatePickers);
  } else {
    initAllDatePickers();
  }

  window.CustomDatePicker = CustomDatePicker;
  window.initAllDatePickers = initAllDatePickers;
})();

