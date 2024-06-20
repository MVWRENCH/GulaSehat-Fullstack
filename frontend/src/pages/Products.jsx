import { useContext, useEffect, useState } from "react";
import { baseUrl } from "../config";
import { ModalContext } from "../contexts/ModalProvider";

export default function Products() {
  const [listMakanan, setListMakanan] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(""); // State for selected category
  const { toggleModal, setModalType, setSelectedMakanan } =
    useContext(ModalContext);

  useEffect(() => {
    async function fetchMakanan() {
      try {
        const response = await fetch(`${baseUrl}/getAllMakanan`);
        if (!response.ok) {
          throw new Error("Failed to fetch makanan");
        }
        const data = await response.json();

        // Filter listMakanan based on selectedCategory if it's set
        if (selectedCategory) {
          const filteredData = data.filter(
            (makanan) => makanan.KategoriID === selectedCategory
          );
          setListMakanan(filteredData);
        } else {
          setListMakanan(data);
        }
      } catch (error) {
        console.error("Error fetching makanan:", error);
        setError("Failed to fetch makanan. Please try again."); // Set error state
      }
    }

    fetchMakanan();
  }, [selectedCategory]); // Dependency on selectedCategory to refetch data when it changes

  // Function to handle category filter button click
  const handleFilterByCategory = (kategoriID) => {
    setSelectedCategory(kategoriID); // Set the selected category
  };

  async function handleButtonEditMakanan(MakananID) {
    try {
      const response = await fetch(
        `${baseUrl}/getMakanan?MakananID=${MakananID}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch makanan data");
      }
      const data = await response.json();
      setSelectedMakanan(data);
      setModalType("editMakanan");
      toggleModal();
    } catch (error) {
      console.error("Error fetching makanan data:", error);
    }
  }

  return (
    <>
      <h1>Products</h1>
      <div className="product-filter">
        <button
          onClick={() => handleFilterByCategory("")}
          className={selectedCategory === "" ? "active" : ""}
        >
          All
        </button>
        {/* Button to reset filter */}
        <button
          onClick={() => handleFilterByCategory("K001")}
          className={selectedCategory === "K001" ? "active" : ""}
        >
          Breakfast
        </button>
        <button
          onClick={() => handleFilterByCategory("K002")}
          className={selectedCategory === "K002" ? "active" : ""}
        >
          Appetizer
        </button>
        <button
          onClick={() => handleFilterByCategory("K003")}
          className={selectedCategory === "K003" ? "active" : ""}
        >
          Dessert
        </button>
        <button
          onClick={() => handleFilterByCategory("K004")}
          className={selectedCategory === "K004" ? "active" : ""}
        >
          Beverage
        </button>
        <button
          onClick={() => handleFilterByCategory("K005")}
          className={selectedCategory === "K005" ? "active" : ""}
        >
          Snack
        </button>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div className="product-list">
        <button
          className="product-card btn-add-new-dish"
          onClick={() => {
            setModalType("inputMakanan");
            toggleModal();
          }}
        >
          <ion-icon name="add-outline"></ion-icon>
          <p>Add new dish</p>
        </button>
        {listMakanan.map((item) => (
          <div className="product-card" key={item.MakananID}>
            <img src="/food.jpg" alt="" />
            <span>
              <b>{item.Nama_Makanan}</b>
              <p>Rp{item.Harga_Makanan}</p>
            </span>
            <button
              onClick={() => {
                handleButtonEditMakanan(item.MakananID);
              }}
            >
              <ion-icon name="create-outline"></ion-icon>Edit dish
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
