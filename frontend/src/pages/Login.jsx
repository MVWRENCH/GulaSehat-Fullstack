import { useContext, useRef, useState } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { baseUrl } from "../config";

export default function Login() {
  const { setUser, setUserRole } = useContext(AuthContext);
  const usernameRef = useRef();
  const passwordRef = useRef();
  const [selectedRole, setSelectedRole] = useState("pelanggan");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      if (!usernameRef.current.value || !passwordRef.current.value) {
        throw new Error("All fields are required");
      }

      let endpoint;
      const queryParams = `Username=${usernameRef.current.value}&Password=${passwordRef.current.value}&Role=${selectedRole}`;

      switch (selectedRole) {
        case "pelanggan":
          endpoint = `${baseUrl}/login?${queryParams}`;
          break;
        case "dokter":
          endpoint = `${baseUrl}/loginDoctor?${queryParams}`;
          break;
        case "seller":
          endpoint = `${baseUrl}/loginseller?${queryParams}`;
          break;
        default:
          throw new Error("Invalid role selected");
      }

      const res = await fetch(endpoint, {
        method: "GET",
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Error response:", errorText);
        throw new Error("Failed to login");
      }

      const data = await res.json();
      setUser(data);
      setUserRole(selectedRole);

      alert("Login success!");
      window.location.href = "/"; // Redirect to home page after successful login
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="auth-page">
      <h1>Login</h1>
      <form action="#" onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="role">Login as</label>
          <br />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            id="role"
            style={{ width: "105%" }}
          >
            <option value="pelanggan">Pelanggan</option>
            <option value="dokter">Dokter</option>
            <option value="seller">Seller</option>
          </select>
        </div>
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
        <p>
          Need an account? <a href="/signup">Signup</a>
          <br />
          Need a Seller account? <a href="/signup-seller">Signup Seller</a>
          <br />
          Need a Dokter account? <a href="/signup-dokter">Signup Dokter</a>
        </p>

        <input
          type="submit"
          value="Login"
          className="btn-save"
          style={{ width: "105%" }}
        />
      </form>
    </div>
  );
}
