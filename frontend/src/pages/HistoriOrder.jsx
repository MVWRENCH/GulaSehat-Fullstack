export default function HistoriOrder() {
  const orderHistoryMock = [
    {
      OrderID: "OR00016927",
      Tanggal_Order: "2024-06-16 20:51:00",
      PelangganID: "User051759",
      PembayaranID: "P000087203",
      MakananID: "MK01289034",
      Total_Harga_Order: 379000,
      ItemID: {
        String: "",
        Valid: false,
      },
      Status: "Cancelled",
    },
    {
      OrderID: "OR00016927",
      Tanggal_Order: "2024-06-16 20:51:00",
      PelangganID: "User051759",
      PembayaranID: "P000087203",
      MakananID: "MK01289034",
      Total_Harga_Order: 379000,
      ItemID: {
        String: "",
        Valid: false,
      },
      Status: "Cancelled",
    },
    {
      OrderID: "OR00016927",
      Tanggal_Order: "2024-06-16 20:51:00",
      PelangganID: "User051759",
      PembayaranID: "P000087203",
      MakananID: "MK01289034",
      Total_Harga_Order: 379000,
      ItemID: {
        String: "",
        Valid: false,
      },
      Status: "Cancelled",
    },
    {
      OrderID: "OR00016927",
      Tanggal_Order: "2024-06-16 20:51:00",
      PelangganID: "User051759",
      PembayaranID: "P000087203",
      MakananID: "MK01289034",
      Total_Harga_Order: 379000,
      ItemID: {
        String: "",
        Valid: false,
      },
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
      <h1>Histori Order</h1>
      <table className="compact-table">
        <thead>
          <tr>
            <th>Tanggal Order</th>
            <th>Order ID</th>
            <th>Pembayaran ID</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orderHistoryMock.map((history, i) => (
            <tr key={i}>
              <td>{history.OrderID}</td>
              <td>{history.Tanggal_Order}</td>
              <td>{history.PembayaranID}</td>
              <td style={{ color: statusOrder[history.Status] }}>
                {history.Status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
