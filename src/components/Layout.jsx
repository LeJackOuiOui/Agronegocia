import Header from './header.jsx'

function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}

export default Layout
