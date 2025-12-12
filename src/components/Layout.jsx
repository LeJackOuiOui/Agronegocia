export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-3xl font-bold mb-6 text-center">Reactive Store</header>
      {children}
    </div>
  );
}
