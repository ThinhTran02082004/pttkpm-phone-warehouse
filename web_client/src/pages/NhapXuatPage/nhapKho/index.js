import {createContext, useContext, useEffect, useState} from 'react'
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
import HeaderModalA from '../../../components/modals/headerA'
import SideNavbar from '../../../components/layouts/sideBar'
import TableA from '../../../components/tables/tableA'
import ContentA from '../../../components/layouts/blockContent'
import Page3 from '../../../components/layouts/Page3'
import colors from '../../../utilities/colors'
import InputShadow from '../../../components/Forms/InputShadow'
import GroupShadow from '../../../components/Forms/GroupShadow'
import {getSuppliers} from "../../../api/Partners/suppliers";
import {getEmployees} from "../../../api/Roles/employees";
import {findImportProducts, findImports} from "../../../api/Warehouse/imports";
import {formatDate} from "../../../utilities/others";

const phieuNhapHd = [
  {key: "Mã phiếu nhập", value: "maphieunhap"},
  {key: "Nhà cung cấp", value: "tennhacungcap"},
  {key: "Nhân viên nhập", value: "hoten"},
  {key: "Thời gian", value: "thoigian", format: formatDate},
  {key: "Tổng tiền", value: "tongtien", format: t => t + "đ"},
]

const chiTietPhieuHd = [
  {key: "Mã SP", value: "maimei"},
  {key: "Tên sản phẩm", value: "tendanhmucsanpham"},
  {key: "RAM", value: "dungluongram"},
  {key: "ROM", value: "dungluongrom"},
  {key: "Màu sắc", value: "tenmausac"},
  {key: "Đơn giá", value: "gianhap"},
]

const defaultForm = {
  manhacungcap: "*",
  manhanvien: "*",
  tungay: formatDate(new Date(2010, 0, 2)),
  denngay: formatDate(new Date()),
  tusotien: 0,
  densotien: 100_000_000_000,
  timkiem: ""
}

const defaultData = {
  nhanvien: [],
  nhacungcap: [],
  table: [],
  rowClick: undefined,
  modal: ""
}

const DataContext = createContext({})

function NhapKho() {
  const [form, setForm] = useState(defaultForm)
  const [data, setData] = useState(defaultData)


  useEffect(() => {
    findImports(form).then(data => setData(d => ({...d, table: data.Data})))

    getSuppliers().then(({Data}) => {
      setData(data => ({...data, nhacungcap: Data}))
    })
    //
    getEmployees().then(({Data}) => {
      setData(data => ({...data, nhanvien: Data}))
    })
  }, []);

  useEffect(() => {
    findImports(form).then(data => setData(d => ({...d, table: data.Data})))
  }, [form])

  useEffect(() => {

  }, [data]);

  function onOpenInfo() {
    if (data.rowClick) return setData(data => ({...data, modal: "info"}))
  }

  function onRowClick(row) {
    setData(src => ({...src, rowClick: row}))
  }

  return (<>
    <Page3
      sidebar={<SideNavbar/>}
      tools={<>
        <ToolBtn as="a" className="_border-green-focus" href="/nhap-kho/them" color={colors.green} icon={faCirclePlus}
                 title="Thêm"/>
        <ToolBtn className="_border-blue-focus" color={colors.blue} icon={faCircleInfo} title="Chi tiết"
                 onClick={onOpenInfo}/>
        <ToolBtn as="a" className="_border-orange-focus-2" color={colors.orange_2} icon={faPencil} title="Sửa"/>
        <ToolBtn className="_border-red-focus" color={colors.red} icon={faCircleXmark} title="Hủy"/>
        <ToolBtn className="_border-green-focus" color={colors.green} icon={faFileExport} title="Xuất Excel"/>
      </>}
      rightForm={<>
        <InputShadow type='text' className="w-auto" placeholder='Tìm kiếm'
                     value={form.timkiem}
                     onChange={e => setForm(src => ({...src, timkiem: e.target.value}))}/>
        <IconBtn icon={faMagnifyingGlass} className="btn-success btn-lg" onClick={() => {
          setData(da => ({
            ...da,
            table: data.table.filter(i => i.tennhacungcap?.includes(form.timkiem || '') || i.hoten?.includes(form.timkiem || ''))
          }))
        }}/>
        <IconBtn icon={faArrowRotateRight} title={"Làm mới"} className="btn-primary"/>
      </>}
      leftForm={<>
        <Form.Group>
          <Form.Label className='fw-bold'>Nhà cung cấp</Form.Label>
          <InputShadow as={FormSelect}
                       value={form.manhacungcap}
                       onChange={e => setForm(src => ({...src, manhacungcap: e.target.value}))}>
            <option value='*'>Tất cả</option>
            {data?.nhacungcap?.map((i, j) => <option key={j} value={i.manhacungcap}>{i.tennhacungcap}</option>)}
          </InputShadow>
        </Form.Group>

        <Form.Group>
          <Form.Label className='fw-bold'>Nhân viên nhập</Form.Label>
          <InputShadow as={FormSelect}
                       value={form.manhanvien}
                       onChange={e => setForm(src => ({...src, manhanvien: e.target.value}))}>
            <option value='*'>Tất cả</option>
            {data?.nhanvien?.map((i, j) => <option key={j} value={i.manhanvien}>{i.hoten}</option>)}
          </InputShadow>
        </Form.Group>

        <Form.Group>
          <Form.Label className='fw-bold'>Từ ngày</Form.Label>
          <InputShadow type="date"
                       value={form.tungay}
                       onChange={e => setForm(src => ({...src, tungay: e.target.value}))}/>
        </Form.Group>

        <Form.Group>
          <Form.Label className='fw-bold'>Đến ngày</Form.Label>
          <InputShadow type="date"
                       value={form.denngay}
                       onChange={e => setForm(src => ({...src, denngay: e.target.value}))}/>
        </Form.Group>

        <Form.Group>
          <Form.Label className='fw-bold'>Từ số tiền</Form.Label>
          <GroupShadow>
            <Form.Control type="number"
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
      table={<TableA index headers={phieuNhapHd} data={data.table.slice(0, 100)} onClick={onRowClick}/>}
    />

    <DataContext.Provider value={data}>
      {/* Chi tiết */}
      <InfoModal show={data.modal === "info"} onHide={() => setData(src => ({...src, modal: ""}))}/>
    </DataContext.Provider>
  </>)
}

function InfoModal({onHide, ...props}) {
  const data = useContext(DataContext)

  const [products, setProducts] = useState([])

  useEffect(function () {
    findImportProducts({maphieunhap: data?.rowClick?.maphieunhap}).then(({Data}) => setProducts(Data))
  }, [data?.rowClick?.maphieunhap])

  function onModalHide() {
    if (typeof onHide === 'function') onHide()
  }

  return (
    <Modal {...props} size='xl' scrollable backdrop="static" centered>
      <HeaderModalA title={"THÔNG TIN PHIẾU NHẬP"}/>

      <ModalBody className='d-flex flex-column gap-3 p-4 overflow-hidden'>
        <Form className='d-flex justify-content-between gap-3'>
          <FormGroup>
            <FormLabel className='fw-bold'>Mã phiếu</FormLabel>
            <FormControl type='text' disabled value={data.rowClick?.maphieunhap}/>
          </FormGroup>

          <FormGroup>
            <FormLabel className='fw-bold'> Nhân viên nhập</FormLabel>
            <FormControl type='text' disabled value={data.rowClick?.hoten}/>
          </FormGroup>

          <FormGroup>
            <FormLabel className='fw-bold'>Nhà cung cấp</FormLabel>
            <FormControl type='text' disabled value={data.rowClick?.tennhacungcap}/>
          </FormGroup>

          <FormGroup>
            <FormLabel className='fw-bold'>Thời gian tạo</FormLabel>
            <FormControl type='text' disabled value={data.rowClick?.thoigian?.split("T")[0]}/>
          </FormGroup>
        </Form>

        <ContentA style={{maxHeight: "100%"}}>
          <TableA headers={chiTietPhieuHd} data={products}/>
        </ContentA>
        <p className='text-end m-0 fw-bold mx-4'>Tổng số: {products.length} chiếc</p>
      </ModalBody>

      <ModalFooter className='justify-content-center p-3 d-flex gap-5'>
        <Button variant='primary' style={{width: "20%"}}>Xuất PDF</Button>
        <Button variant='danger' style={{width: "20%"}} onClick={onModalHide}>Hủy</Button>
      </ModalFooter>
    </Modal>
  )
}

export default NhapKho