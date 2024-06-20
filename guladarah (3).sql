-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 20, 2024 at 05:07 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `guladarah`
--

-- --------------------------------------------------------

--
-- Table structure for table `aktivitas`
--

CREATE TABLE `aktivitas` (
  `AktivitasID` varchar(10) NOT NULL,
  `Nama_Aktivitas` varchar(20) NOT NULL,
  `Status_Aktivitas` int(5) NOT NULL,
  `Keterangan` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `aktivitas`
--

INSERT INTO `aktivitas` (`AktivitasID`, `Nama_Aktivitas`, `Status_Aktivitas`, `Keterangan`) VALUES
('A001', 'Walking', 1, 'Jalan Selama 2 jam dengan kecepatan rendah'),
('A002', 'Swimming', 1, 'Renang selama 1,5 jam'),
('A003', 'Yoga', 1, 'Yoga selama 1 jam'),
('A004', 'Cycling', 1, 'Bersepeda selama 2 jam dengan kecepatan rendah'),
('A005', 'Pilates', 1, 'Pilates selama 1 sesi'),
('A007', 'Light Weights', 1, 'Angkat beban ringan 20x reps'),
('A009', 'Golf', 1, 'Golf dengan 9 hole'),
('AK00087601', 'Lari', 2, 'Lari dengan speed sedang selama 1 jam atau 10 ribu steps'),
('B001', 'Running', 2, '0'),
('B002', 'Swimming', 2, '0'),
('B003', 'Cycling', 2, '0'),
('B004', 'Yoga', 2, '0'),
('B005', 'Hiking', 2, '0'),
('B006', 'Weight Training', 2, '0'),
('B007', 'Basketball', 2, '0'),
('B008', 'Dancing', 2, '0'),
('B009', 'Pilates', 2, '0'),
('B010', 'Tennis', 2, '0'),
('C001', 'Walking', 3, '0'),
('C002', 'Swimming', 3, '0'),
('C003', 'Cycling', 3, '0'),
('C004', 'Yoga', 3, '0'),
('C005', 'Pilates', 3, '0'),
('C006', 'Jogging', 0, '0'),
('C007', 'Dancing', 0, '0'),
('C008', 'Weight Training', 0, '0'),
('C009', 'Rowing', 0, '0'),
('C010', 'Tennis', 0, '0');

-- --------------------------------------------------------

--
-- Table structure for table `dokter`
--

CREATE TABLE `dokter` (
  `DokterID` varchar(15) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(150) NOT NULL,
  `Nama_Dokter` varchar(50) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `Alamat_Praktik` varchar(100) NOT NULL,
  `No_Telp` bigint(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dokter`
--

INSERT INTO `dokter` (`DokterID`, `Username`, `Password`, `Nama_Dokter`, `Email`, `Alamat_Praktik`, `No_Telp`) VALUES
('Dokter20507', 'apeng', '$argon2id$v=19$m=65536,t=1,p=8$/R9aOTJ3eT/clpK//TXMUg$N/iSVe32QXL8SzILTLEa/wkdCUA9m5MxXM4FzQjwaL8', 'Marvel Stefano', 'marvelstefano13@gmail.com', 'Malang', 18231616455),
('Dokter2668', 'Marvel', '$argon2id$v=19$m=65536,t=1,p=8$R8vOA+R33RHsy12u5QbWQg$PGEUa0UVqoHqbAKzzrD8jsrPTTsp/KTON0z9CFQmZXQ', 'Marvel Stefano', 'marvelstefano13@gmail.com', 'Malang', 18231616455);

-- --------------------------------------------------------

--
-- Table structure for table `gula_darah`
--

CREATE TABLE `gula_darah` (
  `GulaDarahID` varchar(10) NOT NULL,
  `PelangganID` varchar(10) NOT NULL,
  `Tanggal_Pengecekan` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `LevelGulaDarah` float NOT NULL,
  `StatusGulaDarah` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `gula_darah`
--

INSERT INTO `gula_darah` (`GulaDarahID`, `PelangganID`, `Tanggal_Pengecekan`, `LevelGulaDarah`, `StatusGulaDarah`) VALUES
('GD00001896', 'User095455', '2024-06-13 14:05:48', 70.2, 2),
('GD00023730', 'User051759', '2024-06-16 12:23:50', 86, 2),
('GD00052607', 'User095455', '2024-05-23 11:34:53', 82.32, 2),
('GD00087476', 'User095455', '2024-05-26 13:27:56', 70.2, 2),
('GD00089107', 'User095455', '2024-05-27 15:03:11', 70.2, 2),
('GD00094231', 'User056523', '2024-05-23 11:39:49', 104.4, 3),
('GD00095524', 'User056523', '2024-05-23 11:39:08', 102.4, 3),
('GD00095613', 'User095455', '2024-05-24 04:47:11', 70.2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE `item` (
  `ItemID` varchar(10) NOT NULL,
  `Nama_Item` varchar(50) NOT NULL,
  `Harga_Item` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item`
--

INSERT INTO `item` (`ItemID`, `Nama_Item`, `Harga_Item`) VALUES
('item001', 'Premium', 39000);

-- --------------------------------------------------------

--
-- Table structure for table `kategori_makanan`
--

CREATE TABLE `kategori_makanan` (
  `KategoriID` varchar(10) NOT NULL,
  `Kategori_Makanan` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kategori_makanan`
--

INSERT INTO `kategori_makanan` (`KategoriID`, `Kategori_Makanan`) VALUES
('K001', 'Main Course'),
('K002', 'Appetizer'),
('K003', 'Dessert'),
('K004', 'Beverage'),
('K005', 'Snack');

-- --------------------------------------------------------

--
-- Table structure for table `keranjang`
--

CREATE TABLE `keranjang` (
  `KeranjangID` varchar(10) NOT NULL,
  `PelangganID` varchar(10) NOT NULL,
  `MakananID` varchar(10) DEFAULT NULL,
  `ItemID` varchar(10) DEFAULT NULL,
  `Kuantitas` int(10) NOT NULL,
  `Harga_Total` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `keranjang`
--

INSERT INTO `keranjang` (`KeranjangID`, `PelangganID`, `MakananID`, `ItemID`, `Kuantitas`, `Harga_Total`) VALUES
('KR00063376', 'User051759', 'MK01267890', NULL, 1, 15000);

-- --------------------------------------------------------

--
-- Table structure for table `makanan`
--

CREATE TABLE `makanan` (
  `MakananID` varchar(10) NOT NULL,
  `KategoriID` varchar(10) NOT NULL,
  `Nama_Makanan` varchar(50) NOT NULL,
  `Kandungan_Makanan` varchar(150) NOT NULL,
  `PenjualID` varchar(20) NOT NULL,
  `Harga_Makanan` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `makanan`
--

INSERT INTO `makanan` (`MakananID`, `KategoriID`, `Nama_Makanan`, `Kandungan_Makanan`, `PenjualID`, `Harga_Makanan`) VALUES
('MK00041313', 'K001', 'Steak', '200gr Beef, 5gr garlic, 2gr pepper, 2gr Sugar, 2gr Salt, 10ml olive oil', 'Seller070567', 25000),
('MK00050787', 'K001', 'Soto', 'Daging ayam, nasi, mie', 'Seller070567', 25000),
('MK01234567', 'K005', 'Yogurt dengan Madu', 'Probiotik, Vitamin', 'Seller070567', 34000),
('MK01267890', 'K005', 'Biskuit Gandum', 'Serat, Karbohidrat Kompleks', 'Seller070567', 15000),
('MK01289034', 'K002', 'Capcay dengan Tofu', 'Serat, Vitamin', 'Seller070567', 64000),
('MK12345678', 'K001', 'Nasi Putih dengan Ayam Rebus', 'Karbohidrat, Protein', 'Seller070567', 0),
('MK12378901', 'K001', 'Tumis Brokoli dengan Daging Ayam', 'Serat, Protein', 'Seller070567', 0),
('MK12390145', 'K001', 'Salmon Panggang dengan Sayuran', 'Protein, Omega 3', 'Seller070567', 0),
('MK23401256', 'K005', 'Granola dengan Susu', 'Serat, Vitamin', 'Seller070567', 0),
('MK23456789', 'K002', 'Sup Sayur dengan Kentang', 'Vitamin, Mineral, Serat', 'Seller070567', 0),
('MK23489012', 'K002', 'Sayur Bening Bayam', 'Vitamin, Mineral', 'Seller070567', 0),
('MK34512367', 'K001', 'Nasi Merah dengan Ayam Bakar', 'Karbohidrat, Protein', 'Seller070567', 0),
('MK34567890', 'K001', 'Ikan Panggang dengan Nasi', 'Protein, Omega 3', 'Seller070567', 0),
('MK34590123', 'K001', 'Nasi Merah dengan Ikan Bakar', 'Karbohidrat Kompleks, Protein', 'Seller070567', 0),
('MK45601234', 'K005', 'Buah Apel', 'Serat, Vitamin', 'Seller070567', 0),
('MK45623478', 'K002', 'Sop Ayam dengan Jagung', 'Protein, Vitamin', 'Seller070567', 0),
('MK45678901', 'K003', 'Buah Potong Segar', 'Vitamin, Mineral', 'Seller070567', 0),
('MK56712345', 'K001', 'Nasi Jagung dengan Ikan Kukus', 'Karbohidrat Kompleks, Protein', 'Seller070567', 0),
('MK56734589', 'K001', 'Daging Sapi Panggang dengan Kentang', 'Protein, Zat Besi', 'Seller070567', 0),
('MK56789012', 'K004', 'Jus Jeruk Segar', 'Vitamin C, Antioksidan', 'Seller070567', 0),
('MK67823456', 'K002', 'Sayur Asam dengan Tempe', 'Serat, Vitamin', 'Seller070567', 0),
('MK67845690', 'K003', 'Puding Chia dengan Buah', 'Serat, Antioksidan', 'Seller070567', 0),
('MK67890123', 'K005', 'Kacang Almond', 'Protein, Lemak Sehat', 'Seller070567', 0),
('MK78901234', 'K001', 'Oatmeal dengan Buah', 'Serat, Vitamin', 'Seller070567', 0),
('MK78934567', 'K001', 'Daging Ayam Panggang dengan Sayuran', 'Protein, Vitamin', 'Seller070567', 0),
('MK78956701', 'K004', 'Smoothie Berry', 'Vitamin, Mineral', 'Seller070567', 0),
('MK89012345', 'K002', 'Salad Hijau', 'Serat, Vitamin, Mineral', 'Seller070567', 0),
('MK89045678', 'K003', 'Buah-buahan Beri', 'Vitamin, Antioksidan', 'Seller070567', 0),
('MK89067812', 'K005', 'Kacang Mete', 'Protein, Lemak Sehat', 'Seller070567', 0),
('MK90123456', 'K001', 'Telur Rebus dengan Roti Gandum', 'Protein, Karbohidrat', 'Seller070567', 0),
('MK90156789', 'K004', 'Teh Hijau', 'Antioksidan', 'Seller070567', 0),
('MK90178923', 'K001', 'Nasi Kuning dengan Ayam Goreng', 'Karbohidrat, Protein', 'Seller070567', 0);

-- --------------------------------------------------------

--
-- Table structure for table `order_pelanggan`
--

CREATE TABLE `order_pelanggan` (
  `OrderID` varchar(10) NOT NULL,
  `Tanggal_Order` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `PelangganID` varchar(10) NOT NULL,
  `PembayaranID` varchar(10) NOT NULL,
  `MakananID` varchar(10) DEFAULT NULL,
  `ItemID` varchar(10) DEFAULT NULL,
  `Total_Harga_Order` int(11) NOT NULL,
  `Status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_pelanggan`
--

INSERT INTO `order_pelanggan` (`OrderID`, `Tanggal_Order`, `PelangganID`, `PembayaranID`, `MakananID`, `ItemID`, `Total_Harga_Order`, `Status`) VALUES
('OR00016927', '2024-06-16 13:51:00', 'User051759', 'P000087203', 'MK01289034', NULL, 379000, 'Cancelled');

-- --------------------------------------------------------

--
-- Table structure for table `pelanggan`
--

CREATE TABLE `pelanggan` (
  `PelangganID` varchar(10) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(150) NOT NULL,
  `Nama_Lengkap` varchar(20) NOT NULL,
  `Email` varchar(20) NOT NULL,
  `DOB` date NOT NULL,
  `Alamat` varchar(50) NOT NULL,
  `Jenis_Kelamin` varchar(10) NOT NULL,
  `Berat_Badan` int(11) NOT NULL,
  `tipe_akun` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pelanggan`
--

INSERT INTO `pelanggan` (`PelangganID`, `Username`, `Password`, `Nama_Lengkap`, `Email`, `DOB`, `Alamat`, `Jenis_Kelamin`, `Berat_Badan`, `tipe_akun`) VALUES
('User051759', 'Apeng', '$argon2id$v=19$m=65536,t=1,p=8$F1U+YUdSW4gPptQF23da/Q$tCML4dkuA3xjEwkB1aRYbbksnvFTzDnIW6iUi2qZ9+M', 'Marvel ', 'mv@gmail.com', '2004-06-07', 'Surabaya', 'Male', 85, 0),
('User056523', 'Effendi', '$argon2id$v=19$m=65536,t=1,p=8$ake96V6J6xEbTUqM6faH0w$WRYNxJO86Z1SwBF2jJfX5f770o0I4Dj/33vFShwPyS0', 'Jerry123', 'Jerry@gmail.com', '2003-10-27', 'Malang', 'Male', 60, 0),
('User061303', 'Billy', '$argon2id$v=19$m=65536,t=1,p=8$MLIZdxHhyKP93fVO5yRykQ$h4h0ya+BHyfoLROiiQCxDKF0d39Do2sUvmqWvi+p5iY', 'Billy Jason', 'Jason.gunawan@binus.', '2004-08-25', 'malang', 'Male', 65, 0),
('User064635', 'testpelangggan', '$argon2id$v=19$m=65536,t=1,p=8$35cS7m88Hzee5xT3u1cOAg$31xOfuLx6NB8BBuKIYtqguIM/n3dk0YDIqxg+aO52Jw', 'test pelangggan', 'testpelangggan@binus', '2004-08-25', 'malang', 'Male', 65, 0),
('User095455', 'MV', '$argon2id$v=19$m=65536,t=1,p=8$Wq7lxW3+NXbHrft275f2NA$00fGCR1uVdBwLbhYQUngqTG7n0FT4hvEuQqfWPmpWOg', 'Marvel Stefano', 'marvelstefano@gmail.', '2004-06-07', 'Surabaya', 'Male', 70, 0);

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
--

CREATE TABLE `pembayaran` (
  `PembayaranID` varchar(10) NOT NULL,
  `Tanggal_Pembayaran` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `Metode_Pembayaran` varchar(15) NOT NULL,
  `Nominal_Pembayaran` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pembayaran`
--

INSERT INTO `pembayaran` (`PembayaranID`, `Tanggal_Pembayaran`, `Metode_Pembayaran`, `Nominal_Pembayaran`) VALUES
('P000087203', '2024-06-16 11:02:51', 'Credit Card', 379000);

-- --------------------------------------------------------

--
-- Table structure for table `penjual`
--

CREATE TABLE `penjual` (
  `PenjualID` varchar(15) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(150) NOT NULL,
  `Nama_Penjual` varchar(50) NOT NULL,
  `Nama_Bisnis` varchar(50) NOT NULL,
  `Email` varchar(50) NOT NULL,
  `No_Telp` bigint(11) NOT NULL,
  `Alamat` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `penjual`
--

INSERT INTO `penjual` (`PenjualID`, `Username`, `Password`, `Nama_Penjual`, `Nama_Bisnis`, `Email`, `No_Telp`, `Alamat`) VALUES
('Seller070567', 'Apeng', '$argon2id$v=19$m=65536,t=1,p=8$qIVZYJvYP8jlJCFI614+tA$S1w9HxsIit579WllL2tR6ROXBUGv1vinzcvEteYMMXE', 'Marvel', 'Male', 'marvel@gmail.com', 18230245685, 'malang');

-- --------------------------------------------------------

--
-- Table structure for table `rekomendasi_aktivitas`
--

CREATE TABLE `rekomendasi_aktivitas` (
  `RekomendasiID` varchar(10) NOT NULL,
  `Gula_DarahID` varchar(10) NOT NULL,
  `AktivitasID` varchar(10) NOT NULL,
  `Nama_Aktivitas` varchar(20) NOT NULL,
  `Keterangan` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rekomendasi_aktivitas`
--

INSERT INTO `rekomendasi_aktivitas` (`RekomendasiID`, `Gula_DarahID`, `AktivitasID`, `Nama_Aktivitas`, `Keterangan`) VALUES
('RK0574d40f', 'GD00094231', 'C004', 'Yoga', '0'),
('RK088d0b1a', 'GD00094231', 'C003', 'Cycling', '0'),
('RK0ebb1b27', 'GD00094231', 'C002', 'Swimming', '0'),
('RK36613f69', 'GD00094231', 'C005', 'Pilates', '0'),
('RK3b54af17', 'GD00094231', 'C004', 'Yoga', '0'),
('RK4404d565', 'GD00094231', 'C002', 'Swimming', '0'),
('RK475e3264', 'GD00094231', 'C003', 'Cycling', '0'),
('RK4d03f398', 'GD00094231', 'C002', 'Swimming', '0'),
('RK4ff636c8', 'GD00094231', 'C001', 'Walking', '0'),
('RK5390d8ae', 'GD00094231', 'C003', 'Cycling', '0'),
('RK763751b5', 'GD00094231', 'C002', 'Swimming', '0'),
('RK7d168052', 'GD00094231', 'C004', 'Yoga', '0'),
('RK80869ec7', 'GD00094231', 'C003', 'Cycling', '0'),
('RK8793fe15', 'GD00094231', 'C001', 'Walking', '0'),
('RK9acec2bb', 'GD00094231', 'C002', 'Swimming', '0'),
('RK9ece9924', 'GD00094231', 'C001', 'Walking', '0'),
('RKab90e625', 'GD00094231', 'C005', 'Pilates', '0'),
('RKabfe7b8b', 'GD00094231', 'C001', 'Walking', '0'),
('RKc0912e57', 'GD00094231', 'C005', 'Pilates', '0'),
('RKc0bcb4b8', 'GD00094231', 'C005', 'Pilates', '0'),
('RKcbd4d4d8', 'GD00094231', 'C003', 'Cycling', '0'),
('RKd4f6712a', 'GD00094231', 'C004', 'Yoga', '0'),
('RKd4f8652e', 'GD00094231', 'C004', 'Yoga', '0'),
('RKdd18eac3', 'GD00094231', 'C005', 'Pilates', '0'),
('RKf31169c8', 'GD00094231', 'C001', 'Walking', '0');

-- --------------------------------------------------------

--
-- Table structure for table `rekomendasi_makanan`
--

CREATE TABLE `rekomendasi_makanan` (
  `RekomendasiID` varchar(10) NOT NULL,
  `Gula_DarahID` varchar(10) DEFAULT NULL,
  `MakananID` varchar(10) DEFAULT NULL,
  `Nama_Makanan` varchar(20) DEFAULT NULL,
  `Kandungan_Makanan` varchar(20) DEFAULT NULL,
  `PenjualID` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rekomendasi_makanan`
--

INSERT INTO `rekomendasi_makanan` (`RekomendasiID`, `Gula_DarahID`, `MakananID`, `Nama_Makanan`, `Kandungan_Makanan`, `PenjualID`) VALUES
('RK01987724', 'GD00094231', 'MK23401256', 'Granola dengan Susu', 'Serat, Vitamin', NULL),
('RK07835d63', 'GD00094231', 'MK01267890', 'Biskuit Gandum', 'Serat, Karbohidrat K', NULL),
('RK0bb662af', 'GD00094231', 'MK56712345', 'Nasi Jagung dengan I', 'Karbohidrat Kompleks', NULL),
('RK22832a4c', 'GD00094231', 'MK23456789', 'Sup Sayur dengan Ken', 'Vitamin, Mineral, Se', NULL),
('RK2bfb0282', 'GD00094231', 'MK01267890', 'Biskuit Gandum', 'Serat, Karbohidrat K', NULL),
('RK31a34d53', 'GD00094231', 'MK01267890', 'Biskuit Gandum', 'Serat, Karbohidrat K', NULL),
('RK324f2dc6', 'GD00094231', 'MK01289034', 'Capcay dengan Tofu', 'Serat, Vitamin', NULL),
('RK3c0350e8', 'GD00094231', 'MK01267890', 'Biskuit Gandum', 'Serat, Karbohidrat K', NULL),
('RK3da92d5c', 'GD00094231', 'MK45601234', 'Buah Apel', 'Serat, Vitamin', NULL),
('RK503227d4', 'GD00094231', 'MK23456789', 'Sup Sayur dengan Ken', 'Vitamin, Mineral, Se', NULL),
('RK50e6b5ca', 'GD00094231', 'MK01234567', 'Yogurt dengan Madu', 'Probiotik, Vitamin', NULL),
('RK5ac1e1cf', 'GD00094231', 'MK01234567', 'Yogurt dengan Madu', 'Probiotik, Vitamin', NULL),
('RK6f3406f5', 'GD00094231', 'MK45601234', 'Buah Apel', 'Serat, Vitamin', NULL),
('RK727ec9ff', 'GD00094231', 'MK23401256', 'Granola dengan Susu', 'Serat, Vitamin', NULL),
('RK7bc4aea0', 'GD00094231', 'MK01234567', 'Yogurt dengan Madu', 'Probiotik, Vitamin', NULL),
('RK8c9fb73c', 'GD00094231', 'MK23489012', 'Sayur Bening Bayam', 'Vitamin, Mineral', NULL),
('RK956ef6bd', 'GD00094231', 'MK01234567', 'Yogurt dengan Madu', 'Probiotik, Vitamin', NULL),
('RK9d3eff45', 'GD00094231', 'MK45601234', 'Buah Apel', 'Serat, Vitamin', NULL),
('RK9eb2d246', 'GD00094231', 'MK23401256', 'Granola dengan Susu', 'Serat, Vitamin', NULL),
('RKbb51b382', 'GD00094231', 'MK23456789', 'Sup Sayur dengan Ken', 'Vitamin, Mineral, Se', NULL),
('RKbf2356db', 'GD00094231', 'MK23401256', 'Granola dengan Susu', 'Serat, Vitamin', NULL),
('RKc483a5fd', 'GD00094231', 'MK01289034', 'Capcay dengan Tofu', 'Serat, Vitamin', NULL),
('RKc91b0df9', 'GD00094231', 'MK01267890', 'Biskuit Gandum', 'Serat, Karbohidrat K', NULL),
('RKca89a598', 'GD00094231', 'MK01234567', 'Yogurt dengan Madu', 'Probiotik, Vitamin', NULL),
('RKcb28873a', 'GD00094231', 'MK23456789', 'Sup Sayur dengan Ken', 'Vitamin, Mineral, Se', NULL),
('RKd094c537', 'GD00094231', 'MK01289034', 'Capcay dengan Tofu', 'Serat, Vitamin', NULL),
('RKda313e3d', 'GD00094231', 'MK78901234', 'Oatmeal dengan Buah', 'Serat, Vitamin', NULL),
('RKdb932723', 'GD00094231', 'MK01289034', 'Capcay dengan Tofu', 'Serat, Vitamin', NULL),
('RKf84638a5', 'GD00094231', 'MK01267890', 'Biskuit Gandum', 'Serat, Karbohidrat K', NULL),
('RKf988375a', 'GD00094231', 'MK45623478', 'Sop Ayam dengan Jagu', 'Protein, Vitamin', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `aktivitas`
--
ALTER TABLE `aktivitas`
  ADD PRIMARY KEY (`AktivitasID`);

--
-- Indexes for table `dokter`
--
ALTER TABLE `dokter`
  ADD PRIMARY KEY (`DokterID`);

--
-- Indexes for table `gula_darah`
--
ALTER TABLE `gula_darah`
  ADD PRIMARY KEY (`GulaDarahID`,`PelangganID`),
  ADD KEY `UserID` (`PelangganID`);

--
-- Indexes for table `item`
--
ALTER TABLE `item`
  ADD PRIMARY KEY (`ItemID`);

--
-- Indexes for table `kategori_makanan`
--
ALTER TABLE `kategori_makanan`
  ADD PRIMARY KEY (`KategoriID`);

--
-- Indexes for table `keranjang`
--
ALTER TABLE `keranjang`
  ADD PRIMARY KEY (`KeranjangID`,`PelangganID`),
  ADD KEY `ItemID` (`ItemID`),
  ADD KEY `FK_KustomerID` (`PelangganID`),
  ADD KEY `FK_MakananID` (`MakananID`);

--
-- Indexes for table `makanan`
--
ALTER TABLE `makanan`
  ADD PRIMARY KEY (`MakananID`),
  ADD KEY `KategoriID` (`KategoriID`),
  ADD KEY `PenjualID` (`PenjualID`);

--
-- Indexes for table `order_pelanggan`
--
ALTER TABLE `order_pelanggan`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `FK_Order_Kustomer` (`PelangganID`),
  ADD KEY `FK_Order_Pembayaran` (`PembayaranID`),
  ADD KEY `FK_Order_Makanan` (`MakananID`),
  ADD KEY `FK_item` (`ItemID`);

--
-- Indexes for table `pelanggan`
--
ALTER TABLE `pelanggan`
  ADD PRIMARY KEY (`PelangganID`,`Username`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`PembayaranID`);

--
-- Indexes for table `penjual`
--
ALTER TABLE `penjual`
  ADD PRIMARY KEY (`PenjualID`),
  ADD UNIQUE KEY `PenjualID` (`PenjualID`);

--
-- Indexes for table `rekomendasi_aktivitas`
--
ALTER TABLE `rekomendasi_aktivitas`
  ADD PRIMARY KEY (`RekomendasiID`),
  ADD KEY `Gula_DarahID` (`Gula_DarahID`),
  ADD KEY `AktivitasID` (`AktivitasID`);

--
-- Indexes for table `rekomendasi_makanan`
--
ALTER TABLE `rekomendasi_makanan`
  ADD PRIMARY KEY (`RekomendasiID`),
  ADD KEY `Gula_DarahID` (`Gula_DarahID`),
  ADD KEY `MakananID` (`MakananID`),
  ADD KEY `PenjualID` (`PenjualID`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `gula_darah`
--
ALTER TABLE `gula_darah`
  ADD CONSTRAINT `gula_darah_ibfk_1` FOREIGN KEY (`PelangganID`) REFERENCES `pelanggan` (`PelangganID`);

--
-- Constraints for table `keranjang`
--
ALTER TABLE `keranjang`
  ADD CONSTRAINT `FK_KustomerID` FOREIGN KEY (`PelangganID`) REFERENCES `pelanggan` (`PelangganID`),
  ADD CONSTRAINT `FK_MakananID` FOREIGN KEY (`MakananID`) REFERENCES `makanan` (`MakananID`),
  ADD CONSTRAINT `keranjang_ibfk_1` FOREIGN KEY (`ItemID`) REFERENCES `item` (`ItemID`);

--
-- Constraints for table `makanan`
--
ALTER TABLE `makanan`
  ADD CONSTRAINT `makanan_ibfk_1` FOREIGN KEY (`KategoriID`) REFERENCES `kategori_makanan` (`KategoriID`),
  ADD CONSTRAINT `makanan_ibfk_2` FOREIGN KEY (`PenjualID`) REFERENCES `penjual` (`PenjualID`);

--
-- Constraints for table `order_pelanggan`
--
ALTER TABLE `order_pelanggan`
  ADD CONSTRAINT `FK_Order_Kustomer` FOREIGN KEY (`PelangganID`) REFERENCES `pelanggan` (`PelangganID`),
  ADD CONSTRAINT `FK_Order_Makanan` FOREIGN KEY (`MakananID`) REFERENCES `makanan` (`MakananID`),
  ADD CONSTRAINT `FK_Order_Pembayaran` FOREIGN KEY (`PembayaranID`) REFERENCES `pembayaran` (`PembayaranID`),
  ADD CONSTRAINT `FK_item` FOREIGN KEY (`ItemID`) REFERENCES `item` (`ItemID`);

--
-- Constraints for table `rekomendasi_aktivitas`
--
ALTER TABLE `rekomendasi_aktivitas`
  ADD CONSTRAINT `rekomendasi_aktivitas_ibfk_1` FOREIGN KEY (`Gula_DarahID`) REFERENCES `gula_darah` (`GulaDarahID`),
  ADD CONSTRAINT `rekomendasi_aktivitas_ibfk_2` FOREIGN KEY (`AktivitasID`) REFERENCES `aktivitas` (`AktivitasID`);

--
-- Constraints for table `rekomendasi_makanan`
--
ALTER TABLE `rekomendasi_makanan`
  ADD CONSTRAINT `rekomendasi_makanan_ibfk_1` FOREIGN KEY (`Gula_DarahID`) REFERENCES `gula_darah` (`GulaDarahID`),
  ADD CONSTRAINT `rekomendasi_makanan_ibfk_2` FOREIGN KEY (`MakananID`) REFERENCES `makanan` (`MakananID`),
  ADD CONSTRAINT `rekomendasi_makanan_ibfk_3` FOREIGN KEY (`PenjualID`) REFERENCES `penjual` (`PenjualID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
