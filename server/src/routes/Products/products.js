const express = require("express")
const path = require("path")
const multer = require("multer");

const {deleteProduct, updateProduct, insertProduct, getProductById, getProducts, updateProductImage, getProductWithConfigures} = require('../../models/quanLySanPham/products')

const router = express.Router({mergeParams: true})


const {v4} = require("uuid");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../../images/products"),
  filename: function (req, file, cb) {
    console.log(file)
    return cb(null, `${file.fieldname}_${v4()}${path.extname(file.originalname)}`)
  },
})

const upload = multer({
  storage: storage,
  limits: {fileSize: 1024 * 1024 * 1024}
})

router.route("/")
.get(async function (req, res) {
  const result = await getProducts(res.locals.conn);
  await res.locals.conn.destroy()

  res.json(result)
})
.post(async function (req, res) {
  const conn = res.locals.conn;
  const result = await insertProduct(conn, req.body);
  await res.locals.conn.destroy()
  res.json(result)
})
.put(async function (req, res) {
  const conn = res.locals.conn;
  const result = await updateProduct(conn, req.body);
  await res.locals.conn.destroy()
  res.json(result)
})
.delete(async function (req, res) {
  const conn = res.locals.conn;
  const result = await deleteProduct(conn, req.body);
  await res.locals.conn.destroy()
  res.json(result)
})

router.get("/product-configures", async function (req, res) {
  const conn = res.locals.conn;
  const result = await getProductWithConfigures(conn);
  await res.locals.conn.destroy()
  res.json(result)
})

router.post("/upload-img/:madanhmucsanpham",
  upload.single("hinhAnh"),
  async function (req, res) {
    const result = await updateProductImage(res.locals.conn, {
      madanhmucsanpham: req.params.madanhmucsanpham,
      hinhAnh: '/api/images/products/' + req.file.filename
    })
    console.log(result)
    await res.locals.conn.destroy()

    res.json(result)
  })

module.exports = router