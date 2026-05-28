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
      {steps.map((step, index) => {
        const isCompletedOrActive = currentStep >= step.number;
        const isActive = currentStep === step.number;
        
        return (
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
                backgroundColor: isCompletedOrActive ? 'var(--accent-lima)' : '#111',
                color: isCompletedOrActive ? 'var(--black)' : 'var(--gray-text)',
                border: isCompletedOrActive ? '1px solid var(--accent-lima)' : '1px solid #333',
                boxShadow: isCompletedOrActive ? '2px 2px 0px var(--white)' : 'none',
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
                color: isActive ? 'var(--accent-lima)' : 'var(--gray-text)',
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
                backgroundColor: currentStep > step.number ? 'var(--accent-lima)' : '#333',
                margin: '0 12px',
                transform: 'translateY(-16px)',
                transition: 'var(--transition)',
                zIndex: 1
              }} />
            )}
          </React.Fragment>
        );
      })}
      <div style={{ height: '24px' }}></div> {/* Spacer for absolute labels */}
    </div>
  );
};

export default CheckoutStepper;
