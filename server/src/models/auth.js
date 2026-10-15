const bcrypt = require('bcrypt')

async function verifyAccount(conn, { mail, password }) {
  if (!mail || !password) return { success: false, message: "Vui lòng nhập email và mật khẩu" };
  try {
    const [result] = await conn.query(
      `SELECT t.matkhau, t.mataikhoan,
              n.manhanvien,
              n.hoten,
              n.mail,
              n.sodienthoai,
              n.gioitinh,
              n.ngaysinh,
              n.cccd,
              n.avatar,
              n.tinh,
              n.quan,
              n.phuong,
              n.diachi,
              nq.tennhomquyen,
              nq.tenhienthi AS tenNhomQuyen
       FROM taikhoan t
                INNER JOIN nhanvien n ON t.nhanvien = n.manhanvien
                LEFT JOIN nhomquyen nq ON t.vaitro = nq.manhomquyen
       WHERE n.mail = ?`, [mail])

    if (!result || result.length === 0) {
      return { result: false, success: false, message: "Email không tồn tại" }
    }

    const user = result[0]
    const compare = await bcrypt.compare(password, user.matkhau)

    if (!compare) {
      return { result: false, success: false, message: "Mật khẩu không đúng" }
    }

    // Return user info without password
    delete user.matkhau
    return {
      userid: user.manhanvien,
      result: compare,
      success: true,
      user: {
        manhanvien: user.manhanvien,
        mataikhoan: user.mataikhoan,
        hoten: user.hoten,
        mail: user.mail,
        sodienthoai: user.sodienthoai,
        gioitinh: user.gioitinh,
        ngaysinh: user.ngaysinh,
        cccd: user.cccd,
        avatar: user.avatar,
        tinh: user.tinh,
        quan: user.quan,
        phuong: user.phuong,
        diachi: user.diachi,
        tennhomquyen: user.tenNhomQuyen || user.tennhomquyen
      }
    }
  } catch (e) {
    console.error("Login error:", e)
    return { result: false, success: false, message: "Lỗi hệ thống" }
  }
}

async function getProfile(conn, manhanvien) {
  try {
    const [result] = await conn.query(
      `SELECT n.manhanvien,
              n.hoten,
              n.mail,
              n.sodienthoai,
              n.gioitinh,
              n.ngaysinh,
              n.cccd,
              n.avatar,
              n.tinh,
              n.quan,
              n.phuong,
              n.diachi,
              nq.tennhomquyen,
              nq.tenhienthi
       FROM nhanvien n
                LEFT JOIN taikhoan t ON t.nhanvien = n.manhanvien
                LEFT JOIN nhomquyen nq ON t.vaitro = nq.manhomquyen
       WHERE n.manhanvien = ?`, [manhanvien])

    if (!result || result.length === 0) {
      return { success: false, message: "Không tìm thấy nhân viên" }
    }

    return { success: true, Data: result[0] }
  } catch (e) {
    console.error("Get profile error:", e)
    return { success: false, message: "Lỗi hệ thống" }
  }
}

async function updateProfile(conn, manhanvien, data) {
  try {
    const { hoten, gioitinh, ngaysinh, sodienthoai, cccd, avatar, tinh, quan, phuong, diachi } = data

    await conn.query(
      `UPDATE nhanvien SET 
        hoten = COALESCE(?, hoten),
        gioitinh = COALESCE(?, gioitinh),
        ngaysinh = COALESCE(?, ngaysinh),
        sodienthoai = COALESCE(?, sodienthoai),
        cccd = COALESCE(?, cccd),
        avatar = COALESCE(?, avatar),
        tinh = COALESCE(?, tinh),
        quan = COALESCE(?, quan),
        phuong = COALESCE(?, phuong),
        diachi = COALESCE(?, diachi)
       WHERE manhanvien = ?`,
      [hoten, gioitinh, ngaysinh, sodienthoai, cccd, avatar, tinh, quan, phuong, diachi, manhanvien]
    )

    return { success: true, message: "Cập nhật thành công" }
  } catch (e) {
    console.error("Update profile error:", e)
    return { success: false, message: "Lỗi cập nhật: " + e.message }
  }
}


module.exports = {
  verifyAccount,
  getProfile,
  updateProfile,
}