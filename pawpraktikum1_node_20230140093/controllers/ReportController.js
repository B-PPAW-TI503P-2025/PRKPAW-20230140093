const { Presensi } = require("../models");
const { Op } = require("sequelize");


const { format, zonedTimeToUtc } = require("date-fns-tz");




exports.getDailyReport = async (req, res) => {
  try {
    const { nama, tanggalMulai, tanggalSelesai } = req.query;
    const timeZone = "Asia/Jakarta";

    let options = { where: {} };

    // Filter berdasarkan nama (opsional)
    if (nama) {
      options.where.nama = { [Op.like]: `%${nama}%` };
    }

    // Filter rentang tanggal (WIB -> UTC)
    if (tanggalMulai && tanggalSelesai) {
      const startDate = `${tanggalMulai}T00:00:00`;
      const endDate = `${tanggalSelesai}T23:59:59`;

      const startUtc = zonedTimeToUtc(startDate, timeZone);
      const endUtc = zonedTimeToUtc(endDate, timeZone);

      if (isNaN(startUtc) || isNaN(endUtc) || startUtc > endUtc) {
        return res.status(400).json({
          message: "Format tanggalMulai atau tanggalSelesai tidak valid. Gunakan format YYYY-MM-DD.",
        });
      }

      options.where.checkIn = { [Op.between]: [startUtc, endUtc] };
    }

    const records = await Presensi.findAll(options);

    const formattedRecords = records.map((item) => ({
      id: item.id,
      userId: item.userId,
      nama: item.nama,
      checkIn: item.checkIn ? format(item.checkIn, "dd-MM-yyyy HH:mm:ss", { timeZone }) : null,
      checkOut: item.checkOut ? format(item.checkOut, "dd-MM-yyyy HH:mm:ss", { timeZone }) : null,
      createdAt: format(item.createdAt, "dd-MM-yyyy HH:mm:ss", { timeZone }),
      updatedAt: format(item.updatedAt, "dd-MM-yyyy HH:mm:ss", { timeZone }),
    }));

    res.status(200).json({
      reportDate: format(new Date(), "dd-MM-yyyy HH:mm:ss", { timeZone }),
      totalRecords: formattedRecords.length,
      data: formattedRecords,
    });
  } catch (error) {
    console.error("❌ Error saat mengambil laporan harian:", error);
    res.status(500).json({
      message: "Gagal mengambil laporan harian",
      error: error.message,
    });
  }
};
