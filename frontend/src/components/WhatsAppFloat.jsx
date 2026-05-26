import React, { useState } from 'react';

const WhatsAppFloat = () => {
  const phoneNumber = '5491166203840';
  const message = 'Hola! Vengo de la web de Calen Design y quería hacer una consulta.';
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        backgroundColor: isHovered ? 'var(--accent-lima)' : 'var(--bg-card)',
        color: isHovered ? 'var(--black)' : 'var(--accent-lima)',
        width: '56px',
        height: '56px',
        borderRadius: '0px',
        border: 'var(--border-brutal)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isHovered ? '2px 2px 0px var(--white)' : 'none',
        transform: isHovered ? 'translate(-2px, -2px)' : 'none',
        zIndex: 999,
        transition: 'var(--transition)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Contactar por WhatsApp"
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    </a>
  );
};

export default WhatsAppFloat;
