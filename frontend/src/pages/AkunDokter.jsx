import { useContext, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { baseUrl } from "../config";

export default function AkunDokter() {
  const { user, setUser } = useContext(AuthContext);
  const usernameRef = useRef();
  const namaLengkapRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const alamatRef = useRef();
  const noTelpRef = useRef();
  const [error, setError] = useState("");

  async function handleSubmitEditProfile(event) {
    event.preventDefault();

    const updatedProfile = {
      Username: usernameRef.current.value || user.Username,
      Nama_Dokter: namaLengkapRef.current.value || user.Nama_Dokter,
      Email: emailRef.current.value || user.Email,
      Password: passwordRef.current.value || "",
      Alamat: alamatRef.current.value || user.Alamat,
      No_Telp: noTelpRef.current.value || user.No_Telp.toString(),
    };

    const queryString = `Username=${encodeURIComponent(
      updatedProfile.Username
    )}&Password=${encodeURIComponent(
      updatedProfile.Password
    )}&Nama_Dokter=${encodeURIComponent(
      updatedProfile.Nama_Dokter
    )}&Email=${encodeURIComponent(
      updatedProfile.Email
    )}&Alamat_Praktik=${encodeURIComponent(
      updatedProfile.Alamat
    )}&No_Telp=${encodeURIComponent(updatedProfile.No_Telp)}`;

    try {
      const response = await fetch(`${baseUrl}/EditDoctor?${queryString}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully");
      setError(""); // Clear any previous errors
      window.location.reload();
    } catch (error) {
      console.error("Profile update failed:", error);
      setError("Failed to update profile. Please try again.");
    }
  }

  return (
    <>
      <h1>Edit Profile</h1>
      <p style={{ opacity: 0.8 }}>Edit your profile information here.</p>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmitEditProfile}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <br />
          <input
            type="text"
            defaultValue={user.Username}
            ref={usernameRef}
            id="username"
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <br />
          <input type="password" ref={passwordRef} id="password" />
        </div>
        <div className="input-group">
          <label htmlFor="namaLengkap">Nama lengkap</label>
          <br />
          <input
            type="text"
            defaultValue={user.Nama_Dokter}
            ref={namaLengkapRef}
            id="namaLengkap"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <br />
          <input
            type="email"
            defaultValue={user.Email}
            ref={emailRef}
            id="email"
          />
        </div>
        <div className="input-group">
          <label htmlFor="alamat">Alamat Praktik</label>
          <br />
          <input
            type="text"
            defaultValue={user.Alamat}
            ref={alamatRef}
            id="alamat"
          />
        </div>
        <div className="input-group">
          <label htmlFor="noTelp">Nomor Telepon</label>
          <br />
          <input
            type="text"
            defaultValue={user.No_Telp}
            ref={noTelpRef}
            id="noTelp"
          />
        </div>
        <input type="submit" value="Save" className="btn-save" />
      </form>
    </>
  );
}
