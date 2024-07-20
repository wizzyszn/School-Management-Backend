const AdminModel = require("../models/admin");
const TeacherModel = require("../models/teacher");
const jwt = require('jsonwebtoken');

module.exports.isAdminOrClassTeacher = async (req, res, next) => {
    console.log("Ok")
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "Access token is missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { email } = decoded;

    const [admin, teacher] = await Promise.all([
      AdminModel.findOne({ email }),
      TeacherModel.findOne({ "contact.email": email })
    ]);

    if (admin) {
      if (admin.role === "admin") {
        return next();
      }
    } else if (teacher) {
      if (teacher.roles && teacher.roles.includes("classTeacher")) {
        return next();
      }
    }

    throw new Error("Admin or class teacher access is required");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
