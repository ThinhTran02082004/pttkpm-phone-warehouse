async function getImports(conn) {
  try {
    const [result] = await conn.query(
      `SELECT *
       FROM phieunhapkho
       ORDER BY maphieunhap DESC`)
    return {success: true, Data: result}
  } catch (err) {
    console.error(err);
    return {success: false, Data: []};
  }
}

async function findImportProduct(conn, {maphieunhap}) {
  try {
    const [result] = await conn.query(
      `SELECT s.masanpham,
              s.maimei,
              d.tendanhmucsanpham,
              ram.dungluongram,
              rom.dungluongrom,
              mausac.tenmausac,
              c.gianhap
       FROM sanpham s
                INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
                INNER JOIN ptpm.danhmucsanpham d ON c.danhmucsanpham = d.madanhmucsanpham
                INNER JOIN ram ON c.ram = ram.maram
                INNER JOIN rom ON c.rom = rom.marom
                INNER JOIN mausac ON c.mausac = mausac.mamausac
       WHERE phieunhap = ?;`, [maphieunhap])
    return {success: true, Data: result}
  } catch (err) {
    console.error(err);
    return {success: false, Data: []};
  }
}

async function findImports(conn, {manhacungcap, manhanvien, tungay, denngay, tusotien, densotien}) {
  try {
    let result
    if (manhacungcap === '*' && manhanvien === '*')
      [result] = await conn.query(
        `SELECT p.maphieunhap, n.tennhacungcap, nv.hoten, p.thoigiannhap thoigian, SUM(c.gianhap) tongtien
         FROM phieunhapkho p
                  INNER JOIN nhacungcap n ON p.nhacungcap = n.manhacungcap
                  INNER JOIN nhanvien nv ON p.nhanviennhap = nv.manhanvien
                  RIGHT JOIN sanpham s ON p.maphieunhap = s.phieunhap
                  INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
         GROUP BY p.maphieunhap, thoigiannhap
         HAVING COUNT(DISTINCT masanpham) > 0
         ORDER BY thoigian DESC`)
    else if (manhacungcap === '*')
      [result] = await conn.query(
        `SELECT p.maphieunhap, n.tennhacungcap, nv.hoten, p.thoigiannhap thoigian, SUM(c.gianhap) tongtien
         FROM phieunhapkho p
                  INNER JOIN nhacungcap n ON p.nhacungcap = n.manhacungcap
                  INNER JOIN nhanvien nv ON p.nhanviennhap = nv.manhanvien
                  RIGHT JOIN sanpham s ON p.maphieunhap = s.phieunhap
                  INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
         WHERE manhanvien = ?
           AND p.thoigiannhap BETWEEN ? AND ?
         GROUP BY p.maphieunhap, thoigiannhap
         HAVING tongtien BETWEEN ? AND ?
            AND COUNT(DISTINCT masanpham) > 0
         ORDER BY thoigian
                 DESC`,
        [manhanvien, tungay, denngay, tusotien, densotien])
    else if (manhanvien === '*')
      [result] = await conn.query(
        `SELECT p.maphieunhap, n.tennhacungcap, nv.hoten, p.thoigiannhap thoigian, SUM(c.gianhap) tongtien
         FROM phieunhapkho p
                  INNER JOIN nhacungcap n ON p.nhacungcap = n.manhacungcap
                  INNER JOIN nhanvien nv ON p.nhanviennhap = nv.manhanvien
                  RIGHT JOIN sanpham s ON p.maphieunhap = s.phieunhap
                  INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
         WHERE n.manhacungcap = ?
           AND p.thoigiannhap BETWEEN ? AND ?
         GROUP BY p.maphieunhap, thoigiannhap
         HAVING tongtien BETWEEN ? AND ?
            AND COUNT(DISTINCT masanpham) > 0
         ORDER BY thoigian DESC`,
        [manhacungcap, tungay, denngay, tusotien, densotien])
    else [result] = await conn.query(
        `SELECT p.maphieunhap, n.tennhacungcap, nv.hoten, p.thoigiannhap thoigian, SUM(c.gianhap) tongtien
         FROM phieunhapkho p
                  INNER JOIN nhacungcap n ON p.nhacungcap = n.manhacungcap
                  INNER JOIN nhanvien nv ON p.nhanviennhap = nv.manhanvien
                  RIGHT JOIN sanpham s ON p.maphieunhap = s.phieunhap
                  INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
         WHERE n.manhacungcap = ?
           AND manhanvien = ?
           AND p.thoigiannhap BETWEEN ? AND ?
         GROUP BY p.maphieunhap, thoigiannhap
         HAVING tongtien BETWEEN ? AND ?
         ORDER BY thoigian DESC`,
        [manhacungcap, manhanvien, tungay, denngay, tusotien, densotien])

    return {success: true, Data: result}
  } catch (err) {
    console.error(err);
    return {success: false, Data: []};
  }
}

async function getFreeImport(conn) {
  try {
    let [result] = await conn.query(
      `SELECT p.*
       FROM phieunhapkho p
                LEFT JOIN sanpham s ON s.phieunhap = p.maphieunhap
       WHERE p.nhacungcap IS NULL
         AND p.nhanviennhap IS NULL
       GROUP BY p.maphieunhap
       HAVING COUNT(DISTINCT s.masanpham) = 0
       LIMIT 1;`)

    if (result.length) return {Data: result, success: true, message: "success"};

    [result] = await conn.query(`INSERT INTO phieunhapkho (nhacungcap, nhanviennhap)
                                 VALUES (NULL, NULL);`)

    const [temp] = await conn.query(
      `SELECT *
       FROM phieunhapkho
       WHERE maphieunhap = ?`,
      [result.insertId])
    return {success: true, Data: temp}
  } catch (err) {
    console.error(err);
    return {success: false, Data: []};
  }
}

async function insertImport(conn, imports = []) {
  try {
    await conn.query(
      `INSERT INTO phieunhapkho (nhacungcap, nhanviennhap, thoigiannhap)
       VALUES ?`,
      [imports.map(({nhacungcap, nhanviennhap, thoigiannhap}) => [nhacungcap, nhanviennhap, thoigiannhap])])

    const [result] = await conn.query(
      `SELECT *
       FROM phieunhapkho
       WHERE nhanviennhap IN ?
         AND nhacungcap IN ?
       ORDER BY thoigiannhap DESC
       LIMIT ?`,
      [
        [imports.map(({nhanviennhap}) => nhanviennhap)],
        [imports.map(({nhacungcap}) => nhacungcap)],
        imports.length
      ])
    // console.log(result, imports)

    return {message: "Import added", success: true, Data: result}
  } catch (err) {
    console.error(err);
    return {message: "Added fail", success: false, Data: []};
  }
}

async function updateImport(conn, {maphieunhap, nhacungcap, nhanviennhap}) {
  try {
    await conn.query(
      `UPDATE phieunhapkho
       SET nhacungcap   = ?,
           nhanviennhap = ?
       WHERE maphieunhap = ?`,
      [nhacungcap, nhanviennhap, maphieunhap])

    return {message: "Import updated", success: true, Data: []}
  } catch (e) {
    console.log(e)
    return {message: "Updated fail", success: false, Data: []};
  }
}

async function deleteImport(conn, imports = []) {
  try {
    await conn.query(
      `DELETE
       FROM phieunhapkho
       WHERE maphieunhap IN ?`,
      [[imports.map(({maphieunhap}) => maphieunhap)]])

    return {message: "Imports deleted", success: true}
  } catch (err) {
    console.error(err);
    return {message: "Deleted fail", success: false};
  }
}

module.exports = {
  getImports, insertImport, updateImport, deleteImport, findImports, findImportProduct, getFreeImport
}