import { useContext, useRef, useEffect, useState } from "react";
import { ModalContext } from "../contexts/ModalProvider";
import { AuthContext } from "../contexts/AuthProvider";
import { baseUrl } from "../config";

export default function Modal() {
  const { isOpen, toggleModal, modalType, selectedMakanan } =
    useContext(ModalContext);
  const { user } = useContext(AuthContext);

  // Refs for input fields
  const inputRef = useRef(null); // For inputGulaDarah
  const inputNamaAktivitasRef = useRef(null); // For inputAktivitas
  const inputStatusAktivitasRef = useRef(null); // For inputAktivitas
  const inputKeteranganRef = useRef(null); // For inputAktivitas

  async function handleSubmitInputGulaDarah() {
    try {
      const bloodSugarLevel = inputRef.current.value;
      if (!bloodSugarLevel || bloodSugarLevel === "0") {
        throw new Error("Invalid input");
      }

      const res = await fetch(
        `${baseUrl}/insertGulaDarah?PelangganID=${user.PelangganID}&LevelGulaDarah=${bloodSugarLevel}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Internal Server Error");
      }

      alert("Data berhasil dimasukkan");
      toggleModal();
      window.location.reload(); // Use window.location.reload() instead of location.reload()
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleSubmitInputAktivitas() {
    try {
      const namaAktivitas = inputNamaAktivitasRef.current.value;
      const statusAktivitas = inputStatusAktivitasRef.current.value;
      const keterangan = inputKeteranganRef.current.value;

      if (!namaAktivitas || !statusAktivitas || !keterangan) {
        throw new Error("All fields are required");
      }

      const res = await fetch(
        `${baseUrl}/inputActivity?Nama_Aktivitas=${namaAktivitas}&Status_Aktivitas=${statusAktivitas}&Keterangan=${keterangan}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Internal Server Error");
      }

      alert("Data berhasil dimasukkan");
      toggleModal();
      window.location.reload(); // Use window.location.reload() instead of location.reload()
    } catch (error) {
      alert(error.message);
    }
  }

  const inputNamaMakananRef = useRef(null);
  const inputKandunganMakananRef = useRef(null);
  // const inputPenjualIDRef = useRef(null);
  const inputHargaMakananRef = useRef(null);
  const selectKategoriIDRef = useRef(null);

  async function handleSubmitInputMakanan() {
    try {
      const namaMakanan = inputNamaMakananRef.current.value;
      const kandunganMakanan = inputKandunganMakananRef.current.value;
      const penjualID = user.PenjualID;
      const hargaMakanan = inputHargaMakananRef.current.value;
      const kategoriID = selectKategoriIDRef.current.value;

      if (
        !namaMakanan ||
        !kandunganMakanan ||
        !penjualID ||
        !hargaMakanan ||
        !kategoriID
      ) {
        throw new Error("All fields are required");
      }

      const res = await fetch(
        `${baseUrl}/insertMakanan?KategoriID=${kategoriID}&Nama_Makanan=${namaMakanan}&Kandungan_Makanan=${kandunganMakanan}&PenjualID=${penjualID}&Harga_Makanan=${hargaMakanan}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to insert makanan");
      }

      alert("Makanan inserted successfully");
      toggleModal();
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleSubmitEditMakanan() {
    try {
      const makananID = selectedMakanan.MakananID;
      const namaMakanan = inputNamaMakananRef.current.value.trim() || selectedMakanan.Nama_Makanan;
      const kandunganMakanan = inputKandunganMakananRef.current.value.trim() || selectedMakanan.Kandungan_Makanan;
      const penjualID = user.penjualID;
      const hargaMakanan = inputHargaMakananRef.current.value.trim() || selectedMakanan.Harga_Makanan;
      const kategoriID = selectKategoriIDRef.current.value || selectedMakanan.KategoriID;
  
      if (!namaMakanan || !kandunganMakanan || !hargaMakanan || !kategoriID) {
        throw new Error("All fields are required");
      }
  
      const res = await fetch(
        `${baseUrl}/editMakanan?MakananID=${makananID}&KategoriID=${kategoriID}&Nama_Makanan=${encodeURIComponent(namaMakanan)}&Kandungan_Makanan=${encodeURIComponent(kandunganMakanan)}&PenjualID=${penjualID}&Harga_Makanan=${hargaMakanan}`,
        {
          method: "POST",
        }
      );
  
      if (!res.ok) {
        throw new Error("Failed to edit makanan");
      }
  
      alert("Makanan edited successfully");
      toggleModal();
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  }
  

  return (
    <>
      {isOpen && modalType === "inputGulaDarah" && (
        <div className="modal-wrapper">
          <div className="modal">
            <button className="btn-close" onClick={toggleModal}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
            <h2>Input Gula Darah</h2>
            <p>Input Gula Darah Terakhir Kamu</p>
            <input
              ref={inputRef}
              type="number"
              name=""
              id=""
              placeholder="Gula Darah"
              required
            />
            <button onClick={handleSubmitInputGulaDarah} className="submit">
              Input
            </button>
          </div>
        </div>
      )}
      {isOpen && modalType === "inputAktivitas" && (
        <div className="modal-wrapper">
          <div className="modal">
            <button className="btn-close" onClick={toggleModal}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
            <h2>Input Aktivitas</h2>
            <div className="input-group">
              <label htmlFor="namaAktivitas">Nama Aktivitas</label>
              <br />
              <input
                ref={inputNamaAktivitasRef}
                type="text"
                id="namaAktivitas"
                placeholder="Nama Aktivitas"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="statusAktivitas">Status Aktivitas</label>
              <br />
              <select
                ref={inputStatusAktivitasRef}
                id="statusAktivitas"
                required
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </div>
            <div className="input-group">
              <label htmlFor="keterangan">Keterangan</label>
              <br />
              <input
                ref={inputKeteranganRef}
                type="text"
                id="keterangan"
                placeholder="Keterangan"
                required
              />
            </div>
            <button onClick={handleSubmitInputAktivitas} className="submit">
              Input
            </button>
          </div>
        </div>
      )}
      {isOpen && modalType === "inputMakanan" && (
        <div className="modal-wrapper">
          <div className="modal">
            <button className="btn-close" onClick={toggleModal}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
            <h2>Input Makanan</h2>
            <div className="input-group">
              <label htmlFor="namaMakanan">Nama Makanan</label>
              <br />
              <input
                ref={inputNamaMakananRef}
                type="text"
                id="namaMakanan"
                placeholder="Nama Makanan"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="kandunganMakanan">Kandungan Makanan</label>
              <br />
              <input
                ref={inputKandunganMakananRef}
                type="text"
                id="kandunganMakanan"
                placeholder="Kandungan Makanan"
                required
              />
            </div>
            {/* <div className="input-group">
              <label htmlFor="penjualID">Penjual ID</label>
              <br />
              <input
                ref={inputPenjualIDRef}
                type="text"
                id="penjualID"
                placeholder="Penjual ID"
                required
              />
            </div> */}
            <div className="input-group">
              <label htmlFor="hargaMakanan">Harga Makanan</label>
              <br />
              <input
                ref={inputHargaMakananRef}
                type="text"
                id="hargaMakanan"
                placeholder="Harga Makanan"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="kategoriID">Kategori Makanan</label>
              <br />
              <select ref={selectKategoriIDRef} id="kategoriID" required>
                <option value="">Pilih Kategori</option>
                <option value="K001">K001 - Main Course</option>
                <option value="K002">K002 - Appetizer</option>
                <option value="K003">K003 - Dessert</option>
                <option value="K004">K004 - Beverage</option>
                <option value="K005">K005 - Snack</option>
              </select>
            </div>
            <button onClick={handleSubmitInputMakanan} className="submit">
              Input
            </button>
          </div>
        </div>
      )}{" "}
      {isOpen && modalType === "editMakanan" && (
        <div className="modal-wrapper">
          <div className="modal">
            <button className="btn-close" onClick={toggleModal}>
              <ion-icon name="close-outline"></ion-icon>
            </button>
            <h2>Edit Makanan {selectedMakanan.MakananID}</h2>
            <div className="input-group">
              <label htmlFor="inputNamaMakanan">Nama Makanan</label>
              <br />
              <input
                ref={inputNamaMakananRef}
                type="text"
                id="inputNamaMakanan"
                placeholder={selectedMakanan.Nama_Makanan} // Populate with fetched data
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="inputKandunganMakanan">Kandungan Makanan</label>
              <br />
              <input
                ref={inputKandunganMakananRef}
                type="text"
                id="inputKandunganMakanan"
                placeholder={selectedMakanan.Kandungan_Makanan} // Populate with fetched data
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="inputHargaMakanan">Harga Makanan</label>
              <br />
              <input
                ref={inputHargaMakananRef}
                type="text"
                id="inputHargaMakanan"
                placeholder={selectedMakanan.Harga_Makanan} // Populate with fetched data
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="selectKategoriID">Kategori Makanan</label>
              <br />
              <select
                ref={selectKategoriIDRef}
                id="selectKategoriID"
                defaultValue={selectedMakanan.KategoriID} // Set default value to selectedMakanan's KategoriID
                required
              >
                <option value="">Pilih Kategori</option>
                <option value="K001">K001 - Main Course</option>
                <option value="K002">K002 - Appetizer</option>
                <option value="K003">K003 - Dessert</option>
                <option value="K004">K004 - Beverage</option>
                <option value="K005">K005 - Snack</option>
              </select>
            </div>
            <button onClick={handleSubmitEditMakanan} className="submit">
              Edit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
