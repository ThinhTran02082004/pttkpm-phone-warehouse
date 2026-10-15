async function getSuppliers(conn) {
  try {
    const [result] = await conn.query(
      `SELECT *
       FROM nhacungcap
       ORDER BY manhacungcap;`);

    return {Data: result, success: true};

  } catch (e) {
    return {Data: [], success: false}
  }
}

async function getSuppliersCarts(conn, {manhacungcap}) {
  try {
    const [result] = await conn.query(
      `SELECT p.maphieunhap, p.thoigiannhap, COUNT(DISTINCT sanpham.masanpham) soluong, SUM(c.giaxuat) thanhtien
       FROM phieunhapkho p
                INNER JOIN nhacungcap n ON p.nhacungcap = n.manhacungcap
                INNER JOIN sanpham ON p.maphieunhap = sanpham.phieuxuat
                INNER JOIN cauhinh c ON sanpham.cauhinh = c.macauhinh
       WHERE manhacungcap = ?
       GROUP BY p.maphieunhap`,
      [manhacungcap])
    return {Data: result, success: true};
  } catch (e) {
    console.log(e)
    return {Data: [], success: false}
  }
}

async function insertSupplier(conn, Data = []) {
  try {
    await conn.query(`INSERT INTO nhacungcap (tennhacungcap, diachi, mail, sodienthoai)
                      VALUES ?`, [
      Data.map(({tennhacungcap, diachi, mail, sodienthoai}) => [tennhacungcap, diachi, mail, sodienthoai])
    ]);
    const [result] = await conn.query(
      `SELECT *
       FROM nhacungcap
       WHERE mail IN ?
         AND sodienthoai IN ?;`,
      [[Data.map(({mail}) => mail)], [Data.map(({sodienthoai}) => sodienthoai)]])
    return {message: "Supplier added", success: true, Data: result};

  } catch (e) {
    console.log(e)
    return {message: "Added fail", success: false, Data: []};
  }
}


async function updateSupplier(conn, {tennhacungcap, diachi, mail, sodienthoai, manhacungcap}) {
  try {
    const [result] = await conn.query(
      `UPDATE nhacungcap
       SET tennhacungcap = ?,
           diachi        = ?,
           mail          = ?,
           sodienthoai   = ?
       WHERE manhacungcap = ?;`,
      [tennhacungcap, diachi, mail, sodienthoai, manhacungcap]);

    return {message: "Supplier updated", success: true, Data: []};

  } catch (e) {
    return {message: "Updated fail", success: false, Data: []};
  }
}

async function deleteSupplier(conn, Data = []) {
  try {
    await conn.query(
      `DELETE
       FROM nhacungcap
       WHERE manhacungcap IN ?;`,
      [[Data.map(({manhacungcap}) => manhacungcap)]]);

    return {message: "Supplier deleted", success: true, Data: []};
  } catch (e) {
    return {message: "Deleted fail", success: false, Data: []};
  }
}

module.exports = {deleteSupplier, getSuppliers, insertSupplier, updateSupplier, getSuppliersCarts}