import { useContext, useEffect, useState } from 'react';
import Accordion from 'react-bootstrap/Accordion'
import { useAccordionButton } from 'react-bootstrap/esm/AccordionButton';
import { AccordionContext, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleRight,
  faCircleCheck,
  faCircleUser,
  faClipboardUser,
  faHandshakeSimple,
  faHouse,
  faLaptop,
  faRightFromBracket,
  faShieldHalved,
  faUnlockKeyhole,
  faWarehouse
} from "@fortawesome/free-solid-svg-icons"

import { UserContext } from '../../../api/authentication';
import styles from './style.module.css'


const navLinks = [
  { title: "Trang chủ", force: true, eventKey: "trangChu", link: "/", icon: faHouse, links: [] },
  {
    title: "Sản phẩm", force: true, eventKey: "sanPham", icon: faLaptop, links: [
      { title: "Sản phẩm", force: true, eventKey: "QuanLySanPham", link: "/san-pham", visible: true, },
      { title: "Thuộc tính", force: true, eventKey: "QuanLyThuocTinh", link: "/thuoc-tinh", visible: true, }
    ]
  },
  {
    title: "Đối tác", force: true, eventKey: "doiTac", icon: faHandshakeSimple, links: [
      { title: "Khách hàng", force: true, eventKey: "QuanLyKhachHang", link: "/khach-hang", visible: true, },
      { title: "Nhà cung cấp", force: true, eventKey: "QuanLyNhaCungCap", link: "/nha-cung-cap", visible: true, }
    ]
  },
  {
    title: "Nhập xuất", force: true, eventKey: "NhapXuatPage", icon: faWarehouse, links: [
      { title: "Nhập kho", force: true, eventKey: "QuanLyNhapKho", link: "/nhap-kho", visible: true, },
      { title: "Nhập kho", force: true, eventKey: "QuanLyNhapKho", link: "/nhap-kho/them", visible: false, },
      { title: "Xuất kho", force: true, eventKey: "QuanLyXuatKho", link: "/xuat-kho", visible: true, },
      { title: "Xuất kho", force: true, eventKey: "QuanLyXuatKho", link: "/xuat-kho/them", visible: false, },
    ]
  },
  { title: "Dịch vụ", force: true, eventKey: "QuanLyDoiTraHang", link: "/doi-tra-hang", icon: faShieldHalved, links: [] },
  { title: "Nhân viên", force: true, eventKey: "QuanLyNhanVien", link: "/nhan-vien", icon: faClipboardUser, links: [] },
  { title: "Tài khoản", force: true, eventKey: "QuanLyTaiKhoan", link: "/tai-khoan", icon: faCircleUser, links: [] },
  { title: "Thống kê", force: true, eventKey: "ThongKe", link: "/thong-ke", icon: faCircleCheck, links: [] },
  {
    title: "Phân quyền",
    force: true,
    eventKey: "QuanLyNhomQuyen",
    link: "/phan-quyen",
    icon: faUnlockKeyhole,
    links: []
  },
];

function NavLinks({ className, icon, link, eventKey, title, links = [], onClick, perm, force, icon_angle = 0 }) {
  const { activeEventKey } = useContext(AccordionContext);
  const [active, setActive] = useState(false)

  useEffect(function () {
    setActive(links.some(i => window.location.pathname.includes(i.href)) || window.location.pathname === link)
  }, [links, link, perm])

  function onUserClick() {
    if (typeof onClick == 'function') onClick(eventKey);
  }

  const clsName = active && "_bg-yellow-0"
  return (
    <Accordion.Item className={[className, 'bg-light'].join(" ")} eventKey={eventKey}>
      {/* header */}
      <div className={[clsName, styles.nav_header, "px-4 py-2"].join(" ")}
        onClick={useAccordionButton(eventKey, onUserClick)}>
        <FontAwesomeIcon size='2xl' width={35} icon={icon} rotation={icon_angle} />

        {links.length
          ? <>
            <p className={["fs-5 fw-semibold my-0"].join(" ")}>{title}</p>
            <FontAwesomeIcon className={[styles.arrow_icon].join()} icon={faAngleRight}
              rotation={activeEventKey !== eventKey ? 0 : 90} />
          </>
          : <a href={link}
            className={[perm?.includes(eventKey) || force ? "text-primary" : "text-dark pe-none", "fs-5 text-decoration-none fw-semibold "].join(" ")}>{title}</a>}
      </div>

      {!!links.length && <Accordion.Collapse eventKey={eventKey}>
        <div className='position-relative my-1'>
          <div className={[styles.leftBar, "position-absolute rounded-5"].join(" ")}></div>
          {links?.map(({ link, title, visible, eventKey, force }, j) => visible && (
            <div key={j} className={["py-1 position-relative"].join(" ")}>
              <div
                className={[styles.heading, "position-absolute rounded-5", window.location.pathname.includes(link) ? '_bg-yellow-2' : "bg-dark"].join(" ")}></div>
              <a
                className={[styles.links, force || perm?.includes(eventKey) || "text-dark pe-none", window.location.pathname.includes(link) && '_text-yellow-2', 'text-decoration-none fs-5 disabled'].join(" ")}
                href={link}>{title}</a>
            </div>
          ))}
        </div>
      </Accordion.Collapse>}
    </Accordion.Item>
  );
}

export default function SideNavbar({ navItem = navLinks }) {
  const { token, perm, user } = useContext(UserContext)
  const [activeTab, setActiveTab] = useState("");
  const [accessPage, setAccessPage] = useState([]);

  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [name, setName] = useState(user?.hoten || user?.hoTen || "Nguyễn Văn A");
  const [role, setRole] = useState(user?.tennhomquyen || user?.tenNhomQuyen || "Quản lí kho");

  useEffect(function () {
    const activeItem = navLinks.find(i => i.links.some(j => window.location.pathname.includes(j.link)))
    setActiveTab(activeItem?.eventKey)
    if (perm) {
      setAccessPage(
        perm.filter(j =>
          j.tenHanhDong === 'Xem'
          && navItem.find(i => i.eventKey === j.tenChucNang || i.links?.map(i => i.eventKey).includes(j.tenChucNang))
        ).map(i => i.tenChucNang)
      )
    }
  }, [navItem, perm, user])

  useEffect(() => {
    if (user) {
      setAvatar(user.avatar || "");
      setName(user.hoten || user.hoTen || "Nguyễn Văn A");
      setRole(user.tennhomquyen || user.tenNhomQuyen || "Quản lí kho");
    }

    const handleAvatarUpdate = () => {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        try {
          const parsedUser = JSON.parse(userStr);
          setAvatar(parsedUser.avatar || "");
          setName(parsedUser.hoten || parsedUser.hoTen || "Nguyễn Văn A");
          setRole(parsedUser.tennhomquyen || parsedUser.tenNhomQuyen || "Quản lí kho");
        } catch (e) {
          console.error("Error parsing user from sessionStorage:", e);
        }
      }
    };

    window.addEventListener('avatarUpdated', handleAvatarUpdate);
    return () => window.removeEventListener('avatarUpdated', handleAvatarUpdate);
  }, [user]);

  function onNavlinkClick(key) {
    setActiveTab(key === activeTab ? "" : key)
  }

  return (
    <div className={["bg-light h-100 user-select-none"].join(" ")}>
      {/* Tài khoản */}
      <div className={[styles.account_sec, "d-flex gap-3 align-items-center border-bottom p-3 m-0"].join(" ")}>
        <a href='/tai-khoan-ca-nhan' className={[styles.avatar, "align-self-center d-grid"].join(" ")}>
          <Image className='bg-primary' src={avatar || '/default-avatar.png'} roundedCircle style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
        </a>
        <a href='/tai-khoan-ca-nhan' className={["text-decoration-none text-dark"].join(" ")}>
          <p className={["fs-5 fw-bold m-0"].join(" ")}>
            {name}
          </p>
          <p className={["fs-6 m-0"].join(" ")}>
            {role}
          </p>
        </a>
      </div>

      {/* Trang chủ */}
      <div className={[styles.nav_container, "d-flex flex-column justify-content-between"].join(" ")}>
        {/* nav link */}
        <Accordion flush activeKey={activeTab}>
          {navItem
            .filter(i => i.force || accessPage.includes(i.eventKey) || i.links?.some(j => accessPage.includes(j.eventKey)))
            .map((i, j) => <NavLinks {...i} key={j} onClick={onNavlinkClick} perm={accessPage} />)}
        </Accordion>

        {/* Đăng xuất */}
        <div className="border-top ">
          <NavLinks icon={faRightFromBracket} icon_angle={180} title={"Đăng xuất"} link="/dang-suat" force />
        </div>
      </div>
    </div>
  )
}