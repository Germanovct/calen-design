import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--white)',
      borderTop: 'var(--border-brutal)',
      padding: '48px 0 24px 0',
      marginTop: 'auto',
      fontSize: '14px',
      color: 'var(--black)'
    }}>
      <div className="container" style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: '32px'
      }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{
            fontFamily: 'var(--display)',
            fontSize: '24px',
            color: 'var(--dark-black)',
            marginBottom: '16px',
            fontWeight: '900'
          }}>CALEN DESIGN</h3>
          <p style={{ maxWidth: '300px', lineHeight: '1.8', fontWeight: '500' }}>
            Ropa de diseño independiente con una estética femenina, minimalista y atemporal. Hecho para durar.
          </p>
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <h4 style={{
            fontFamily: 'var(--display)',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--dark-black)',
            marginBottom: '16px',
            fontWeight: '900'
          }}>EXPLORAR</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '600' }}>
            <li><Link to="/">INICIO</Link></li>
            <li><Link to="/productos">CATÁLOGO</Link></li>
            <li><Link to="/productos?category=remeras">REMERAS</Link></li>
            <li><Link to="/productos?category=buzos">BUZOS</Link></li>
            <li><Link to="/productos?category=vestidos">VESTIDOS</Link></li>
          </ul>
        </div>

        <div style={{ flex: '1 1 150px' }}>
          <h4 style={{
            fontFamily: 'var(--display)',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--dark-black)',
            marginBottom: '16px',
            fontWeight: '900'
          }}>SOPORTE</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '600' }}>
            <li><Link to="/mi-cuenta">MI CUENTA</Link></li>
            <li><a href="#envios">POLÍTICAS DE ENVÍO</a></li>
            <li><a href="#cambios">CAMBIOS Y DEVOLUCIONES</a></li>
          </ul>
        </div>

        <div style={{ flex: '1 1 200px' }}>
          <h4 style={{
            fontFamily: 'var(--display)',
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--dark-black)',
            marginBottom: '16px',
            fontWeight: '900'
          }}>CONTACTO</h4>
          <p style={{ marginBottom: '8px', fontWeight: '500' }}>Showroom en Palermo, CABA</p>
          <p style={{ marginBottom: '8px', fontWeight: '500' }}>info@calendesign.com</p>
          <p style={{ fontWeight: '500' }}>+54 9 11 6620 3840</p>
        </div>
      </div>

      <div className="container" style={{
        marginTop: '40px',
        paddingTop: '24px',
        borderTop: 'var(--border-brutal-sm)',
        textAlign: 'center',
        fontSize: '12px',
        fontFamily: 'var(--display)',
        fontWeight: '800'
      }}>
        <p>&copy; {new Date().getFullYear()} CALEN DESIGN. Todos los derechos reservados. DTS&Dog Agency.</p>
      </div>
    </footer>
  );
};

export default Footer;
