import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { ModalContext } from "../contexts/ModalProvider";
import { baseUrl } from "../config";
import DoughnutChart from "../components/DoughnutChart";

export default function DetailGulaDarah() {
  const { user } = useContext(AuthContext);
  const { toggleModal } = useContext(ModalContext);
  const [userStatus, setUserStatus] = useState({});
  const [historyGulaDarah, setHistoryGulaDarah] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({});

  useEffect(() => {
    // Ambil data Status Gula Darah, dan History Gula Darah user dari backend dan dimasukkan ke state userStatus, historyGulaDarah
    // Kemudian data userStatus dan historyGulaDarah akan dipakai di UI untuk ditampilkan
    const fetchDataStatus = async () => {
      const dataMonthlyStats = await fetch(
        `${baseUrl}/getGulaDarahMonthlyStats?PelangganID=${user.PelangganID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const parsedDataMonthlyStats = await dataMonthlyStats.json();
      setMonthlyStats(parsedDataMonthlyStats);

      const dataUserStatus = await fetch(
        `${baseUrl}/getGulaDarahStats?PelangganID=${user.PelangganID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const parsedDataUserStatus = await dataUserStatus.json();
      setUserStatus(parsedDataUserStatus);

      const dataHistoryGulaDarah = await fetch(
        `${baseUrl}/getGulaDarahHistory?PelangganID=${user.PelangganID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const parsedDataHistoryGulaDarah = await dataHistoryGulaDarah.json();
      setHistoryGulaDarah(parsedDataHistoryGulaDarah);
    };

    fetchDataStatus();
  }, []);

  const statusGulaDarah = {
    1: {
      title: "Rendah",
      color: "yellow",
    },
    2: {
      title: "Normal",
      color: "green",
    },
    3: {
      title: "Tinggi",
      color: "red",
    },
  };

  function formatDate(dateString) {
    const date = new Date(dateString);

    const options = {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    return date.toLocaleString("en-US", options).replace(",", "");
  }

  return (
    <>
      <div className="head">
        <span>
          <h1>Detail Gula Darah</h1>
          <p>
            Hi <b>{user.Username}</b> . Welcome back to GulaSehat!
          </p>
        </span>
        <div className="group">
          <button className="btn-input-gula-darah" onClick={toggleModal}>
            <img src="/blood.png"></img>
            Input Gula Darah
          </button>
          <button className="btn-filter-periode">
            <ion-icon name="calendar-clear-outline"></ion-icon>
            <span>
              <h3>Filter Periode</h3>
              <p>17 April 2023 - 17 Mei 2024</p>
            </span>
            <ion-icon name="chevron-down-outline"></ion-icon>
          </button>
        </div>
      </div>
      <div className="status">
        <div className="status-card">
          <img src="/blood.png"></img>
          <span>
            <h1>
              {userStatus.latest} <span>mg/dL</span>
            </h1>
            <p>Gula Darah Terkini</p>
          </span>
        </div>
        <div className="status-card">
          <img src="/blood.png"></img>
          <span>
            <h1>
              {Math.ceil(userStatus.average)} <span>mg/dL</span>
            </h1>
            <p>Gula Darah Rata-rata</p>
          </span>
        </div>
        <div className="status-card">
          <img src="/blood.png"></img>
          <span>
            <h1>
              {userStatus.max} <span>mg/dL</span>
            </h1>
            <p>Gula Darah Tertinggi</p>
          </span>
        </div>
        <div className="status-card">
          <img src="/blood.png"></img>
          <span>
            <h1>
              {userStatus.min} <span>mg/dL</span>
            </h1>
            <p>Gula Darah Terendah</p>
          </span>
        </div>
      </div>
      
      <div className="charts">
        <DoughnutChart percentage={parseFloat(monthlyStats.high_percent)} label="High" />
        <DoughnutChart percentage={parseFloat(monthlyStats.low_percent)} label="Low" />
        <DoughnutChart percentage={parseFloat(monthlyStats.normal_percent)} label="Normal" />
      </div>
      <h3>Gula Darah History</h3>
      <table className="compact-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Level Gula Darah</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {historyGulaDarah.map((history, i) => (
            <tr key={i}>
              <td>{formatDate(history.Tanggal_Pengecekan)}</td>
              <td>{history.LevelGulaDarah}</td>
              <td
                style={{
                  color: statusGulaDarah[history.StatusGulaDarah].color,
                }}
              >
                {statusGulaDarah[history.StatusGulaDarah].title}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
