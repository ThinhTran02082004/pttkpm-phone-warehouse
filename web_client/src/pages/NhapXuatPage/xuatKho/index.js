import {useEffect, useState} from 'react'
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter
} from 'react-bootstrap'
import {
  faArrowRotateRight,
  faCircleInfo,
  faCirclePlus,
  faCircleXmark,
  faFileExport,
  faMagnifyingGlass,
  faPencil
} from '@fortawesome/free-solid-svg-icons'

import ToolBtn from '../../../components/buttons/toolBtn'
import IconBtn from '../../../components/buttons/iconBtn'
import TableA from '../../../components/tables/tableA'
import Page3 from '../../../components/layouts/Page3'
import SideNavbar from '../../../components/layouts/sideBar'
import colors from '../../../utilities/colors'
import InputShadow from '../../../components/Forms/InputShadow'
import HeaderModalB from "../../../components/modals/headerB";
import GroupShadow from "../../../components/Forms/GroupShadow";
import {getCustomers} from "../../../api/Partners/customers";
import {getEmployees} from "../../../api/Roles/employees";
import {findExports} from "../../../api/Warehouse/exports";
import {formatDate} from "../../../utilities/others";
import HeaderModalA from "../../../components/modals/headerA";
import ContentA from "../../../components/layouts/blockContent";

const phieuNhapHd = [
  {key: "Mã phiếu xuất", value: "maphieuxuat"},
  {key: "Khách hàng", value: "tenkhachhang"},
  {key: "Nhân viên xuất", value: "hoten"},
  {key: "Thời gian", value: "thoigian", format: formatDate},
  {key: "Tổng tiền", value: "tongtien"},
]

const phieuXuatHeader = [
  {key: "Mã sp", value: "tenSP"},
  {key: "Tên sản phẩm", value: "tonKho"},
  {key: "RAM", value: "tonKho"},
  {key: "ROM", value: "tonKho"},
  {key: "Màu sắc", value: "tonKho"},
  {key: "Mã IMEI", value: "tonKho"},
  {key: "Đơn giá", value: "tonKho"},
]

const phieuBaoHanhHD = [
  {key: "Mã SP", value: ""},
  {key: "Tên sản phẩm", value: ""},
  {key: "RAM", value: ""},
  {key: "ROM", value: ""},
  {key: "Màu sắc", value: ""},
  {key: "Mã IMEI", value: ""},
  {key: "Đơn giá", value: ""},
  {key: "Thời gian bảo hành", value: ""},
]
const defaultForm = {
  makhachhang: "*",
  manhanvien: "*",
  tungay: new Date(2010, 0, 1).toISOString().split("T")[0],
  denngay: new Date().toISOString().split("T")[0],
  tusotien: 0,
  densotien: 10_000_000_000
}

function XuatKho() {
  const [data, setData] = useState({})
  const [form, setForm] = useState(defaultForm)

  const [modal, setModal] = useState("")

  useEffect(() => {
    getCustomers().then(({Data}) => setData(src => ({...src, Data})))
    getEmployees().then(({Data}) => setData(src => ({...src, Data})))

  }, [])

  useEffect(() => {
    findExports(form).then(({Data}) => setData(src => ({...src, table: Data})))
  }, [form])

  return (
    <>
      <Page3
        sidebar={<SideNavbar/>}
        tools={<>
          <ToolBtn as="a" className="_border-focus-green" href="/xuat-kho/them" color={colors.green} icon={faCirclePlus}
                   title="Thêm"/>
          <ToolBtn color={colors.blue} icon={faCircleInfo} title="Chi tiết" onClick={setModal.bind({}, "info")}/>
          <ToolBtn as="a" className="_border-orange-focus-2" color={colors.orange_2} icon={faPencil} title="Sửa"/>
          <ToolBtn color={colors.red} icon={faCircleXmark} title="Hủy"/>
          <ToolBtn color={colors.green} icon={faFileExport} title="Xuất Excel"/>
        </>}
        rightForm={<>
          <InputShadow as={FormControl} className='w-auto' type='text' placeholder='Tìm kiếm'
                       value={form.timkiem}
                       onChange={e => setForm(src => ({...src, timkiem: e.target.value}))}/>
          <IconBtn icon={faMagnifyingGlass} className="btn-primary w-auto btn-lg" onClick={e => {
            const table = [...data.table];
            const timkiem = form.timkiem || '';
            setData(da => ({
              ...da,
              table: table.filter(i => i.tennhacungcap?.includes(timkiem) || i.hoten?.includes(timkiem))
            }))
          }}/>
          <IconBtn icon={faArrowRotateRight} title={"Làm mới"} className="btn-success w-auto'"/>
        </>}
        leftForm={<>
          <Form.Group>
            <Form.Label className='fw-bold'>Khách hàng</Form.Label>
            <InputShadow as={FormSelect} value={form.makhachhang}
                         onChange={e => setForm(src => ({...src, makhachhang: e.target.value}))}>
              <option value="*">Tất cả</option>
              {data.customers?.map((i, j) => <option key={j} value={i.makhachhang}>{i.tenkhachhang}</option>)}
            </InputShadow>
          </Form.Group>

          <Form.Group>
            <Form.Label className='fw-bold'>Nhân viên xuất</Form.Label>
            <InputShadow as={FormSelect}
                         value={form.manhanvien}
                         onChange={e => setForm(src => ({...src, manhanvien: e.target.value}))}>
              <option value="*">Tất cả</option>
              {data.employees?.map((i, j) => <option key={j} value={i.manhanvien}>{i.hoten}</option>)}

            </InputShadow>
          </Form.Group>

          <Form.Group>
            <Form.Label className='fw-bold'>Từ ngày</Form.Label>
            <InputShadow type='date'
                         value={form.tungay}
                         onChange={e => setForm(src => ({...src, tungay: e.target.value}))}/>
          </Form.Group>

          <Form.Group>
            <Form.Label className='fw-bold'>Đến ngày</Form.Label>
            <InputShadow type='date'
                         value={form.denngay}
                         onChange={e => setForm(src => ({...src, denngay: e.target.value}))}/>
          </Form.Group>

          <Form.Group>
            <Form.Label className='fw-bold'>Từ số tiền</Form.Label>
            <GroupShadow>
              <Form.Control type='number'
                            value={form.tusotien}
                            onChange={e => setForm(src => ({...src, tusotien: e.target.value}))}/>
              <InputGroup.Text>VNĐ</InputGroup.Text>
            </GroupShadow>
          </Form.Group>

          <Form.Group>
            <Form.Label className='fw-bold'>Đến số tiền</Form.Label>
            <GroupShadow>
              <Form.Control type='number'
                            value={form.densotien}
                            onChange={e => setForm(src => ({...src, densotien: e.target.value}))}/>
              <InputGroup.Text>VNĐ</InputGroup.Text>
            </GroupShadow>
          </Form.Group>
        </>}
        table={<TableA headers={phieuNhapHd} data={data.table?.slice(0, 100)}/>}
      />

      <PhieuXuatModal show={modal === "info"} onHide={setModal.bind({}, "")}/>
      {/*<BaoHanhModal show={modal === "baoHanh"} onHide={setModal.bind({}, "")}/>*/}
    </>
  )
}

function PhieuXuatModal({show, onHide}) {
  return (
    <Modal show={show} centered scrollable size='xl' className='vh-100'>
      <HeaderModalA title="THÔNG TIN PHIẾU XUẤT"/>

      <ModalBody className='d-flex flex-column gap-5 p-5'>
        <Form className='d-flex gap-5 justify-content-between'>
          <FormGroup>
            <FormLabel className='fw-bold'>Mã phiếu</FormLabel>
            <InputShadow disabled/>
          </FormGroup>
          <FormGroup>
            <FormLabel className='fw-bold'>Nhân viên xuất</FormLabel>
            <InputShadow disabled/>
          </FormGroup>
          <FormGroup>
            <FormLabel className='fw-bold'>Khách hàng</FormLabel>
            <InputShadow disabled/>
          </FormGroup>
          <FormGroup>
            <FormLabel className='fw-bold'>Thời gian</FormLabel>
            <InputShadow disabled type="date"/>
          </FormGroup>
        </Form>

        <ContentA>
          <TableA headers={phieuXuatHeader}/>
          <div style={{height: "1000px"}}></div>
        </ContentA>
      </ModalBody>

      <ModalFooter className='justify-content-center p-3 d-flex gap-5'>
        <Button variant='primary' style={{width: "20%"}}>Xuất PDF</Button>
        <Button variant='danger' style={{width: "20%"}}
                onClick={e => {
                  if (typeof onHide === 'function') onHide();
                }}>Hủy</Button>
        <Button variant='success' style={{width: "20%"}}>Xem phiếu bảo
          hành</Button>
      </ModalFooter>
    </Modal>
  )
}

function BaoHanhModal({onHide, show}) {
  return (
    <Modal show={show} size='xl' className='vh-100' centered scrollable>
      <HeaderModalB className={"d-flex flex-column gap-2 text-center"}>
        <h1 className={"fs-3"}> PHIẾU BẢO HÀNH </h1>
        <h2 className="fs-5 fst-italic">Vui lòng trình phiếu bảo hành khi có nhu cầu sửa chữa, bảo hành!</h2>
      </HeaderModalB>

      <ModalBody className="_vh-70 d-flex flex-column gap-2">
        <div className="mx-5">
          <h3 className="text-center mb-4 fw-bold">Thông tin khách hàng</h3>
          <div className="d-flex justify-content-between">
            <div>
              <div className="d-flex gap-2 fs-5">
                <p className="fw-bold">Họ và tên: </p>
                <span>Tst</span>
              </div>
              <div className="d-flex gap-2 fs-5">
                <p className="fw-bold">Email: </p>
                <span>Tst</span>
              </div>
              <div className="d-flex gap-2 fs-5">
                <p className="fw-bold">Số điện thoại:</p>
                <span>Tst</span>
              </div>
            </div>

            <div>
              <div className="d-flex gap-2 fs-5">
                <p className="fw-bold">Mã khách hàng: </p>
                <span>Tst</span>
              </div>
              <div className="d-flex gap-2 fs-5">
                <p className="fw-bold">Mã hóa đơn mua hàng: </p>
                <span>Tst</span>
              </div>
              <div className="d-flex gap-2 fs-5">
                <p className="fw-bold">Ngày mua hàng: </p>
                <span>Tst</span>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex h-100 w-100 flex-column overflow-hidden">
          <h3 className="text-center mb-4 fw-bold">Danh sách sản phẩm đã mua</h3>
          <div className="h-100 overflow-auto border">
            <TableA headers={phieuBaoHanhHD}/>
            <div style={{height: "1000px"}}></div>
          </div>
        </div>
      </ModalBody>

      <ModalFooter className='justify-content-center p-3 d-flex gap-5'>
        <Button variant='primary' style={{width: "20%"}}>Xuất PDF</Button>
        <Button variant='danger' style={{width: "20%"}}
                onChange={e => {
                  if (typeof onHide === 'function') onHide();
                }}>Hủy</Button>
      </ModalFooter>
    </Modal>
  )
}

export default XuatKho