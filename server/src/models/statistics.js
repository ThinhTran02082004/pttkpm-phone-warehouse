async function getOverall(conn) {
  try {
    const [[sanpham], [khachhang], [nhanvien], [doanhthu]] = await Promise.all([
      conn.query(
        `SELECT COUNT(*) sanpham
         FROM (SELECT madanhmucsanpham
               FROM danhmucsanpham d
                        LEFT JOIN cauhinh c ON c.danhmucsanpham = d.madanhmucsanpham
                        LEFT JOIN ptpm.sanpham s ON c.macauhinh = s.cauhinh
               GROUP BY d.madanhmucsanpham
               HAVING COUNT(s.masanpham) > 0) a;`),
      conn.query(
        `SELECT COUNT(*) khachhang
         FROM (SELECT k.makhachhang
               FROM khachhang k
                        INNER JOIN ptpm.phieuxuatkho p ON k.makhachhang = p.khachhang
               GROUP BY makhachhang) a`),
      conn.query(
        `SELECT COUNT(*) nhanvien
         FROM (SELECT manhanvien
               FROM nhanvien
               ORDER BY manhanvien) a`),
      conn.query(
        `SELECT d.thoigian, SUM(d.doanhthu) doanhthu, SUM(v.von) von, SUM(doanhthu - von) loinhuan
         FROM (SELECT DATE(thoigianxuat) thoigian, SUM(c.giaxuat) doanhthu
               FROM phieuxuatkho x
                        INNER JOIN sanpham s ON s.phieuxuat = x.maphieuxuat
                        INNER JOIN cauhinh c ON c.macauhinh = s.cauhinh
               GROUP BY thoigianxuat) d,
              (SELECT DATE(thoigiannhap) thoigian, SUM(c.gianhap) von
               FROM phieunhapkho n
                        INNER JOIN sanpham s ON s.phieunhap = n.maphieunhap
                        INNER JOIN cauhinh c ON c.macauhinh = s.cauhinh
               GROUP BY thoigiannhap) v
         WHERE d.thoigian = v.thoigian
         GROUP BY v.thoigian, d.thoigian
         ORDER BY d.thoigian DESC, v.thoigian DESC
         LIMIT 7;`),
    ])

    return { Data: { khachhang, doanhthu, nhanvien, sanpham }, success: true }
  } catch (err) {
    console.log(err);
    return { Data: {}, success: false }
  }
}

async function getNhaCungCapStat(conn, { ngaybatdau = '1990-01-01', ngayketthuc = "3000-01-01" }) {
  try {
    const [result] = await conn.query(
      `SELECT n.*, COUNT(DISTINCT d.madanhmucsanpham) lannhap, SUM(c.gianhap) tongtien
       FROM nhacungcap n
                INNER JOIN phieunhapkho p ON n.manhacungcap = p.nhacungcap
                INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
                INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
                INNER JOIN danhmucsanpham d ON c.danhmucsanpham = d.madanhmucsanpham
       WHERE p.thoigiannhap BETWEEN ? AND ?
       GROUP BY n.manhacungcap;`, [ngaybatdau, ngayketthuc])

    return { Data: result, success: true }
  } catch (e) {
    console.log(e)
    return { Data: [], success: false }
  }
}

async function getKhachHangStat(conn, { ngaybatdau = '1990-01-01', ngayketthuc = "3000-01-01" }) {
  try {
    const [result] = await conn.query(
      `SELECT k.*, COUNT(DISTINCT p.maphieuxuat) muahang, SUM(c.giaxuat) tongtien
       FROM khachhang k
                INNER JOIN phieuxuatkho p ON k.makhachhang = p.khachhang
                INNER JOIN sanpham s ON p.maphieuxuat = s.phieuxuat
                INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
       WHERE p.thoigianxuat BETWEEN ? AND ?
       GROUP BY k.makhachhang`, [ngaybatdau, ngayketthuc])
    return { Data: result, success: true }
  } catch (e) {
    console.log(e)
    return { Data: [], success: false }
  }
}

async function getYearProfit(conn) {
  try {
    const [result] = await conn.query(
      `SELECT a.nam, a.von, b.doanhthu, b.doanhthu - a.von loinhuan
       FROM (SELECT YEAR(p.thoigiannhap) nam, SUM(c.gianhap) von
             FROM phieunhapkho p
                      INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
                      INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
             GROUP BY nam) a,
            (SELECT YEAR(x.thoigianxuat) nam, SUM(c.giaxuat) doanhthu
             FROM phieuxuatkho x
                      INNER JOIN sanpham s ON s.phieuxuat = x.maphieuxuat
                      INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
             GROUP BY nam) b
       WHERE a.nam = b.nam
       ORDER BY a.nam;`)
    return { Data: result, success: true }
  } catch (e) {
    console.log(e)
    return { Data: [], success: false }
  }
}

async function getMonthProfit(conn, { nam = 2024 }) {
  try {
    const [result] = await conn.query(
      `SELECT 
         COALESCE(a.thang, b.thang) thang,
         COALESCE(a.von, 0) von,
         COALESCE(b.doanhthu, 0) doanhthu,
         COALESCE(b.doanhthu, 0) - COALESCE(a.von, 0) loinhuan
       FROM (SELECT MONTH(p.thoigiannhap) thang, SUM(c.gianhap) von
             FROM phieunhapkho p
                      INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
                      INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
             WHERE YEAR(p.thoigiannhap) = ?
             GROUP BY MONTH(p.thoigiannhap)) a
       LEFT JOIN
            (SELECT MONTH(x.thoigianxuat) thang, SUM(c.giaxuat) doanhthu
             FROM phieuxuatkho x
                      INNER JOIN sanpham s ON s.phieuxuat = x.maphieuxuat
                      INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
             WHERE YEAR(x.thoigianxuat) = ?
             GROUP BY MONTH(x.thoigianxuat)) b ON a.thang = b.thang
       UNION
       SELECT 
         COALESCE(a.thang, b.thang) thang,
         COALESCE(a.von, 0) von,
         COALESCE(b.doanhthu, 0) doanhthu,
         COALESCE(b.doanhthu, 0) - COALESCE(a.von, 0) loinhuan
       FROM (SELECT MONTH(p.thoigiannhap) thang, SUM(c.gianhap) von
             FROM phieunhapkho p
                      INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
                      INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
             WHERE YEAR(p.thoigiannhap) = ?
             GROUP BY MONTH(p.thoigiannhap)) a
       RIGHT JOIN
            (SELECT MONTH(x.thoigianxuat) thang, SUM(c.giaxuat) doanhthu
             FROM phieuxuatkho x
                      INNER JOIN sanpham s ON s.phieuxuat = x.maphieuxuat
                      INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
             WHERE YEAR(x.thoigianxuat) = ?
             GROUP BY MONTH(x.thoigianxuat)) b ON a.thang = b.thang
       ORDER BY thang;`, [nam, nam, nam, nam])
    return { Data: result, success: true }
  } catch (e) {
    console.log(e)
    return { Data: [], success: false }
  }
}

async function getDayProfit(conn, { nam = 2024, thang = 1 }) {
  try {
    const [result] = await conn.query(
      `SELECT 
         COALESCE(a.thoigian, b.thoigian) thoigian,
         COALESCE(a.von, 0) von,
         COALESCE(b.doanhthu, 0) doanhthu,
         COALESCE(b.doanhthu, 0) - COALESCE(a.von, 0) loinhuan
       FROM (SELECT DATE(p.thoigiannhap) thoigian, SUM(c.gianhap) von
             FROM phieunhapkho p
                      INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
                      INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
             WHERE MONTH(p.thoigiannhap) = ? AND YEAR(p.thoigiannhap) = ?
             GROUP BY DATE(p.thoigiannhap)) a
       LEFT JOIN
            (SELECT DATE(x.thoigianxuat) thoigian, SUM(c.giaxuat) doanhthu
             FROM phieuxuatkho x
                      INNER JOIN sanpham s ON s.phieuxuat = x.maphieuxuat
                      INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
             WHERE MONTH(x.thoigianxuat) = ? AND YEAR(x.thoigianxuat) = ?
             GROUP BY DATE(x.thoigianxuat)) b ON a.thoigian = b.thoigian
       UNION
       SELECT 
         COALESCE(a.thoigian, b.thoigian) thoigian,
         COALESCE(a.von, 0) von,
         COALESCE(b.doanhthu, 0) doanhthu,
         COALESCE(b.doanhthu, 0) - COALESCE(a.von, 0) loinhuan
       FROM (SELECT DATE(p.thoigiannhap) thoigian, SUM(c.gianhap) von
             FROM phieunhapkho p
                      INNER JOIN sanpham s ON p.maphieunhap = s.phieunhap
                      INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
             WHERE MONTH(p.thoigiannhap) = ? AND YEAR(p.thoigiannhap) = ?
             GROUP BY DATE(p.thoigiannhap)) a
       RIGHT JOIN
            (SELECT DATE(x.thoigianxuat) thoigian, SUM(c.giaxuat) doanhthu
             FROM phieuxuatkho x
                      INNER JOIN sanpham s ON s.phieuxuat = x.maphieuxuat
                      INNER JOIN cauhinh c ON s.cauhinh = c.macauhinh
             WHERE MONTH(x.thoigianxuat) = ? AND YEAR(x.thoigianxuat) = ?
             GROUP BY DATE(x.thoigianxuat)) b ON a.thoigian = b.thoigian
       ORDER BY thoigian;`, [thang, nam, thang, nam, thang, nam, thang, nam])
    return { Data: result, success: true }
  } catch (e) {
    console.log(e)
    return { Data: [], success: false }
  }
}


async function getLastAndFirstDay(conn) {
  try {
    const [result] = await conn.query(
      `SELECT(SELECT thoigianxuat thoigian
       FROM phieuxuatkho
       UNION
       SELECT thoigiannhap thoigian
       FROM phieunhapkho
       ORDER BY thoigian
       LIMIT 1) mindate,
      (SELECT thoigianxuat thoigian
       FROM phieuxuatkho
       UNION
       SELECT thoigiannhap thoigian
       FROM phieunhapkho
       ORDER BY thoigian DESC
       LIMIT 1) maxdate;`)

    return { Data: result, success: true }
  } catch (e) {
    console.log(e)
    return { Data: [], success: false }
  }
}

async function getTonKho(conn, { ngaybatdau, ngayketthuc }) {
  try {
    const [result] = await conn.query(
      `SELECT d.madanhmucsanpham,
              d.tendanhmucsanpham,
              d2.tondauki                                                                        tondau,
              COUNT(DISTINCT s.masanpham)                                                        tongnhap,
              SUM(IF(s.phieuxuat IS NOT NULL, 1, 0))                                             tongxuat,
              d2.tondauki + COUNT(DISTINCT s.masanpham) - SUM(IF(s.phieuxuat IS NOT NULL, 1, 0)) toncuoi
       FROM danhmucsanpham d
                LEFT JOIN cauhinh c ON d.madanhmucsanpham = c.danhmucsanpham
                LEFT JOIN sanpham s ON c.macauhinh = s.cauhinh
                LEFT JOIN phieunhapkho n ON s.phieunhap = n.maphieunhap
                LEFT JOIN phieuxuatkho x ON s.phieuxuat = x.maphieuxuat
                LEFT JOIN
            (SELECT d.madanhmucsanpham,
                    COUNT(DISTINCT s.masanpham) - SUM(IF(s.phieuxuat IS NOT NULL, 1, 0)) tondauki
             FROM danhmucsanpham d
                      LEFT JOIN cauhinh c ON d.madanhmucsanpham = c.danhmucsanpham
                      LEFT JOIN sanpham s ON c.macauhinh = s.cauhinh
                      LEFT JOIN phieunhapkho n ON s.phieunhap = n.maphieunhap
                      LEFT JOIN phieuxuatkho x ON s.phieuxuat = x.maphieuxuat
             WHERE n.thoigiannhap < ?
               AND x.thoigianxuat < ?
             GROUP BY d.madanhmucsanpham) d2 ON d2.madanhmucsanpham = d.madanhmucsanpham
       #        WHERE n.thoigiannhap BETWEEN ? AND ?
#          AND x.thoigianxuat BETWEEN ? AND ?
       GROUP BY d.madanhmucsanpham;`,
      [ngaybatdau, ngaybatdau, ngaybatdau, ngayketthuc, ngaybatdau, ngayketthuc])
    console.log(result)
    return { Data: result, success: true }
  } catch (e) {
    return { Data: [], success: false }
  }
  // return {Data: [], success: true}
}


module.exports = {
  getOverall,
  getNhaCungCapStat,
  getKhachHangStat,
  getYearProfit,
  getMonthProfit,
  getDayProfit,
  getLastAndFirstDay,
  getTonKho
}