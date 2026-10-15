async function getExports(conn) {
  try {
    const [result] = await conn.query(
      `SELECT *
       FROM phieuxuatkho
       ORDER BY maphieuxuat DESC`)
    return {success: true, Data: result}
  } catch (err) {
    console.error(err);
    return {success: false, Data: []};
  }
}

async function findExports(conn, {makhachhang, manhanvien, tungay, denngay, tusotien, densotien}) {
  try {
    let result;
    if (makhachhang === '*' && manhanvien === '*')
      [result] = await conn.query(
        `SELECT p.maphieuxuat, k.tenkhachhang, n.hoten, p.thoigianxuat thoigian, SUM(c.giaxuat) tongtien
         FROM phieuxuatkho p
                  LEFT JOIN khachhang k ON p.khachhang = k.makhachhang
                  LEFT JOIN nhanvien n ON p.nhanvienxuat = n.manhanvien
                  LEFT JOIN sanpham s ON p.maphieuxuat = s.phieuxuat
                  LEFT JOIN cauhinh c ON s.cauhinh = c.macauhinh
         GROUP BY p.maphieuxuat, p.thoigianxuat
         HAVING COUNT(DISTINCT masanpham) > 0
         ORDER BY p.thoigianxuat DESC`)

    else if (makhachhang === '*')
      [result] = await conn.query(
        `SELECT p.maphieuxuat, k.tenkhachhang, n.hoten, p.thoigianxuat thoigian, SUM(c.giaxuat) tongtien
         FROM phieuxuatkho p
                  LEFT JOIN khachhang k ON p.khachhang = k.makhachhang
                  LEFT JOIN nhanvien n ON p.nhanvienxuat = n.manhanvien
                  LEFT JOIN sanpham s ON p.maphieuxuat = s.phieuxuat
                  LEFT JOIN cauhinh c ON s.cauhinh = c.macauhinh
         WHERE n.manhanvien = ?
           AND p.thoigianxuat BETWEEN ? AND ?
         GROUP BY p.maphieuxuat, p.thoigianxuat
         HAVING tongtien BETWEEN ? AND ?
            AND COUNT(DISTINCT masanpham) > 0
         ORDER BY p.thoigianxuat DESC`,
        [manhanvien, tungay, denngay, tusotien, densotien])
    else if (manhanvien === '*')
      [result] = await conn.query(
        `SELECT p.maphieuxuat, k.tenkhachhang, n.hoten, p.thoigianxuat thoigian, SUM(c.giaxuat) tongtien
         FROM phieuxuatkho p
                  LEFT JOIN khachhang k ON p.khachhang = k.makhachhang
                  LEFT JOIN nhanvien n ON p.nhanvienxuat = n.manhanvien
                  LEFT JOIN sanpham s ON p.maphieuxuat = s.phieuxuat
                  LEFT JOIN cauhinh c ON s.cauhinh = c.macauhinh
         WHERE k.makhachhang = ?
           AND p.thoigianxuat BETWEEN ? AND ?
         GROUP BY p.maphieuxuat, p.thoigianxuat
         HAVING tongtien BETWEEN ? AND ?
            AND COUNT(DISTINCT masanpham) > 0
         ORDER BY p.thoigianxuat DESC`,
        [makhachhang, tungay, denngay, tusotien, densotien])
    else [result] = await conn.query(
        `SELECT p.maphieuxuat, k.tenkhachhang, n.hoten, p.thoigianxuat thoigian, SUM(c.giaxuat) tongtien
         FROM phieuxuatkho p
                  LEFT JOIN khachhang k ON p.khachhang = k.makhachhang
                  LEFT JOIN nhanvien n ON p.nhanvienxuat = n.manhanvien
                  LEFT JOIN sanpham s ON p.maphieuxuat = s.phieuxuat
                  LEFT JOIN cauhinh c ON s.cauhinh = c.macauhinh
         WHERE k.makhachhang = ?
           AND n.manhanvien = ?
           AND p.thoigianxuat BETWEEN ? AND ?
         GROUP BY p.maphieuxuat, p.thoigianxuat
         HAVING tongtien BETWEEN ? AND ?
            AND COUNT(DISTINCT masanpham) > 0
         ORDER BY p.thoigianxuat DESC`,
        [makhachhang, manhanvien, tungay, denngay, tusotien, densotien])

    return {success: true, Data: result}
  } catch (e) {
    console.log(e)
    return {success: false, Data: []};
  }
}

async function insertExport(conn, imports = []) {
  try {
    await conn.query(
      `INSERT INTO phieuxuatkho (khachhang, nhanvienxuat, thoigianxuat)
       VALUES ?`,
      [imports.map(({khachhang, nhanvienxuat, thoigianxuat}) => [khachhang, nhanvienxuat, thoigianxuat])])

    const [result] = await conn.query(
      `SELECT *
       FROM phieuxuatkho
       WHERE nhanvienxuat IN ?
         AND khachhang IN ?
       ORDER BY thoigianxuat DESC
       LIMIT ?`,
      [
        [imports.map(({nhanvienxuat}) => nhanvienxuat)],
        [imports.map(({khachhang}) => khachhang)],
        imports.length
      ])

    return {message: "Export added", success: true, Data: result}
  } catch (err) {
    console.error(err);
    return {message: "Added fail", success: false, Data: []};
  }
}

async function getFreeExport(conn) {
  try {
    let [result] = await conn.query(
      `SELECT p.*
       FROM phieuxuatkho p
                LEFT JOIN sanpham s ON s.phieuxuat = p.maphieuxuat
       WHERE p.khachhang IS NULL
         AND p.nhanvienxuat IS NULL
       GROUP BY p.maphieuxuat
       HAVING COUNT(DISTINCT s.masanpham) = 0
       LIMIT 1;`)

    if (result.length) return {Data: result, success: true, message: "success"};

    [result] = await conn.query(`INSERT INTO phieuxuatkho (khachhang, nhanvienxuat)
                                 VALUES (NULL, NULL);`)

    const [temp] = await conn.query(
      `SELECT *
       FROM phieuxuatkho
       WHERE maphieuxuat = ?`,
      [result.insertId])
    return {success: true, Data: temp}
  } catch (err) {
    console.error(err);
    return {success: false, Data: []};
  }
}

async function updateExport(conn, {maphieuxuat, khachhang, nhanvienxuat}) {
  try {
    await conn.query(
      `UPDATE phieuxuatkho
       SET khachhang    = ?,
           nhanvienxuat = ?
       WHERE maphieuxuat = ?`,
      [khachhang, nhanvienxuat, maphieuxuat])

    return {message: "Export updated", success: true}
  } catch (e) {
    console.log(e)
    return {message: "Updated fail", success: false};
  }
}

async function deleteExport(conn, imports = []) {
  try {
    await conn.query(
      `DELETE
       FROM phieuxuatkho
       WHERE maphieuxuat IN ?`,
      [[imports.map(({maphieunhap}) => maphieunhap)]])

    return {message: "Exports deleted", success: true}
  } catch (err) {
    console.error(err);
    return {message: "Deleted fail", success: false};
  }
}

module.exports = {
  getExports, insertExport, updateExport, deleteExport, findExports, getFreeExport
}