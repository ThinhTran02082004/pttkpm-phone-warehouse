async function getReturns(conn) {
  try {
    const [result] = await conn.query(
      `SELECT p.maphieudoitra,
              p.thoigiandoitra,
              k.makhachhang,
              k.tenkhachhang,
              n.hoten           AS tennhanvien,
              p.ghichu,
              COUNT(s.masanpham) AS soluongdoitra
       FROM phieudoitra p
                LEFT JOIN khachhang k ON p.khachhang = k.makhachhang
                LEFT JOIN nhanvien n ON p.nhanviencskh = n.manhanvien
                LEFT JOIN sanpham s ON p.maphieudoitra = s.phieudoitra
       GROUP BY p.maphieudoitra
       ORDER BY p.thoigiandoitra DESC;`)
    return {Data: result, success: true};
  } catch (e) {
    console.log(e)
    return {Data: [], success: false}
  }
}

async function getReturnProducts(conn, {maphieudoitra}) {
  try {
    const [result] = await conn.query(
      `SELECT s.masanpham,
              s.maimei,
              d.tendanhmucsanpham,
              r.dungluongram,
              ro.dungluongrom,
              m.tenmausac,
              c.gianhap,
              c.giaxuat
       FROM sanpham s
                INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
                INNER JOIN danhmucsanpham d ON c.danhmucsanpham = d.madanhmucsanpham
                INNER JOIN ram r ON c.ram = r.maram
                INNER JOIN rom ro ON c.rom = ro.marom
                INNER JOIN mausac m ON c.mausac = m.mamausac
       WHERE s.phieudoitra = ?;`,
      [maphieudoitra])
    return {Data: result, success: true};
  } catch (e) {
    console.log(e)
    return {Data: [], success: false}
  }
}

async function insertReturn(conn, {khachhang, nhanviencskh, ghichu, sanpham = []}) {
  try {
    // Tạo phiếu đổi trả
    const [result] = await conn.query(
      `INSERT INTO phieudoitra (khachhang, nhanviencskh, ghichu)
       VALUES (?, ?, ?);`,
      [khachhang, nhanviencskh, ghichu])

    const maphieudoitra = result.insertId;

    // Cập nhật sản phẩm
    if (sanpham.length > 0) {
      await conn.query(
        `UPDATE sanpham
         SET phieudoitra = ?,
             tinhtrang   = 3
         WHERE masanpham IN ?;`,
        [maphieudoitra, [sanpham]])
    }

    return {message: "Return created", success: true, Data: {maphieudoitra}};
  } catch (e) {
    console.log(e)
    return {message: "Created fail", success: false};
  }
}

async function updateReturn(conn, {maphieudoitra, khachhang, nhanviencskh, ghichu}) {
  try {
    await conn.query(
      `UPDATE phieudoitra
       SET khachhang    = ?,
           nhanviencskh = ?,
           ghichu       = ?
       WHERE maphieudoitra = ?;`,
      [khachhang, nhanviencskh, ghichu, maphieudoitra])

    return {message: "Return updated", success: true}
  } catch (e) {
    console.log(e)
    return {message: "Updated fail", success: false};
  }
}

async function deleteReturn(conn, returns = []) {
  try {
    await conn.query(
      `DELETE
       FROM phieudoitra
       WHERE maphieudoitra IN ?;`,
      [[returns.map(({maphieudoitra}) => maphieudoitra)]])

    return {message: "Return deleted", success: true}
  } catch (e) {
    console.log(e)
    return {message: "Deleted fail", success: false}
  }
}

module.exports = {
  getReturns, getReturnProducts, insertReturn, updateReturn, deleteReturn
}

