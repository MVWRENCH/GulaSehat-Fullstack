import { useContext, useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ProfileNavbar from "./components/ProfileNavbar";
import Dashboard from "./pages/Dashboard";
import { SectionContext } from "./contexts/SectionProvider";
import Slider from "./components/Slider";
import RekomendasiAktivitas from "./pages/RekomendasiAktivitas";
import RekomendasiMakanan from "./pages/RekomendasiMakanan";
import DetailGulaDarah from "./pages/DetailGulaDarah";
import Modal from "./components/Modal";
import Akun from "./pages/Akun";
import Chat from "./pages/Chat";
import AkunDokter from "./pages/AkunDokter";
import DashboardSeller from "./pages/DashboardSeller";
import Products from "./pages/Products";
import { AuthContext } from "./contexts/AuthProvider";
import Cart from "./pages/Cart";
import HistoriOrder from "./pages/HistoriOrder";

// Layout Web dibagi jadi 2, kiri Sidebar dan kanan Main
// Main berisi ProfileNavbar (yg tulisan 'Hello, Farhan [foto profile]') dan section (dashboard, detail, aktivitas, dll sesuai Sidebar)
// Section akan berganti" sesuai dengan state section di atas (dari SectionContext yg adalah shared value, jadi bisa dipake dimana aja)
// Section yang ditampilkan adalah sesuai dengan value dari section dari SectionContext

function App() {
  const { section } = useContext(SectionContext);
  // Misal section diatas valuenya = 'dashboard' maka akan menunjukkan component <Dashboard />, dll seperti yang sudah ada dibawah
  // Pergantian value ini bisa dilihat di "./component/Sidebar.jsx"
  // ProfileNavbar akan terus ada diatas setiap section (yg tulisan 'Hello, Farhan [foto profile]').

  const { user } = useContext(AuthContext);
  if (!user) {
    window.location.href = "/login";
  }
  
  return (
    <>
      <main>
        <Modal />

        {/* Kiri */}
        <Sidebar />

        {/* Kanan */}
        <section>
          <ProfileNavbar />
          {section === "dashboard-pelanggan" && <Dashboard />}
          {section === "dashboard-seller" && <DashboardSeller />}
          {section === "dashboard-dokter" && <Chat />}
          {section === "detail-gula-darah" && <DetailGulaDarah />}
          {section === "aktivitas" && <RekomendasiAktivitas />}
          {section === "makanan" && <RekomendasiMakanan />}
          {section === "akun-pelanggan" && <Akun />}
          {section === "akun-dokter" && <AkunDokter />}
          {section === "products" && <Products />}
          {section === "cart" && <Cart />}
          {section === "histori-order" && <HistoriOrder />}
        </section>
      </main>
    </>
  );
}

export default App;
