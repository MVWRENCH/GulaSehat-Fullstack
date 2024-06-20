import { useRef, useContext } from "react";
import { baseUrl } from "../config";
import { AuthContext } from "../contexts/AuthProvider";

export default function SignupDokter() {
  const usernameRef = useRef();
  const namaDokterRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const alamatPraktikRef = useRef();
  const noTelpRef = useRef();

  const { setUser, setUserRole } = useContext(AuthContext);

  async function handleSignup(e) {
    e.preventDefault();

    try {
      // Validate that all fields are filled
      if (
        !usernameRef.current.value ||
        !namaDokterRef.current.value ||
        !emailRef.current.value ||
        !passwordRef.current.value ||
        !alamatPraktikRef.current.value ||
        !noTelpRef.current.value
      ) {
        throw new Error("All fields are required");
      }

      // Construct query parameters
      const queryParams = new URLSearchParams({
        Username: usernameRef.current.value,
        Password: passwordRef.current.value,
        Nama_Dokter: namaDokterRef.current.value,
        Email: emailRef.current.value,
        Alamat_Praktik: alamatPraktikRef.current.value,
        No_Telp: noTelpRef.current.value,
      }).toString();

      console.log("Sending payload:", queryParams);

      // Send the request with query parameters
      const res = await fetch(`${baseUrl}/registerDoctor?${queryParams}`, {
        method: "GET",
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(errorText);
      }

      const doctor = await res.json(); // Assuming server responds with the created doctor object
      setUser(doctor); // Set the user context with the doctor object
      setUserRole("dokter"); // Set user role to "dokter"

      alert("Register success!");
      window.location.href = "/";
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="auth-page">
      <h1>Signup Dokter</h1>
      <form action="#" onSubmit={handleSignup}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <br />
          <input type="text" ref={usernameRef} id="username" required />
        </div>
        <div className="input-group">
          <label htmlFor="namaDokter">Nama Dokter</label>
          <br />
          <input type="text" required ref={namaDokterRef} id="namaDokter" />
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
          <label htmlFor="alamatPraktik">Alamat Praktik</label>
          <br />
          <input
            type="text"
            required
            ref={alamatPraktikRef}
            id="alamatPraktik"
          />
        </div>
        <div className="input-group">
          <label htmlFor="noTelp">No. Telepon</label>
          <br />
          <input type="text" required ref={noTelpRef} id="noTelp" />
        </div>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
        <input type="submit" value="Join now" className="btn-save" />
      </form>
    </div>
  );
}
