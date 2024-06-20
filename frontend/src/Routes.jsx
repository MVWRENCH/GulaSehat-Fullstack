import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SignupDokter from "./pages/SignupDokter";
import SignupSeller from "./pages/SignupSeller";

// Ini untuk define routes
// route '/' akan memunculkan component App atau halaman utama, dst.
export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup-dokter" element={<SignupDokter />} />
        <Route path="/signup-seller" element={<SignupSeller />} />
      </Routes>
    </BrowserRouter>
  );
}
