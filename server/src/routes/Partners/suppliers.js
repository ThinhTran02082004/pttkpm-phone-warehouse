const express = require("express")
const router = express.Router({mergeParams: true})

const {updateSupplier, insertSupplier, getSuppliers, deleteSupplier, getSuppliersCarts} = require('../../models/quanLyDoiTac/suppliers')
const {insertMultipleConfigures} = require("../../models/quanLySanPham/configures");
const {getCustomerCarts} = require("../../models/quanLyDoiTac/customers");

router.route("/")
.get(async function (req, res) {
  const conn = res.locals.conn;
  const result = await getSuppliers(conn)

  await conn.destroy()
  res.json(result)
})
.post(async function (req, res) {
  const conn = res.locals.conn;
  const result = await insertSupplier(conn, req.body)

  await conn.destroy()
  res.json(result)
})
.put(async function (req, res) {
  const conn = res.locals.conn;
  const result = await updateSupplier(conn, req.body)

  await conn.destroy()
  res.json(result)
})
.delete(async function (req, res) {
  const conn = res.locals.conn;
  const result = await deleteSupplier(conn, req.body)

  await conn.destroy()
  res.json(result)
})
router.get("/:manhacungcap", async function (req, res) {
  const conn = res.locals.conn
  const result = await getSuppliersCarts(conn, req.params)

  await conn.destroy()
  res.json(result)
})
module.exports = router