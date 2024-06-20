import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { ModalContext } from "../contexts/ModalProvider";
import { baseUrl } from "../config";
import { SectionContext } from "../contexts/SectionProvider";
import { CartContext } from "../contexts/CartProvider";

export default function ProfileNavbar() {
  const { user, userRole } = useContext(AuthContext);
  const { toggleModal, setModalType } = useContext(ModalContext);
  const { changeSection } = useContext(SectionContext);
  const { cartCount } = useContext(CartContext);

  return (
    <nav>
      {userRole == "pelanggan" && (
        <>
          {/* <button className="btn-icon">
            <ion-icon name="notifications-outline"></ion-icon>
            <div className="badge">1</div>
          </button>
          <button className="btn-icon">
            <ion-icon name="chatbox-ellipses-outline"></ion-icon>
            <div className="badge">1</div>
          </button> */}
          <button className="btn-icon" onClick={() => changeSection("cart")}>
            <ion-icon name="cart-outline"></ion-icon>
            <div className="badge">{cartCount}</div>
          </button>
        </>
      )}
      {userRole === "dokter" && (
        <button
          className="btn-input-aktivitas"
          onClick={() => {
            setModalType("inputAktivitas");
            toggleModal();
          }}
        >
          {/* <img src="/blood.png"></img> */}
          <ion-icon name="accessibility"></ion-icon>
          Input Aktivitas
        </button>
      )}
      <div className="container">
        Hello,
        <b style={{ paddingLeft: "4px" }}>{user.Username}</b>
        <img
          src={user.photoUrl ? user.photoUrl : "/blank-profile.jpg"}
          alt=""
        />
      </div>
    </nav>
  );
}
