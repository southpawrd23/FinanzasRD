/* ============================================
   FinanzasRD - JavaScript
   Calculadoras, menú, modales, interacciones
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // MENÚ MÓVIL
  // ==========================================
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('mainNav');
  const links = nav.querySelectorAll('.header__link');

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });

  // ==========================================
  // HEADER SCROLL EFFECT
  // ==========================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 2px 24px rgba(0,0,0,0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  // ==========================================
  // CALCULADORA 1: Ahorro Mensual
  // ==========================================
  function calcAhorro(monto, meses) {
    return monto * meses;
  }

  // ==========================================
  // CALCULADORA 2: Interés Compuesto
  // Fórmula: M = C(1+r)^n + A * [((1+r)^n - 1) / r]
  // donde r = tasa mensual, n = meses totales
  // ==========================================
  function calcInteresCompuesto(capital, aporte, tasaAnual, anios) {
    const r = tasaAnual / 100 / 12;
    const n = anios * 12;
    if (r === 0) {
      return capital + aporte * n;
    }
    const futuroCapital = capital * Math.pow(1 + r, n);
    const futuroAportes = aporte * ((Math.pow(1 + r, n) - 1) / r);
    return futuroCapital + futuroAportes;
  }

  // ==========================================
  // CALCULADORA 3: Préstamo (Cuota Fija)
  // Fórmula francesa:
  // Cuota = P * [r(1+r)^n] / [(1+r)^n - 1]
  // donde r = tasa mensual, n = meses
  // ==========================================
  function calcPrestamo(monto, interesAnual, meses) {
    const r = interesAnual / 100 / 12;
    if (r === 0) {
      return monto / meses;
    }
    const factor = Math.pow(1 + r, meses);
    return monto * (r * factor) / (factor - 1);
  }

  // ==========================================
  // CALCULADORA 4: Conversor Dólar
  // ==========================================
  function calcConversor(dolares, tasa) {
    return dolares * tasa;
  }

  // ==========================================
  // FORMATO DE MONEDA
  // ==========================================
  function formatMoney(valor) {
    return 'RD$ ' + Math.round(valor).toLocaleString('es-DO');
  }

  function formatMoneyShort(valor) {
    if (valor >= 1000000) {
      return 'RD$ ' + (valor / 1000000).toFixed(2) + 'M';
    }
    return 'RD$ ' + Math.round(valor).toLocaleString('es-DO');
  }

  // ==========================================
  // CONECTAR BOTONES
  // ==========================================
  document.querySelectorAll('.calcular-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.calc;

      switch (type) {
        case 'ahorro': {
          const monto = parseFloat(document.getElementById('ahorroMonto').value) || 0;
          const meses = parseInt(document.getElementById('ahorroMeses').value) || 1;
          const total = calcAhorro(monto, meses);
          document.querySelector('#ahorroResult .result-value').textContent = formatMoney(total);
          break;
        }

        case 'compuesto': {
          const capital = parseFloat(document.getElementById('compCapital').value) || 0;
          const aporte = parseFloat(document.getElementById('compAporte').value) || 0;
          const tasa = parseFloat(document.getElementById('compTasa').value) || 0;
          const anios = parseInt(document.getElementById('compAnios').value) || 1;
          const total = calcInteresCompuesto(capital, aporte, tasa, anios);
          document.querySelector('#compResult .result-value').textContent = formatMoneyShort(total);
          break;
        }

        case 'prestamo': {
          const monto = parseFloat(document.getElementById('prestamoMonto').value) || 0;
          const interes = parseFloat(document.getElementById('prestamoInteres').value) || 0;
          const plazo = parseInt(document.getElementById('prestamoPlazo').value) || 1;
          const cuota = calcPrestamo(monto, interes, plazo);
          document.querySelector('#prestamoResult .result-value').textContent = formatMoney(cuota);
          break;
        }

        case 'conversor': {
          const dolares = parseFloat(document.getElementById('convDolares').value) || 0;
          const tasa = parseFloat(document.getElementById('convTasa').value) || 0;
          const total = calcConversor(dolares, tasa);
          document.querySelector('#convResult .result-value').textContent = 'RD$ ' + total.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          break;
        }
      }
    });
  });

  // ==========================================
  // TASA USD/DOP EN VIVO
  // ==========================================
  function fetchLiveRate() {
    const tasaInput = document.getElementById('convTasa');
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        if (data && data.rates && data.rates.DOP) {
          const rate = data.rates.DOP;
          tasaInput.value = rate.toFixed(2);
          // Actualizar resultado
          const dolares = parseFloat(document.getElementById('convDolares').value) || 0;
          const total = calcConversor(dolares, rate);
          document.querySelector('#convResult .result-value').textContent = 'RD$ ' + total.toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
      })
      .catch(() => {
        // Si falla la API, se mantiene el valor por defecto
      });
  }

  fetchLiveRate();

  // ==========================================
  // CÁLCULOS INICIALES (al cargar)
  // ==========================================
  function runInitialCalculations() {
    // Ahorro
    const aMonto = parseFloat(document.getElementById('ahorroMonto').value) || 0;
    const aMeses = parseInt(document.getElementById('ahorroMeses').value) || 1;
    document.querySelector('#ahorroResult .result-value').textContent = formatMoney(calcAhorro(aMonto, aMeses));

    // Compuesto
    const cCapital = parseFloat(document.getElementById('compCapital').value) || 0;
    const cAporte = parseFloat(document.getElementById('compAporte').value) || 0;
    const cTasa = parseFloat(document.getElementById('compTasa').value) || 0;
    const cAnios = parseInt(document.getElementById('compAnios').value) || 1;
    document.querySelector('#compResult .result-value').textContent = formatMoneyShort(calcInteresCompuesto(cCapital, cAporte, cTasa, cAnios));

    // Préstamo
    const pMonto = parseFloat(document.getElementById('prestamoMonto').value) || 0;
    const pInteres = parseFloat(document.getElementById('prestamoInteres').value) || 0;
    const pPlazo = parseInt(document.getElementById('prestamoPlazo').value) || 1;
    document.querySelector('#prestamoResult .result-value').textContent = formatMoney(calcPrestamo(pMonto, pInteres, pPlazo));

    // Conversor
    const dDolares = parseFloat(document.getElementById('convDolares').value) || 0;
    const dTasa = parseFloat(document.getElementById('convTasa').value) || 0;
    document.querySelector('#convResult .result-value').textContent = 'RD$ ' + calcConversor(dDolares, dTasa).toLocaleString('es-DO', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  runInitialCalculations();

  // Recalcular al cambiar inputs (Enter)
  document.querySelectorAll('.calculadora__form input').forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const btn = input.closest('.calculadora__form').querySelector('.calcular-btn');
        if (btn) btn.click();
      }
    });
  });

  // ==========================================
  // COMPARADOR DE COOPERATIVAS
  // ==========================================
  const coopBody = document.getElementById('coopBody');
  const addBtn = document.getElementById('addCoopBtn');

  function addCoopRow(nombre = '', tasa = '', plazo = '', beneficio = '') {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><input type="text" value="${nombre}" class="coop-input" placeholder="Nombre"></td>
      <td><input type="number" value="${tasa}" class="coop-input" step="0.1" placeholder="0"></td>
      <td><input type="number" value="${plazo}" class="coop-input" placeholder="0"></td>
      <td><input type="number" value="${beneficio}" class="coop-input" step="100" placeholder="0"></td>
      <td><button class="btn-delete" aria-label="Eliminar">✕</button></td>
    `;
    tr.querySelector('.btn-delete').addEventListener('click', () => {
      tr.remove();
    });
    coopBody.appendChild(tr);
  }

  // Delete buttons for existing rows
  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('tr').remove();
    });
  });

  addBtn.addEventListener('click', () => {
    addCoopRow('', '', '', '');
  });

  // ==========================================
  // MODALES (Privacidad / Términos)
  // ==========================================
  const privacyModal = document.getElementById('privacyModal');
  const termsModal = document.getElementById('termsModal');
  const overlay = document.getElementById('modalOverlay');

  function openModal(modal) {
    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeAllModals() {
    privacyModal.classList.remove('active');
    termsModal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.getElementById('privacyLink').addEventListener('click', (e) => {
    e.preventDefault();
    openModal(privacyModal);
  });

  document.getElementById('termsLink').addEventListener('click', (e) => {
    e.preventDefault();
    openModal(termsModal);
  });

  document.getElementById('privacyClose').addEventListener('click', closeAllModals);
  document.getElementById('termsClose').addEventListener('click', closeAllModals);
  overlay.addEventListener('click', closeAllModals);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });

  // ==========================================
  // FORMULARIO DE CONTACTO
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('contactNombre').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const mensaje = document.getElementById('contactMensaje').value.trim();

    if (nombre && email && mensaje) {
      alert('✓ Mensaje enviado con éxito. Te responderemos pronto.');
      contactForm.reset();
    } else {
      alert('Por favor completa todos los campos.');
    }
  });

  // ==========================================
  // SMOOTH SCROLL (fallback si no soporta scroll-behavior)
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

});
