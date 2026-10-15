const express = require("express")
const router = express.Router({mergeParams: true})

const {insertCustomer, getCustomers, deleteCustomer, updateCustomer, getCustomerCarts} = require('../../models/quanLyDoiTac/customers')

router.route("/")
.get(async function (req, res) {
  const conn = res.locals.conn
  const result = await getCustomers(conn)
  await conn.destroy()

  res.json(result)
})
.post(async function (req, res) {
  const conn = res.locals.conn
  const customer = req.body
  const result = await insertCustomer(conn, customer)

  await conn.destroy()
  res.json(result)
})
.put(async function (req, res) {
  const conn = res.locals.conn
  const customer = req.body
  const result = await updateCustomer(conn, customer)

  await conn.destroy()
  res.json(result)
})
.delete(async function (req, res) {
  const conn = res.locals.conn
  const customer = req.body
  const result = await deleteCustomer(conn, customer)

  await conn.destroy()
  res.json(result)
})

router.get("/:makhachhang", async function (req, res) {
  const conn = res.locals.conn
  const result = await getCustomerCarts(conn, req.params)

  await conn.destroy()
  res.json(result)
})
module.exports = router