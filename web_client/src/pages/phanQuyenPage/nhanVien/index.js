import {createContext, useContext, useEffect, useState} from 'react'
import {UserContext} from "../../../api/authentication";
import {
  faArrowRotateRight,
  faCirclePlus,
  faFileExcel,
  faFileExport,
  faMagnifyingGlass,
  faPencil,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import {Button, Form, FormControl, FormSelect, Modal} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import InputShadow from '../../../components/Forms/InputShadow'
import TableA from '../../../components/tables/tableA'
import Page2 from '../../../components/layouts/Page2'
import SideNavbar from '../../../components/layouts/sideBar'
import ToolBtn from '../../../components/buttons/toolBtn'
import FlexForm from '../../../components/Forms/FlexForm'
import colors from '../../../utilities/colors'
import HeaderModalA from '../../../components/modals/headerA'
import {deleteEmployee, getEmployees, insertEmployee, updateEmployee} from "../../../api/Roles/employees";
import ErrorModal from "../../../components/modals/errorModal";
import {formatDate} from "../../../utilities/others";
import AlertModal from "../../../components/modals/alertModal";

const nhanVienContext = createContext()

const nhanVienHeader = [
  {key: "Mã NV", value: "manhanvien", format: t => "NV-" + t},
  {key: "Tên nhân viên", value: "hoten"},
  {key: "Giới tính", value: "gioitinh"},
  {key: "Ngày sinh", value: "ngaysinh", format: formatDate},
  {key: "Email", value: "mail"},
  {key: "Số điện thoại", value: "sodienthoai"},
  {key: "Vai trò", value: "tenhienthi"},
  {key: "tennhomquyen", value: "tennhomquyen", hide: true},
]
const defaultNhanVien = {
  manhanvien: "", hoten: "", gioitinh: "Nam", ngaysinh: "", mail: "", sodienthoai: ""
}

function NhanVien() {
  const {perm} = useContext(UserContext)

  const [modal, setModal] = useState("")
  const [premodal, setPreModal] = useState("")

  function openModal(NewModal) {
    if (NewModal === '') setRowClick(undefined)
    setPreModal(modal)
    setModal(NewModal)
  }

  const [formData, setFormData] = useState({...defaultNhanVien})
  const [rowClick, setRowClick] = useState()

  const [tableData, setTableData] = useState()

  const [search, setSearch] = useState('')

  useEffect(() => {
    updateTableData()
  }, []);

  function updateTableData() {
    setTableData([])
    getEmployees().then(data => setTableData(data.Data))
  }

  async function onRowClick(row) {

    if (row) row.ngaysinh = row?.ngaysinh?.split("T")[0]
    setRowClick(row);
  }

  async function onOpenEditModal() {
    if (!rowClick) return setModal("error")
    setFormData(rowClick)

    setModal("edit")
  }


  async function onInsert() {
    const result = await insertEmployee([formData])
    if (!result?.success) return openModal("addFail")

    setFormData({...defaultNhanVien})
    updateTableData()
    openModal("insertSuccess")
  }

  async function onUpdate() {
    const result = await updateEmployee(formData)

    if (!result?.success) return openModal("editFail")

    setFormData({...defaultNhanVien})
    updateTableData()
    setModal('')
    openModal("editSuccess")
  }

  async function onDelete() {
    console.log(rowClick)

    if (!rowClick) return setModal("error")
    const result = await deleteEmployee([rowClick])

    if (!result.success) return openModal("deleteFail")

    setFormData({...defaultNhanVien})
    setRowClick(undefined)
    updateTableData()
    openModal("deleteSuccess")
  }

  return (
    <>
      <Page2
        sidebar={<SideNavbar/>}
        tools={<>
          {/*Them btn*/}
          <ToolBtn
            className={[
              // !perm.find(i => i.tenHanhDong === 'Them' && i.tenChucNang === 'QuanLyNhanVien') && 'pe-none opacity-50',
              "_border-green-focus"
            ].join(' ')}
            color={colors.green} icon={faCirclePlus} title="Thêm" onClick={e => {
            setFormData({...defaultNhanVien})
            openModal("add")
          }}/>

          {/*Sua btn*/}
          <ToolBtn
            className={[
              // !perm.find(i => i.tenHanhDong === 'Sua' && i.tenChucNang === 'QuanLyNhanVien') && 'pe-none opacity-50',
              "_border-orange-focus-2"
            ].join(' ')}
            color={colors.orange_2} icon={faPencil} title="Sửa" onClick={onOpenEditModal}/>

          {/*Xoa btn*/}
          <ToolBtn
            className={[
              // !perm.find(i => i.tenHanhDong === 'Xoa' && i.tenChucNang === 'QuanLyNhanVien') && 'pe-none opacity-50',
              "_border-yellow-focus-2"
            ].join(' ')}
            color={colors.yellow_2} icon={faTrashCan} title="Xóa" onClick={onDelete}/>

          {/*NhapFile btn*/}
          <ToolBtn
            className={[
              // !perm.find(i => i.tenHanhDong === 'NhapFile' && i.tenChucNang === 'QuanLyNhanVien') && 'pe-none opacity-50',
              "_border-green-focus"
            ].join(' ')}
            color={colors.green} icon={faFileExcel} title="Nhập Excel"/>

          {/*XuatFile btn*/}
          <ToolBtn
            className={[
              // !perm.find(i => i.tenHanhDong === 'XuatFile' && i.tenChucNang === 'QuanLyNhanVien') && 'pe-none opacity-50',
              "_border-green-focus"
            ].join(' ')}
            color={colors.green} icon={faFileExport} title="Xuất Excel"/>
        </>}
        rightSec={<FlexForm>
          <InputShadow as={FormControl} className="w-auto" placeholder="Tìm kiếm"
                       value={search} onChange={e => {
            setSearch(e.target.value)
          }}/>
          <Button className='d-flex gap-2 align-items-center px-4 opacity-2' size='lg' variant='success'
                  onClick={async e => {
                    // const table = [...tableData]
                    // console.log(table)
                    const result = await getEmployees()
                    setTableData(result.Data.filter(i => i.hoten.includes(search)))
                  }}>
            <FontAwesomeIcon icon={faMagnifyingGlass}/>
          </Button>
          <Button className='d-flex gap-2 align-items-center' variant='primary'>
            <FontAwesomeIcon icon={faArrowRotateRight}/>
            <span className="text-nowrap">Làm mới</span>
          </Button>
        </FlexForm>
        }
        dataTable={<TableA headers={nhanVienHeader} data={tableData} onClick={onRowClick}/>}
      />
      <nhanVienContext.Provider value={[formData, setFormData]}>
        {/* Them khach hang */}
        {perm.find(i => i.tenHanhDong === 'Them' && i.tenChucNang === 'QuanLyNhanVien')
          || <Modal show={modal === "add"} centered backdrop="static" size='lg'>
            <HeaderModalA title={"THÊM NHÂN VIÊN"}/>

            <Modal.Body>
              <NhanVienForm/>
            </Modal.Body>

            <Modal.Footer className='d-flex justify-content-center gap-5 py-3'>
              <Button variant='primary' style={{width: "25%"}} onClick={onInsert}>Thêm nhân viên</Button>
              <Button variant='danger' style={{width: "25%"}} onClick={openModal.bind({}, "")}>Hủy
                bỏ</Button>
            </Modal.Footer>
          </Modal>}

        {/* Sua thong tin khach hang */}
        {perm.find(i => i.tenHanhDong === 'Sua' && i.tenChucNang === 'QuanLyNhanVien')
          || <Modal show={modal === "edit"} centered backdrop="static" size='lg'>
            <HeaderModalA title={"CHỈNH SỬA NHÂN VIÊN"}/>

            <Modal.Body>
              <NhanVienForm/>
            </Modal.Body>

            <Modal.Footer className='d-flex justify-content-center gap-5 py-3'>
              <Button variant='primary' style={{width: "25%"}} onClick={onUpdate}>Lưu thông tin</Button>
              <Button variant='danger' style={{width: "25%"}} onClick={openModal.bind({}, "")}>Hủy
                bỏ</Button>
            </Modal.Footer>
          </Modal>}

        <ErrorModal show={modal === "error"} onHide={openModal.bind(({}, ""))}>
          <p>Phải chọn 1 nhân viên</p>
        </ErrorModal>

        <AlertModal show={modal === "insertSuccess"} message={"Thêm thành công"} onHide={openModal.bind({}, "")}/>
        <AlertModal show={modal === "editSuccess"} message={"Sửa thành công"} onHide={openModal.bind({}, "")}/>
        <AlertModal show={modal === "addFail"} message={"Hãy điền đầy đủ thông tin!!!"}
                    onHide={openModal.bind({}, premodal)}/>
        <AlertModal show={modal === "editFail"} message={"Hãy kiểm tra lại thông tin đã điền!!!"}
                    onHide={openModal.bind({}, premodal)}/>
        <AlertModal show={modal === "deleteSuccess"} message={"Xóa thành công!"} onHide={openModal.bind({}, "")}/>
        <AlertModal show={modal === "deleteFail"} message={"Xóa thất bại!"} onHide={openModal.bind({}, "")}/>
      </nhanVienContext.Provider>
    </>
  )
}


function NhanVienForm() {
  const [data, setData] = useContext(nhanVienContext)

  function onDataChange(key, e) {
    setData(src => ({...src, [key]: e.target.value}))
  }

  return (
    <Form className='mx-5 px-5 my-4'>
      {/*Tên nhân viên*/}
      <Form.Group className="mb-3">
        <Form.Label className='fw-bold'>Tên nhân viên</Form.Label>
        <Form.Control type="text" value={data.hoten} onChange={onDataChange.bind({}, "hoten")}/>
      </Form.Group>

      {/*Giới tính*/}
      <Form.Group className="mb-3">
        <Form.Label className='fw-bold'>Giới tính</Form.Label>
        <InputShadow as={FormSelect} value={data.gioitinh} onChange={onDataChange.bind({}, "gioitinh")}>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </InputShadow>
      </Form.Group>

      {/*Ngày sinh*/}
      <Form.Group className="mb-3">
        <Form.Label className='fw-bold'>Ngày sinh</Form.Label>
        <Form.Control type="date" value={data.ngaysinh} onChange={onDataChange.bind({}, "ngaysinh")}/>
      </Form.Group>

      {/*Số điện thoại*/}
      <Form.Group className="mb-3">
        <Form.Label className='fw-bold'>Số điện thoại</Form.Label>
        <Form.Control type="email" value={data.sodienthoai} onChange={onDataChange.bind({}, "sodienthoai")}/>
      </Form.Group>

      {/*Email*/}
      <Form.Group className="mb-3">
        <Form.Label className='fw-bold'>Email</Form.Label>
        <Form.Control type="email" value={data.mail} onChange={onDataChange.bind({}, "mail")}/>
      </Form.Group>
    </Form>
  )
}

export default NhanVien