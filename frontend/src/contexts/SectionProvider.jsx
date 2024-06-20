import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

export const SectionContext = createContext(null);

// Untuk berbagi state section yang sedang ditampilkan
export default function SectionProvider({ children }) {
  const [section, setSection] = useState();
  const { userRole } = useContext(AuthContext);

  function changeSection(str) {
    setSection(str);
  }

  // Default section yang akan ditunjukkan pertama kali adalah Dashboard
  useEffect(() => {
    if (userRole === "pelanggan") {
      setSection("dashboard-pelanggan");
    }
    if (userRole === "seller") {
      setSection("dashboard-seller");
    }
    if (userRole === "dokter") {
      setSection("dashboard-dokter");
    }
  }, [userRole]);

  return (
    <SectionContext.Provider value={{ section, changeSection }}>
      {children}
    </SectionContext.Provider>
  );
}
