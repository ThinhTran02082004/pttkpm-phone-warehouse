async function getEmployees(conn) {
  try {
    const [result] = await conn.query(
      `SELECT nv.*, nq.*
       FROM nhanvien nv
                LEFT JOIN taikhoan tk ON nv.manhanvien = tk.nhanvien
                LEFT JOIN nhomquyen nq ON tk.vaitro = nq.manhomquyen
       WHERE nq.manhomquyen != 1
          OR nq.manhomquyen IS NULL`)

    return {Data: result, success: true}
  } catch (e) {
    return {Data: [], success: false}
  }
}

async function getEmployeeWithoutAccount(conn) {
  try {
    const [result] = await conn.query(
      `SELECT n.*
       FROM nhanvien n
                LEFT JOIN taikhoan t ON t.nhanvien = n.manhanvien
       WHERE t.mataikhoan IS NULL
       LIMIT 100;`)
    return {Data: result, success: true}
  } catch (e) {
    return {Data: [], success: false}
  }
}

async function getEmployeeWithAccount(conn) {
  try {
    const [result] = await conn.query(
      `SELECT n.*
       FROM nhanvien n
                LEFT JOIN taikhoan t ON t.nhanvien = n.manhanvien
       WHERE t.mataikhoan IS NOT NULL
       LIMIT 100;`)
    return {Data: result, success: true}
  } catch (e) {
    return {Data: [], success: false}
  }
}

async function insertEmployee(conn, employees = []) {
  try {
    await conn.query(
      `INSERT INTO nhanvien (hoten, ngaysinh, sodienthoai, gioitinh, mail)
       VALUES ?`,
      [
        employees.map(({hoten, ngaysinh, sodienthoai, gioitinh, mail}) => [
          hoten, ngaysinh, sodienthoai, gioitinh, mail
        ])
      ])

    const [res] = await conn.query(
      `SELECT *
       FROM nhanvien nv
       WHERE mail IN ?`,
      [[employees.map(({mail}) => mail)]]
    )

    return {message: "Customers added", success: true, Data: res};
  } catch (e) {
    console.log(e)
    return {message: "Added fail", success: false};
  }
}

async function updateEmployee(conn, {hoten, ngaysinh, sodienthoai, gioitinh, mail, manhanvien}) {
  try {
    const [result] = await conn.query(
      `UPDATE nhanvien
       SET hoten       = ?,
           ngaysinh    = ?,
           sodienthoai = ?,
           gioitinh    = ?,
           mail        = ?
       WHERE manhanvien = ?;`,
      [hoten, ngaysinh, sodienthoai, gioitinh, mail, manhanvien])

    return {message: "Employee updated", success: true}
  } catch (e) {
    console.log(e)
    return {message: "Updated failed", success: false}
  }
}

async function deleteEmployee(conn, employees = []) {
  try {
    const [result] = await conn.query(
      `DELETE
       FROM nhanvien
       WHERE manhanvien IN ?;`,
      [[employees.map(({manhanvien}) => manhanvien)]])

    return {message: "Employee deleted", success: true}
  } catch (e) {
    console.log(e)
    return {message: "Deleted failed", success: false}
  }
}

module.exports = {
  getEmployees, getEmployeeWithAccount, insertEmployee, updateEmployee, deleteEmployee, getEmployeeWithoutAccount
}