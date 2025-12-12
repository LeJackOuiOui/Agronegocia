// Aquí importan el Header y Footer, haganlos por separado como componentes
import Footer from "./Footer.jsx";



export default function Layout({ children }) {
  return (
    <main className="mx-auto max-w-3xl p-4 sm:p-6 font-sans leading-relaxed text-gray-800 dark:text-gray-100 bg-white dark:bg-neutral-900 min-h-screen">
      {/*Aquí colocan el Header*/}

      <section>{children}</section>

      <Footer/>
    </main>
  );
}
