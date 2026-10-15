import {faCircleCheck, faCircleUser, faClipboardUser, faHandshakeSimple, faHouse, faLaptop, faShieldHalved, faUnlockKeyhole, faWarehouse} from "@fortawesome/free-solid-svg-icons"

import TrangChu from "../pages/OtherPage/trangChu"
import NhanVien from "../pages/phanQuyenPage/nhanVien"
import PhanQuyen from "../pages/phanQuyenPage/phanQuyen"
import TaiKhoan from "../pages/OtherPage/TaiKhoanPage"

import SanPham from "../pages/SanPhamPage/sanPham"
import ThuocTinh from "../pages/SanPhamPage/thuocTinh"

import NhapKho from "../pages/NhapXuatPage/nhapKho"
import ThemNhapKho from "../pages/NhapXuatPage/themNhapKho"
import XuatKho from "../pages/NhapXuatPage/xuatKho"
import ThemXuatKho from "../pages/NhapXuatPage/themXuatKho"

import KhachHang from "../pages/DoiTacPage/khachHang"
import NhaCungCap from "../pages/DoiTacPage/nhaCungCap"

import DoiTraHang from "../pages/NhapXuatPage/doiTraHang"
import DangSuat from "../pages/OtherPage/dangSuat"
import QuanLyTaiKhoang from "../pages/phanQuyenPage/taiKhoan"
import DangNhap from "../pages/OtherPage/dangNhap"

export const navLinks = [
  {title: "", hidden: true, eventKey: "QuanLyTaiKhoan", link: "/tai-khoan-ca-nhan", Component: TaiKhoan, links: []},
  {title: "", hidden: true, eventKey: "dangSuat", link: "/dang-suat", Component: DangSuat, links: []},
  {title: "", hidden: true, eventKey: "dangNhap", link: "/dang-nhap", Component: DangNhap, links: []},
  {title: "Trang chủ", eventKey: "trangChu", link: "/", icon: faHouse, Component: TrangChu, links: []},
  {
    title: "Sản phẩm", eventKey: "sanPham", icon: faLaptop, links: [
      {content: "Sản phẩm", eventKey: "QuanLySanPham", href: "/san-pham", visible: true, Component: SanPham},
      {content: "Thuộc tính", eventKey: "QuanLyThuocTinh", href: "/thuoc-tinh", visible: true, Component: ThuocTinh}
    ]
  },
  {
    title: "Xuất nhập", eventKey: "xuatNhap", icon: faWarehouse, links: [
      {content: "Nhập kho", eventKey: "", href: "/nhap-kho", visible: true, Component: NhapKho},
      {content: "Nhập kho", eventKey: "", href: "/nhap-kho/them", visible: false, Component: ThemNhapKho},
      {content: "Xuất kho", eventKey: "", href: "/xuat-kho", visible: true, Component: XuatKho},
      {content: "Xuất kho", eventKey: "", href: "/xuat-kho/them", visible: false, Component: ThemXuatKho},
    ]
  },
  {
    title: "Đối tác", eventKey: "doiTac", icon: faHandshakeSimple, links: [
      {content: "Khách hàng", eventKey: "", href: "/khach-hang", visible: true, Component: KhachHang},
      {content: "Nhà cung cấp", eventKey: "", href: "/nha-cung-cap", visible: true, Component: NhaCungCap}
    ]
  },
  {
    title: "Dịch vụ", eventKey: "dichVu", icon: faShieldHalved, links: [
      {content: "Đổi trả hàng", eventKey: "", href: "/doi-tra-hang", visible: true, Component: DoiTraHang},
      {content: "Bảo hành", eventKey: "", href: "/bao-hanh", visible: true}
    ]
  },
  {
    title: "Nhân viên",
    eventKey: "QuanLyNhanVien",
    link: "/nhan-vien",
    icon: faClipboardUser,
    Component: NhanVien,
    links: []
  },
  {
    title: "Tài khoản",
    eventKey: "QuanLyTaiKhoan",
    link: "/tai-khoan",
    icon: faCircleUser,
    Component: QuanLyTaiKhoang,
    links: []
  },
  {title: "Thống kê", eventKey: "thongKe", link: "/thong-ke", icon: faCircleCheck, links: []},
  {
    title: "Phân quyền",
    eventKey: "QuanLyNhomQuyen",
    link: "/phan-quyen",
    icon: faUnlockKeyhole,
    Component: PhanQuyen,
    links: []
  },
];

