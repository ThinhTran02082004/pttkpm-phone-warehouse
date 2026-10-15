const express = require('express');
const { verifyAccount, getProfile, updateProfile } = require("../../models/auth");
const { createToken, getSecretKey } = require("./validateToken");
const { insertEmployee } = require("../../models/quanLyTaiKhoan/employees");
const { v4 } = require("uuid");
const { insertEmployeeAccount } = require("../../models/quanLyTaiKhoan/accounts");

const router = express.Router({ mergeParams: true });

router.post("/login", async function (req, res) {
  const result = await verifyAccount(res.locals.conn, req.body)
  if (!result.result) {
    await res.locals.conn.destroy()
    return res.json(result);
  }
  const token = createToken(result.userid, req.body.mail, req.body.password)

  delete result.userid
  await res.locals.conn.destroy()
  res.json({ ...result, token })
})

router.post("/register", async function (req, res) {
  // Extract name from email if not provided
  const email = req.body.mail || ""
  const defaultName = email.split("@")[0] || "User"

  const emp = await insertEmployee(res.locals.conn, [
    {
      hoten: req.body.hoten || defaultName,
      ngaysinh: new Date().toISOString().split("T")[0],
      gioitinh: req.body.gioitinh || "Nam",
      mail: email
    }
  ])
  console.log(emp)
  if (!emp.success) {
    await res.locals.conn.destroy()
    return res.json({ message: "Email đã tồn tại", success: false })
  }

  const acc = await insertEmployeeAccount(res.locals.conn, [
    { matkhau: req.body.password, vaitro: 2, nhanvien: emp.Data[0].manhanvien }  // Changed from 1 (admin) to 2
  ])

  await res.locals.conn.destroy()
  res.json(acc)
})

router.post("/change-password", function (req, res) {
  // res.json({message: req.path})
  res.redirect("/eee")
})

// Get user profile
router.get("/profile/:id", async function (req, res) {
  const result = await getProfile(res.locals.conn, req.params.id)
  await res.locals.conn.destroy()
  res.json(result)
})

// Update user profile
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure images directory exists
const imagesDir = path.join(__dirname, '../../../images');
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imagesDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ storage: storage })

router.put("/profile/:id", upload.single('avatarFile'), async function (req, res) {
  try {
    const updateData = { ...req.body };

    // If a new avatar file was uploaded, construct its URL
    if (req.file) {
      updateData.avatar = `http://localhost:3002/api/images/${req.file.filename}`;
    }

    const result = await updateProfile(res.locals.conn, req.params.id, updateData)
    await res.locals.conn.destroy()
    res.json(result)
  } catch (err) {
    console.error("Profile update error:", err)
    if (res.locals.conn) await res.locals.conn.destroy()
    res.status(500).json({ success: false, message: 'Lỗi server khi cập nhật profile' })
  }
})


module.exports = router;