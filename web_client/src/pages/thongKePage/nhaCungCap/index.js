import { Button, Form, FormControl, FormGroup, FormLabel, InputGroup, Modal, ModalBody, ModalFooter, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import Layout2 from "../../../components/layouts/layout2";
import GroupShadow from "../../../components/Forms/GroupShadow";
import InputGroupText from "react-bootstrap/InputGroupText";
import InputShadow from "../../../components/Forms/InputShadow";
import TableA from "../../../components/tables/tableA";

import './style.module.css'
import { useEffect, useState } from "react";
import { getSupplierStat } from "../../../api/statistics";
import HeaderModalA from "../../../components/modals/headerA";
import ContentA from "../../../components/layouts/blockContent";
import colors from "../../../utilities/colors";
import { getSupplierCart } from "../../../api/Partners/suppliers";
import { formatDate } from "../../../utilities/others";

const tableHD = [
  { key: "Mã nhà cung cấp", value: "manhacungcap", format: t => "NCC-" + t },
  { key: "Tên nhà cung cấp", value: "tennhacungcap" },
  { key: "Số lượng nhập", value: "lannhap" },
  { key: "Tổng số tiền", value: "tongtien" },
]

const lichSuMuaHangHeader = [
  { key: "Ngày nhập hàng", value: "thoigianxuat", format: formatDate },
  { key: "Mã phiếu nhập hàng", value: "maphieuxuat", format: t => "PN-" + t },
  { key: "Số lượng", value: "soluong" },
  { key: "Thành tiền", value: "thanhtien" },
  { key: "Ghi chú", value: "sdt" },
]

function ThongKeNhaCungCap() {
  const [modal, setModal] = useState("")

  const [startDate, setStartDate] = useState("2010-01-01");
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [search, setSearch] = useState("")

  const [ncc, setNCC] = useState()
  const [table, setTable] = useState([]);

  useEffect(() => {
    updateData()
  }, []);

  useEffect(() => {
    updateData()
  }, [endDate, startDate]);

  function updateData() {
    setTable([])
    getSupplierStat(startDate, endDate).then(data => setTable(data.Data))
  }

  return (
    <>
      <Layout2
        leftPart={<>
          <FormGroup>
            <FormLabel className="fw-bold">Tìm kiếm nhà cung cấp</FormLabel>
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
            <InputShadow type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </FormGroup>

          <FormGroup>
            <FormLabel className="fw-bold">Đến ngày</FormLabel>
            <InputShadow type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </FormGroup>

          <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
            <Button className="w-75" variant="success">Xuất excel</Button>
            <Button className="w-75" variant="primary" onClick={() => {
              setStartDate("2010-01-01");
              setEndDate(new Date().toISOString().split("T")[0]);
            }}>Làm mới</Button>
          </div>
        </>}
        rightPart={<>
          <div className="h-100 overflow-auto border">
            <Table bordered striped>
              <thead className="text-center fw-bold">
                <tr>
                  {tableHD.map((i, j) => <th key={j}>{i.key}</th>)}
                  <th>Chi tiết</th>
                </tr>
              </thead>

              <tbody>
                {table.filter(i => i.tennhacungcap.includes(search))
                  .map((ncc, j) => (
                    <tr key={j}>
                      {tableHD.map((hd, k) => <td key={k}>{ncc[hd.value]}</td>)}
                      <td className="text-center">
                        {/*<Button className="rounded-5">*/}
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          size="lg"
                          color={colors.blue}
                          onClick={e => {
                            setNCC(ncc)
                            setModal("lichSu")
                          }} />
                        {/*</Button>*/}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
            {/*<TableA headers={tableHD} data={table.filter(i => i.tennhacungcap.includes(search))}/>*/}
            {/*<div style={{height: "1000px"}}></div>*/}
          </div>
          <h3 className="text-end text-danger pb-3">Tổng số tiền nhập hàng: {table.reduce((acc, i) => acc + +i.tongtien, 0)} VND</h3>
        </>}
      />

      <NhaCungCapChiTiet show={modal === "lichSu"} nhacungcap={ncc} onHide={setModal.bind({}, "")} />
    </>
  )
}

function NhaCungCapChiTiet({ show, onHide, nhacungcap }) {
  const [data, setData] = useState([])

  useEffect(() => {
    getSupplierCart({ manhacungcap: nhacungcap?.manhacungcap }).then(({ Data }) => setData(Data))
  }, [nhacungcap]);
  return (
    <Modal centered size="xl" show={show} backdrop="static" className='vh-100' scrollable>
      <HeaderModalA title="LỊCH SỬ NHẬP HÀNG" />

      <ModalBody className='d-flex flex-column vh-100 gap-4 px-5 py-4'>
        <Form className='d-flex flex-column gap-4'>
          <FormGroup className='d-flex gap-5'>
            <FormGroup className='_w-40'>
              <FormLabel className='fw-bold'>Mã nhà cung cấp</FormLabel>
              <InputShadow as={FormControl} size="sm" disabled value={nhacungcap?.manhacungcap} />
            </FormGroup>
            <FormGroup className='_w-100'>
              <FormLabel className='fw-bold'>Tên nhà cung cấp</FormLabel>
              <InputShadow as={FormControl} size="sm" disabled value={nhacungcap?.tennhacungcap} />
            </FormGroup>
            <FormGroup className='_w-50'>
              <FormLabel className='fw-bold'>Email</FormLabel>
              <InputShadow as={FormControl} size="sm" disabled value={nhacungcap?.mail} />
            </FormGroup>
            <FormGroup className='_w-50'>
              <FormLabel className='fw-bold'>Số điện thoại</FormLabel>
              <InputShadow as={FormControl} size="sm" disabled value={nhacungcap?.sodienthoai} />
            </FormGroup>
          </FormGroup>

          <FormGroup className='d-flex gap-5'>
            <FormGroup className='_w-55'>
              <FormLabel className='fw-bold'>Địa chỉ</FormLabel>
              <InputShadow as={FormControl} size="sm" disabled value={nhacungcap?.diachi} />
            </FormGroup>

          </FormGroup>
        </Form>

        <ContentA className="h-100">
          <TableA headers={lichSuMuaHangHeader} data={data} />
          {/*<div style={{height: "10000px"}}></div>*/}
        </ContentA>
      </ModalBody>

      <ModalFooter className='d-flex justify-content-center gap-5'>
        <Button className='_w-15' variant='primary'>Xuất PDF</Button>
        <Button className='_w-15'
          variant='danger'
          onClick={e => {
            if (typeof onHide === 'function') onHide()
          }}>Đóng</Button>
      </ModalFooter>
    </Modal>
  )
}


export default ThongKeNhaCungCap