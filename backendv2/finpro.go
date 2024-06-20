package main

import (
	"context"
	"database/sql"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/alexedwards/argon2id"
	creditcard "github.com/durango/go-credit-card"
	_ "github.com/go-sql-driver/mysql"
	"github.com/google/generative-ai-go/genai"
	"github.com/joho/godotenv"
	"google.golang.org/api/option"
)

type User struct {
	PelangganID   string    `json:"PelangganID"`
	Username      string    `json:"Username"`
	Password      string    `json:"Password"`
	Nama_Lengkap  string    `json:"Nama_Lengkap"`
	Email         string    `json:"Email"`
	DOB           time.Time `json:"DOB"`
	Alamat        string    `json:"Alamat"`
	Jenis_Kelamin string    `json:"Jenis_Kelamin"`
	Berat_Badan   int       `json:"Berat_Badan"`
	Tipe_Akun     int       `json:"tipe_akun"`
}

type Penjual struct {
	PenjualID    string `json:"PenjualID"`
	Username     string `json:"Username"`
	Password     string `json:"Password"`
	Nama_Penjual string `json:"Nama_Penjual"`
	Nama_Bisnis  string `json:"Nama_Bisnis"`
	Email        string `json:"Email"`
	No_Telp      int64  `json:"No_Telp"`
	Alamat       string `json:"Alamat"`
}

type Dokter struct {
	DokterID       string `json:"DokterID"`
	Username       string `json:"Username"`
	Password       string `json:"Password"`
	Nama_Dokter    string `json:"Nama_Dokter"`
	Email          string `json:"Email"`
	Alamat_Praktik string `json:"Alamat"`
	No_Telp        int64  `json:"No_Telp"`
}

type GulaDarah struct {
	GulaDarahID        string  `json:"GulahDarahID"`
	PelangganID        string  `json:"PelangganID"`
	Tanggal_Pengecekan string  `json:"Tanggal_Pengecekan"`
	LevelGulaDarah     float32 `json:"LevelGulaDarah"`
	StatusGulaDarah    int     `json:"StatusGulaDarah"`
}

type Makanan struct {
	MakananID         string  `json:"MakananID"`
	KategoriID        string  `json:"KategoriID"`
	Nama_Makanan      string  `json:"Nama_Makanan"`
	Kandungan_Makanan string  `json:"Kandungan_Makanan"`
	PenjualID         string  `json:"PenjualID"`
	Harga_Makanan     *string `json:"Harga_Makanan"`
}

type RekomendasiMakanan struct {
	RekomendasiID     string  `json:"RekomendasiID"`
	Gula_DarahID      *string `json:"Gula_DarahID"`
	MakananID         *string `json:"MakananID"`
	Nama_Makanan      *string `json:"Nama_Makanan"`
	Kandungan_Makanan *string `json:"Kandungan_Makanan"`
	PenjualID         *string `json:"PenjualID"`
}

type FoodRecommendationRequest struct {
	Prompt string `json:"prompt"`
}

type FoodRecommendation struct {
	Nama_Makanan      string `json:"Food_Name"`
	Kandungan_Makanan string `json:"Food_Content"`
	Recipe            string `json:"Recipe"`
	HowToMake         string `json:"How_To_Make"`
	Photo_Dir         string `json:"Photo_Dir"`
}

type Aktivitas struct {
	AktivitasID      string `json:"AktivitasID"`
	Nama_Aktivitas   string `json:"Nama_Aktivitas"`
	Status_Aktivitas int    `json:"Status_Aktivitas"`
	Keterangan       string `json:"Keterangan"`
}

type RekomendasiAktivitas struct {
	RekomendasiID  string  `json:"RekomendasiID"`
	Gula_DarahID   *string `json:"Gula_DarahID"`
	AktivitasID    *string `json:"AktivitasID"`
	Nama_Aktivitas *string `json:"Nama_Aktivitas"`
	Keterangan     *string `json:"Keterangan"`
}

type Keranjang struct {
	KeranjangID string  `json:"KeranjangID"`
	PelangganID *string `json:"PelangganID"`
	MakananID   *string `json:"MakananID"`
	ItemID      *string `json:"ItemID"`
	Kuantitas   int     `json:"Kuantitas"`
	Harga_Total int     `json:"Harga_Total"`
}

type pembayaran struct {
	PembayaranID       string `json:"embayaranID"`
	Tanggal_Pembayaran string `json:"Tanggal_Pembayaran"`
	Metode_Pembayaran  string `json:"Metode_Pembayaran"`
	NameOnCard         string
	CardNumber         string
	ExpirationDate     string
	CVV                string
	Nominal_Pembayaran int `json:"Nominal_Pembayaran"`
}

type order_pelanggan struct {
	OrderID           string `json:"OrderID"`
	Tanggal_Order     string `json:"Tanggal_Order"`
	PelangganID       string `json:"PelangganID"`
	PembayaranID      string `json:"pembayaranID"`
	MakananID         string `json:"MakananID"`
	Total_Harga_Order int    `json:"Total_Harga_Order"`
	ItemID            string `json:"ItemID"`
	Status            string `json:"Status"`
}

type CheckoutRequest struct {
	PelangganID     string `json:"pelanggan_id"`
	NameOnCard      string `json:"name_on_card"`
	CardNumber      string `json:"card_number"`
	ExpirationMonth string `json:"expiration_month"`
	ExpirationYear  string `json:"expiration_year"`
	CVV             string `json:"cvv"`
}

type OrderHistory struct {
	OrderID           string         `json:"OrderID"`
	Tanggal_Order     string         `json:"Tanggal_Order"`
	PelangganID       string         `json:"PelangganID"`
	PembayaranID      string         `json:"PembayaranID"`
	MakananID         string         `json:"MakananID"`
	Total_Harga_Order int            `json:"Total_Harga_Order"`
	ItemID            sql.NullString `json:"ItemID"` // Use sql.NullString for nullable string fields
	Status            string         `json:"Status"`
}

var db *sql.DB

func generateUserID() string {
	rand.Seed(time.Now().UnixNano())
	id := fmt.Sprintf("User%06d", rand.Intn(100000))
	return id
}

func generateSellerID() string {
	rand.Seed(time.Now().UnixNano())
	id := fmt.Sprintf("Seller%04d", rand.Intn(100000))
	return id
}

func generateDoctorID() string {
	rand.Seed(time.Now().UnixNano())
	id := fmt.Sprintf("Dokter%04d", rand.Intn(100000))
	return id
}

func generateGulaDarahID() string {
	rand.Seed(time.Now().UnixNano())
	id := fmt.Sprintf("GD%08d", rand.Intn(100000))
	return id
}

func generateMakananID() string {
	rand.Seed(time.Now().UnixNano())
	id := fmt.Sprintf("MK%08d", rand.Intn(100000))
	return id
}

func generateAktivitasID() string {
	rand.Seed(time.Now().UnixNano())
	id := fmt.Sprintf("AK%08d", rand.Intn(100000))
	return id
}

func generateKeranjangID() string {
	rand.Seed(time.Now().UnixNano())
	id := fmt.Sprintf("KR%08d", rand.Intn(100000))
	return id
}

func generatePembayaranID() string {
	rand.Seed(time.Now().UnixNano())
	id := fmt.Sprintf("P%09d", rand.Intn(100000))
	return id
}

func generateOrderID() string {
	rand.Seed(time.Now().UnixNano())
	id := fmt.Sprintf("OR%08d", rand.Intn(100000))
	return id
}

func generateRekomendasiMakananID() string {
	bytes := make([]byte, 4)
	if _, err := rand.Read(bytes); err != nil {
		panic(err)
	}
	return fmt.Sprintf("RK%s", hex.EncodeToString(bytes))
}

func generateRekomendasiAktivitasID() string {
	bytes := make([]byte, 4)
	if _, err := rand.Read(bytes); err != nil {
		panic(err)
	}
	return fmt.Sprintf("RK%s", hex.EncodeToString(bytes))
}

func hashPassword(password string) (string, error) {
	hash, err := argon2id.CreateHash(password, argon2id.DefaultParams)
	if err != nil {
		log.Fatal(err)
	}
	return string(hash), nil
}

func insertManyRekomendasiMakanan(db *sql.DB, rekomendasiMakananList []RekomendasiMakanan) error {
	// Begin a transaction
	tx, err := db.Begin()
	if err != nil {
		return err
	}

	// Prepare the SQL statement
	stmt, err := tx.Prepare(`
		INSERT INTO rekomendasi_makanan 
		(RekomendasiID, Gula_DarahID, MakananID, Nama_Makanan, Kandungan_Makanan, PenjualID) 
		VALUES (?, ?, ?, ?, ?, ?)
	`)
	if err != nil {
		tx.Rollback()
		return err
	}
	defer stmt.Close()

	for _, rekom := range rekomendasiMakananList {
		_, err := stmt.Exec(rekom.RekomendasiID, rekom.Gula_DarahID, rekom.MakananID, rekom.Nama_Makanan, rekom.Kandungan_Makanan, rekom.PenjualID)
		if err != nil {
			tx.Rollback()
			return err
		}
	}

	return tx.Commit()
}

func insertManyRekomendasiAktivitas(db *sql.DB, rekomendasiAktivitas []RekomendasiAktivitas) error {
	query := "INSERT INTO rekomendasi_aktivitas (RekomendasiID, Gula_DarahID, AktivitasID, Nama_Aktivitas, Keterangan) VALUES (?, ?, ?, ?, ?)"
	stmt, err := db.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	for _, rekomendasi := range rekomendasiAktivitas {
		_, err := stmt.Exec(
			rekomendasi.RekomendasiID,
			rekomendasi.Gula_DarahID,
			rekomendasi.AktivitasID,
			rekomendasi.Nama_Aktivitas,
			rekomendasi.Keterangan,
		)
		if err != nil {
			return err
		}
	}
	return nil
}

func getPelangganByID(w http.ResponseWriter, r *http.Request) {
	pelangganID := r.URL.Query().Get("PelangganID")
	if pelangganID == "" {
		http.Error(w, "PelangganID is required", http.StatusBadRequest)
		return
	}

	var pelanggan struct {
		PelangganID   string `json:"PelangganID"`
		Username      string `json:"Username"`
		Nama_Lengkap  string `json:"Nama_Lengkap"`
		Email         string `json:"Email"`
		DOB           string `json:"DOB"`
		Alamat        string `json:"Alamat"`
		Jenis_Kelamin string `json:"Jenis_Kelamin"`
		Berat_Badan   int    `json:"Berat_Badan"`
	}

	var dobStr string

	err := db.QueryRow("SELECT PelangganID, Username, Nama_Lengkap, Email, DOB, Alamat, Jenis_Kelamin, Berat_Badan FROM pelanggan WHERE PelangganID=?", pelangganID).Scan(
		&pelanggan.PelangganID,
		&pelanggan.Username,
		&pelanggan.Nama_Lengkap,
		&pelanggan.Email,
		&dobStr,
		&pelanggan.Alamat,
		&pelanggan.Jenis_Kelamin,
		&pelanggan.Berat_Badan,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Pelanggan not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error executing query", http.StatusInternalServerError)
		log.Printf("%v", err)
		return
	}

	// Parse the DOB string into a time.Time object
	dob, err := time.Parse("2006-01-02", dobStr) // Adjust the layout as per your date format
	if err != nil {
		http.Error(w, "Error parsing DOB", http.StatusInternalServerError)
		log.Printf("Error parsing DOB: %v", err)
		return
	}

	// Convert the dob to string to add it to the response
	pelanggan.DOB = dob.Format("2006-01-02") // Adjust the layout as per your desired date format

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pelanggan)
}

func getPenjualByID(w http.ResponseWriter, r *http.Request) {
	penjualID := r.URL.Query().Get("PenjualID")
	if penjualID == "" {
		http.Error(w, "PenjualID is required", http.StatusBadRequest)
		return
	}

	var penjual Penjual

	err := db.QueryRow("SELECT PenjualID, Username, Nama_Penjual, Nama_Bisnis, Email, No_Telp, Alamat FROM penjual WHERE PenjualID=?", penjualID).Scan(
		&penjual.PenjualID,
		&penjual.Username,
		&penjual.Nama_Penjual,
		&penjual.Nama_Bisnis,
		&penjual.Email,
		&penjual.No_Telp,
		&penjual.Alamat,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Penjual not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error executing query", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(penjual)
}

func getDokterByID(w http.ResponseWriter, r *http.Request) {
	dokterID := r.URL.Query().Get("DokterID")
	if dokterID == "" {
		http.Error(w, "DokterID is required", http.StatusBadRequest)
		return
	}

	var dokter Dokter

	err := db.QueryRow("SELECT DokterID, Username, Nama_Dokter, Email, Alamat_Praktik, No_Telp FROM dokter WHERE DokterID=?", dokterID).Scan(
		&dokter.DokterID,
		&dokter.Username,
		&dokter.Nama_Dokter,
		&dokter.Email,
		&dokter.Alamat_Praktik,
		&dokter.No_Telp,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Dokter not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error executing query", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(dokter)
}

func registerUser(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("Username")
	password := r.URL.Query().Get("Password")
	namaLengkap := r.URL.Query().Get("Nama_Lengkap")
	email := r.URL.Query().Get("Email")
	dob := r.URL.Query().Get("DOB")
	alamat := r.URL.Query().Get("Alamat")
	jenisKelamin := r.URL.Query().Get("Jenis_Kelamin")
	beratBadan := r.URL.Query().Get("Berat_Badan")

	if username == "" || password == "" || namaLengkap == "" || email == "" || dob == "" || alamat == "" || jenisKelamin == "" || beratBadan == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	// Parse DOB as date
	parsedDOB, err := time.Parse("2006-01-02", dob)
	if err != nil {
		http.Error(w, "Invalid date format", http.StatusBadRequest)
		return
	}

	// Parse Berat_Badan as integer
	parsedBeratBadan, err := strconv.Atoi(beratBadan)
	if err != nil {
		http.Error(w, "Invalid weight format", http.StatusBadRequest)
		return
	}

	var existingUsername string
	err = db.QueryRow("SELECT Username FROM pelanggan WHERE Username=?", username).Scan(&existingUsername)
	if err != nil && err != sql.ErrNoRows {
		http.Error(w, "Error checking username", http.StatusInternalServerError)
		return
	}
	if existingUsername != "" {
		http.Error(w, "Username already exists", http.StatusBadRequest)
		return
	}

	user := User{
		PelangganID:   generateUserID(),
		Username:      username,
		Password:      password,
		Nama_Lengkap:  namaLengkap,
		Email:         email,
		DOB:           parsedDOB,
		Alamat:        alamat,
		Jenis_Kelamin: jenisKelamin,
		Berat_Badan:   parsedBeratBadan,
	}

	hashedPassword, err := hashPassword(user.Password)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}
	user.Password = hashedPassword

	stmt, err := db.Prepare("INSERT INTO pelanggan (PelangganID, Username, Password, Nama_Lengkap, Email, DOB, Alamat, Jenis_Kelamin, Berat_Badan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		http.Error(w, "Error preparing statement", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(user.PelangganID, user.Username, user.Password, user.Nama_Lengkap, user.Email, user.DOB, user.Alamat, user.Jenis_Kelamin, user.Berat_Badan)
	if err != nil {
		http.Error(w, "Error executing statement", http.StatusInternalServerError)
		return
	}

	log.Printf("User registered: %+v", user) // Log user registration details

	req, err := http.NewRequest("GET", r.URL.Path, nil)
	if err != nil {
		http.Error(w, "Error creating request", http.StatusInternalServerError)
		return
	}

	// Copy the original URL parameters and add PelangganID
	q := req.URL.Query()
	q.Set("PelangganID", user.PelangganID)
	req.URL.RawQuery = q.Encode()

	// Call getPelangganByID with the new request
	getPelangganByID(w, req)
}

func loginUser(w http.ResponseWriter, r *http.Request) {
	// Parse URL parameters
	username := r.URL.Query().Get("Username")
	password := r.URL.Query().Get("Password")
	if username == "" || password == "" {
		http.Error(w, "Username and Password are required", http.StatusBadRequest)
		return
	}

	// Retrieve stored password hash from the database
	var storedPasswordHash string
	var pelangganID string
	err := db.QueryRow("SELECT PelangganID, Password FROM pelanggan WHERE Username=?", username).Scan(&pelangganID, &storedPasswordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}
		http.Error(w, "Error retrieving stored password", http.StatusInternalServerError)
		log.Printf("Error retrieving stored password: %v", err)
		return
	}

	// Compare the provided password with the stored password hash
	match, err := argon2id.ComparePasswordAndHash(password, storedPasswordHash)
	if err != nil {
		http.Error(w, "Error comparing passwords", http.StatusInternalServerError)
		log.Printf("Error comparing passwords: %v", err)
		return
	}

	if !match {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	log.Printf("User logged in: %s", username)

	req, err := http.NewRequest("GET", r.URL.Path, nil)
	if err != nil {
		http.Error(w, "Error creating request", http.StatusInternalServerError)
		return
	}

	// Copy the original URL parameters and add PelangganID
	q := req.URL.Query()
	q.Set("PelangganID", pelangganID)
	req.URL.RawQuery = q.Encode()

	// Call getPelangganByID with the new request
	getPelangganByID(w, req)
}

func editUser(w http.ResponseWriter, r *http.Request) {
	// Parse URL parameters
	username := r.URL.Query().Get("Username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	// Check if the user exists
	var existingUserID string
	err := db.QueryRow("SELECT PelangganID FROM pelanggan WHERE Username=?", username).Scan(&existingUserID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Username not found", http.StatusNotFound)
			log.Printf("Username not found: %s", username)
			return
		}
		http.Error(w, "Error checking user ID", http.StatusInternalServerError)
		log.Printf("Error checking user ID: %v", err)
		return
	}

	// Parse other URL parameters
	namaLengkap := r.URL.Query().Get("Nama_Lengkap")
	email := r.URL.Query().Get("Email")
	dobStr := r.URL.Query().Get("DOB")
	var dob time.Time
	if dobStr != "" {
		dob, err = time.Parse("2006-01-02", dobStr)
		if err != nil {
			http.Error(w, "Invalid DOB format", http.StatusBadRequest)
			return
		}
	}
	alamat := r.URL.Query().Get("Alamat")
	jenisKelamin := r.URL.Query().Get("Jenis_Kelamin")
	beratBadanStr := r.URL.Query().Get("Berat_Badan")
	var beratBadan int
	if beratBadanStr != "" {
		beratBadan, err = strconv.Atoi(beratBadanStr)
		if err != nil {
			http.Error(w, "Invalid Berat_Badan format", http.StatusBadRequest)
			return
		}
	}

	// Update the user information
	query := "UPDATE pelanggan SET "
	params := []interface{}{}
	if namaLengkap != "" {
		query += "Nama_Lengkap=?, "
		params = append(params, namaLengkap)
	}
	if email != "" {
		query += "Email=?, "
		params = append(params, email)
	}
	if !dob.IsZero() {
		query += "DOB=?, "
		params = append(params, dob)
	}
	if alamat != "" {
		query += "Alamat=?, "
		params = append(params, alamat)
	}
	if jenisKelamin != "" {
		query += "Jenis_Kelamin=?, "
		params = append(params, jenisKelamin)
	}
	if beratBadan != 0 {
		query += "Berat_Badan=?, "
		params = append(params, beratBadan)
	}

	// Remove the trailing comma and space
	query = query[:len(query)-2]

	// Add the WHERE clause
	query += " WHERE Username=?"
	params = append(params, username)

	stmt, err := db.Prepare(query)
	if err != nil {
		http.Error(w, "Error preparing statement", http.StatusInternalServerError)
		log.Printf("Error preparing statement: %v", err)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(params...)
	if err != nil {
		http.Error(w, "Error executing statement", http.StatusInternalServerError)
		log.Printf("Error executing statement: %v", err)
		return
	}

	log.Printf("User information updated: %s", username)
	w.WriteHeader(http.StatusOK)
}

func insertGulaDarah(w http.ResponseWriter, r *http.Request) {
	// Parse URL parameters
	pelangganID := r.URL.Query().Get("PelangganID")
	levelGulaDarahStr := r.URL.Query().Get("LevelGulaDarah")
	levelGulaDarah, err := strconv.ParseFloat(levelGulaDarahStr, 32)
	if err != nil {
		http.Error(w, "Invalid LevelGulaDarah", http.StatusBadRequest)
		return
	}

	// Validate required parameters
	if pelangganID == "" || levelGulaDarahStr == "" {
		http.Error(w, "PelangganID and LevelGulaDarah are required", http.StatusBadRequest)
		return
	}

	// Convert PelangganID to userID
	var userID string
	stmt, err := db.Prepare("SELECT PelangganID FROM pelanggan WHERE PelangganID=?")
	if err != nil {
		http.Error(w, "Error preparing statement 1", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	err = stmt.QueryRow(pelangganID).Scan(&userID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "PelangganID not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error executing query", http.StatusInternalServerError)
		return
	}

	// Create GulaDarah object
	gulaDarah := GulaDarah{
		PelangganID:        userID,
		Tanggal_Pengecekan: time.Now().Format("2006-01-02 15:04:05"),
		LevelGulaDarah:     float32(levelGulaDarah),
	}

	// Determine status based on LevelGulaDarah
	if gulaDarah.LevelGulaDarah < 70 {
		gulaDarah.StatusGulaDarah = 1 // Low
	} else if gulaDarah.LevelGulaDarah <= 100 {
		gulaDarah.StatusGulaDarah = 2 // Normal
	} else {
		gulaDarah.StatusGulaDarah = 3 // High
	}

	// Generate GulaDarahID
	gulaDarah.GulaDarahID = generateGulaDarahID()

	// Insert into database
	stmt, err = db.Prepare("INSERT INTO gula_darah (GulaDarahID, PelangganID, Tanggal_Pengecekan, LevelGulaDarah, StatusGulaDarah) VALUES (?, ?, ?, ?, ?)")
	if err != nil {
		http.Error(w, "Error preparing statement 2", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(gulaDarah.GulaDarahID, gulaDarah.PelangganID, gulaDarah.Tanggal_Pengecekan, gulaDarah.LevelGulaDarah, gulaDarah.StatusGulaDarah)
	if err != nil {
		http.Error(w, "Error executing statement", http.StatusInternalServerError)
		return
	}

	log.Printf("Gula Darah record inserted for PelangganID: %s", gulaDarah.PelangganID)
	w.WriteHeader(http.StatusCreated)
}

func getGulaDarahStats(w http.ResponseWriter, r *http.Request) {
	type GulaDarahStats struct {
		Average *float64 `json:"average"`
		Min     float64  `json:"min"`
		Max     float64  `json:"max"`
		Latest  float64  `json:"latest"`
	}

	pelangganID := r.URL.Query().Get("PelangganID")
	if pelangganID == "" {
		http.Error(w, "PelangganID is required", http.StatusBadRequest)
		return
	}

	var stats GulaDarahStats
	var average float64
	err := db.QueryRow("SELECT AVG(LevelGulaDarah), MIN(LevelGulaDarah), MAX(LevelGulaDarah) FROM gula_darah WHERE PelangganID=?", pelangganID).Scan(&average, &stats.Min, &stats.Max)
	if err != nil {
		http.Error(w, "Error calculating statistics", http.StatusInternalServerError)
		return
	}
	stats.Average = &average

	err = db.QueryRow("SELECT LevelGulaDarah FROM gula_darah WHERE PelangganID=? ORDER BY Tanggal_Pengecekan DESC LIMIT 1", pelangganID).Scan(&stats.Latest)
	if err != nil {
		http.Error(w, "Error fetching latest data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(stats)
	if err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

func getGulaDarahHistory(w http.ResponseWriter, r *http.Request) {
	pelangganID := r.URL.Query().Get("PelangganID")
	if pelangganID == "" {
		http.Error(w, "PelangganID is required", http.StatusBadRequest)
		return
	}

	rows, err := db.Query("SELECT GulaDarahID, PelangganID, Tanggal_Pengecekan, LevelGulaDarah, StatusGulaDarah FROM gula_darah WHERE PelangganID=? ORDER BY Tanggal_Pengecekan DESC", pelangganID)
	if err != nil {
		http.Error(w, "Error fetching Gula Darah history", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var history []GulaDarah
	for rows.Next() {
		var record GulaDarah
		err := rows.Scan(&record.GulaDarahID, &record.PelangganID, &record.Tanggal_Pengecekan, &record.LevelGulaDarah, &record.StatusGulaDarah)
		if err != nil {
			http.Error(w, "Error scanning row", http.StatusInternalServerError)
			return
		}
		history = append(history, record)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, "Error iterating rows", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(history)
	if err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

func getGulaDarahMonthlyStats(w http.ResponseWriter, r *http.Request) {
	pelangganID := r.URL.Query().Get("PelangganID")
	if pelangganID == "" {
		http.Error(w, "PelangganID is required", http.StatusBadRequest)
		return
	}

	// Automatically detect the current month
	currentMonth := time.Now().Format("2006-01")

	query := `
		SELECT
			COUNT(CASE WHEN StatusGulaDarah = 1 THEN 1 END) AS LowCount,
			COUNT(CASE WHEN StatusGulaDarah = 2 THEN 1 END) AS NormalCount,
			COUNT(CASE WHEN StatusGulaDarah = 3 THEN 1 END) AS HighCount,
			COUNT(*) AS TotalCount
		FROM
			gula_darah
		WHERE
			PelangganID = ?
			AND DATE_FORMAT(Tanggal_Pengecekan, '%Y-%m') = ?
	`

	var lowCount, normalCount, highCount, totalCount int
	err := db.QueryRow(query, pelangganID, currentMonth).Scan(&lowCount, &normalCount, &highCount, &totalCount)
	if err != nil {
		http.Error(w, "Error calculating monthly stats", http.StatusInternalServerError)
		return
	}

	var lowPercent, normalPercent, highPercent float64
	if totalCount > 0 {
		lowPercent = (float64(lowCount) / float64(totalCount)) * 100
		normalPercent = (float64(normalCount) / float64(totalCount)) * 100
		highPercent = (float64(highCount) / float64(totalCount)) * 100
	}

	stats := map[string]float64{
		"low_percent":    lowPercent,
		"normal_percent": normalPercent,
		"high_percent":   highPercent,
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(stats)
	if err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

func getLatestGulaDarah(userID string) (GulaDarah, error) {
	var gulaDarah GulaDarah
	err := db.QueryRow("SELECT GulaDarahID, PelangganID, Tanggal_Pengecekan, LevelGulaDarah, StatusGulaDarah FROM gula_darah WHERE PelangganID=? ORDER BY Tanggal_Pengecekan DESC LIMIT 1", userID).Scan(&gulaDarah.GulaDarahID, &gulaDarah.PelangganID, &gulaDarah.Tanggal_Pengecekan, &gulaDarah.LevelGulaDarah, &gulaDarah.StatusGulaDarah)
	if err != nil {
		return GulaDarah{}, err
	}
	return gulaDarah, nil
}

func getSuggestedActivities(statusGulaDarah int) ([]Aktivitas, error) {
	rows, err := db.Query("SELECT AktivitasID, Nama_Aktivitas, Keterangan FROM aktivitas WHERE Status_Aktivitas=?", statusGulaDarah)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var activities []Aktivitas
	for rows.Next() {
		var activity Aktivitas
		err := rows.Scan(&activity.AktivitasID, &activity.Nama_Aktivitas, &activity.Keterangan)
		if err != nil {
			return nil, err
		}
		activities = append(activities, activity)
	}
	return activities, nil
}

func getSuggestedActivitiesHandler(w http.ResponseWriter, r *http.Request) {
	pelangganID := r.URL.Query().Get("PelangganID")
	if pelangganID == "" {
		http.Error(w, "PelangganID is required", http.StatusBadRequest)
		return
	}

	gulaDarah, err := getLatestGulaDarah(pelangganID)
	if err != nil {
		http.Error(w, "Error fetching latest gula darah", http.StatusInternalServerError)
		return
	}

	activities, err := getSuggestedActivities(gulaDarah.StatusGulaDarah)
	if err != nil {
		http.Error(w, "Error fetching activities", http.StatusInternalServerError)
		return
	}

	rekomendasiAktivitas := []RekomendasiAktivitas{}
	for _, activity := range activities {
		rekomendasiAktivitas = append(rekomendasiAktivitas, RekomendasiAktivitas{
			RekomendasiID:  generateRekomendasiAktivitasID(), // Implement this function to generate unique IDs
			Gula_DarahID:   &gulaDarah.GulaDarahID,
			AktivitasID:    &activity.AktivitasID,
			Nama_Aktivitas: &activity.Nama_Aktivitas,
			Keterangan:     &activity.Keterangan, // Assuming Deskripsi_Aktivitas corresponds to Keterangan
		})
	}

	if err := insertManyRekomendasiAktivitas(db, rekomendasiAktivitas); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(activities)
	if err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
	}
}

func getFoodRecommendation(w http.ResponseWriter, r *http.Request) {
	pelangganID := r.URL.Query().Get("PelangganID")
	if pelangganID == "" {
		http.Error(w, "PelangganID is required", http.StatusBadRequest)
		return
	}

	var foods []Makanan
	rows, err := db.Query("SELECT * FROM makanan")
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Makanan not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error executing query 1", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var m Makanan
		err := rows.Scan(&m.MakananID, &m.KategoriID, &m.Nama_Makanan, &m.Kandungan_Makanan, &m.PenjualID, &m.Harga_Makanan)
		if err != nil {
			http.Error(w, "Error scanning query", http.StatusInternalServerError)
			return
		}
		foods = append(foods, m)
	}

	foodsJsonString, err := json.Marshal(foods)
	if err != nil {
		http.Error(w, "Error json marshaling query", http.StatusInternalServerError)
		return
	}

	gulaDarah, err := getLatestGulaDarah(pelangganID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	prompt := fmt.Sprintf(`%s 
	
	From this json recommend at least 5 healthy foods for a person with %f%% level of BloodLevel responds in valid array json format string of 'MakananID' value. Give the response oneline, without line break, give a long attribute value`, string(foodsJsonString), gulaDarah.LevelGulaDarah)
	req := FoodRecommendationRequest{Prompt: prompt}

	ctx := context.Background()
	client, err := genai.NewClient(ctx, option.WithAPIKey(os.Getenv("API_KEY")))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer client.Close()

	model := client.GenerativeModel("gemini-1.0-pro")
	resp, err := model.GenerateContent(ctx, genai.Text(req.Prompt))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var recommendationIds = []string{}
	err = json.Unmarshal([]byte(fmt.Sprintf("%+v", resp.Candidates[0].Content.Parts[0])), &recommendationIds)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	filteredFoods := []Makanan{}

	for _, food := range foods {
		for _, recommendationId := range recommendationIds {
			if food.MakananID == recommendationId {
				filteredFoods = append(filteredFoods, food)
				break
			}
		}
	}

	rekomendasiMakanan := []RekomendasiMakanan{}
	for _, filteredFood := range filteredFoods {
		rekomendasiMakanan = append(rekomendasiMakanan, RekomendasiMakanan{
			RekomendasiID:     generateRekomendasiMakananID(),
			Gula_DarahID:      &gulaDarah.GulaDarahID,
			MakananID:         &filteredFood.MakananID,
			Nama_Makanan:      &filteredFood.Nama_Makanan,
			Kandungan_Makanan: &filteredFood.Kandungan_Makanan,
			PenjualID:         nil,
		})
	}

	if err := insertManyRekomendasiMakanan(db, rekomendasiMakanan); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(filteredFoods)
}

func addToCart(w http.ResponseWriter, r *http.Request) {
	pelangganID := r.URL.Query().Get("PelangganID")
	makananID := r.URL.Query().Get("MakananID")
	itemID := r.URL.Query().Get("ItemID")

	if pelangganID == "" {
		http.Error(w, "PelangganID is required", http.StatusBadRequest)
		return
	}

	if makananID != "" && itemID != "" {
		http.Error(w, "Only one of MakananID or ItemID should be provided", http.StatusBadRequest)
		return
	}

	if makananID == "" && itemID == "" {
		http.Error(w, "One of MakananID or ItemID must be provided", http.StatusBadRequest)
		return
	}

	var existingKeranjang struct {
		KeranjangID string
		Kuantitas   int
		Harga_Total int
	}

	var err error

	if makananID != "" {
		err = db.QueryRow("SELECT KeranjangID, Kuantitas, Harga_Total FROM keranjang WHERE PelangganID = ? AND MakananID = ?", pelangganID, makananID).Scan(&existingKeranjang.KeranjangID, &existingKeranjang.Kuantitas, &existingKeranjang.Harga_Total)
	} else if itemID != "" {
		err = db.QueryRow("SELECT KeranjangID, Kuantitas, Harga_Total FROM keranjang WHERE PelangganID = ? AND ItemID = ?", pelangganID, itemID).Scan(&existingKeranjang.KeranjangID, &existingKeranjang.Kuantitas, &existingKeranjang.Harga_Total)
	}

	if err != nil && err != sql.ErrNoRows {
		http.Error(w, "Error checking existing cart item", http.StatusInternalServerError)
		return
	}

	if err == nil {
		// Item already exists in cart, update quantity and price
		newQuantity := existingKeranjang.Kuantitas + 1
		var unitPrice int
		if makananID != "" {
			unitPrice = existingKeranjang.Harga_Total / existingKeranjang.Kuantitas
		} else if itemID != "" {
			unitPrice = existingKeranjang.Harga_Total / existingKeranjang.Kuantitas
		}
		newHargaTotal := existingKeranjang.Harga_Total + unitPrice

		_, err := db.Exec("UPDATE keranjang SET Kuantitas = ?, Harga_Total = ? WHERE KeranjangID = ?", newQuantity, newHargaTotal, existingKeranjang.KeranjangID)
		if err != nil {
			http.Error(w, "Error updating cart item", http.StatusInternalServerError)
			return
		}
	} else {
		// Item does not exist in cart, insert new
		keranjangID := generateKeranjangID()
		var hargaTotal int

		if makananID != "" {
			err = db.QueryRow("SELECT Harga_Makanan FROM makanan WHERE MakananID = ?", makananID).Scan(&hargaTotal)
			if err != nil {
				http.Error(w, "Error fetching makanan price", http.StatusInternalServerError)
				return
			}
		} else if itemID != "" {
			err = db.QueryRow("SELECT Harga_Item FROM item WHERE ItemID = ?", itemID).Scan(&hargaTotal)
			if err != nil {
				http.Error(w, "Error fetching item price", http.StatusInternalServerError)
				return
			}
		}

		// Prepare the INSERT statement
		stmt, err := db.Prepare("INSERT INTO keranjang (KeranjangID, PelangganID, MakananID, ItemID, Kuantitas, Harga_Total) VALUES (?, ?, ?, ?, ?, ?)")
		if err != nil {
			http.Error(w, "Error preparing statement", http.StatusInternalServerError)
			return
		}
		defer stmt.Close()

		// Execute the INSERT statement
		if itemID != "" {
			_, err = stmt.Exec(keranjangID, pelangganID, nil, itemID, 1, hargaTotal)
		} else {
			_, err = stmt.Exec(keranjangID, pelangganID, makananID, nil, 1, hargaTotal)
		}
		if err != nil {
			http.Error(w, "Error inserting cart item", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusCreated)
}

func reduceQuantity(w http.ResponseWriter, r *http.Request) {
	keranjangID := r.URL.Query().Get("KeranjangID")
	pelangganID := r.URL.Query().Get("PelangganID")

	if keranjangID == "" || pelangganID == "" {
		http.Error(w, "KeranjangID and PelangganID are required", http.StatusBadRequest)
		return
	}

	var currentQuantity int
	var hargaTotal int
	err := db.QueryRow("SELECT Kuantitas, Harga_Total FROM keranjang WHERE KeranjangID = ? AND PelangganID = ?", keranjangID, pelangganID).Scan(&currentQuantity, &hargaTotal)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Cart item not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching cart item", http.StatusInternalServerError)
		}
		return
	}

	// Ensure the quantity is greater than 0 before reducing
	if currentQuantity > 0 {
		newQuantity := currentQuantity - 1

		if newQuantity == 0 {
			_, err := db.Exec("DELETE FROM keranjang WHERE KeranjangID = ? AND PelangganID = ?", keranjangID, pelangganID)
			if err != nil {
				http.Error(w, "Error deleting cart item", http.StatusInternalServerError)
				return
			}
		} else {
			pricePerUnit := hargaTotal / currentQuantity
			newHargaTotal := hargaTotal - pricePerUnit
			_, err := db.Exec("UPDATE keranjang SET Kuantitas = ?, Harga_Total = ? WHERE KeranjangID = ? AND PelangganID = ?", newQuantity, newHargaTotal, keranjangID, pelangganID)
			if err != nil {
				http.Error(w, "Error updating quantity", http.StatusInternalServerError)
				return
			}
		}
	}

	w.WriteHeader(http.StatusOK)
}

func AddQuantity(w http.ResponseWriter, r *http.Request) {
	keranjangID := r.URL.Query().Get("KeranjangID")
	pelangganID := r.URL.Query().Get("PelangganID")

	if keranjangID == "" || pelangganID == "" {
		http.Error(w, "KeranjangID and PelangganID are required", http.StatusBadRequest)
		return
	}

	var currentQuantity int
	var hargaTotal int
	err := db.QueryRow("SELECT Kuantitas, Harga_Total FROM keranjang WHERE KeranjangID = ? AND PelangganID = ?", keranjangID, pelangganID).Scan(&currentQuantity, &hargaTotal)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Cart item not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching cart item", http.StatusInternalServerError)
		}
		return
	}

	// Calculate new quantity and new total price
	newQuantity := currentQuantity + 1
	pricePerUnit := hargaTotal / currentQuantity
	newHargaTotal := hargaTotal + pricePerUnit

	// Update the database with new quantity and total price
	_, err = db.Exec("UPDATE keranjang SET Kuantitas = ?, Harga_Total = ? WHERE KeranjangID = ? AND PelangganID = ?", newQuantity, newHargaTotal, keranjangID, pelangganID)
	if err != nil {
		http.Error(w, "Error updating quantity", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func checkout(w http.ResponseWriter, r *http.Request) {
	// Parse URL parameters
	pelangganID := r.URL.Query().Get("PelangganID")
	nameOnCard := r.URL.Query().Get("NameonCard")
	cardNumber := r.URL.Query().Get("CardNumber")
	expirationMonth := r.URL.Query().Get("ExpirationMonth")
	expirationYear := r.URL.Query().Get("ExpirationYear")
	cvv := r.URL.Query().Get("CVV")

	if pelangganID == "" || nameOnCard == "" || cardNumber == "" || expirationMonth == "" || expirationYear == "" || cvv == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	// Validate credit card information
	card := creditcard.Card{Number: cardNumber, Cvv: cvv, Month: expirationMonth, Year: expirationYear}
	err := card.Validate()
	if err != nil {
		http.Error(w, "Invalid credit card information", http.StatusBadRequest)
		return
	}

	// Calculate the total amount from the cart and get MakananID and ItemID
	var totalAmount int
	var makananIDs []string
	var itemID sql.NullString

	rows, err := db.Query("SELECT MakananID, ItemID, Harga_Total FROM keranjang WHERE PelangganID = ?", pelangganID)
	if err != nil {
		http.Error(w, "Error fetching cart items", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var makananID sql.NullString
		var hargaTotal int
		if err := rows.Scan(&makananID, &itemID, &hargaTotal); err != nil {
			http.Error(w, "Error scanning cart item", http.StatusInternalServerError)
			return
		}
		if makananID.Valid {
			makananIDs = append(makananIDs, makananID.String)
		}
		totalAmount += hargaTotal
	}

	if err := rows.Err(); err != nil {
		http.Error(w, "Error iterating over cart items", http.StatusInternalServerError)
		return
	}

	// Generate IDs and timestamps
	pembayaranID := generatePembayaranID()
	orderID := generateOrderID()
	timestamp := time.Now().Format("2006-01-02 15:04:05")

	// Insert payment record
	payment := pembayaran{
		PembayaranID:       pembayaranID,
		Tanggal_Pembayaran: timestamp,
		Metode_Pembayaran:  "Credit Card",
		NameOnCard:         nameOnCard,
		CardNumber:         cardNumber,
		ExpirationDate:     fmt.Sprintf("%s/%s", expirationMonth, expirationYear),
		CVV:                cvv,
		Nominal_Pembayaran: totalAmount,
	}

	_, err = db.Exec("INSERT INTO pembayaran (PembayaranID, Tanggal_Pembayaran, Metode_Pembayaran, Nominal_Pembayaran) VALUES (?, ?, ?, ?)",
		payment.PembayaranID, payment.Tanggal_Pembayaran, payment.Metode_Pembayaran, payment.Nominal_Pembayaran)
	if err != nil {
		http.Error(w, "Error inserting payment record", http.StatusInternalServerError)
		log.Printf("Error inserting payment record: %v", err)
		return
	}

	// Concatenate multiple MakananID values into a single field
	makananIDConcat := strings.Join(makananIDs, ", ")

	// Insert order record
	order := order_pelanggan{
		OrderID:           orderID,
		Tanggal_Order:     timestamp,
		PelangganID:       pelangganID,
		PembayaranID:      pembayaranID,
		MakananID:         makananIDConcat,
		Total_Harga_Order: totalAmount,
		Status:            "Pending",
	}

	stmt, err := db.Prepare("INSERT INTO order_Pelanggan (OrderID, Tanggal_Order, PelangganID, PembayaranID, MakananID, Total_Harga_Order, ItemID, Status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		http.Error(w, "Error preparing order statement", http.StatusInternalServerError)
		log.Printf("Error preparing order statement: %v", err)
		return
	}
	defer stmt.Close()

	if itemID.Valid {
		_, err = stmt.Exec(order.OrderID, order.Tanggal_Order, order.PelangganID, order.PembayaranID, nil, order.Total_Harga_Order, itemID.String, order.Status)
	} else {
		_, err = stmt.Exec(order.OrderID, order.Tanggal_Order, order.PelangganID, order.PembayaranID, order.MakananID, order.Total_Harga_Order, nil, order.Status)
	}
	if err != nil {
		http.Error(w, "Error inserting order record", http.StatusInternalServerError)
		log.Printf("Error inserting order record: %v", err)
		log.Printf("Order Details: %+v", order)
		return
	}

	// Remove items from cart
	_, err = db.Exec("DELETE FROM keranjang WHERE PelangganID = ?", pelangganID)
	if err != nil {
		http.Error(w, "Error clearing cart", http.StatusInternalServerError)
		log.Printf("Error clearing cart: %v", err)
		return
	}

	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "Checkout successful")
}

func viewOrderHistory(w http.ResponseWriter, r *http.Request) {
	pelangganID := r.URL.Query().Get("PelangganID")

	if pelangganID == "" {
		http.Error(w, "PelangganID is required", http.StatusBadRequest)
		return
	}

	rows, err := db.Query("SELECT OrderID, Tanggal_Order, PelangganID, PembayaranID, MakananID, Total_Harga_Order, ItemID, Status FROM order_Pelanggan WHERE PelangganID = ?", pelangganID)
	if err != nil {
		http.Error(w, "Error fetching order history", http.StatusInternalServerError)
		log.Printf("Error fetching order history: %v", err)
		return
	}
	defer rows.Close()

	var orderHistory []OrderHistory

	for rows.Next() {
		var order OrderHistory
		if err := rows.Scan(&order.OrderID, &order.Tanggal_Order, &order.PelangganID, &order.PembayaranID, &order.MakananID, &order.Total_Harga_Order, &order.ItemID, &order.Status); err != nil {
			http.Error(w, "Error scanning order history", http.StatusInternalServerError)
			log.Printf("Error scanning order history: %v", err)
			return
		}
		orderHistory = append(orderHistory, order)
	}

	if err := rows.Err(); err != nil {
		http.Error(w, "Error iterating over order history", http.StatusInternalServerError)
		log.Printf("Error iterating over order history: %v", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(orderHistory); err != nil {
		http.Error(w, "Error encoding order history", http.StatusInternalServerError)
		log.Printf("Error encoding order history: %v", err)
		return
	}
}

func getCart(w http.ResponseWriter, r *http.Request) {
	pelangganID := r.URL.Query().Get("PelangganID")

	if pelangganID == "" {
		http.Error(w, "PelangganID is required", http.StatusBadRequest)
		return
	}

	type CartItem struct {
		KeranjangID string `json:"keranjang_id"`
		PelangganID string `json:"pelanggan_id"`
		MakananID   string `json:"makanan_id,omitempty"`
		ItemID      string `json:"item_id,omitempty"`
		Kuantitas   int    `json:"kuantitas"`
		HargaTotal  int    `json:"harga_total"`
	}

	rows, err := db.Query("SELECT KeranjangID, PelangganID, MakananID, ItemID, Kuantitas, Harga_Total FROM keranjang WHERE PelangganID = ?", pelangganID)
	if err != nil {
		http.Error(w, "Error fetching cart items", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var cartItems []CartItem
	for rows.Next() {
		var item CartItem
		var makananID, itemID sql.NullString
		err := rows.Scan(&item.KeranjangID, &item.PelangganID, &makananID, &itemID, &item.Kuantitas, &item.HargaTotal)
		if err != nil {
			http.Error(w, "Error scanning cart items", http.StatusInternalServerError)
			return
		}

		if makananID.Valid {
			item.MakananID = makananID.String
		}
		if itemID.Valid {
			item.ItemID = itemID.String
		}

		cartItems = append(cartItems, item)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, "Error with cart items rows", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(cartItems); err != nil {
		http.Error(w, "Error encoding cart items", http.StatusInternalServerError)
		return
	}
}

func registerSeller(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("Username")
	password := r.URL.Query().Get("Password")
	namaPenjual := r.URL.Query().Get("Nama_Penjual")
	namaBisnis := r.URL.Query().Get("Nama_Bisnis")
	email := r.URL.Query().Get("Email")
	noTelp := r.URL.Query().Get("No_Telp")
	alamat := r.URL.Query().Get("Alamat")

	if username == "" || password == "" || namaPenjual == "" || namaBisnis == "" || email == "" || noTelp == "" || alamat == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	// Parse No_Telp as int64
	parsedNoTelp, err := strconv.ParseInt(noTelp, 10, 64)
	if err != nil {
		http.Error(w, "Invalid phone number format", http.StatusBadRequest)
		return
	}

	var existingUsername string
	err = db.QueryRow("SELECT Username FROM penjual WHERE Username=?", username).Scan(&existingUsername)
	if err != nil && err != sql.ErrNoRows {
		http.Error(w, "Error checking username", http.StatusInternalServerError)
		return
	}
	if existingUsername != "" {
		http.Error(w, "Username already exists", http.StatusBadRequest)
		return
	}

	penjual := Penjual{
		PenjualID:    generateSellerID(),
		Username:     username,
		Password:     password,
		Nama_Penjual: namaPenjual,
		Nama_Bisnis:  namaBisnis,
		Email:        email,
		No_Telp:      parsedNoTelp,
		Alamat:       alamat,
	}

	hashedPassword, err := hashPassword(penjual.Password)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}
	penjual.Password = hashedPassword

	stmt, err := db.Prepare("INSERT INTO penjual (PenjualID, Username, Password, Nama_Penjual, Nama_Bisnis, Email, No_Telp, Alamat) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		http.Error(w, "Error preparing statement", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(penjual.PenjualID, penjual.Username, penjual.Password, penjual.Nama_Penjual, penjual.Nama_Bisnis, penjual.Email, penjual.No_Telp, penjual.Alamat)
	if err != nil {
		http.Error(w, "Error executing statement", http.StatusInternalServerError)
		return
	}

	log.Printf("Seller registered: %+v", penjual) // Log seller registration details
	req, err := http.NewRequest("GET", r.URL.Path, nil)
	if err != nil {
		http.Error(w, "Error creating request", http.StatusInternalServerError)
		return
	}

	// Copy the original URL parameters and add PenjualID
	q := req.URL.Query()
	q.Set("PenjualID", penjual.PenjualID)
	req.URL.RawQuery = q.Encode()

	// Call getPenjualByID with the new request
	getPenjualByID(w, req)
}

func loginSeller(w http.ResponseWriter, r *http.Request) {
	// Parse URL parameters
	username := r.URL.Query().Get("Username")
	password := r.URL.Query().Get("Password")
	if username == "" || password == "" {
		http.Error(w, "Username and Password are required", http.StatusBadRequest)
		return
	}

	// Retrieve stored password hash from the database
	var storedPasswordHash string
	var penjualID string
	err := db.QueryRow("SELECT PenjualID, Password FROM penjual WHERE Username=?", username).Scan(&penjualID, &storedPasswordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}
		http.Error(w, "Error retrieving stored password", http.StatusInternalServerError)
		log.Printf("Error retrieving stored password: %v", err)
		return
	}

	// Compare the provided password with the stored password hash
	match, err := argon2id.ComparePasswordAndHash(password, storedPasswordHash)
	if err != nil {
		http.Error(w, "Error comparing passwords", http.StatusInternalServerError)
		log.Printf("Error comparing passwords: %v", err)
		return
	}

	if !match {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	log.Printf("Seller logged in: %s", username)

	// Create a new request to call getPenjualByID
	req, err := http.NewRequest("GET", r.URL.Path, nil)
	if err != nil {
		http.Error(w, "Error creating request", http.StatusInternalServerError)
		return
	}

	// Copy the original URL parameters and add PenjualID
	q := req.URL.Query()
	q.Set("PenjualID", penjualID)
	req.URL.RawQuery = q.Encode()

	// Call getPenjualByID with the new request
	getPenjualByID(w, req)
}

func editSeller(w http.ResponseWriter, r *http.Request) {
	// Parse URL parameters
	username := r.URL.Query().Get("Username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	// Check if the user exists
	var existingPenjualID string
	err := db.QueryRow("SELECT PenjualID FROM penjual WHERE Username=?", username).Scan(&existingPenjualID)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Username not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error checking user ID", http.StatusInternalServerError)
		return
	}

	// Parse other URL parameters
	namaPenjual := r.URL.Query().Get("Nama_Penjual")
	namaBisnis := r.URL.Query().Get("Nama_Bisnis")
	email := r.URL.Query().Get("Email")
	noTelpStr := r.URL.Query().Get("No_Telp")
	var noTelp int64
	if noTelpStr != "" {
		noTelp, err = strconv.ParseInt(noTelpStr, 10, 64)
		if err != nil {
			http.Error(w, "Invalid No_Telp format", http.StatusBadRequest)
			return
		}
	}
	alamat := r.URL.Query().Get("Alamat")

	// Update the user information
	query := "UPDATE penjual SET "
	params := []interface{}{}
	if namaPenjual != "" {
		query += "Nama_Penjual=?, "
		params = append(params, namaPenjual)
	}
	if namaBisnis != "" {
		query += "Nama_Bisnis=?, "
		params = append(params, namaBisnis)
	}
	if email != "" {
		query += "Email=?, "
		params = append(params, email)
	}
	if noTelp != 0 {
		query += "No_Telp=?, "
		params = append(params, noTelp)
	}
	if alamat != "" {
		query += "Alamat=?, "
		params = append(params, alamat)
	}

	// Remove the trailing comma and space
	query = query[:len(query)-2]

	// Add the WHERE clause
	query += " WHERE Username=?"
	params = append(params, username)

	stmt, err := db.Prepare(query)
	if err != nil {
		http.Error(w, "Error preparing statement", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(params...)
	if err != nil {
		http.Error(w, "Error executing statement", http.StatusInternalServerError)
		return
	}

	log.Printf("Seller information updated: %s", username)
	w.WriteHeader(http.StatusOK)
}

func insertMakanan(w http.ResponseWriter, r *http.Request) {
	makananID := generateMakananID()
	kategoriID := r.URL.Query().Get("KategoriID")
	namaMakanan := r.URL.Query().Get("Nama_Makanan")
	kandunganMakanan := r.URL.Query().Get("Kandungan_Makanan")
	penjualID := r.URL.Query().Get("PenjualID")
	hargaMakanan := r.URL.Query().Get("Harga_Makanan")

	if kategoriID == "" || namaMakanan == "" || kandunganMakanan == "" || penjualID == "" || hargaMakanan == "" {
		http.Error(w, "Missing required parameters", http.StatusBadRequest)
		return
	}

	makanan := Makanan{
		MakananID:         makananID,
		KategoriID:        kategoriID,
		Nama_Makanan:      namaMakanan,
		Kandungan_Makanan: kandunganMakanan,
		PenjualID:         penjualID,
		Harga_Makanan:     &hargaMakanan,
	}

	stmt, err := db.Prepare("INSERT INTO makanan (MakananID, KategoriID, Nama_Makanan, Kandungan_Makanan, PenjualID, Harga_Makanan) VALUES (?, ?, ?, ?, ?, ?)")
	if err != nil {
		http.Error(w, "Error preparing statement", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(makanan.MakananID, makanan.KategoriID, makanan.Nama_Makanan, makanan.Kandungan_Makanan, makanan.PenjualID, makanan.Harga_Makanan)
	if err != nil {
		http.Error(w, "Error executing statement", http.StatusInternalServerError)
		return
	}

	log.Printf("Makanan inserted: %+v", makanan)
	w.WriteHeader(http.StatusCreated)
}

func editMakanan(w http.ResponseWriter, r *http.Request) {
	makananID := r.URL.Query().Get("MakananID")
	kategoriID := r.URL.Query().Get("KategoriID")
	namaMakanan := r.URL.Query().Get("Nama_Makanan")
	kandunganMakanan := r.URL.Query().Get("Kandungan_Makanan")
	penjualID := r.URL.Query().Get("PenjualID")
	hargaMakanan := r.URL.Query().Get("Harga_Makanan")

	makanan := Makanan{
		MakananID:         makananID,
		KategoriID:        kategoriID,
		Nama_Makanan:      namaMakanan,
		Kandungan_Makanan: kandunganMakanan,
		PenjualID:         penjualID,
		Harga_Makanan:     &hargaMakanan,
	}

	stmt, err := db.Prepare("UPDATE makanan SET KategoriID=?, Nama_Makanan=?, Kandungan_Makanan=?, Harga_Makanan=? WHERE MakananID=? AND PenjualID=?")
	if err != nil {
		http.Error(w, "Error preparing statement", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(makanan.KategoriID, makanan.Nama_Makanan, makanan.Kandungan_Makanan, makanan.Harga_Makanan, makanan.MakananID, makanan.PenjualID)
	if err != nil {
		http.Error(w, "Error executing statement", http.StatusInternalServerError)
		return
	}

	log.Printf("Makanan updated: %+v", makanan)
	w.WriteHeader(http.StatusOK)
}

func getMakanan(w http.ResponseWriter, r *http.Request) {
	makananID := r.URL.Query().Get("MakananID")

	if makananID == "" {
		http.Error(w, "MakananID is required", http.StatusBadRequest)
		return
	}

	var makanan Makanan

	err := db.QueryRow("SELECT MakananID, KategoriID, Nama_Makanan, Kandungan_Makanan, PenjualID, Harga_Makanan FROM makanan WHERE MakananID = ?", makananID).Scan(
		&makanan.MakananID,
		&makanan.KategoriID,
		&makanan.Nama_Makanan,
		&makanan.Kandungan_Makanan,
		&makanan.PenjualID,
		&makanan.Harga_Makanan,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Makanan not found", http.StatusNotFound)
		} else {
			http.Error(w, "Error fetching makanan", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(makanan); err != nil {
		http.Error(w, "Error encoding makanan", http.StatusInternalServerError)
		return
	}
}

func getAllMakanan(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT MakananID, KategoriID, Nama_Makanan, Kandungan_Makanan, PenjualID, Harga_Makanan FROM makanan")
	if err != nil {
		http.Error(w, "Error fetching makanan items", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var makananList []Makanan
	for rows.Next() {
		var makanan Makanan
		err := rows.Scan(
			&makanan.MakananID,
			&makanan.KategoriID,
			&makanan.Nama_Makanan,
			&makanan.Kandungan_Makanan,
			&makanan.PenjualID,
			&makanan.Harga_Makanan,
		)
		if err != nil {
			http.Error(w, "Error scanning makanan items", http.StatusInternalServerError)
			return
		}
		makananList = append(makananList, makanan)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, "Error with makanan items rows", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(makananList); err != nil {
		http.Error(w, "Error encoding makanan items", http.StatusInternalServerError)
		return
	}
}

func updateOrderStatus(w http.ResponseWriter, r *http.Request) {
	// Parse URL parameters
	orderID := r.URL.Query().Get("OrderID")
	if orderID == "" {
		http.Error(w, "OrderID is required", http.StatusBadRequest)
		return
	}

	action := r.URL.Query().Get("Action")
	if action != "accept" && action != "cancel" && action != "complete" {
		http.Error(w, "Invalid action parameter", http.StatusBadRequest)
		return
	}

	// Determine the new status based on the action
	newStatus := ""
	switch action {
	case "accept":
		newStatus = "Processing"
	case "cancel":
		newStatus = "Cancelled"
	case "complete":
		newStatus = "Completed"
	}

	// Update order status in the database
	stmt, err := db.Prepare("UPDATE order_pelanggan SET Status=? WHERE OrderID=?")
	if err != nil {
		http.Error(w, "Error preparing statement", http.StatusInternalServerError)
		log.Printf("Error preparing statement: %v", err)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(newStatus, orderID)
	if err != nil {
		http.Error(w, "Error executing statement", http.StatusInternalServerError)
		log.Printf("Error executing statement: %v", err)
		return
	}

	log.Printf("Order %s %sed successfully", orderID, action)
	w.WriteHeader(http.StatusOK)
}

func registerDoctor(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("Username")
	password := r.URL.Query().Get("Password")
	namaDokter := r.URL.Query().Get("Nama_Dokter")
	email := r.URL.Query().Get("Email")
	alamatPraktik := r.URL.Query().Get("Alamat_Praktik")
	noTelp := r.URL.Query().Get("No_Telp")

	if username == "" || password == "" || namaDokter == "" || email == "" || alamatPraktik == "" || noTelp == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	// Parse No_Telp as int64
	parsedNoTelp, err := strconv.ParseInt(noTelp, 10, 64)
	if err != nil {
		http.Error(w, "Invalid phone number format", http.StatusBadRequest)
		return
	}

	var existingUsername string
	err = db.QueryRow("SELECT Username FROM dokter WHERE Username=?", username).Scan(&existingUsername)
	if err != nil && err != sql.ErrNoRows {
		http.Error(w, "Error checking username", http.StatusInternalServerError)
		return
	}
	if existingUsername != "" {
		http.Error(w, "Username already exists", http.StatusBadRequest)
		return
	}

	dokter := Dokter{
		DokterID:       generateDoctorID(),
		Username:       username,
		Password:       password,
		Nama_Dokter:    namaDokter,
		Email:          email,
		Alamat_Praktik: alamatPraktik,
		No_Telp:        parsedNoTelp,
	}

	hashedPassword, err := hashPassword(dokter.Password)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}
	dokter.Password = hashedPassword

	stmt, err := db.Prepare("INSERT INTO dokter (DokterID, Username, Password, Nama_Dokter, Email, Alamat_Praktik, No_Telp) VALUES (?, ?, ?, ?, ?, ?, ?)")
	if err != nil {
		http.Error(w, "Error preparing statement", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(dokter.DokterID, dokter.Username, dokter.Password, dokter.Nama_Dokter, dokter.Email, dokter.Alamat_Praktik, dokter.No_Telp)
	if err != nil {
		http.Error(w, "Error executing statement", http.StatusInternalServerError)
		return
	}

	log.Printf("Doctor registered: %+v", dokter) // Log doctor registration details

	// Now that the doctor is registered, call getDokterByID with the new request
	req, err := http.NewRequest("GET", r.URL.Path, nil)
	if err != nil {
		http.Error(w, "Error creating request", http.StatusInternalServerError)
		return
	}

	// Add the new DokterID to the query parameters of the new request
	q := req.URL.Query()
	q.Set("DokterID", dokter.DokterID)
	req.URL.RawQuery = q.Encode()

	// Call getDokterByID with the new request
	getDokterByID(w, req)
	log.Printf("Doctorid: %+v", dokter.DokterID)
}

func loginDoctor(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("Username")
	password := r.URL.Query().Get("Password")

	if username == "" || password == "" {
		http.Error(w, "Username and password are required", http.StatusBadRequest)
		return
	}

	var storedPassword string
	var dokterID string
	err := db.QueryRow("SELECT DokterID, Password FROM dokter WHERE Username=?", username).Scan(&dokterID, &storedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}
		http.Error(w, "Error retrieving stored password", http.StatusInternalServerError)
		log.Printf("Error retrieving stored password: %v", err)
		return
	}

	match, err := argon2id.ComparePasswordAndHash(password, storedPassword)
	if err != nil {
		http.Error(w, "Error comparing password and hash", http.StatusInternalServerError)
		return
	}
	if !match {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	log.Printf("Doctor logged in: %s", username) // Log successful login

	// Create a new request to call getDokterByID
	req, err := http.NewRequest("GET", r.URL.Path, nil)
	if err != nil {
		http.Error(w, "Error creating request", http.StatusInternalServerError)
		return
	}

	// Copy the original URL parameters and add DokterID
	q := req.URL.Query()
	q.Set("DokterID", dokterID)
	req.URL.RawQuery = q.Encode()

	// Call getDokterByID with the new request
	getDokterByID(w, req)
}

func EditDoctor(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("Username")
	newPassword := r.URL.Query().Get("Password")
	namaDokter := r.URL.Query().Get("Nama_Dokter")
	email := r.URL.Query().Get("Email")
	alamatPraktik := r.URL.Query().Get("Alamat_Praktik")
	noTelpStr := r.URL.Query().Get("No_Telp")

	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	noTelp, err := strconv.ParseInt(noTelpStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid phone number format", http.StatusBadRequest)
		return
	}

	var dokter Dokter
	err = db.QueryRow("SELECT DokterID, Password FROM dokter WHERE Username=?", username).Scan(&dokter.DokterID, &dokter.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			http.Error(w, "Doctor not found", http.StatusNotFound)
			return
		}
		http.Error(w, "Error executing query", http.StatusInternalServerError)
		return
	}

	if newPassword != "" {
		hashedPassword, err := argon2id.CreateHash(newPassword, argon2id.DefaultParams)
		if err != nil {
			http.Error(w, "Error hashing password", http.StatusInternalServerError)
			return
		}
		dokter.Password = hashedPassword
	}

	stmt, err := db.Prepare("UPDATE dokter SET Password=?, Nama_Dokter=?, Email=?, Alamat_Praktik=?, No_Telp=? WHERE Username=?")
	if err != nil {
		http.Error(w, "Error preparing statement", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(dokter.Password, namaDokter, email, alamatPraktik, noTelp, username)
	if err != nil {
		http.Error(w, "Error executing statement", http.StatusInternalServerError)
		return
	}

	log.Printf("Doctor updated: %+v", dokter)
	w.WriteHeader(http.StatusOK)
}

func inputActivity(w http.ResponseWriter, r *http.Request) {
	namaAktivitas := r.URL.Query().Get("Nama_Aktivitas")
	statusAktivitasStr := r.URL.Query().Get("Status_Aktivitas")
	keterangan := r.URL.Query().Get("Keterangan")

	if namaAktivitas == "" || statusAktivitasStr == "" || keterangan == "" {
		http.Error(w, "Nama Aktivitas, Status Aktivitas, and Keterangan are required", http.StatusBadRequest)
		return
	}

	statusAktivitas, err := strconv.Atoi(statusAktivitasStr)
	if err != nil || statusAktivitas < 1 || statusAktivitas > 3 {
		http.Error(w, "Status_Aktivitas must be an integer between 1 and 3", http.StatusBadRequest)
		return
	}

	aktivitasID := generateAktivitasID()

	stmt, err := db.Prepare("INSERT INTO aktivitas (AktivitasID, Nama_Aktivitas, Status_Aktivitas, Keterangan) VALUES (?, ?, ?, ?)")
	if err != nil {
		http.Error(w, "Error preparing statement", http.StatusInternalServerError)
		return
	}
	defer stmt.Close()

	_, err = stmt.Exec(aktivitasID, namaAktivitas, statusAktivitas, keterangan)
	if err != nil {
		http.Error(w, "Error executing statement", http.StatusInternalServerError)
		return
	}

	log.Printf("Activity inserted: %+v", Aktivitas{aktivitasID, namaAktivitas, statusAktivitas, keterangan})
	w.WriteHeader(http.StatusCreated)
}

func getAllAktivitas(w http.ResponseWriter, r *http.Request) {
	rows, err := db.Query("SELECT AktivitasID, Nama_Aktivitas, Status_Aktivitas, Keterangan FROM aktivitas")
	if err != nil {
		http.Error(w, "Error fetching aktivitas items", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var aktivitasList []Aktivitas
	for rows.Next() {
		var aktivitas Aktivitas
		err := rows.Scan(
			&aktivitas.AktivitasID,
			&aktivitas.Nama_Aktivitas,
			&aktivitas.Status_Aktivitas,
			&aktivitas.Keterangan,
		)
		if err != nil {
			http.Error(w, "Error scanning aktivitas items", http.StatusInternalServerError)
			return
		}
		aktivitasList = append(aktivitasList, aktivitas)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, "Error with aktivitas items rows", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(aktivitasList); err != nil {
		http.Error(w, "Error encoding aktivitas items", http.StatusInternalServerError)
		return
	}
}

func cors(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

func main() {
	godotenv.Load()

	var err error
	db, err = sql.Open("mysql", "root:@tcp(localhost:3306)/guladarah")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal(err)
	}

	//Customer Function
	http.HandleFunc("/register", cors(registerUser))
	http.HandleFunc("/login", cors(loginUser))
	http.HandleFunc("/editUser", cors(editUser))
	http.HandleFunc("/insertGulaDarah", cors(insertGulaDarah))
	http.HandleFunc("/getGulaDarahStats", cors(getGulaDarahStats))
	http.HandleFunc("/getGulaDarahHistory", cors(getGulaDarahHistory))
	http.HandleFunc("/getGulaDarahMonthlyStats", cors(getGulaDarahMonthlyStats))
	http.HandleFunc("/getSuggestedActivities", cors(getSuggestedActivitiesHandler))
	http.HandleFunc("/getFoodRecommendation", cors(getFoodRecommendation))
	http.HandleFunc("/addToCart", cors(addToCart))
	http.HandleFunc("/reduceQuantity", cors(reduceQuantity))
	http.HandleFunc("/AddQuantity", cors(AddQuantity))
	http.HandleFunc("/checkout", cors(checkout))
	http.HandleFunc("/viewOrderHistory", cors(viewOrderHistory))
	http.HandleFunc("/getPelangganByID", cors(getPelangganByID))
	http.HandleFunc("/getCart", cors(getCart))

	//Seller Function
	http.HandleFunc("/registerseller", cors(registerSeller))
	http.HandleFunc("/loginseller", cors(loginSeller))
	http.HandleFunc("/editSeller", cors(editSeller))
	http.HandleFunc("/insertMakanan", cors(insertMakanan))
	http.HandleFunc("/editMakanan", cors(editMakanan))
	http.HandleFunc("/updateOrderStatus", cors(updateOrderStatus))
	http.HandleFunc("/getPenjualByID", cors(getPenjualByID))
	http.HandleFunc("/getMakanan", cors(getMakanan))
	http.HandleFunc("/getAllMakanan", cors(getAllMakanan))

	//Doctor Function
	http.HandleFunc("/registerDoctor", cors(registerDoctor))
	http.HandleFunc("/loginDoctor", cors(loginDoctor))
	http.HandleFunc("/EditDoctor", cors(EditDoctor))
	http.HandleFunc("/inputActivity", cors(inputActivity))
	http.HandleFunc("/getDokterByID", cors(getDokterByID))
	http.HandleFunc("/getAllAktivitas", cors(getAllAktivitas))

	log.Println("Server starting on port 8080...")
	http.ListenAndServe(":8080", nil)
}
