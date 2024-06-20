import { useContext, useRef } from "react";
import { baseUrl } from "../config";
import { AuthContext } from "../contexts/AuthProvider";

export default function SignupSeller() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const namaPenjualRef = useRef();
  const namaBisnisRef = useRef();
  const emailRef = useRef();
  const noTelpRef = useRef();
  const alamatRef = useRef();
  const { setUser, setUserRole } = useContext(AuthContext);

  async function handleSignup(e) {
    e.preventDefault();

    try {
      if (
        !usernameRef.current.value ||
        !passwordRef.current.value ||
        !namaPenjualRef.current.value ||
        !namaBisnisRef.current.value ||
        !emailRef.current.value ||
        !noTelpRef.current.value ||
        !alamatRef.current.value
      ) {
        throw new Error("All fields are required");
      }

      const params = new URLSearchParams({
        Username: usernameRef.current.value,
        Password: passwordRef.current.value,
        Nama_Penjual: namaPenjualRef.current.value,
        Nama_Bisnis: namaBisnisRef.current.value,
        Email: emailRef.current.value,
        No_Telp: noTelpRef.current.value,
        Alamat: alamatRef.current.value,
      });

      console.log("Sending params:", params.toString());

      const res = await fetch(`${baseUrl}/registerseller?${params.toString()}`, {
        method: "POST",
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error(errorText);
      }

      const seller = await res.json(); // Assuming the server returns the created seller object

      setUser(seller); // Set the user context with the returned seller object
      setUserRole("seller"); // Set the user role to "seller"

      alert("Register success!");
      window.location.href = "/";
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="auth-page">
      <h1>Signup Seller</h1>
      <form action="#" onSubmit={handleSignup}>
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <br />
          <input type="text" ref={usernameRef} id="username" required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <br />
          <input type="password" ref={passwordRef} id="password" required />
        </div>
        <div className="input-group">
          <label htmlFor="namaPenjual">Nama Penjual</label>
          <br />
          <input type="text" required ref={namaPenjualRef} id="namaPenjual" />
        </div>
        <div className="input-group">
          <label htmlFor="namaBisnis">Nama Bisnis</label>
          <br />
          <input type="text" required ref={namaBisnisRef} id="namaBisnis" />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <br />
          <input type="email" required ref={emailRef} id="email" />
        </div>
        <div className="input-group">
          <label htmlFor="noTelp">No. Telepon</label>
          <br />
          <input type="text" required ref={noTelpRef} id="noTelp" />
        </div>
        <div className="input-group">
          <label htmlFor="alamat">Alamat</label>
          <br />
          <input type="text" required ref={alamatRef} id="alamat" />
        </div>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
        <input type="submit" value="Join now" className="btn-save" />
      </form>
    </div>
  );
}
