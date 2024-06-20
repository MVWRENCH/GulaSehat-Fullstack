// Dashboard.js
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthProvider";
import { ModalContext } from "../contexts/ModalProvider";
import FoodSlider from "../components/FoodSlider";
import AktivitasSlider from "../components/AktivitasSlider";
import { foodRecommendationMock } from "../data";
import { baseUrl } from "../config";
import DoughnutChart from "../components/DoughnutChart";
import DonutChart from "../components/DonutChart";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { toggleModal, setModalType } = useContext(ModalContext);
  const [userStatus, setUserStatus] = useState({});
  const [rekomendasiMakanan, setRekomendasiMakanan] = useState([]);
  const [rekomendasiKegiatan, setRekomendasiKegiatan] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const dataStatus = await fetch(
        `${baseUrl}/getGulaDarahStats?PelangganID=${user.PelangganID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const parsedDataStatus = await dataStatus.json();
      setUserStatus(parsedDataStatus);

      const dataRekomendasiMakanan = await fetch(
        `${baseUrl}/getFoodRecommendation?PelangganID=${user.PelangganID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const parsedDataRekomendasiMakanan = await dataRekomendasiMakanan.json();
      setRekomendasiMakanan(parsedDataRekomendasiMakanan);

      const dataRekomendasiKegiatan = await fetch(
        `${baseUrl}/getSuggestedActivities?PelangganID=${user.PelangganID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const parsedDataRekomendasiKegiatan =
        await dataRekomendasiKegiatan.json();
      setRekomendasiKegiatan(parsedDataRekomendasiKegiatan);

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
    };

    fetchData();
  }, []);

  return (
    <>
      <div className="head">
        <span>
          <h1>Dashboard</h1>
          <p>
            Hi <b>{user.PelangganID}</b> . Welcome back to GulaSehat!
          </p>
        </span>
        <div className="group">
          <button
            className="btn-input-gula-darah"
            onClick={() => {
              setModalType('inputGulaDarah')
              toggleModal();
            }}
          >
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
      <h1>Gula Darah Bulan Ini</h1>
      <div className="charts">
        <DoughnutChart
          percentage={parseFloat(monthlyStats.high_percent)}
          label="High"
        />
        <DoughnutChart
          percentage={parseFloat(monthlyStats.low_percent)}
          label="Low"
        />
        <DoughnutChart
          percentage={parseFloat(monthlyStats.normal_percent)}
          label="Normal"
        />
      </div>
      <FoodSlider data={rekomendasiMakanan} />
      <AktivitasSlider data={rekomendasiKegiatan} />
    </>
  );
}
