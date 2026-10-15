const bcrypt = require('bcrypt');

async function getEmployeeAccounts(conn) {
  try {
    const [result] = await conn.query(
      `SELECT t.mataikhoan,
              CONCAT('TK-' + t.mataikhoan) AS ma,
              nv.manhanvien,
              nv.hoten,
              nv.mail,
              nv.sodienthoai,
              nq.manhomquyen,
              nq.tennhomquyen,
              nq.tenhienthi,
              nq.ghichu
       FROM taikhoan t
                INNER JOIN nhanvien nv ON t.nhanvien = nv.manhanvien
                INNER JOIN nhomquyen nq ON t.vaitro = nq.manhomquyen
       WHERE nq.manhomquyen != 1;`)
    return {Data: result, success: true};
  } catch (e) {
    console.log(e)
    return {Data: [], success: false}
  }
}

async function insertEmployeeAccount(conn, accounts = []) {
  try {
    const saveData = []
    for (const account of accounts) saveData.push({
      nhanvien: account.nhanvien,
      vaitro: account.vaitro,
      matkhau: await bcrypt.hash(account.matkhau, 10),
    })

    await conn.query(
      `INSERT INTO taikhoan (matkhau, vaitro, nhanvien)
       VALUES ?;`,
      [saveData.map(({matkhau, vaitro, nhanvien}) => [matkhau, vaitro, nhanvien])])

    const [result] = await conn.query(
      `SELECT n.hoten, n.sodienthoai, n.mail, nq.tenhienthi
       FROM taikhoan t
                INNER JOIN nhanvien n ON t.nhanvien = n.manhanvien
                INNER JOIN nhomquyen nq ON t.vaitro = nq.manhomquyen
       WHERE nhanvien IN ?`, [[accounts.map(({nhanvien}) => nhanvien)]])
    return {message: "Account added", success: true, Data: result};
  } catch (e) {
    console.log(e)
    return {message: "Added fail", success: false};
  }
}

async function updateEmployeeAccount(conn, {vaitro, mataikhoan}) {
  try {
    await conn.query(
      `UPDATE taikhoan
       SET vaitro = ?
       WHERE mataikhoan = ?;`, [vaitro, mataikhoan])
    return {message: "Account updated", success: true}
  } catch (e) {
    console.log((e))
    return {message: "Updated fail", success: false};
  }
}

async function deleteEmployeeAccount(conn, accounts = []) {
  try {
    console.log(accounts)
    const temp = accounts.filter(i => +i.manhomquyen !== 1).map(({mataikhoan}) => mataikhoan)
    if (temp.length === 0) return {message: "Deleted fail", success: false}
    await conn.query(
      `DELETE
       FROM taikhoan
       WHERE mataikhoan IN ?;`, [[temp]])
    return {message: "Account deleted", success: true}
  } catch (e) {
    console.log(e)
    return {message: "Deleted fail", success: false}
  }
}


module.exports = {
  deleteEmployeeAccount, insertEmployeeAccount, updateEmployeeAccount, getEmployeeAccounts
}