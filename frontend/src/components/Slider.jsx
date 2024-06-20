export default function Slider({ title, data }) {
  const mockData = [1, 1, 1, 1, 1];
  return (
    <div className="slider">
      <h1 style={{ paddingBottom: "12px" }}>{title}</h1>
      <div className="list-rekomendasi">
        {mockData.map((data, i) => (
          <div className="card-rekomendasi" key={i}>
            <div className="text">
              <span>
                <img src="/blank-profile.jpg" alt="" />
                <h3>
                  Sofia <br />
                  <p>2 days ago</p>
                </h3>
              </span>
              <p>
                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ad cum
                assumenda ducimus est repellendus mollitia iure nostrum minus,
                harum fugit itaque possimus dicta, consequuntur aliquam facere
                ipsam, doloremque at ipsum?
              </p>
            </div>
            <img src="/food.jpg" alt="" className="food-img" />
          </div>
        ))}
      </div>
    </div>
  );
}
