import React from "react";
import Logo from "../../assets/logooo.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <img src={Logo} alt="Logo" className="footer-logo" />
          <p className="footer-description">
            La mejor plataforma para comprar y vender tus productos de forma
            rápida, segura y confiable.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 Agro Negocio — Todos los derechos reservados.
      </div>
    </footer>
  );
}
