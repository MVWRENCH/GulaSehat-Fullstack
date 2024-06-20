import { useContext, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { baseUrl } from "../config"; // Assuming you have a config file for base URL

export default function Akun() {
  const { user } = useContext(AuthContext);

  const usernameRef = useRef();
  const namaLengkapRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const alamatRef = useRef();
  const dobRef = useRef();
  const jenisKelaminRef = useRef();
  const beratBadanRef = useRef();

  const [error, setError] = useState("");

  async function editProfile(updatedProfile) {
    try {
      const dobFormatted = dobRef.current.value ? new Date(dobRef.current.value).toISOString().split('T')[0] : user.DOB.split('T')[0]; // Use current user DOB if no new input

      const params = new URLSearchParams({
        Username: updatedProfile.Username,
        Nama_Lengkap: updatedProfile.Nama_Lengkap || user.Nama_Lengkap,
        Email: updatedProfile.Email || user.Email,
        DOB: dobFormatted,
        Alamat: updatedProfile.Alamat || user.Alamat,
        Jenis_Kelamin: updatedProfile.Jenis_Kelamin || user.Jenis_Kelamin,
        Berat_Badan: updatedProfile.Berat_Badan.toString() || user.Berat_Badan.toString(),
      });

      const response = await fetch(`${baseUrl}/editUser?${params}`, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      alert("Profile updated successfully");
      setError(""); // Clear error message on success
    } catch (error) {
      console.error("Profile update failed:", error);
      alert("Failed to update information");
      setError("Failed to update profile information.");
    }
  }

  async function handleSubmitEditProfile(event) {
    event.preventDefault();

    // Collect the new values, or default to the existing user values
    const updatedProfile = {
      Username: usernameRef.current.value || user.Username,
      Password: passwordRef.current.value || user.Password,
      Nama_Lengkap: namaLengkapRef.current.value || user.Nama_Lengkap,
      Email: emailRef.current.value || user.Email,
      DOB: dobRef.current.value ? new Date(dobRef.current.value).toISOString() : user.DOB,
      Alamat: alamatRef.current.value || user.Alamat,
      Jenis_Kelamin: jenisKelaminRef.current.value || user.Jenis_Kelamin,
      Berat_Badan: beratBadanRef.current.value || user.Berat_Badan.toString(),
    };

    try {
      console.log("Updated Profile Data:", updatedProfile);
      await editProfile(updatedProfile); // Call editProfile function with updated profile data
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile information."); // Set error state on failure
    }
  }

  return (
    <>
      <span>
        <h1>Edit Profile</h1>
        <p style={{ opacity: 0.8 }}>Edit your profile information here.</p>
      </span>
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
          <label htmlFor="namaLengkap">Nama lengkap</label>
          <br />
          <input
            type="text"
            defaultValue={user.Nama_Lengkap}
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
          <label htmlFor="password">Password</label>
          <br />
          <input type="password" ref={passwordRef} id="password" />
        </div>
        <div className="input-group">
          <label htmlFor="alamat">Alamat</label>
          <br />
          <input
            type="text"
            defaultValue={user.Alamat}
            ref={alamatRef}
            id="alamat"
          />
        </div>
        <div className="input-group-row">
          <div className="input-group">
            <label htmlFor="dob">Tempat, tanggal lahir</label>
            <br />
            <input
              type="date"
              defaultValue={user.DOB.split("T")[0]} // Assume DOB is in ISO format
              ref={dobRef}
              id="dob"
            />
          </div>
          <div className="input-group">
            <label htmlFor="jenisKelamin">Jenis kelamin</label>
            <br />
            <select
              ref={jenisKelaminRef}
              id="jenisKelamin"
              defaultValue={user.Jenis_Kelamin}
            >
              <option value="" disabled hidden>
                Choose
              </option>
              <option value="Male">Laki-laki</option>
              <option value="Female">Perempuan</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="beratBadan">Berat badan</label>
            <br />
            <input
              type="text" // Change to text input to handle string input
              defaultValue={user.Berat_Badan.toString()} // Ensure default value is string
              ref={beratBadanRef}
              id="beratBadan"
            />
          </div>
        </div>
        <input type="submit" value="Save" className="btn-save" />
      </form>
    </>
  );
}
