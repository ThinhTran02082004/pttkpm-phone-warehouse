const pool = require('../../models')
const {verifyAccount} = require("../../models/auth");


async function getAllPerm() {
  const conn = await pool.getConnection()
  const [res] = await conn.query(
    `SELECT q.maquyenhan, cn.tenchucnang chucnang, hd.tenhanhdong hanhdong
     FROM quyenhan q
              INNER JOIN chucnang cn ON q.chucnang = cn.machucnang
              INNER JOIN hanhdong hd ON q.hanhdong = hd.mahanhdong
     ORDER BY cn.machucnang, hd.mahanhdong;`)
  await conn.destroy()
  return Object.freeze(res)
}

const permissions = getAllPerm()

async function authAccount(req, res, next) {

  if (res.locals.user) return next()

  await res.locals.conn.destroy()
  return res.json({susccess: false, message: "User is not authenticated.", Data: []})
}

function authPermission(maQuyenHan = 0, last = false, optional = true) {
  return async function (req, res, next) {
    if (res.locals.permissions == null) {
      await res.locals.conn.destroy()
      return res.json({message: "Action is prohibited", success: false})
    }

    if (res.locals.permissionCheck && optional) return next()
    res.locals.permissionCheck = false;

    const perms = res.locals.permissions
    for (let perm of perms)
      if (perm.quyen === maQuyenHan) {
        res.locals.permissionCheck = true;
        return next()
      }

    if (last || !optional) {
      await res.locals.conn.destroy()
      return res.json({message: "Action is prohibited", success: false})
    }
    next()
  }
}

module.exports = {
  authAccount,
  authPermission,
  permissions
}