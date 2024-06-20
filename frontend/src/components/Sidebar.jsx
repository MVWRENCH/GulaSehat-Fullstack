import { useContext } from "react";
import { color } from "../colors"; // Make sure the path is correct
import { SectionContext } from "../contexts/SectionProvider";
import { ModalContext } from "../contexts/ModalProvider";
import { AuthContext } from "../contexts/AuthProvider";

export default function Sidebar() {
  const { section, changeSection } = useContext(SectionContext);
  const { toggleModal } = useContext(ModalContext);
  const { userRole, logout } = useContext(AuthContext);

  const menus = {
    pelanggan: [
      {
        title: "dashboard",
        icon: "home-outline",
        sectionName: "dashboard-pelanggan",
      },
      {
        title: "detail-gula-darah",
        icon: "list-outline",
        sectionName: "detail-gula-darah",
      },
      {
        title: "input-gula-darah",
        icon: "create-outline",
        sectionName: "input-gula-darah",
      },
      { title: "aktivitas", icon: "people-outline", sectionName: "aktivitas" },
      { title: "makanan", icon: "cafe-outline", sectionName: "makanan" },
      { title: "histori-order", icon: "list-outline", sectionName: "histori-order" },
      { title: "akun", icon: "person-outline", sectionName: "akun-pelanggan" },
    ],
    seller: [
      {
        title: "dashboard",
        icon: "home-outline",
        sectionName: "dashboard-seller",
      },
      {
        title: "products",
        icon: "restaurant-outline",
        sectionName: "products",
      },
    ],
    dokter: [
      {
        title: "dashboard",
        icon: "home-outline",
        sectionName: "dashboard-dokter",
      },
      { title: "akun", icon: "person-outline", sectionName: "akun-dokter" },
    ],
  };

  const menu = menus[userRole];

  return (
    <div className="sidebar">
      <span>
        <h1 className="logo">
          GulaSehat<span className="green-text">.</span>
        </h1>
        <span>
          {menu.map((menu) => (
            <button
              key={menu.sectionName}
              className={section === menu.sectionName ? "btn-active" : ""}
              onClick={
                () =>
                  menu.sectionName != "input-gula-darah"
                    ? changeSection(menu.sectionName)
                    : toggleModal()

                // if sectionName = logout then logout
              }
            >
              <span className="sidebar-icon">
                <ion-icon name={menu.icon}></ion-icon>
              </span>
              {menu.title.charAt(0).toUpperCase() +
                menu.title.slice(1).replace(/-/g, " ")}
            </button>
          ))}
        </span>
      </span>
      <button onClick={logout}>
        <span className="sidebar-icon">
          <ion-icon name="log-out-outline"></ion-icon>
        </span>
        Logout
      </button>
    </div>
  );
}
