const express = require("express")
const router = express.Router({mergeParams: true})

const {deleteProduct, updateProduct, insertProduct, getProductById, getProducts} = require('../../models/quanLySanPham/products')
const {getConfigurations, insertConfiguration, updateConfiguration, deleteConfiguration, insertMultipleConfigurations, updateConfigure, deleteConfigure, insertMultipleConfigures, getConfigures, insertConfigure, getProductConfigures} = require("../../models/quanLySanPham/configures");

router.route("/")
.get(async function (req, res) {
  const result = await getConfigures(res.locals.conn);
  await res.locals.conn.destroy()

  res.json(result)
})
.post(async function (req, res) {
  const conn = res.locals.conn;
  const result = await insertConfigure(conn, req.body);
  await res.locals.conn.destroy()
  res.json(result)
})
.put(async function (req, res) {
  const conn = res.locals.conn;
  const result = await updateConfigure(conn, req.body);
  await res.locals.conn.destroy()
  res.json(result)
})
.delete(async function (req, res) {
  const conn = res.locals.conn;
  const result = await deleteConfigure(conn, req.body);
  await res.locals.conn.destroy()
  res.json(result)
})

router.get("/:madanhmucsanpham", async function (req, res) {
  const conn = res.locals.conn;
  const result = await getProductConfigures(conn, req.params);
  await res.locals.conn.destroy()
  res.json(result)
})

module.exports = router