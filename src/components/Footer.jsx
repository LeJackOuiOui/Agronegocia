import React from "react";
import Logo from "../assets/logo.jpg";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-brand">
          <img src={Logo} alt="Logo" className="footer-logo" />
          <p className="footer-description">
            La mejor plataforma para comprar y vender tus productos de forma rápida, segura y confiable.
          </p>
        </div>

        <div className="footer-columns">

          <div className="footer-column">
            <h4>Sobre nosotros</h4>
            <ul>
              <li><a href="/about">Quiénes somos</a></li>
              <li><a href="/mission">Nuestra misión</a></li>
              <li><a href="/contact">Contacto</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Servicios</h4>
            <ul>
              <li><a href="/categories">Categorías</a></li>
              <li><a href="/sell">Vender un producto</a></li>
              <li><a href="/help">Centro de ayuda</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <ul>
              <li><a href="/terms">Términos y condiciones</a></li>
              <li><a href="/privacy">Política de privacidad</a></li>
              <li><a href="/security">Seguridad</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Síguenos</h4>
            <ul className="social-list">
              <li><a href="#fb">Facebook</a></li>
              <li><a href="#ig">Instagram</a></li>
              <li><a href="#tw">Twitter</a></li>
            </ul>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        © 2025 Agro Negocio — Todos los derechos reservados.
      </div>
    </footer>
  );
}
