import { useState, useEffect } from "react";
import "./App.css";
// import Home from "./pages/Home";
// import Forms from "./pages/Forms";
import DataListing from "./pages/DataListing";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { AppProvider } from "./components/context/AppContext";

function App() {
  return (
    <>
      {/* <AppProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/forms" element={<Forms />} />
            <Route path="/products" element={<DataListing />} />
          </Routes>
        </Router>
      </AppProvider> */}
      <Layout>
        <DataListing />
      </Layout>
    </>
  );
}

export default App;
