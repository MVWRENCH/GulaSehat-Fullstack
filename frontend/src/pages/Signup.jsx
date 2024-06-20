import { useRef } from "react";
import { baseUrl } from "../config";

export default function Signup() {
  const usernameRef = useRef();
  const namaLengkapRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const alamatRef = useRef();
  const dobRef = useRef();
  const jenisKelaminRef = useRef();
  const beratBadanRef = useRef();

  async function handleSignup(e) {
    e.preventDefault();

    try {
      if (
        !usernameRef.current.value ||
        !namaLengkapRef.current.value ||
        !emailRef.current.value ||
        !passwordRef.current.value ||
        !alamatRef.current.value ||
        !dobRef.current.value ||
        !jenisKelaminRef.current.value ||
        !beratBadanRef.current.value
      ) {
        throw new Error("All fields are required");
      }

      // Convert DOB to the required format
      const dob = new Date(dobRef.current.value).toISOString().split('T')[0];

      const queryParams = new URLSearchParams({
        Username: usernameRef.current.value,
        Password: passwordRef.current.value,
        Nama_Lengkap: namaLengkapRef.current.value,
        Email: emailRef.current.value,
        DOB: dob,
        Alamat: alamatRef.current.value,
        Jenis_Kelamin: jenisKelaminRef.current.value,
        Berat_Badan: beratBadanRef.current.value,
      }).toString();

      console.log("Sending query params:", queryParams);

      const res = await fetch(`${baseUrl}/register?${queryParams}`, {
        method: "GET", // Change to GET as per Go handler requirements
        headers: { "Content-Type": "application/json" },
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(errorText);
      }

      alert("Register success!");
      window.location.href = "/";
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="auth-page">
      <h1>Signup</h1>
      <form action="#" onSubmit={handleSignup}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <br />
          <input type="text" ref={usernameRef} id="username" required />
        </div>
        <div className="input-group">
          <label htmlFor="namaLengkap">Nama lengkap</label>
          <br />
          <input type="text" required ref={namaLengkapRef} id="namaLengkap" />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <br />
          <input type="email" required ref={emailRef} id="email" />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <br />
          <input type="password" ref={passwordRef} id="password" required />
        </div>
        <div className="input-group">
          <label htmlFor="alamat">Alamat</label>
          <br />
          <input type="text" required ref={alamatRef} id="alamat" />
        </div>
        <div className="input-group-row">
          <div className="input-group">
            <label htmlFor="dob">Tempat, tanggal lahir</label>
            <br />
            <input type="date" required ref={dobRef} id="dob" />
          </div>
          <div className="input-group">
            <label htmlFor="jenisKelamin">Jenis kelamin</label>
            <br />
            <select ref={jenisKelaminRef} id="jenisKelamin" defaultValue="">
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
            <input type="number" required ref={beratBadanRef} id="beratBadan" />
          </div>
        </div>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
        <input type="submit" value="Join now" className="btn-save" />
      </form>
    </div>
  );
}
