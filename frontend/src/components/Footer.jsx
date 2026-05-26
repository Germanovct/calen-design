import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--white)',
      borderTop: '1px solid var(--gray-light)',
      padding: '48px 0 24px 0',
      marginTop: 'auto',
      fontSize: '14px',
      color: 'var(--gray-medium)'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '32px'
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{
            fontFamily: 'var(--serif)',
            fontSize: '22px',
            color: 'var(--dark-black)',
            marginBottom: '16px'
          }}>Calen Design</h3>
          <p style={{ maxWidth: '300px', lineHeight: '1.8' }}>
            Ropa de diseño independiente con una estética femenina, minimalista y atemporal. Hecho para durar.
          </p>
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <h4 style={{
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--dark-black)',
            marginBottom: '16px',
            fontWeight: '600'
          }}>Explorar</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Catálogo</Link></li>
            <li><Link to="/productos?category=remeras">Remeras</Link></li>
            <li><Link to="/productos?category=buzos">Buzos</Link></li>
            <li><Link to="/productos?category=vestidos">Vestidos</Link></li>
          </ul>
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <h4 style={{
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--dark-black)',
            marginBottom: '16px',
            fontWeight: '600'
          }}>Soporte</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li><Link to="/mi-cuenta">Mi Cuenta</Link></li>
            <li><a href="#envios">Políticas de Envío</a></li>
            <li><a href="#cambios">Cambios y Devoluciones</a></li>
          </ul>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <h4 style={{
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--dark-black)',
            marginBottom: '16px',
            fontWeight: '600'
          }}>Contacto</h4>
          <p style={{ marginBottom: '8px' }}>Showroom en Palermo, CABA</p>
          <p style={{ marginBottom: '8px' }}>info@calendesign.com</p>
          <p>+54 9 11 6620 3840</p>
        </div>
      </div>

      <div className="container" style={{
        marginTop: '40px',
        paddingTop: '24px',
        borderTop: '1px solid var(--gray-light)',
        textAlign: 'center',
        fontSize: '12px'
      }}>
        <p>&copy; {new Date().getFullYear()} Calen Design. Todos los derechos reservados. DTS&Dog Agency.</p>
      </div>
    </footer>
  );
};

export default Footer;
