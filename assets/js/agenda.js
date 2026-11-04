/**
 * AGENDA INTERATIVA DO FOTÓGRAFO (100% JAVASCRIPT PURO)
 * Suporta navegação entre meses, visualização de status (Disponível, Reservado, Poucas Vagas)
 * e persistência local via localStorage no navegador.
 */

const AgendaData = {
  // Formato: 'AAAA-MM-DD': { status: 'booked'|'available'|'limited', title: '', slots: [...] }
  '2026-10-18': {
    status: 'booked',
    title: 'Casamento Mariana & Rodrigo',
    categoria: 'Casamento',
    slots: [{ time: '16:00 - 02:00', desc: 'Cerimônia & Recepção (Reservado)' }]
  },
  '2026-10-24': {
    status: 'booked',
    title: 'Festa de 15 Anos - Clara',
    categoria: 'Festa 15 Anos',
    slots: [{ time: '19:00 - 03:00', desc: 'Festa de Gala (Reservado)' }]
  },
  '2026-10-25': {
    status: 'limited',
    title: 'Ensaios Externos',
    categoria: 'Ensaio',
    slots: [
      { time: '08:30 - 10:30', desc: 'Ensaio Gestante - Lívia (Reservado)' },
      { time: '16:00 - 18:00', desc: 'Horário Golden Hour (Disponível!)' }
    ]
  },
  '2026-10-31': {
    status: 'booked',
    title: 'Casamento Beatriz & Guilherme',
    categoria: 'Casamento',
    slots: [{ time: '15:30 - 01:00', desc: 'Evento Completo (Reservado)' }]
  },
  '2026-11-07': {
    status: 'booked',
    title: 'Festa de 15 Anos - Larissa',
    categoria: 'Festa 15 Anos',
    slots: [{ time: '19:30 - 03:30', desc: 'Espaço Villa Real (Reservado)' }]
  },
  '2026-11-14': {
    status: 'limited',
    title: 'Ensaios em Estúdio',
    categoria: 'Ensaio',
    slots: [
      { time: '10:00 - 12:00', desc: 'Ensaio Feminino (Disponível!)' },
      { time: '14:30 - 16:30', desc: 'Ensaio de Família (Reservado)' }
    ]
  },
  '2026-11-21': {
    status: 'booked',
    title: 'Casamento Fernanda & Thiago',
    categoria: 'Casamento',
    slots: [{ time: '16:30 - 02:00', desc: 'Cerimônia ao Ar Livre (Reservado)' }]
  },
  '2026-11-28': {
    status: 'available',
    title: 'Data Aberta para Evento',
    categoria: 'Livre',
    slots: [
      { time: 'Dia Todo', desc: 'Disponível para Casamento ou 15 Anos' }
    ]
  },
  '2026-12-05': {
    status: 'booked',
    title: 'Casamento Camila & André',
    categoria: 'Casamento',
    slots: [{ time: '17:00 - 02:30', desc: 'Casamento Clássico (Reservado)' }]
  },
  '2026-12-12': {
    status: 'booked',
    title: 'Baile de Debutante',
    categoria: 'Festa 15 Anos',
    slots: [{ time: '20:00 - 04:00', desc: 'Recepção e Festa (Reservado)' }]
  },
  '2026-12-19': {
    status: 'limited',
    title: 'Ensaios de Fim de Ano',
    categoria: 'Ensaio',
    slots: [
      { time: '09:00 - 11:00', desc: 'Sessão Matutina (Disponível!)' },
      { time: '16:00 - 18:00', desc: 'Sessão Pôr do Sol (Reservado)' }
    ]
  }
};

class AgendaController {
  constructor() {
    this.currentDate = new Date(2026, 9, 1); // Outubro 2026 como base padrão
    this.selectedDateStr = null;
    this.monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    this.init();
  }

  init() {
    this.loadLocalAgenda();
    this.bindEvents();
    this.render();
    this.selectDate('2026-10-25');
  }

  loadLocalAgenda() {
    try {
      const saved = localStorage.getItem('rhuan_agenda_reservas');
      if (saved) {
        const parsed = JSON.parse(saved);
        Object.assign(AgendaData, parsed);
      }
    } catch (e) {
      // Caso o localStorage esteja indisponível, segue com AgendaData padrão
    }
  }

  registerLocalPreBooking(dateStr, nomeCliente, categoria) {
    if (!dateStr) return;
    const existing = AgendaData[dateStr];
    const novoSlot = {
      time: 'Pré-Reserva',
      desc: `${categoria} - ${nomeCliente} (Solicitado)`
    };

    if (existing) {
      existing.slots = existing.slots || [];
      existing.slots.push(novoSlot);
      if (existing.status === 'available') {
        existing.status = 'limited';
      }
    } else {
      AgendaData[dateStr] = {
        status: 'limited',
        title: `Pré-reserva: ${nomeCliente}`,
        categoria: categoria,
        slots: [novoSlot]
      };
    }

    try {
      const saved = JSON.parse(localStorage.getItem('rhuan_agenda_reservas') || '{}');
      saved[dateStr] = AgendaData[dateStr];
      localStorage.setItem('rhuan_agenda_reservas', JSON.stringify(saved));
    } catch (e) {
      // Ignora erro de quota
    }

    this.render();
    this.selectDate(dateStr);
  }

  bindEvents() {
    const prevBtn = document.getElementById('prevMonthBtn');
    const nextBtn = document.getElementById('nextMonthBtn');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() - 1);
        this.render();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.currentDate.setMonth(this.currentDate.getMonth() + 1);
        this.render();
      });
    }

    const requestDateBtn = document.getElementById('requestDateBtn');
    if (requestDateBtn) {
      requestDateBtn.addEventListener('click', () => {
        this.handleDateBooking();
      });
    }
  }

  render() {
    const monthTitle = document.getElementById('agendaMonthTitle');
    const daysGrid = document.getElementById('calendarDaysGrid');
    if (!daysGrid) return;

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    if (monthTitle) {
      monthTitle.textContent = `${this.monthNames[month]} de ${year}`;
    }

    daysGrid.innerHTML = '';

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Células vazias anteriores
    for (let i = 0; i < firstDayIndex; i++) {
      const emptyDiv = document.createElement('div');
      emptyDiv.className = 'calendar-day empty';
      daysGrid.appendChild(emptyDiv);
    }

    // Dias do mês
    for (let day = 1; day <= totalDays; day++) {
      const dayDiv = document.createElement('div');
      const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const dayData = AgendaData[dayStr];
      let statusClass = 'available';
      let statusText = 'Livre';
      let statusShort = 'Livre';

      if (dayData) {
        statusClass = dayData.status;
        if (dayData.status === 'booked') { statusText = 'Ocupado'; statusShort = 'Ocup.'; }
        if (dayData.status === 'limited') { statusText = 'Vagas'; statusShort = 'Vagas'; }
      }

      dayDiv.className = `calendar-day ${statusClass}`;
      if (this.selectedDateStr === dayStr) {
        dayDiv.classList.add('selected');
      }

      dayDiv.innerHTML = `
        <span class="day-number">${day}</span>
        <span class="day-badge">
          <span class="badge-text-full">${statusText}</span>
          <span class="badge-text-short">${statusShort}</span>
          <span class="badge-dot"></span>
        </span>
      `;

      dayDiv.addEventListener('click', () => {
        this.selectDate(dayStr);
      });

      daysGrid.appendChild(dayDiv);
    }
  }

  selectDate(dayStr) {
    this.selectedDateStr = dayStr;

    // Atualiza classe no DOM
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    const allDays = document.querySelectorAll('.calendar-day:not(.empty)');
    const dayNum = parseInt(dayStr.split('-')[2], 10);
    if (allDays[dayNum - 1]) {
      allDays[dayNum - 1].classList.add('selected');
    }

    // Atualiza Painel Lateral
    const [year, month, day] = dayStr.split('-');
    const dateObj = new Date(year, parseInt(month, 10) - 1, day);
    const dayOfWeek = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'][dateObj.getDay()];

    const displaySelectedDate = document.getElementById('selectedDateFormatted');
    const displaySelectedStatus = document.getElementById('selectedDateStatus');
    const slotListContainer = document.getElementById('agendaSlotList');

    if (displaySelectedDate) {
      displaySelectedDate.textContent = `${day} de ${this.monthNames[parseInt(month, 10) - 1]}, ${year}`;
    }

    if (displaySelectedStatus) {
      displaySelectedStatus.textContent = dayOfWeek;
    }

    if (slotListContainer) {
      slotListContainer.innerHTML = '';
      const dayData = AgendaData[dayStr];

      if (dayData && dayData.slots && dayData.slots.length > 0) {
        dayData.slots.forEach(slot => {
          const item = document.createElement('div');
          item.className = 'event-slot-item';
          item.innerHTML = `
            <span class="event-slot-time">${slot.time}</span>
            <span class="event-slot-desc">${slot.desc}</span>
          `;
          slotListContainer.appendChild(item);
        });
      } else {
        // Dia livre sem agendamentos
        const item = document.createElement('div');
        item.className = 'event-slot-item';
        item.innerHTML = `
          <span class="event-slot-time">Dia Disponível</span>
          <span class="event-slot-desc" style="color: var(--status-available);">Agenda 100% livre para ensaio ou festa</span>
        `;
        slotListContainer.appendChild(item);
      }
    }
  }

  handleDateBooking() {
    if (!this.selectedDateStr) return;
    const [year, month, day] = this.selectedDateStr.split('-');
    const formatted = `${day}/${month}/${year}`;

    // Pré-preenche o campo de data do formulário de orçamento e rola suavemente até ele
    const dateInput = document.getElementById('orcamentoData');
    if (dateInput) {
      dateInput.value = this.selectedDateStr;
    }

    const orcamentoSection = document.getElementById('orcamentos') || document.getElementById('contato');
    if (orcamentoSection) {
      orcamentoSection.scrollIntoView({ behavior: 'smooth' });
      if (window.showToast) {
        window.showToast(`Data ${formatted} selecionada para o seu orçamento!`);
      }
    } else {
      window.location.href = `orcamentos.html?data=${this.selectedDateStr}`;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.agendaApp = new AgendaController();
});
