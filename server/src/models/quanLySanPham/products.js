async function getProducts(conn) {
  try {
    

    const [result] = await conn.query(
      `SELECT d.*, h.*, t.*, x.*, COUNT(s.phieunhap) tonkho
       FROM danhmucsanpham d
                LEFT JOIN ptpm.cauhinh c ON d.madanhmucsanpham = c.danhmucsanpham
                LEFT JOIN ptpm.sanpham s ON c.macauhinh = s.cauhinh
                INNER JOIN hedieuhanh h ON d.hedieuhanh = h.mahedieuhanh
                INNER JOIN thuonghieu t ON d.thuonghieu = t.mathuonghieu
                INNER JOIN xuatxu x ON d.xuatxu = x.maxuatxu
       WHERE s.phieuxuat IS NULL
       GROUP BY d.madanhmucsanpham
       ORDER BY d.madanhmucsanpham DESC`)
    return {Data: result, success: true};
  } catch (e) {
    console.log(e)
    return {Data: [], success: false}
  }
}


async function getProductWithConfigures(conn) {
  try {
    const [result] = await conn.query(
      `SELECT d.madanhmucsanpham, d.tendanhmucsanpham, COUNT(s.phieunhap) tonkho, COUNT(DISTINCT c.macauhinh) socauhinh
       FROM danhmucsanpham d
                LEFT JOIN ptpm.cauhinh c ON d.madanhmucsanpham = c.danhmucsanpham
                LEFT JOIN ptpm.sanpham s ON c.macauhinh = s.cauhinh
                INNER JOIN hedieuhanh h ON d.hedieuhanh = h.mahedieuhanh
                INNER JOIN thuonghieu t ON d.thuonghieu = t.mathuonghieu
                INNER JOIN xuatxu x ON d.xuatxu = x.maxuatxu
       WHERE s.phieuxuat IS NULL
       GROUP BY d.madanhmucsanpham
       HAVING COUNT(DISTINCT c.macauhinh) > 0
       ORDER BY d.madanhmucsanpham DESC`)
    return {Data: result, success: true};
  } catch (e) {
    console.log(e)
    return {Data: [], success: false}
  }
}

async function insertProduct(conn, products = []) {
  try {
    await conn.query(`INSERT INTO danhmucsanpham
                      (tendanhmucsanpham, chipxuly, dungluongpin, kichthuongmanhinh, cameratruoc, camerasau,
                       phienbanhedieuhanh, thoigianbaohanh, xuatxu, hedieuhanh, thuonghieu)
                      VALUES ?`, [
      products.map(({
                      tendanhmucsanpham,
                      chipxuly,
                      dungluongpin,
                      kichthuongmanhinh,
                      cameratruoc,
                      camerasau,
                      phienbanhedieuhanh,
                      thoigianbaohanh,
                      xuatxu,
                      hedieuhanh,
                      thuonghieu
                    }) => [tendanhmucsanpham, chipxuly, dungluongpin, kichthuongmanhinh, cameratruoc, camerasau, phienbanhedieuhanh, thoigianbaohanh, xuatxu, hedieuhanh, thuonghieu])
    ])
    const arr = {
      tendanhmucsanpham: [],
      chipxuly: [],
      dungluongpin: [],
      kichthuongmanhinh: [],
      cameratruoc: [],
      camerasau: [],
      phienbanhedieuhanh: [],
      thoigianbaohanh: [],
      xuatxu: [],
      hedieuhanh: [],
      thuonghieu: []
    }
    products.forEach(product => {
      const data = Object.entries(product)
      data.forEach(([key, value]) => arr[key]?.push(value))
    })

    const {
      tendanhmucsanpham,
      chipxuly,
      dungluongpin,
      kichthuongmanhinh,
      cameratruoc,
      camerasau,
      phienbanhedieuhanh,
      thoigianbaohanh,
      xuatxu,
      hedieuhanh,
      thuonghieu
    } = arr
    const [result] = await conn.query(
      `SELECT *
       FROM danhmucsanpham
       WHERE tendanhmucsanpham IN ?
         AND chipxuly IN ?
         AND dungluongpin IN ?
         AND kichthuongmanhinh IN ?
         AND cameratruoc IN ?
         AND camerasau IN ?
         AND phienbanhedieuhanh IN ?
         AND thoigianbaohanh IN ?
         AND xuatxu IN ?
         AND hedieuhanh IN ?
         AND thuonghieu IN ?
       ORDER BY madanhmucsanpham DESC
       LIMIT ?`,
      [[tendanhmucsanpham], [chipxuly], [dungluongpin], [kichthuongmanhinh], [cameratruoc], [camerasau], [phienbanhedieuhanh], [thoigianbaohanh], [xuatxu], [hedieuhanh], [thuonghieu], products.length])
    return {message: "Products added", success: true, Data: result};
  } catch (e) {
    console.log(e)
    return {message: "Added fail", success: false, Data: []};
  }
}

async function updateProduct(conn, {
  tendanhmucsanpham,
  chipxuly,
  dungluongpin,
  kichthuongmanhinh,
  cameratruoc,
  camerasau,
  phienbanhedieuhanh,
  thoigianbaohanh,
  xuatxu,
  hedieuhanh,
  thuonghieu,
  madanhmucsanpham
}) {
  try {
    await conn.query(
      `UPDATE danhmucsanpham
       SET tendanhmucsanpham  = ?,
           chipxuly           = ?,
           dungluongpin       = ?,
           kichthuongmanhinh  = ?,
           cameratruoc        = ?,
           camerasau          = ?,
           phienbanhedieuhanh = ?,
           thoigianbaohanh    = ?,
           xuatxu             = ?,
           hedieuhanh         = ?,
           thuonghieu         = ?
       WHERE madanhmucsanpham = ?;`,
      [tendanhmucsanpham, chipxuly, dungluongpin, kichthuongmanhinh, cameratruoc, camerasau, phienbanhedieuhanh, thoigianbaohanh, xuatxu, hedieuhanh, thuonghieu, madanhmucsanpham])
    return {message: "Product updated", success: true}
  } catch (e) {
    console.log((e))
    return {message: "Updated fail", success: false};
  }
}

async function deleteProduct(conn, products = []) {
  try {
    await conn.query(
      `DELETE
       FROM danhmucsanpham
       WHERE madanhmucsanpham IN ?`,
      [[products.map(({madanhmucsanpham}) => madanhmucsanpham)]])
    return {message: "Product deleted", success: true}
  } catch (e) {
    return {message: "Deleted fail", success: false}
  }
}

async function updateProductImage(conn, {madanhmucsanpham, hinhanh}) {
  try {
    await conn.query(
      `UPDATE danhmucsanpham
       SET hinhanh = ?
       WHERE madanhmucsanpham = ?`, [hinhanh, madanhmucsanpham])
    return {message: "success", success: true, hinhanh}
  } catch (e) {
    return {message: "fail", success: false}
  }
}

module.exports = {
  updateProductImage, getProducts, insertProduct, updateProduct, deleteProduct, getProductWithConfigures
}