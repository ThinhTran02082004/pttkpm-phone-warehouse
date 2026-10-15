import {createContext, useEffect, useState} from 'react'
import {
  faArrowRotateRight,
  faCirclePlus,
  faMagnifyingGlass,
  faPencil,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  Modal,
  ModalBody,
  ModalFooter
} from 'react-bootstrap'

import TableA from '../../../components/tables/tableA'
import Page2 from '../../../components/layouts/Page2'
import SideNavbar from '../../../components/layouts/sideBar'
import ToolBtn from '../../../components/buttons/toolBtn'
import InputShadow from '../../../components/Forms/InputShadow'
import FlexForm from '../../../components/Forms/FlexForm'
import colors from '../../../utilities/colors'
import HeaderModalA from '../../../components/modals/headerA'
import ContentA from '../../../components/layouts/blockContent'
import {getEmployeeNoAccount} from "../../../api/Roles/employees";
import {getRoles} from "../../../api/Roles/roles";
import {deleteAccount, getAccounts, insertAccount, updateAccount} from "../../../api/Roles/accounts";
import ErrorModal from "../../../components/modals/errorModal";

const tableHd = [
  {key: "Mã tài khoản", value: "mataikhoan"},
  {key: "Mã nhân viên", value: "manhanvien"},
  {key: "Tên nhân viên", value: "hoten"},
  {key: "Email", value: "mail"},
  {key: "Nhóm quyền", value: "tenhienthi"},
  {key: "tenQuyen", value: "tennhomquyen", hide: true},
  {key: "maQuyen", value: "manhomquyen", hide: true},
  // { key: "Trạng thái", value: "" },
]

const chonNhanVienHD = [
  {key: "Mã nv", value: "manhanvien"},
  {key: "Tên nhân viên", value: "hoten"},
  {key: "Email", value: "mail", hide: true},
]

const FormContext = createContext({})
const InfoContext = createContext({})

function QuanLyTaiKhoan() {
  const [modal, setModal] = useState("")
  const [table, setTable] = useState()
  const [row, setRow] = useState()

  useEffect(() => {
    updateInfo()
  }, []);


  function updateTableData() {
    setTable([])
    getAccounts().then(data => setTable(data.Data))
  }

  function onRowClick(row) {
    setRow(row)
  }

  async function updateInfo() {
    updateTableData()
    setRow()
  }

  function onOpenEditModal() {
    if (!row) return setModal('error')
    setModal("edit")
  }

  async function onDelete() {
    if (!row) return setModal('error')
    const result = await deleteAccount([row])

    if (!result.success) return;

    await updateInfo()
  }

  return (
    <>
      <Page2
        sidebar={<SideNavbar/>}
        tools={<>
          <ToolBtn className="_border-green-focus" color={colors.green} icon={faCirclePlus} title="Thêm"
                   onClick={setModal.bind({}, "add")}/>
          <ToolBtn className="_border-orange-focus-2" color={colors.orange_2} icon={faPencil} title="Sửa"
                   onClick={onOpenEditModal}/>
          <ToolBtn className="_border-yellow-focus-2" color={colors.yellow_2} icon={faTrashCan} title="Xóa"
                   onClick={onDelete}/>
        </>}
        rightSec={<FlexForm>
          <InputShadow as={FormControl} className="w-auto" placeholder="Tìm kiếm"/>
          <Button className='d-flex gap-2 align-items-center px-4 opacity-2' size='lg' variant='success'>
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
          </Button>
          <Button className='d-flex gap-2 align-items-center' variant='primary'>
            <FontAwesomeIcon icon={faArrowRotateRight}/>
            <span>Làm mới</span>
          </Button>
        </FlexForm>}
        dataTable={<TableA headers={tableHd} data={table} onClick={onRowClick}/>}
      />

      <InfoContext.Provider value={{}}>
        <FormContext.Provider value={[]}>
          {/*Them tai khoan*/}
          <AddTaiKhoanModal show={modal === "add"} onSubmit={updateTableData} onHide={setModal.bind({}, "")}/>

          {/*Sua tai khoan*/}
          <EditTaiKhoanModal account={row} show={modal === "edit"} onSubmit={updateInfo}
                             onHide={setModal.bind({}, "")}/>
        </FormContext.Provider>
      </InfoContext.Provider>

      <ErrorModal show={modal === 'error'} onHide={() => setModal('')}>
        <p>Phải chọn 1 tài khoản</p>
      </ErrorModal>
    </>
  )
}

function EditTaiKhoanModal({onSubmit, onHide, account, ...props}) {
  const [nhomquyen, setNhomQuyen] = useState([])
  const [vaitro, setVaiTro] = useState()

  useEffect(() => {
    getRoles().then(data => setNhomQuyen(data.roles))
  }, []);

  useEffect(() => {
    setVaiTro(account?.manhomquyen)
  }, [account])

  function onCloseModal() {
    if (typeof onHide === 'function') onHide()
  }

  async function onUpdate() {
    const data = {vaitro: +vaitro, mataikhoan: +account?.mataikhoan}
    console.log(data)
    const result = await updateAccount(data)
    console.log(result)
    if (!result.success) return;

    if (typeof onSubmit === 'function') onSubmit()
    if (typeof onHide === 'function') onHide()
  }

  return (
    <Modal {...props} centered size='lg' backdrop="static" scrollable className='_vh-100'>
      <HeaderModalA title="SỬA TÀI KHOẢN "/>

      <ModalBody className='d-flex gap-4 px-5 py-4 _vh-60'>
        <Form className={['w-100 d-flex flex-column gap-5'].join(" ")}>
          <FormGroup className='d-flex gap-5'>
            <FormGroup className='_w-50'>
              <FormLabel className='fw-bold'>Mã nhân viên</FormLabel>
              <InputShadow disabled value={account?.manhanvien}/>
            </FormGroup>

            <FormGroup className='_w-100'>
              <FormLabel className='fw-bold'>Tên nhân viên</FormLabel>
              <InputShadow disabled value={account?.hoten}/>
            </FormGroup>
          </FormGroup>

          <FormGroup className='d-flex gap-5'>
            <FormGroup className='_w-50'>
              <FormLabel className='fw-bold'>Email</FormLabel>
              <InputShadow disabled value={account?.mail}/>
            </FormGroup>
            <FormGroup className='_w-50'>
              <FormLabel className='fw-bold'>Nhóm quyền</FormLabel>
              <InputShadow as={FormSelect} value={vaitro} onChange={e => setVaiTro(e.target.value)}>
                {nhomquyen?.map(({manhomquyen, tenhienthi}, j) =>
                  <option key={j} value={manhomquyen}>{tenhienthi}</option>)}
              </InputShadow>
            </FormGroup>
          </FormGroup>

        </Form>
      </ModalBody>

      <ModalFooter className='justify-content-center p-3 d-flex gap-5'>
        <Button className='_w-20' variant='primary' onClick={onUpdate}>lưu</Button>
        <Button className='_w-20' variant='danger' onClick={onCloseModal}>Hủy</Button>
      </ModalFooter>
    </Modal>
  )
}

function AddTaiKhoanModal({onSubmit, onHide, ...props}) {
  const [nhanVien, setNhanVien] = useState([]);
  const [nhomquyen, setNhomQuyen] = useState([])

  const [filterForm, setFilterForm] = useState("")

  // disabledForm
  const [manhanvien, setMaNhanVien] = useState()
  const [hoten, setHoTen] = useState("")
  const [mail, setMail] = useState("")

  // active Form
  const [matkhau, setMatKhau] = useState("")
  const [vaitro, setVaiTro] = useState("")


  useEffect(() => {
    setUp()
  }, []);

  function setUp() {
    getEmployeeNoAccount().then(data => setNhanVien(data.Data))
    getRoles().then(data => {
      setNhomQuyen(data.roles)
    })
    setMaNhanVien(undefined)
    setHoTen("")
    setMail("")
    setMatKhau("")
    setVaiTro("")
    setNhomQuyen([])
  }

  function onChange(setState, e) {
    setState(e.target.value)
  }

  function onRowClick(data) {
    setMaNhanVien(data?.manhanvien)
    setHoTen(data?.hoten)
    setMail(data?.mail)
  }

  async function onInsert() {
    const result = await insertAccount([{matkhau, vaitro: vaitro || nhomquyen?.[0]?.manhomquyen, nhanvien: manhanvien}])
    if (!result.success) return;

    if (typeof onSubmit === "function") onSubmit()
    setUp()
  }

  function onCloseModal() {
    if (typeof onHide === "function") onHide()
  }

  return (
    <Modal {...props} centered size='xl' backdrop="static" scrollable className='_vh-100'>
      <HeaderModalA title="THÊM TÀI KHOẢN "/>

      <ModalBody className='d-flex gap-4 px-5 py-4 _vh-60'>
        <div className='h-100 d-flex flex-column gap-2 _w-35'>
          <FormGroup className=''>
            <FormLabel className='fw-bold'>Chọn nhân viên</FormLabel>
            <InputShadow value={filterForm} onChange={e => setFilterForm(e.target.value)}/>
          </FormGroup>

          <ContentA className="h-100">
            <TableA subtable index={false} headers={chonNhanVienHD}
                    data={nhanVien.filter(i => (i.hoten + i.mail).includes(filterForm))} onClick={onRowClick}/>
            {/*<div style={{height: "10000px"}}></div>*/}
          </ContentA>
        </div>

        <Form className={['_w-65 d-flex flex-column gap-5'].join(" ")}>
          <FormGroup className='d-flex gap-5'>
            <FormGroup className='_w-50'>
              <FormLabel className='fw-bold'>Mã nhân viên</FormLabel>
              <InputShadow disabled value={manhanvien} onChange={onChange.bind({}, setMaNhanVien)}/>
            </FormGroup>

            <FormGroup className='_w-100'>
              <FormLabel className='fw-bold'>Tên nhân viên</FormLabel>
              <InputShadow disabled value={hoten} onChange={onChange.bind({}, setHoTen)}/>
            </FormGroup>
          </FormGroup>

          <FormGroup className='d-flex gap-5'>
            <FormGroup className='_w-50'>
              <FormLabel className='fw-bold'>Email</FormLabel>
              <InputShadow disabled value={mail} onChange={onChange.bind({}, setMail)}/>
            </FormGroup>

            <FormGroup className='_w-50'>
              <FormLabel className='fw-bold'>Mật khẩu</FormLabel>
              <InputShadow type="password" value={matkhau} onChange={onChange.bind({}, setMatKhau)}/>
            </FormGroup>
          </FormGroup>

          <FormGroup className='d-flex gap-5'>
            <FormGroup className='_w-50'>
              <FormLabel className='fw-bold'>Nhóm quyền</FormLabel>
              <InputShadow as={FormSelect} value={vaitro} onChange={onChange.bind({}, setVaiTro)}>
                {nhomquyen?.map(({manhomquyen, tenhienthi}, j) => <option key={j}
                                                                          value={manhomquyen}>{tenhienthi}</option>)}
              </InputShadow>
            </FormGroup>
          </FormGroup>
        </Form>
      </ModalBody>

      <ModalFooter className='justify-content-center p-3 d-flex gap-5'>
        <Button className='_w-20' variant='primary' onClick={onInsert}>Thêm tài khoản</Button>
        <Button className='_w-20' variant='danger' onClick={onCloseModal}>Hủy</Button>
      </ModalFooter>
    </Modal>
  )
}


export default QuanLyTaiKhoan