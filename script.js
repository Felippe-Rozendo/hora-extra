// ─── STATE ─────────────────────────────────────────────────
let contrato = 'CLT';
let horaCount = 0;
let horas = [];

// ─── TOAST ──────────────────────────────────────────────────
function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">&#9888;</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3100);
}

// ─── CUSTOM SELECT ──────────────────────────────────────────
function initCustomSelects() {
  document.querySelectorAll('select').forEach(select => {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-select-wrapper';
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    const trigger = document.createElement('div');
    trigger.className = 'custom-select-trigger';

    const triggerText = document.createElement('span');
    triggerText.className = 'custom-select-text';
    triggerText.textContent = select.options[select.selectedIndex]?.text || '';

    const triggerArrow = document.createElement('span');
    triggerArrow.className = 'custom-select-arrow';
    triggerArrow.innerHTML = `<svg width="11" height="7" viewBox="0 0 11 7" fill="none"><path d="M1 1L5.5 5.5L10 1" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

    trigger.appendChild(triggerText);
    trigger.appendChild(triggerArrow);
    wrapper.appendChild(trigger);

    const optionsList = document.createElement('div');
    optionsList.className = 'custom-select-options';

    Array.from(select.options).forEach((opt, i) => {
      const optEl = document.createElement('div');
      optEl.className = 'custom-select-option' + (i === select.selectedIndex ? ' selected' : '');
      optEl.textContent = opt.text;
      optEl.dataset.value = opt.value;

      optEl.addEventListener('click', () => {
        select.value = opt.value;
        triggerText.textContent = opt.text;
        optionsList.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
        optEl.classList.add('selected');
        wrapper.classList.remove('open');
        select.dispatchEvent(new Event('change', { bubbles: true }));
      });

      optionsList.appendChild(optEl);
    });

    wrapper.appendChild(optionsList);

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('open');
      document.querySelectorAll('.custom-select-wrapper.open').forEach(w => w.classList.remove('open'));
      if (!isOpen) wrapper.classList.add('open');
    });
  });

}

// ─── CUSTOM DATE PICKER ──────────────────────────────────────
function fmtDateDisplay(isoStr) {
  if (!isoStr) return '';
  const [y, m, d] = isoStr.split('-');
  return `${d}/${m}/${y}`;
}

function openDatepicker(horaId, e) {
  e.stopPropagation();
  const wrapper = document.getElementById(`dp-wrapper-${horaId}`);
  const isOpen = wrapper.classList.contains('open');
  document.querySelectorAll('.custom-datepicker-wrapper.open').forEach(w => w.classList.remove('open'));
  document.querySelectorAll('.custom-select-wrapper.open').forEach(w => w.classList.remove('open'));
  if (!isOpen) {
    const input = document.getElementById(`data-${horaId}`);
    const parts = (input.value || new Date().toISOString().split('T')[0]).split('-').map(Number);
    renderCalendar(horaId, parts[0], parts[1]);
    wrapper.classList.add('open');
  }
}

function renderCalendar(horaId, year, month) {
  const popup = document.getElementById(`dp-popup-${horaId}`);
  const input = document.getElementById(`data-${horaId}`);
  const selectedValue = input.value;
  const today = new Date().toISOString().split('T')[0];

  const monthNames = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const weekdays = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

  const firstDay = new Date(year, month - 1, 1).getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const prevMonthDays = new Date(year, month - 1, 0).getDate();

  const prevYear = month === 1 ? year - 1 : year;
  const prevMonth = month === 1 ? 12 : month - 1;
  const nextYear = month === 12 ? year + 1 : year;
  const nextMonth = month === 12 ? 1 : month + 1;

  let dayCells = '';

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const dateStr = `${prevYear}-${String(prevMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    dayCells += `<div class="dp-day other-month${dateStr === selectedValue ? ' selected' : ''}" onclick="selectDate(${horaId}, '${dateStr}')">${d}</div>`;
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    let cls = 'dp-day';
    if (dateStr === today) cls += ' today';
    if (dateStr === selectedValue) cls += ' selected';
    dayCells += `<div class="${cls}" onclick="selectDate(${horaId}, '${dateStr}')">${d}</div>`;
  }

  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  for (let d = 1; d <= totalCells - firstDay - daysInMonth; d++) {
    const dateStr = `${nextYear}-${String(nextMonth).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    dayCells += `<div class="dp-day other-month${dateStr === selectedValue ? ' selected' : ''}" onclick="selectDate(${horaId}, '${dateStr}')">${d}</div>`;
  }

  popup.innerHTML = `
    <div class="dp-header">
      <button class="dp-nav-btn" onclick="renderCalendar(${horaId}, ${prevYear}, ${prevMonth})" type="button">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="dp-month-year">${monthNames[month - 1]} ${year}</span>
      <button class="dp-nav-btn" onclick="renderCalendar(${horaId}, ${nextYear}, ${nextMonth})" type="button">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </button>
    </div>
    <div class="dp-weekdays">${weekdays.map(w => `<div class="dp-weekday">${w}</div>`).join('')}</div>
    <div class="dp-days">${dayCells}</div>
  `;
}

function selectDate(horaId, dateStr) {
  const input = document.getElementById(`data-${horaId}`);
  const display = document.getElementById(`dp-display-${horaId}`);
  const wrapper = document.getElementById(`dp-wrapper-${horaId}`);
  input.value = dateStr;
  display.textContent = fmtDateDisplay(dateStr);
  wrapper.classList.remove('open');
  input.dispatchEvent(new Event('change', { bubbles: true }));
}

// ─── INICIALIZAÇÃO ─────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  initCustomSelects();
  addHora();
  document.getElementById('salario').addEventListener('input', checkSalario);
  document.addEventListener('click', () => {
    document.querySelectorAll('.custom-datepicker-wrapper.open').forEach(w => w.classList.remove('open'));
    document.querySelectorAll('.custom-select-wrapper.open').forEach(w => w.classList.remove('open'));
  });
});

function checkSalario() {
  const val = parseFloat(document.getElementById('salario').value);
  const alerta = document.getElementById('alert-salario');
  alerta.style.display = (val && val < 1621) ? 'block' : 'none';
}

function limparSalario() {
  document.getElementById('salario').value = '';
  document.getElementById('alert-salario').style.display = 'none';
}

// ─── CONTRATO ───────────────────────────────────────────────
function setContrato(tipo) {
  contrato = tipo;
  document.getElementById('btn-clt').className = 'contrato-btn' + (tipo === 'CLT' ? ' active-clt' : '');
  document.getElementById('btn-pj').className  = 'contrato-btn' + (tipo === 'PJ'  ? ' active-pj'  : '');
  document.getElementById('pj-info').classList.toggle('visible', tipo === 'PJ');
}

function updatePJInfo() { /* hook para futuros ajustes */ }

// ─── HORAS ──────────────────────────────────────────────────
function addHora() {
  horaCount++;
  const id = horaCount;
  horas.push(id);

  const today = new Date().toISOString().split('T')[0];
  const container = document.getElementById('horas-container');
  const div = document.createElement('div');
  div.className = 'hora-card';
  div.id = `hora-${id}`;
  div.innerHTML = `
    <div class="hora-card-header">
      <span class="hora-badge">#${String(id).padStart(2,'0')}</span>
      <div style="display:flex; align-items:center; gap:8px;">
        <span class="hora-tipo-badge tipo-dia" id="tipo-badge-${id}">Diurna</span>
        <button class="hora-remove-btn" onclick="removeHora(${id})" title="Remover">&#10005;</button>
      </div>
    </div>
    <div class="hora-grid">
      <div class="field">
        <label>Data</label>
        <div class="custom-datepicker-wrapper" id="dp-wrapper-${id}">
          <input type="hidden" id="data-${id}" value="${today}" onchange="updateTipoBadge(${id})" />
          <div class="custom-datepicker-trigger" onclick="openDatepicker(${id}, event)">
            <span class="dp-display" id="dp-display-${id}">${fmtDateDisplay(today)}</span>
            <span class="dp-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="16" y1="2" x2="16" y2="6"/></svg></span>
          </div>
          <div class="custom-datepicker-popup" id="dp-popup-${id}" onclick="event.stopPropagation()"></div>
        </div>
      </div>
      <div class="field">
        <label>Início</label>
        <input type="time" id="inicio-${id}" value="18:00" onchange="updateHoraResumo(${id})" />
      </div>
      <div class="field">
        <label>Fim</label>
        <input type="time" id="fim-${id}" value="20:00" onchange="updateHoraResumo(${id})" />
      </div>
    </div>
    <div class="field mt8">
      <label>Justificativa</label>
      <textarea id="just-${id}" placeholder="Ex: Suporte ao cliente / Entrega do projeto X"></textarea>
    </div>
    <div class="hora-resumo" id="resumo-${id}">
      <div class="resumo-item">
        <span class="resumo-label">Duração</span>
        <span class="resumo-value" id="dur-${id}">—</span>
      </div>
      <div class="resumo-item">
        <span class="resumo-label">Tipo</span>
        <span class="resumo-value amber" id="tipotxt-${id}">—</span>
      </div>
      <div class="resumo-item">
        <span class="resumo-label">Adicional</span>
        <span class="resumo-value" id="adicional-${id}">—</span>
      </div>
    </div>
  `;
  container.appendChild(div);
  updateTipoBadge(id);
  updateHoraResumo(id);
}

function removeHora(id) {
  const el = document.getElementById(`hora-${id}`);
  if (el) el.remove();
  horas = horas.filter(h => h !== id);
}

function resetHoras() {
  horas.forEach(id => {
    const el = document.getElementById(`hora-${id}`);
    if (el) el.remove();
  });
  horas = [];
  horaCount = 0;
  document.getElementById('resultado').style.display = 'none';
  addHora();
}

function getTipoHora(dataStr, inicioStr, fimStr) {
  const data = new Date(dataStr + 'T00:00:00');
  const dow = data.getDay();
  if (dow === 0) return 'domingo';

  const [hiH, hiM] = inicioStr.split(':').map(Number);
  const [hfH, hfM] = fimStr.split(':').map(Number);
  const inicioMin = hiH * 60 + hiM;
  const fimMin = hfH * 60 + hfM + (hfH * 60 + hfM < inicioMin ? 24 * 60 : 0);

  const noiteIni = 22 * 60;
  const noiteFim = 29 * 60;

  const crossesDayNight = (inicioMin < noiteIni && fimMin > noiteIni) ||
                          (inicioMin >= noiteIni && fimMin > noiteFim);

  if (inicioMin >= noiteIni || (inicioMin < 5 * 60)) return 'noite';
  if (crossesDayNight) return 'dia-noite';
  return 'dia';
}

function getTipoLabel(tipo) {
  return { dia: 'Diurna', noite: 'Noturna', 'dia-noite': 'Mista', domingo: 'Dom/Feriado' }[tipo] || 'Diurna';
}

function getAdicionalLabel(tipo) {
  return {
    dia: '+50% (Art. 59)',
    noite: '+70% (HE + Not.)',
    'dia-noite': '+50% / +70% (misto)',
    domingo: '+100% (Art. 59-B)'
  }[tipo] || '+50%';
}

function updateTipoBadge(id) {
  const data  = document.getElementById(`data-${id}`)?.value;
  const inicio = document.getElementById(`inicio-${id}`)?.value;
  const fim   = document.getElementById(`fim-${id}`)?.value;
  if (!data || !inicio || !fim) return;
  const tipo = getTipoHora(data, inicio, fim);
  const badge = document.getElementById(`tipo-badge-${id}`);
  if (!badge) return;
  badge.className = 'hora-tipo-badge tipo-' + tipo;
  badge.textContent = getTipoLabel(tipo);
  updateHoraResumo(id);
}

function getDuracao(inicioStr, fimStr) {
  const [hiH, hiM] = inicioStr.split(':').map(Number);
  const [hfH, hfM] = fimStr.split(':').map(Number);
  let inicioMin = hiH * 60 + hiM;
  let fimMin = hfH * 60 + hfM;
  if (fimMin <= inicioMin) fimMin += 24 * 60;
  return fimMin - inicioMin;
}

function minToHHMM(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h${m > 0 ? m + 'm' : ''}`;
}

function updateHoraResumo(id) {
  const data  = document.getElementById(`data-${id}`)?.value;
  const inicio = document.getElementById(`inicio-${id}`)?.value;
  const fim   = document.getElementById(`fim-${id}`)?.value;
  if (!data || !inicio || !fim) return;

  const durMin = getDuracao(inicio, fim);
  const tipo = getTipoHora(data, inicio, fim);

  const durEl      = document.getElementById(`dur-${id}`);
  const tipoEl     = document.getElementById(`tipotxt-${id}`);
  const adicionalEl = document.getElementById(`adicional-${id}`);
  const badge      = document.getElementById(`tipo-badge-${id}`);

  if (durEl)      durEl.textContent = minToHHMM(durMin);
  if (tipoEl)     tipoEl.textContent = getTipoLabel(tipo);
  if (adicionalEl) adicionalEl.textContent = getAdicionalLabel(tipo);
  if (badge) {
    badge.className = `hora-tipo-badge tipo-${tipo}`;
    badge.textContent = getTipoLabel(tipo);
  }
}

// ─── CÁLCULO INSS 2026 ──────────────────────────────────────
function calcINSS(bruto) {
  const faixas = [
    { ate: 1621.00, aliq: 0.075 },
    { ate: 2902.84, aliq: 0.09  },
    { ate: 4354.27, aliq: 0.12  },
    { ate: 7786.02, aliq: 0.14  },
  ];
  const base = Math.min(bruto, 7786.02);
  let total = 0, prev = 0;
  for (const f of faixas) {
    if (base <= prev) break;
    total += (Math.min(base, f.ate) - prev) * f.aliq;
    prev = f.ate;
  }
  return total;
}

// ─── CÁLCULO IRRF 2026 ──────────────────────────────────────
function calcIRRF(bruto, inss, dependentes) {
  const base = bruto - inss - (dependentes * 189.59);
  if (base <= 0) return 0;

  const tabela = [
    { ate: 2259.20,  aliq: 0,     deducao: 0      },
    { ate: 2826.65,  aliq: 0.075, deducao: 169.44 },
    { ate: 3751.05,  aliq: 0.15,  deducao: 381.44 },
    { ate: 4664.68,  aliq: 0.225, deducao: 662.77 },
    { ate: Infinity, aliq: 0.275, deducao: 896.00 },
  ];

  let irrf = 0;
  for (const f of tabela) {
    if (base <= f.ate) {
      irrf = Math.max(0, base * f.aliq - f.deducao);
      break;
    }
  }

  if (base <= 5000) {
    irrf = 0;
  } else if (base <= 7350) {
    irrf = Math.max(0, irrf - (978.62 - 0.133145 * base));
  }

  return Math.max(0, irrf);
}

// ─── CÁLCULO PRINCIPAL ──────────────────────────────────────
function calcular() {
  const nome       = document.getElementById('nome').value.trim();
  const salarioBase = parseFloat(document.getElementById('salario').value);
  const carga      = parseInt(document.getElementById('carga').value);
  const dependentes = parseInt(document.getElementById('dependentes').value) || 0;

  if (!nome)                      { showToast('Informe seu nome completo.'); return; }
  if (!salarioBase || salarioBase <= 0) { showToast('Informe o salário bruto.'); return; }
  if (horas.length === 0)         { showToast('Adicione ao menos um período de horas extras.'); return; }

  const registros = [];
  for (const id of horas) {
    const data  = document.getElementById(`data-${id}`)?.value;
    const inicio = document.getElementById(`inicio-${id}`)?.value;
    const fim   = document.getElementById(`fim-${id}`)?.value;
    const just  = document.getElementById(`just-${id}`)?.value || '';
    if (!data || !inicio || !fim) continue;
    const durMin = getDuracao(inicio, fim);
    const tipo = getTipoHora(data, inicio, fim);
    registros.push({ id, data, inicio, fim, durMin, tipo, just });
  }

  if (registros.length === 0) { showToast('Nenhum registro de hora extra válido.'); return; }

  const valorHora = salarioBase / carga;

  const adicionalPorTipo = {
    dia: 0.50,
    noite: 0.70,
    'dia-noite': 0.60,
    domingo: 1.00,
  };

  let totalHEValor = 0;
  const detalhes = [];

  for (const r of registros) {
    const horasQ  = r.durMin / 60;
    const adicional = adicionalPorTipo[r.tipo] ?? 0.50;
    const valorHE = valorHora * (1 + adicional) * horasQ;
    totalHEValor += valorHE;
    detalhes.push({ ...r, horas: horasQ, adicional, valorHE });
  }

  const dsr = (totalHEValor / 22) * 8;
  const totalBruto = salarioBase + totalHEValor + dsr;

  let liquido, inss = 0, irrf = 0;
  let breakdownItems = [];

  if (contrato === 'CLT') {
    inss = calcINSS(totalBruto);
    irrf = calcIRRF(totalBruto, inss, dependentes);
    liquido = totalBruto - inss - irrf;

    breakdownItems = [
      { label: 'Salário Base',  value: salarioBase,  cls: '',         type: '' },
      { label: 'Horas Extras',  value: totalHEValor, cls: 'positive', type: 'positive' },
      { label: 'DSR s/ HE',     value: dsr,          cls: 'positive', type: 'positive' },
      { label: 'Total Bruto',   value: totalBruto,   cls: 'neutral',  type: 'neutral'  },
      { label: 'INSS',          value: -inss,        cls: 'negative', type: 'negative' },
      { label: 'IRRF',          value: -irrf,        cls: 'negative', type: 'negative' },
    ];
  } else {
    const iss  = parseFloat(document.getElementById('pj-iss').value)  / 100 || 0.05;
    const irpj = parseFloat(document.getElementById('pj-irpj').value) / 100 || 0.06;
    const pis  = parseFloat(document.getElementById('pj-pis').value)  / 100 || 0.0365;
    const totalImp = iss + irpj + pis;
    const totalBrutoPJ = salarioBase + totalHEValor;
    const impostosPJ = totalBrutoPJ * totalImp;
    const inssProLabore = 1621 * 0.11;
    liquido = totalBrutoPJ - impostosPJ - inssProLabore;

    breakdownItems = [
      { label: 'Valor Base NF',                             value: salarioBase,    cls: '',         type: '' },
      { label: 'HE (sem DSR — PJ)',                         value: totalHEValor,   cls: 'positive', type: 'positive' },
      { label: 'Total NF',                                  value: totalBrutoPJ,   cls: 'neutral',  type: 'neutral'  },
      { label: `ISS+IRPJ+PIS/COFINS (${Math.round(totalImp*100)}%)`, value: -impostosPJ, cls: 'negative', type: 'negative' },
      { label: 'INSS Pro-labore (11%)',                     value: -inssProLabore, cls: 'negative', type: 'negative' },
    ];
  }

  // ─── RENDER ─────────────────────────────────────────────
  const resultadoEl = document.getElementById('resultado');
  resultadoEl.style.display = 'block';
  resultadoEl.classList.remove('visible');
  void resultadoEl.offsetWidth;
  resultadoEl.classList.add('visible');
  resultadoEl.scrollIntoView({ behavior: 'smooth', block: 'start' });

  document.getElementById('valor-liquido').textContent = fmtBRL(liquido);
  document.getElementById('resultado-nome-contrato').textContent = `${nome} \u00b7 ${contrato}`;

  document.getElementById('breakdown-grid').innerHTML = breakdownItems.map(i => `
    <div class="breakdown-item ${i.type ? i.type + '-item' : ''}">
      <span class="breakdown-label">${i.label}</span>
      <span class="breakdown-value ${i.cls}">${i.value < 0 ? '&minus; ' + fmtBRL(-i.value) : fmtBRL(i.value)}</span>
    </div>
  `).join('');

  document.getElementById('he-detalhe-list').innerHTML = detalhes.map(d => `
    <div class="he-detalhe-item">
      <span class="he-detalhe-data">${fmtData(d.data)} &middot; ${getDiaSemana(d.data)}</span>
      <span class="hora-tipo-badge tipo-${d.tipo}">${getTipoLabel(d.tipo)}</span>
      <span style="color:var(--text2); font-size:12px; font-family:var(--mono);">${d.inicio}&ndash;${d.fim} = ${minToHHMM(d.durMin)}</span>
      <span class="he-detalhe-valor">+ ${fmtBRL(d.valorHE)}</span>
    </div>
  `).join('');

  document.getElementById('mensagem-texto').textContent = buildMensagemRH(nome, contrato, detalhes);
}

// ─── MENSAGEM RH ────────────────────────────────────────────
function buildMensagemRH(nome, contrato, detalhes) {
  let msg = '';
  if (detalhes.length === 1) {
    const d = detalhes[0];
    msg += `${nome} (${contrato})\n\n`;
    msg += `Data: ${fmtData(d.data)} - ${getDiaSemana(d.data)}\n`;
    msg += `Período: ${getTipoLabel(d.tipo)}\n`;
    msg += `Quantidade: ${d.inicio}h – ${d.fim}h = ${minToHHMM(d.durMin)}\n`;
    msg += `Justificativa: ${d.just || '—'}\n`;
  } else {
    msg += `${nome} (${contrato})\n`;
    let totalGeral = 0;
    for (const d of detalhes) {
      totalGeral += d.durMin;
      msg += `\nData: ${fmtData(d.data)} - ${getDiaSemana(d.data)}\n`;
      msg += `Período: ${getTipoLabel(d.tipo)}\n`;
      msg += `Quantidade: ${d.inicio}h – ${d.fim}h = ${minToHHMM(d.durMin)}\n`;
      msg += `Justificativa: ${d.just || '—'}\n`;
    }
    msg += `\nTotal de Horas Extras: ${minToHHMM(totalGeral)}\n`;
  }
  return msg;
}

function copiarMensagem() {
  const texto = document.getElementById('mensagem-texto').textContent;
  navigator.clipboard.writeText(texto).then(() => {
    const btn = document.getElementById('btn-copy');
    btn.textContent = '\u2713 Copiado';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copiar';
      btn.classList.remove('copied');
    }, 2000);
  });
}

// ─── UTILS ──────────────────────────────────────────────────
function fmtBRL(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtData(dateStr) {
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

function getDiaSemana(dateStr) {
  const dias = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
  return dias[new Date(dateStr + 'T00:00:00').getDay()];
}
