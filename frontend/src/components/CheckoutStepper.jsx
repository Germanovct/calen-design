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
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: currentStep >= step.number ? 'var(--dark-black)' : 'var(--white)',
              color: currentStep >= step.number ? 'var(--white)' : 'var(--gray-medium)',
              border: `2px solid ${currentStep >= step.number ? 'var(--dark-black)' : 'var(--gray-light)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'var(--transition)'
            }}>
              {step.number}
            </div>
            <span style={{
              fontSize: '12px',
              fontWeight: currentStep === step.number ? '600' : '400',
              color: currentStep === step.number ? 'var(--dark-black)' : 'var(--gray-medium)',
              marginTop: '8px',
              whiteSpace: 'nowrap',
              position: 'absolute',
              top: '40px'
            }}>
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div style={{
              flex: '1',
              maxWidth: '120px',
              height: '2px',
              backgroundColor: currentStep > step.number ? 'var(--dark-black)' : 'var(--gray-light)',
              margin: '0 12px',
              transform: 'translateY(-12px)',
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
