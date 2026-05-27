import React from 'react';

const TICKER_TEXT = 'ENVÍOS A TODO EL PAÍS — PAGOS EN CUOTAS CON MERCADO PAGO — DISEÑO INDEPENDIENTE — HECHO EN ARGENTINA — DEVOLUCIONES SIN COSTO — ';

const BenefitsBar = () => (
  <div style={{
    backgroundColor: '#FF2D2D',
    height: '36px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100, /* encima del navbar */
    flexShrink: 0,
  }}>
    <style>{`
      @keyframes benefits-scroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .benefits-track {
        display: flex;
        white-space: nowrap;
        animation: benefits-scroll 60s linear infinite;
        will-change: transform;
      }
      .benefits-item {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: #FFFFFF;
        padding: 0 2px;
      }
    `}</style>
    <div className="benefits-track">
      {[...Array(8)].map((_, i) => (
        <span key={i} className="benefits-item">{TICKER_TEXT}</span>
      ))}
    </div>
  </div>
);

export default BenefitsBar;
