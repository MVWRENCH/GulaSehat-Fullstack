import { useContext, useEffect, useState } from "react";
import { baseUrl } from "../config";
import { AuthContext } from "../contexts/AuthProvider";
import { CartContext } from "../contexts/CartProvider";

export default function Cart() {
  const [listCart, setListCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nameOnCard, setNameOnCard] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [cvv, setCvv] = useState("");
  const { user } = useContext(AuthContext);
  const { changeCartCount } = useContext(CartContext);

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/getCart?PelangganID=${user.PelangganID}`,
          { method: "GET" }
        );
        if (!res.ok) throw new Error("Error fetching cart data");
        const parsedRes = await res.json();
        setListCart(parsedRes);
      } catch (error) {
        alert(error.message);
      }
    };

    if (user && user.PelangganID) {
      fetchCartData();
    }
  }, [user]);

  useEffect(() => {
    // Calculate sum of item.kuantitas in listCart
    const sumKuantitas = listCart.reduce(
      (total, item) => total + item.kuantitas,
      0
    );

    changeCartCount(sumKuantitas);

    // Calculate total price
    const calculatedTotalPrice = listCart.reduce(
      (total, item) => total + item.harga_total,
      0
    );
    setTotalPrice(calculatedTotalPrice);
  }, [listCart, changeCartCount]);

  const handleCheckout = async () => {
    try {
      const expirationParts = expirationDate.split("-");
      const expirationMonth = expirationParts[1];
      const expirationYear = expirationParts[0];

      const res = await fetch(
        `${baseUrl}/checkout?PelangganID=${user.PelangganID}&NameonCard=${nameOnCard}&CardNumber=${cardNumber}&ExpirationMonth=${expirationMonth}&ExpirationYear=${expirationYear}&CVV=${cvv}`,
        { method: "POST", headers: { "Content-Type": "application/json" } }
      );

      if (!res.ok) throw new Error("Failed to complete checkout");

      alert("Checkout successful");
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  async function handleIncrementQty(KeranjangID) {
    try {
      const res = await fetch(
        `${baseUrl}/AddQuantity?KeranjangID=${KeranjangID}&PelangganID=${user.PelangganID}`
      );

      if (!res.ok) throw new Error("Failed to increase item qty");

      alert("Item QTY Increased");
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDecreaseQty(KeranjangID) {
    try {
      const res = fetch(
        `${baseUrl}/reduceQuantity?KeranjangID=${KeranjangID}&PelangganID=${user.PelangganID}`
      );
      if (!res.ok) throw new Error("Failed to decrease item qty");

      alert("Item QTY Decreased");
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <>
      <h1>Cart {user.PelangganID}</h1>
      <div className="cart-group">
        <div className="cart-list">
          {listCart.map((item, i) => (
            <div className="cart-item" key={i}>
              <span>
                <img src="/food.jpg" alt="" />
                <b>{item.makanan_id}</b>
              </span>
              <div className="qty-handler">
                {item.kuantitas}
                <div className="buttons">
                  <button onClick={() => handleIncrementQty(item.keranjang_id)}>
                    <ion-icon name="caret-up-outline"></ion-icon>
                  </button>
                  <button onClick={() => handleDecreaseQty(item.keranjang_id)}>
                    <ion-icon name="caret-down-outline"></ion-icon>
                  </button>
                </div>
              </div>
              <p>Rp{item.harga_total}</p>
              <button className="btn-delete-from-cart">
                <ion-icon name="trash-outline"></ion-icon>
              </button>
            </div>
          ))}
        </div>
        <div className="payment-card">
          <h3>Payment Info</h3>
          <p>Card type</p>
          <div className="card-types">
            <div className="card-type-card">VISA</div>
            <div className="card-type-card">VISA</div>
            <div className="card-type-card">VISA</div>
            <div className="card-type-card">VISA</div>
          </div>
          <p>Name on card</p>
          <input
            type="text"
            placeholder="Name"
            value={nameOnCard}
            onChange={(e) => setNameOnCard(e.target.value)}
          />
          <p>Card number</p>
          <input
            type="text"
            placeholder="Card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
          />
          <div className="input-group">
            <span>
              <p>Expiration date</p>
              <input
                type="month"
                placeholder="Expiration date"
                value={expirationDate}
                onChange={(e) => setExpirationDate(e.target.value)}
              />
            </span>
            <span>
              <p>CVV</p>
              <input
                type="text"
                placeholder="..."
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
              />
            </span>
          </div>
          <div className="row-detail">
            <p>Subtotal</p>
            <b>Rp{totalPrice}</b>
          </div>
          <div className="row-detail">
            <p>Shipping</p>
            <b>Rp34000</b>
          </div>
          <div className="row-detail">
            <p>Total (Tax Incl.)</p>
            <b>Rp{totalPrice}</b>
          </div>
          <button className="btn-checkout" onClick={handleCheckout}>
            <p>Rp{totalPrice}</p>Checkout
          </button>
        </div>
      </div>
    </>
  );
}
