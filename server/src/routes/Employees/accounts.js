const express = require("express")
const {deleteEmployeeAccount, insertEmployeeAccount, updateEmployeeAccount, getEmployeeAccounts} = require("../../models/quanLyTaiKhoan/accounts");
const router = express.Router({mergeParams: true})

router.route("/")
      .get(async function (req, res) {
        const result = await getEmployeeAccounts(res.locals.conn);
        await res.locals.conn.destroy()
        res.json(result)
      })
      .post(async function (req, res) {
        const conn = res.locals.conn;
        const result = await insertEmployeeAccount(conn, req.body)
        await res.locals.conn.destroy()
        res.json(result)
      })
      .put(async function (req, res) {
        const conn = res.locals.conn;
        const result = await updateEmployeeAccount(conn, req.body)
        await res.locals.conn.destroy()
        res.json(result)
      })
      .delete(async function (req, res) {
        const conn = res.locals.conn;
        const result = await deleteEmployeeAccount(conn, req.body)
        await res.locals.conn.destroy()
        res.json(result)
      })

module.exports = router