// Fuentes como en socioemociograma: autoalojadas con @fontsource (solo Inter 400/500: una única tipografía, sin serif ni cursivas, pedido de Rosario)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css'; // negritas (<strong>) en Inter real, sin negrita sintética
import './style.css';

import { initConsentScripts, registerConsentScript } from './cookies.js';

// GA4 con Consent v2 en modo básico: gtag NO se carga ni envía nada hasta que se acepta la categoría «Análisis».
// GA4_ID: flujo propio bap.habilmind.com (30/10/2026, OK Joaquín).
// En el borrador (*.sslip.io) y en local NO se carga GA4 nunca, para no ensuciar las estadísticas.
const GA4_ID = 'G-8S8THM06M9'; // flujo bap.habilmind.com en «habilmind sl» (properties/558016759), alta 30/10/2026
const ES_BORRADOR = location.hostname.endsWith('.sslip.io') || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const GA4_VALIDO = /^G-[A-Z0-9]{6,}$/.test(GA4_ID) && GA4_ID !== 'G-XXXXXXXXXX';

function gtag() { window.dataLayer.push(arguments); }

registerConsentScript('ga4', 'analisis', () => {
  if (ES_BORRADOR || !GA4_VALIDO) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = gtag;
  window['ga-disable-' + GA4_ID] = false;
  gtag('consent', 'default', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
  gtag('consent', 'update', { analytics_storage: 'granted' });
  const s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
  document.head.appendChild(s);
  gtag('js', new Date()); gtag('config', GA4_ID);
}, () => {
  // Si se retira el consentimiento: GA4 deja de medir y se borran sus cookies.
  if (!GA4_VALIDO) return;
  window['ga-disable-' + GA4_ID] = true;
  if (window.gtag) window.gtag('consent', 'update', { analytics_storage: 'denied' });
  const dom = location.hostname.split('.').slice(-2).join('.');
  document.cookie.split(';').map((c) => c.trim().split('=')[0]).filter((n) => /^_ga/.test(n)).forEach((n) => {
    [location.hostname, '.' + location.hostname, '.' + dom, ''].forEach((d) => {
      document.cookie = n + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
    });
  });
});

initConsentScripts();

// Menú hamburguesa de la cabecera (solo se ve en ≤860px; en escritorio el botón está oculto y el nav sigue igual).
(() => {
  const cab = document.querySelector('.cab');
  const btn = cab && cab.querySelector('.cab-menu');
  const nav = cab && cab.querySelector('#cab-nav');
  if (!btn || !nav) return;
  const set = (abierto, foco) => {
    cab.classList.toggle('abierto', abierto);
    btn.setAttribute('aria-expanded', String(abierto));
    if (foco) btn.focus();
  };
  btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && cab.classList.contains('abierto')) set(false, true); });
  document.addEventListener('click', (e) => { if (cab.classList.contains('abierto') && !cab.contains(e.target)) set(false); });
  window.matchMedia('(min-width:861px)').addEventListener('change', (m) => { if (m.matches) set(false); });
})();
