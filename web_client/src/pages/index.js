import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'


// import { navLinks } from '../utilities/navLinks';
import { UserContext } from '../api/authentication';

import TrangChu from "../pages/OtherPage/trangChu"
import NhanVien from "./phanQuyenPage/nhanVien"
import PhanQuyen from "./phanQuyenPage/phanQuyen"
import TaiKhoan from "../pages/OtherPage/TaiKhoanPage"

import SanPham from "../pages/SanPhamPage/sanPham"
import ThuocTinh from "../pages/SanPhamPage/thuocTinh"

import NhapKho from "./NhapXuatPage/nhapKho"
import ThemNhapKho from "./NhapXuatPage/themNhapKho"
import XuatKho from "./NhapXuatPage/xuatKho"
import ThemXuatKho from "./NhapXuatPage/themXuatKho"

import KhachHang from "../pages/DoiTacPage/khachHang"
import NhaCungCap from "../pages/DoiTacPage/nhaCungCap"

import DoiTraHang from "./NhapXuatPage/doiTraHang"
import DangSuat from "../pages/OtherPage/dangSuat"
import QuanLyTaiKhoan from "./phanQuyenPage/taiKhoan"
import DangNhap from "../pages/OtherPage/dangNhap"
import ErrorPage from './UtilitesPage/error';
import ThongKe from "./thongKePage";
import DangKi from "./OtherPage/dangKi";


const pagePerm = {
  QuanLySanPham: {
    Xem: [
      { path: "/san-pham", element: SanPham }
    ],
  },
  QuanLyThuocTinh: {
    Xem: [{ path: "/thuoc-tinh", element: ThuocTinh }]
  },
  QuanLyNhapKho: {
    Xem: [
      { path: "/nhap-kho", element: NhapKho },
      { path: "/nhap-kho/them", element: ThemNhapKho },
    ]
  },
  QuanLyXuatKho: {
    Xem: [
      { path: "/xuat-kho", element: XuatKho },
      { path: "/xuat-kho/them", element: ThemXuatKho }
    ]
  },
  QuanLyDoiTraHang: {
    Xem: [
      { path: "/doi-tra-hang", element: DoiTraHang },
    ]
  },
  QuanLyKhachHang: {
    Xem: [
      { path: "/khach-hang", element: KhachHang }
    ]
  },
  QuanLyNhaCungCap: {
    Xem: [{ path: "/nha-cung-cap", element: NhaCungCap },]
  },
  QuanLyNhanVien: {
    Xem: [
      { path: "/nhan-vien", element: NhanVien }
    ]
  },
  QuanLyTaiKhoan: {
    XemCaNhan: [
      { path: "/tai-khoan-ca-nhan", element: TaiKhoan },
    ],
    Xem: [
      { path: "/tai-khoan-ca-nhan", element: TaiKhoan },
      { path: "/tai-khoan", element: QuanLyTaiKhoan },
    ]
  },
  ThongKe: {
    Xem: [
      { path: "/thong-ke", element: ThongKe }
    ]
  },
  QuanLyQuyenHan: {
    Xem: [
      { path: "/phan-quyen", element: PhanQuyen }
    ]
  }
}

function App() {
  const [auth, setAuth] = useState({ token: "", perm: [], user: {} })

  useEffect(function () {
    // Load user info from sessionStorage
    const token = sessionStorage.getItem("Authorization")
    const userStr = sessionStorage.getItem("user")

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        setAuth(prev => ({ ...prev, token, user }))
      } catch (e) {
        console.error("Error parsing user data:", e)
      }
    }

    // Authentication protection
    const currentPath = document.location.pathname
    if (!token && !["/dang-nhap", "/dang-ki"].includes(currentPath)) {
      document.location.replace("/dang-nhap")
    }
    if (token && ["/dang-nhap"].includes(currentPath)) {
      document.location.replace("/")
    }
  }, [])

  return (
    <BrowserRouter>
      <UserContext.Provider value={auth}>
        <Routes>
          <Route index element={<TrangChu />} />
          <Route path="/dang-ki" element={<DangKi />} />
          <Route path='/dang-suat' element={<DangSuat />} />
          <Route path='/dang-nhap' element={<DangNhap />} />

          {/*{auth.perm.map(({tenChucNang, tenHanhDong}) => pagePerm[tenChucNang]?.[tenHanhDong])*/}
          {/*.filter(i => !!i)*/}
          {/*.flat()*/}
          {/*.map(({path, element: Elem}, j) => (*/}
          {/*  <Route key={j} path={path} element={<Elem/>}/>*/}
          {/*))}*/}

          <Route path='/tai-khoan-ca-nhan' element={<TaiKhoan />} />

          <Route path='/san-pham' element={<SanPham />} />
          <Route path='/thuoc-tinh' element={<ThuocTinh />} />

          <Route path='/nhap-kho' element={<NhapKho />} />
          <Route path='/nhap-kho/them' element={<ThemNhapKho />} />
          <Route path='/xuat-kho' element={<XuatKho />} />
          <Route path='/xuat-kho/them' element={<ThemXuatKho />} />

          <Route path='/khach-hang' element={<KhachHang />} />
          <Route path='/nha-cung-cap' element={<NhaCungCap />} />

          <Route path='/doi-tra-hang' element={<DoiTraHang />} />

          <Route path='/nhan-vien' element={<NhanVien />} />

          <Route path='/thong-ke' element={<ThongKe />} />
          <Route path='/tai-khoan' element={<QuanLyTaiKhoan />} />
          <Route path='/phan-quyen' element={<PhanQuyen />} />

          <Route path='/*' element={<ErrorPage />} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
