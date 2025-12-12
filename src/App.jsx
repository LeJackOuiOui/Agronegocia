// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./components/context/AppContext";
import Home from "./pages/Home";
import Forms from "./pages/Forms";
import DataListing from "./pages/DataListing";
import "./App.css";

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/forms" element={<Forms />} />
          <Route path="/products" element={<DataListing />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
