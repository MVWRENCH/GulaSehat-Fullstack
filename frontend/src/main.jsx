import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import AuthProvider from "./contexts/AuthProvider.jsx";
import SectionProvider from "./contexts/SectionProvider.jsx";
import Routes from "./Routes.jsx";
import ModalProvider from "./contexts/ModalProvider.jsx";
import CartProvider from "./contexts/CartProvider.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <SectionProvider>
        <ModalProvider>
          <CartProvider>
            <Routes />
          </CartProvider>
        </ModalProvider>
      </SectionProvider>
    </AuthProvider>
  </React.StrictMode>
);
