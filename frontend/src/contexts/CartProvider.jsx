import { createContext, useState, useEffect, useContext } from "react";
import { baseUrl } from "../config";
import { AuthContext } from "../contexts/AuthProvider";

export const CartContext = createContext();

export default function CartProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(() => {
    return localStorage.getItem("cartCount")
      ? parseInt(localStorage.getItem("cartCount"), 10)
      : 0;
  });

  function changeCartCount(int) {
    setCartCount(int);
    localStorage.setItem("cartCount", int);
  }

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/getCart?PelangganID=${user.PelangganID}`,
          { method: "GET" }
        );
        if (!res.ok) throw new Error("Error fetching cart data");
        const parsedRes = await res.json();

        const sumKuantitas = parsedRes.reduce(
          (total, item) => total + item.kuantitas,
          0
        );

        changeCartCount(sumKuantitas);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (user && user.PelangganID) {
      fetchCartData();
    }
  }, [user]);

  return (
    <CartContext.Provider value={{ cartCount, changeCartCount }}>
      {children}
    </CartContext.Provider>
  );
}
