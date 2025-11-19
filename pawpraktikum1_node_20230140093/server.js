const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");

// Definisikan PORT sekali di awal
const PORT = 3001; 

// --- 1. KONFIGURASI DAN PENERAPAN MIDDLEWARE CORS ---
// Ini adalah konfigurasi CORS spesifik yang Anda butuhkan
const corsOptions = {
    origin: 'http://localhost:3000', // Hanya mengizinkan FE dari port 3000
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
// Terapkan CORS di sini (Hanya satu kali!)
app.use(cors(corsOptions)); 

// --- 2. MIDDLEWARE BODY PARSER (JSON) ---
// Ini harus dipanggil SEBELUM route Anda untuk memparsing req.body
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- 3. MIDDLEWARE LOGGING ---
// Morgan untuk logging HTTP
app.use(morgan("dev"));

// Middleware kustom (optional, tapi dipertahankan)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// --- 4. IMPOR ROUTER ---
const presensiRoutes = require("./routes/presensi");
const reportRoutes = require("./routes/reports");
const authRoutes = require('./routes/auth');
const ruteBuku = require("./routes/books");

// --- 5. DEFINISI ROUTES ---
app.get("/", (req, res) => {
    res.send("Home Page for API");
});

// Penempatan Routes API
app.use("/api/auth", authRoutes); // PENTING: Pindahkan ke atas
app.use("/api/books", ruteBuku);
app.use("/api/presensi", presensiRoutes); // Gunakan salah satu saja
app.use("/api/reports", reportRoutes);
app.use('/api/attendance', presensiRoutes); // Gunakan salah satu saja

// --- 6. START SERVER ---
app.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
});

// Catatan: Baris-baris ini dihapus karena sudah didefinisikan di bagian atas
// app.use(cors()); 
// app.use(express.json());
// app.use('/api/attendance', presensiRoutes); 
// app.use('/api/reports', reportRoutes); 
// app.use('/api/auth', authRoutes); // Sudah ada di bagian Routes API