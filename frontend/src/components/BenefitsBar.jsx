import React from 'react';

const BenefitsBar = () => (
  <div style={{
    backgroundColor: '#FF2D2D',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'sticky',
    top: 0,
    zIndex: 100, /* encima del navbar */
    flexShrink: 0,
    padding: '0 16px',
    boxSizing: 'border-box',
  }}>
    <style>{`
      .benefits-text {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        color: #FFFFFF;
        text-align: center;
        white-space: nowrap;
      }
      .benefits-mobile {
        display: none;
      }
      .benefits-desktop {
        display: block;
      }
      @media (max-width: 768px) {
        .benefits-text {
          font-size: 11px;
        }
        .benefits-desktop {
          display: none;
        }
        .benefits-mobile {
          display: block;
        }
      }
    `}</style>
    <div className="benefits-text benefits-desktop">
      ★ ENVÍOS A TODO EL PAÍS ★ PAGOS EN CUOTAS CON MERCADO PAGO ★ DEVOLUCIONES SIN COSTO ★
    </div>
    <div className="benefits-text benefits-mobile">
      ★ ENVÍOS A TODO EL PAÍS ★ CUOTAS SIN INTERÉS ★
    </div>
  </div>
);

export default BenefitsBar;
