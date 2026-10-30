// Fuentes como en socioemociograma: autoalojadas con @fontsource (solo Inter 400/500: una única tipografía, sin serif ni cursivas, pedido de Rosario)
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/700.css'; // negritas (<strong>) en Inter real, sin negrita sintética
import './style.css';

import { initConsentScripts, registerConsentScript } from './cookies.js';

// GA4 con Consent v2 en modo básico: gtag NO se carga ni envía nada hasta que se acepta la categoría «Análisis».
// GA4_ID pendiente de Rosario/Joaquín: cuando llegue, ponerlo aquí y el resto ya está cableado.
// En el borrador (*.sslip.io) y en local NO se carga GA4 nunca, para no ensuciar las estadísticas.
const GA4_ID = 'G-XXXXXXXXXX';
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
