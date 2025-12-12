import Footer from "./Footer.jsx";
import Header from "./header.jsx";

export default function Layout({ children }) {
  return (
    <main className="mx-auto p-4 sm:p-6 font-sans leading-relaxed text-gray-800 dark:text-gray-100 bg-white dark:bg-neutral-900 min-h-screen">
      <Header />

      <section>{children}</section>

      <Footer />
    </main>
  );
}
