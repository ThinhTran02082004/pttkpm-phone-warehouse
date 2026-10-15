async function getCustomers(conn) {
  try {
    const [result] = await conn.query(
      `SELECT *
       FROM khachhang
       ORDER BY makhachhang;`)
    return {Data: result, success: true};
  } catch (e) {
    console.log(e)
    return {Data: [], success: false}
  }
}

async function getCustomerCarts(conn, {makhachhang}) {
  try {
    const [result] = await conn.query(
      `SELECT p.maphieuxuat, p.thoigianxuat, COUNT(DISTINCT sanpham.masanpham) soluong, SUM(c.giaxuat) thanhtien
       FROM phieuxuatkho p
                INNER JOIN khachhang k ON p.khachhang = k.makhachhang
                INNER JOIN sanpham ON p.maphieuxuat = sanpham.phieuxuat
                INNER JOIN cauhinh c ON sanpham.cauhinh = c.macauhinh
       WHERE makhachhang = ?
       GROUP BY p.maphieuxuat;`, [makhachhang])
    return {Data: result, success: true};
  } catch (e) {
    console.log(e)
    return {Data: [], success: false}
  }
}

async function insertCustomer(conn, Data = []) {
  try {
    await conn.query(
      `INSERT INTO khachhang (tenkhachhang, ngaysinh, diachi, sodienthoai, mail)
       VALUES ?`,
      [Data.map(({tenkhachhang, ngaysinh, diachi, sodienthoai, mail}) =>
        [tenkhachhang, ngaysinh, diachi, sodienthoai, mail]
      )]
    )
    const [result] = await conn.query(
      `SELECT *
       FROM khachhang
       WHERE sodienthoai IN ?`,
      [[Data.map(({sodienthoai}) => sodienthoai)]]
    )
    // console.log(result)
    return {message: "Customers added", success: true, Data: result};
  } catch (e) {
    console.log(e)
    return {message: "Added fail", success: false, Data: []};
  }
}

async function updateCustomer(conn, {tenkhachhang, ngaysinh, diachi, sodienthoai, mail, makhachhang}) {
  try {
    await conn.query(
      `UPDATE khachhang
       SET tenkhachhang = ?,
           ngaysinh     = ?,
           diachi       = ?,
           sodienthoai  = ?,
           mail         = ?
       WHERE makhachhang = ?;`,
      [tenkhachhang, ngaysinh, diachi, sodienthoai, mail, makhachhang])
    return {message: "Customer updated", success: true, Data: []}
  } catch (e) {
    console.log((e))
    return {message: "Updated fail", success: false, Data: []};
  }
}

async function deleteCustomer(conn, Data = []) {
  try {
    await conn.query(
      `DELETE
       FROM khachhang
       WHERE makhachhang IN ?;`,
      [[Data.map(({makhachhang}) => makhachhang)]])
    return {message: "Customer deleted", success: true, Data: []}
  } catch (e) {
    return {message: "Deleted fail", success: false, Data: []}
  }
}

module.exports = {
  getCustomers, insertCustomer, updateCustomer, deleteCustomer, getCustomerCarts
}