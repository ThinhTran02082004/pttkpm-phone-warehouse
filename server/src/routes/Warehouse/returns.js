const express = require("express")
const router = express.Router({mergeParams: true})

const {getReturns, getReturnProducts, insertReturn, updateReturn, deleteReturn} = require("../../models/quanLyNhapXuat/returns")

router.route("/")
      .get(async function (req, res) {
        const result = await getReturns(res.locals.conn);
        await res.locals.conn.destroy()
        res.json(result)
      })
      .post(async function (req, res) {
        const result = await insertReturn(res.locals.conn, req.body);
        await res.locals.conn.destroy()
        res.json(result)
      })
      .put(async function (req, res) {
        const result = await updateReturn(res.locals.conn, req.body);
        await res.locals.conn.destroy()
        res.json(result)
      })
      .delete(async function (req, res) {
        const result = await deleteReturn(res.locals.conn, req.body);
        await res.locals.conn.destroy()
        res.json(result)
      })

router.get("/products", async function (req, res) {
  const result = await getReturnProducts(res.locals.conn, req.query);
  await res.locals.conn.destroy();
  res.json(result);
})

module.exports = router

