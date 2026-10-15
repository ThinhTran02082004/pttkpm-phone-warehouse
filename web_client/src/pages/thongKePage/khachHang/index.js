import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, ModalBody, ModalFooter, Table } from "react-bootstrap";

import Layout2 from "../../../components/layouts/layout2";
import GroupShadow from "../../../components/Forms/GroupShadow";
import InputGroupText from "react-bootstrap/InputGroupText";
import InputShadow from "../../../components/Forms/InputShadow";

import './style.module.css'
import { useEffect, useState } from "react";
import { getCustomerStat } from "../../../api/statistics";
import colors from "../../../utilities/colors";
import HeaderModalA from "../../../components/modals/headerA";
import TableA from "../../../components/tables/tableA";
import ContentA from "../../../components/layouts/blockContent";
import { getCustomerCart } from "../../../api/Partners/customers";
import { formatDate } from "../../../utilities/others";

const tableHD = [
  { key: "Mã khách hàng", value: "makhachhang", format: t => "KH-" + t },
  { key: "Tên khách hàng", value: "tenkhachhang" },
  { key: "Số lần mua hàng", value: "muahang" },
  { key: "Tổng số tiền", value: "tongtien" },
]

const lichSuMuaHangHeader = [
  { key: "Ngày mua hàng", value: "thoigianxuat", format: formatDate },
  { key: "Mã phiếu xuất hàng", value: "maphieuxuat", format: t => "PX-" + t },
  { key: "Số lượng", value: "soluong" },
  { key: "Thành tiền", value: "thanhtien" },
  { key: "Ghi chú", value: "" },
]

function ThongKeKhachHang() {
  const [modal, setModal] = useState("")

  const [startDate, setStartDate] = useState("2010-01-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("")

  const [table, setTable] = useState([]);

  const [khachhang, setKhachHang] = useState()

  useEffect(() => {
    updateInfo()
  }, []);

  function updateInfo() {
    setTable([])
    try {
      getCustomerStat(startDate, endDate)
        .then(data => {
          console.log(data)
          setTable(data.Data ?? [])
        })
    } catch (e) {
    }
  }

  return (
    <>
      <Layout2
        leftPart={<>
          <FormGroup>
            <FormLabel className="fw-bold">Tìm kiếm khách hàng</FormLabel>
            <GroupShadow>
              <InputGroup>
                <InputGroupText>
                  <FontAwesomeIcon icon={faMagnifyingGlass} />
                </InputGroupText>
                <FormControl value={search} onChange={e => setSearch(e.target.value)} />
              </InputGroup>
            </GroupShadow>
          </FormGroup>

          <FormGroup>
            <FormLabel className="fw-bold">Từ ngày</FormLabel>
            <InputShadow type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <FormLabel className="fw-bold">Đến ngày</FormLabel>
            <InputShadow type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </FormGroup>
          <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
            <Button className="w-75" variant="success">Xuất excel</Button>
            <Button className="w-75" variant="primary" onClick={updateInfo}>Làm mới</Button>
          </div>
        </>}
        rightPart={<>
          <div className="h-100 w-100 overflow-auto border">
            <Table bordered striped>
              <thead className="text-center fw-bold">
                <tr>
                  {tableHD.map((i, j) => <th key={j}>{i.key}</th>)}
                  <th>Lịch sử mua hàng</th>
                </tr>
              </thead>

              <tbody>
                {table.filter(i => i.tenkhachhang.includes(search))
                  .map((khachHang, j) => (
                    <tr key={j}>
                      {tableHD.map((hd, k) => <td key={k}>{khachHang[hd.value]}</td>)}
                      <td className="text-center">
                        {/*<Button className="rounded-5">*/}
                        <FontAwesomeIcon icon={faInfoCircle}
                          size="lg"
                          color={colors.blue}
                          onClick={e => {
                            setKhachHang(khachHang);
                            setModal("muahang")
                          }} />
                        {/*</Button>*/}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {/*<TableA headers={tableHD} data={}/>*/}
          </div>
          <h3 className="text-end text-danger pb-3">Tổng doanh thu: {table.reduce((acc, i) => acc + +i.tongtien, 0)}VND</h3>
        </>}
      />

      <LichSuModal show={modal === "muahang"} khachhang={khachhang} onHide={setModal.bind({}, "")} />
    </>
  )
}


function LichSuModal({ show, khachhang, onHide }) {
  const [table, setTable] = useState([])

  useEffect(() => {
    getCustomerCart({ makhachhang: khachhang?.makhachhang }).then(({ Data }) => setTable(Data))
  }, [khachhang]);

  return (
    <Modal centered size="xl" show={show} backdrop="static" className='vh-100' scrollable>
      <HeaderModalA title="LỊCH SỬ MUA HÀNG" />

      <ModalBody className='d-flex flex-column _vh-80 gap-4 px-5 py-4'>
        <Form className='d-flex flex-column gap-4'>
          <FormGroup className='d-flex gap-5'>
            <FormGroup className='_w-20'>
              <FormLabel className='fw-bold'>Mã khách hàng</FormLabel>
              <InputShadow as={FormControl} size="sm" disabled value={"KH-" + khachhang?.makhachhang} />
            </FormGroup>
            <FormGroup className='_w-40'>
              <FormLabel className='fw-bold'>Tên khách hàng</FormLabel>
              <InputShadow as={FormControl} size="sm" disabled value={khachhang?.tenkhachhang} />
            </FormGroup>
            <FormGroup className='_w-20'>
              <FormLabel className='fw-bold'>Ngày sinh</FormLabel>
              <InputShadow as={FormControl} size="sm" disabled value={khachhang?.ngaysinh && formatDate(khachhang?.ngaysinh)} />
            </FormGroup>
            <FormGroup className='_w-20'>
              <FormLabel className='fw-bold'>Ngày tham gia</FormLabel>
              <InputShadow as={FormControl} size="sm" disabled value={khachhang?.ngaythamgia && formatDate(khachhang?.ngaythamgia)} />
            </FormGroup>
          </FormGroup>

          <FormGroup className='d-flex gap-5'>
            <FormGroup className='_w-60'>
              <FormLabel className='fw-bold'>Địa chỉ</FormLabel>
              <InputShadow as={FormControl} size="sm" disabled value={khachhang?.diachi} />
            </FormGroup>
            <FormGroup className='_w-20'>
              <FormLabel className='fw-bold'>Số điện thoại</FormLabel>
              <InputShadow as={FormControl} size="sm" disabled value={khachhang?.sodienthoai} />
            </FormGroup>
            <FormGroup className='_w-20'>
              <FormLabel className='fw-bold'>Email</FormLabel>
              <InputShadow as={FormControl} size="sm" disabled value={khachhang?.mail} />
            </FormGroup>
          </FormGroup>
        </Form>

        <ContentA className="h-100">
          <TableA headers={lichSuMuaHangHeader} data={table} />
          {/*<div style={{height: "10000px"}}></div>*/}
        </ContentA>
      </ModalBody>

      <ModalFooter className='d-flex justify-content-center gap-5'>
        <Button className='_w-15' variant='primary'>Xuất PDF</Button>
        <Button className='_w-15' variant='danger' onClick={e => {
          if (typeof onHide === 'function') onHide()
        }}>Đóng</Button>
      </ModalFooter>
    </Modal>
  )
}

export default ThongKeKhachHang