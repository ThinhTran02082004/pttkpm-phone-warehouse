const express = require('express')
const {
  getRoles,
  getActionsQuery,
  deleteRole,
  getFeaturesQuery,
  getPermissionsQuery,
  getRolePermissions,
  insertRole,
  updateRole,
  insertPermission
} = require("../../models/quanLyTaiKhoan/roles");

const router = express.Router({mergeParams: true})

router.route("/")
  .get(async function (req, res) {
    const result = await getRoles(res.locals.conn)
    await res.locals.conn.destroy()
    res.json(result)
  })
  .post(async function (req, res) {
    const result = await insertRole(res.locals.conn, req.body);
    await res.locals.conn.destroy()
    res.json(result)
  })
  .put(async function (req, res) {
    const result = await updateRole(res.locals.conn, req.body);
    await res.locals.conn.destroy()
    res.json(result)
  })
  .delete(async function (req, res) {
    const result = await deleteRole(res.locals.conn, req.body);
    await res.locals.conn.destroy()
    res.json(result)
  })

router.get("/permissions", async function (req, res) {
  const conn = res.locals.conn;
  const [actions, features, permissions] = await Promise.all([
    getActionsQuery(conn), getFeaturesQuery(conn), getPermissionsQuery(conn)
  ])

  await conn.destroy();
  return res.json({actions, features, permissions, success: true})
})

router.get("/:roleID", async function (req, res) {
  const conn = res.locals.conn;
  const result = await getRolePermissions(conn, req.params.roleID);

  await conn.destroy();
  res.json(result)
})

router.post("/update-permission", async function (req, res) {
  const conn = res.locals.conn;
  const result = await insertPermission(conn, req.body);

  await res.locals.conn.destroy()
  return res.json(result);
})
module.exports = router