export default function FoodSlider({ data }) {
  return (
    <div className="slider">
      <h1 style={{ paddingBottom: "12px" }}>Rekomendasi Makanan</h1>
      <div className="list-rekomendasi">
        {data.map((data, i) => (
          <div className="card-rekomendasi" key={i}>
            <div className="text">
              <span>
                {/* <img src="/blank-profile.jpg" alt="" /> */}
                <h3>
                  {data.Nama_Makanan} <br />
                  <p>Harga: {data.Harga_Makanan}</p>
                </h3>
              </span>
              <p>
                {data.Kandungan_Makanan}
              </p>
            </div>
            {/* <img src={`${data.Recipe}.jpg`} alt={data.Recipe} className="food-img" /> */}
            <img src={`food.jpg`} alt={data.Recipe} className="food-img" />
          </div>
        ))}
      </div>
    </div>
  );
}
