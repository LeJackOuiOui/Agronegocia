import Logo from "../assets/logooo.png";

export default function Header() {
  return (
    <header className="w-full h-24 bg-[#2b2b2b] text-[#9fd8a0] flex items-center justify-between px-12 shadow-lg fixed top-0 left-0 z-50 border-b border-[#9fd8a0]">
      <div className="flex items-center space-x-4">

        <img src={Logo} alt="Logo" className="w-14 h-14 object-contain border border-[#9fd8a0] rounded" />

        <div className="text-3xl font-extrabold tracking-wide">Agro Negocio</div>
      </div>

      <nav className="flex space-x-10 text-lg font-medium">
        <a href="#" className="hover:opacity-60 transition-opacity border border-[#9fd8a0] px-3 py-1 rounded">Inicio</a>
        <a href="#" className="hover:opacity-60 transition-opacity border border-[#9fd8a0] px-3 py-1 rounded">Cultivadores</a>
        <a href="#" className="hover:opacity-60 transition-opacity border border-[#9fd8a0] px-3 py-1 rounded">Consumidores</a>
        <a href="#" className="hover:opacity-60 transition-opacity border border-[#9fd8a0] px-3 py-1 rounded">Precios</a>
        <a href="#" className="hover:opacity-60 transition-opacity border border-[#9fd8a0] px-3 py-1 rounded">Contacto</a>
      </nav>
    </header>
  );
}
