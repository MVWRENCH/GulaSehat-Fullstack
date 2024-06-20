export default function AktivitasSlider({ data }) {
  return (
    <div className="slider">
      <h1 style={{ paddingBottom: "12px" }}>Rekomendasi Aktivitas</h1>
      <div className="list-rekomendasi">
        {data.map((data, i) => (
          <div className="card-rekomendasi" key={i}>
            <div className="text">
              <span>
                {/* <img src="/blank-profile.jpg" alt="" /> */}
                <h3>
                  {data.Nama_Aktivitas} <br />
                </h3>
              </span>
              <p>{data.Keterangan}</p>
            </div>
            <img
              src={`${data.Nama_Aktivitas}.jpg`}
              alt={data.Nama_Aktivitas}
              className="food-img"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
