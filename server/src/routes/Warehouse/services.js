const express = require("express")
const router = express.Router({mergeParams: true})

router.route("/")
.get(async function (req, res) {
  const conn = res.locals.conn;

  await conn.destroy();
  res.json({message: req.path})
})
.post(async function (req, res) {
  const conn = res.locals.conn;

  await conn.destroy();
  res.json({message: req.path})
})
.put(async function (req, res) {
  const conn = res.locals.conn;

  await conn.destroy();
  res.json({message: req.path})
})
.delete(async function (req, res) {
  const conn = res.locals.conn;

  await conn.destroy();
  res.json({message: req.path})
})

module.exports = router