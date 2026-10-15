import {
  Nav,
  Tab
} from "react-bootstrap";

import Page1             from "../../components/layouts/Page1";
import SideNavbar        from "../../components/layouts/sideBar";
import ThongKeTongQuan   from "./tongQuan";

import './style.module.css'
import ThongKeTonKho     from "./tonKho";
import ThongKeDoanhThu   from "./doanhThu";
import ThongKeNhaCungCap from "./nhaCungCap";
import ThongKeKhachHang  from "./khachHang";

function ThongKe() {
  return (<>
    <Page1 sidebar={<SideNavbar/>} className="p-3 d-flex flex-column overflow-auto">
      <Tab.Container defaultActiveKey="tongQuan" className="border-0 border">
        <Nav variant="tabs" className="">
          <Nav.Item>
            <Nav.Link className="bg-light border fw-bold" eventKey="tongQuan">Tổng quan</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="bg-light border fw-bold" eventKey="tonKho">Tồn kho</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="bg-light border fw-bold" eventKey="doanhThu">Doanh thu</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="bg-light border fw-bold" eventKey="nhacungCap">Nhà cung cấp</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link className="bg-light border fw-bold" eventKey="khachHang">Khách hàng</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="_h-95 w-100">
          <Tab.Pane eventKey="tongQuan" className="_h-100 w-100 bg-light overflow-auto rounded-bottom rounded-end">
            <ThongKeTongQuan/>
          </Tab.Pane>
          <Tab.Pane eventKey="tonKho" className="_h-100 w-100 bg-light overflow-auto rounded-bottom rounded-end">
            <ThongKeTonKho/>
          </Tab.Pane>
          <Tab.Pane eventKey="doanhThu" className="_h-100 w-100 bg-light overflow-auto rounded-bottom rounded-end">
            <ThongKeDoanhThu/>
          </Tab.Pane>
          <Tab.Pane eventKey="nhacungCap" className="_h-100 w-100 bg-light overflow-auto rounded-bottom rounded-end">
            <ThongKeNhaCungCap/>
          </Tab.Pane>
          <Tab.Pane eventKey="khachHang" className="_h-100 w-100 bg-light overflow-auto rounded-bottom rounded-end">
            <ThongKeKhachHang/>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Page1>
  </>)
}

export default ThongKe