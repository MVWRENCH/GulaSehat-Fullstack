import React, { useEffect, useState } from "react";
import Slider from "../components/Slider";
import { baseUrl } from "../config";

export default function RekomendasiAktivitas() {
  const [listAktivitas, setListAktivitas] = useState([]);

  useEffect(() => {
    const fetchAllAktivitas = async () => {
      try {
        const res = await fetch(`${baseUrl}/getAllAktivitas`);
        if (!res.ok) throw new Error("Failed to fetch all aktivitas");

        const parsedRes = await res.json();
        setListAktivitas(parsedRes);
      } catch (error) {
        alert(error.message);
      }
    };

    fetchAllAktivitas();
  }, []);

  return (
    <div>
      <h1>List Aktivitas</h1>
      <br />
      <div className="aktivitas-list">
        {listAktivitas.map((item, i) => (
          <div key={i} className="aktivitas-card">
            <span>
              <img src={`/${item.Nama_Aktivitas}.jpg`} alt="" />
              <b>{item.Nama_Aktivitas}</b>
            </span>
            <span>
              <p>{item.Keterangan}</p>
            </span>
            <span></span>
          </div>
        ))}
      </div>
    </div>
  );
}
