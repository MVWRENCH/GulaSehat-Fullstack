import { useContext, useEffect, useState } from "react";
import { foodRecommendationMock } from "../data";
import { baseUrl } from "../config";
import { AuthContext } from "../contexts/AuthProvider";

export default function RekomendasiMakanan() {
  const [foodList, setFoodList] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    async function fetchMakanan() {
      try {
        const response = await fetch(`${baseUrl}/getAllMakanan`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setFoodList(data); // Update foodList state with fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error state if needed
      }
    }

    fetchMakanan();
  }, []);

  async function handleAddToCart(MakananID) {
    try {
      const res = await fetch(
        `${baseUrl}/addToCart?PelangganID=${user.PelangganID}&MakananID=${MakananID}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!res.ok) throw new Error("Failed to Add to Cart");

      alert("Food Added to Cart!");

      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="food-list">
      {foodList.map((food) => (
        <div className="food-card" key={food.MakananID}>
          <div className="food-details">
            <h2>{food.Nama_Makanan}</h2>
            <p>{food.Kandungan_Makanan}</p>
            <b>Rp{food.Harga_Makanan}</b>
          </div>
          <img src={`/food.jpg`} alt={food.Nama_Makanan} />
          <button
            className="btn-add-to-cart"
            onClick={() => handleAddToCart(food.MakananID)}
          >
            <ion-icon name="add-circle-outline"></ion-icon>
          </button>
        </div>
      ))}
    </div>
  );
}
