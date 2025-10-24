const { Presensi } = require("../models");

exports.getDailyReport = async (req, res) => {
  try {
    console.log("Controller: Mengambil data laporan harian dari database...");
    const data = await Presensi.findAll(); // ✅ ambil data dari tabel Presensi
    res.json({
      reportDate: new Date().toLocaleDateString(),
      data, // hasil query aman dikirim ke client
    });
  } catch (error) {
    console.error("Error saat mengambil laporan harian:", error);
    res.status(500).json({ message: error.message });
  }
};
