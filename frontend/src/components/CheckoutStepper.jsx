import React from 'react';

const CheckoutStepper = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Datos de Envío' },
    { number: 2, label: 'Resumen y Cotización' },
    { number: 3, label: 'Pasarela de Pago' }
  ];

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '32px 0 48px 0',
      width: '100%'
    }}>
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: currentStep >= step.number ? 'var(--primary-yellow)' : 'var(--white)',
              color: 'var(--black)',
              border: '3px solid #000000',
              boxShadow: currentStep >= step.number ? '3px 3px 0px #000000' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '900',
              fontFamily: 'var(--display)',
              fontSize: '15px',
              transition: 'var(--transition)'
            }}>
              {step.number}
            </div>
            <span style={{
              fontSize: '11px',
              fontWeight: '900',
              fontFamily: 'var(--display)',
              textTransform: 'uppercase',
              color: currentStep === step.number ? 'var(--primary-pink)' : 'var(--black)',
              marginTop: '8px',
              whiteSpace: 'nowrap',
              position: 'absolute',
              top: '44px'
            }}>
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div style={{
              flex: '1',
              maxWidth: '120px',
              height: '4px',
              backgroundColor: '#000000',
              margin: '0 12px',
              transform: 'translateY(-16px)',
              transition: 'var(--transition)',
              zIndex: 1
            }} />
          )}
        </React.Fragment>
      ))}
      <div style={{ height: '24px' }}></div> {/* Spacer for absolute labels */}
    </div>
  );
};

export default CheckoutStepper;
