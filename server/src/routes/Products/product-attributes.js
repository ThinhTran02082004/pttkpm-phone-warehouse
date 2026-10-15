const express = require("express")
const router = express.Router({mergeParams: true})

const {insertAttribute, getAttributes, updateAttribute, deleteAttribute} = require('../../models/quanLySanPham/product-attributes')

router.route("/:attribute")
// Lay du lieu thuoc tinh
      .get(async function (req, res) {
        const attribute = req.params.attribute
        const conn = res.locals.conn

        const result = await getAttributes(conn, attribute)
        await conn.destroy()
        res.json(result)
      })
// Them du lieu thuoc tinh
      .post(async function (req, res) {
        const attribute = req.params.attribute
        const conn = res.locals.conn

        const result = await insertAttribute(conn, attribute, req.body)
        await conn.destroy()
        res.json(result)
      })
// Sua du lieu thuoc tinh
      .put(async function (req, res) {
        const attribute = req.params.attribute
        const conn = res.locals.conn

        const result = await updateAttribute(conn, attribute, req.body)
        await conn.destroy()
        res.json(result)
      })
// Xoa du lieu thuoc tinh
      .delete(async function (req, res) {
        const attribute = req.params.attribute
        const conn = res.locals.conn

        const result = await deleteAttribute(conn, attribute, req.body)
        await conn.destroy()
        res.json(result)
      })

module.exports = router