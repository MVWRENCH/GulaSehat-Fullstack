import { useContext } from "react";
import { AuthContext } from "../contexts/AuthProvider";

const SellerInfoCard = ({ number, icon, type }) => {
  return (
    <div className="seller-info-card">
      <span>
        <ion-icon name={`${icon}-outline`}></ion-icon>
        <p>
          +13.15%<ion-icon name="arrow-up-circle-outline"></ion-icon>
        </p>
      </span>
      <h1>{number}</h1>
      <p>{type}</p>
    </div>
  );
};

const mostOrderedMock = [
  {
    menu_name: "Spinach Salad",
    total: 200,
    image: "/Spinach Salad.jpg",
  },
  {
    menu_name: "Grilled Salmon",
    total: 200,
    image: "/Grilled Salmon.jpg",
  },
  {
    menu_name: "Fruit and Yogurt Parfait",
    total: 200,
    image: "/Fruit and Yogurt Parfait.jpg",
  },
];

export default function DashboardSeller() {
  const { user } = useContext(AuthContext);

  const historyOrderMock = [
    {
      OrderID: "OR00016927",
      Tanggal_Order: "2024-06-16 20:51:00",
      PelangganID: "User051759",
      PembayaranID: "P000087203",
      MakananID: "MK01289034",
      ItemID: null,
      Total_Harga_Order: 379000,
      Status: "Cancelled",
    },
    {
      OrderID: "OR00016927",
      Tanggal_Order: "2024-06-16 20:51:00",
      PelangganID: "User051759",
      PembayaranID: "P000087203",
      MakananID: "MK01289034",
      ItemID: null,
      Total_Harga_Order: 379000,
      Status: "Cancelled",
    },
    {
      OrderID: "OR00016927",
      Tanggal_Order: "2024-06-16 20:51:00",
      PelangganID: "User051759",
      PembayaranID: "P000087203",
      MakananID: "MK01289034",
      ItemID: null,
      Total_Harga_Order: 379000,
      Status: "Cancelled",
    },
    {
      OrderID: "OR00016927",
      Tanggal_Order: "2024-06-16 20:51:00",
      PelangganID: "User051759",
      PembayaranID: "P000087203",
      MakananID: "MK01289034",
      ItemID: null,
      Total_Harga_Order: 379000,
      Status: "Cancelled",
    },
    {
      OrderID: "OR00016927",
      Tanggal_Order: "2024-06-16 20:51:00",
      PelangganID: "User051759",
      PembayaranID: "P000087203",
      MakananID: "MK01289034",
      ItemID: null,
      Total_Harga_Order: 379000,
      Status: "Cancelled",
    },
    {
      OrderID: "OR00016927",
      Tanggal_Order: "2024-06-16 20:51:00",
      PelangganID: "User051759",
      PembayaranID: "P000087203",
      MakananID: "MK01289034",
      ItemID: null,
      Total_Harga_Order: 379000,
      Status: "Cancelled",
    },
  ];

  const statusOrder = {
    Cancelled: "red",
    Completed: "green",
    Preparing: "yellow",
  };

  return (
    <>
      <span>
        <h1>Dashboard</h1>
        <p>
          Hi <b>{user.PelangganID}</b> . Welcome back to GulaSehat!
        </p>
      </span>
      <div className="seller-info">
        <SellerInfoCard
          number={"Rp3.400.000"}
          icon={"cash"}
          type={"Total Pendapatan"}
        />
        <SellerInfoCard
          number={"222"}
          icon={"bookmark"}
          type={"Total Makanan di Order"}
        />
        <SellerInfoCard
          number={"40"}
          icon={"people"}
          type={"Total Pelanggan"}
        />
      </div>

      <div>
        <div className="seller-group">
          <div className="order-report">
            <span>
              <h1>Order Report</h1>
              <button className="btn-filter-order">
                <ion-icon name="options-outline"></ion-icon> Filter
              </button>
            </span>
            <table className="compact-table">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Menu Order</th>
                  <th>Total Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {historyOrderMock.map((history, i) => (
                  <tr key={i}>
                    <td>{history.PelangganID}</td>
                    <td>{history.MakananID}</td>
                    <td>{history.Total_Harga_Order}</td>
                    <td style={{ color: statusOrder[history.Status] }}>
                      {history.Status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="inner-group">
            <div className="order-report">
              <span>
                <h1>New Order</h1>
              </span>
              {mostOrderedMock.map((item, i) => (
                <div className="item-card" key={i}>
                  <img src={`${item.menu_name}.jpg`} alt="" />
                  <span>
                    <b>{item.menu_name}</b>
                    <p>{item.total} dishes ordered</p>
                  </span>
                </div>
              ))}
            </div>
            <div className="order-report">
              <span>
                <h1>Most Order</h1>
              </span>
              {mostOrderedMock.map((item, i) => (
                <div className="item-card" key={i}>
                  <img src={`${item.menu_name}.jpg`} alt="" />
                  <span>
                    <b>{item.menu_name}</b>
                    <p>{item.total} dishes ordered</p>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
