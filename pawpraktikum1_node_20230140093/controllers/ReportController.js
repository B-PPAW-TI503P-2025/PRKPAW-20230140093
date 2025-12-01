const models = require("../models");
const Presensi = models.Presensi;
const User = models.User;
const { Op } = require("sequelize");

exports.getDailyReport = async (req, res) => {
  try {
    const { nama } = req.query;

    let options = {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["name"], // nama field yang benar
        },
      ],
      order: [["checkIn", "DESC"]],
    };

    if (nama) {
      options.include[0].where = {
        name: { [Op.like]: `%${nama}%` },
      };
    }

    const records = await Presensi.findAll(options);

    res.json({
      success: true,
      reportDate: new Date().toLocaleDateString("id-ID"),
      data: records,
    });

  } catch (error) {
    console.log("REPORT ERROR:", error);
    res.status(500).json({ message: "Gagal mengambil laporan", error: error.message });
  }
};
