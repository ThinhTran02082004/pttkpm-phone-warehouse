import {createContext, useContext, useEffect, useState} from 'react'
import {
  faArrowRotateRight,
  faCirclePlus,
  faMagnifyingGlass,
  faPencil,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import {Button, Form, FormControl, Modal} from 'react-bootstrap'
import SideNavbar from '../../../components/layouts/sideBar'
import ToolBtn from '../../../components/buttons/toolBtn'
import Page2 from '../../../components/layouts/Page2'
import TableA from '../../../components/tables/tableA'
import IconBtn from '../../../components/buttons/iconBtn'
import HeaderModalA from '../../../components/modals/headerA'
import ErrorModal from '../../../components/modals/errorModal'
import FlexForm from '../../../components/Forms/FlexForm'
import colors from '../../../utilities/colors'
import {deleteCustomer, getCustomers, insertCustomer, updateCustomer} from "../../../api/Partners/customers";
import {formatDate} from "../../../utilities/others";
import AlertModal from "../../../components/modals/alertModal";

const KhachHangContext = createContext()

const defaultKhachHang = {
  makhachhang: undefined,
  tenkhachhang: "",
  ngaysinh: new Date().toISOString().split('T')[0],
  diachi: "",
  mail: "",
  sodienthoai: ""
}

const khachHangHeader = [
  {key: "Mã KH", value: "makhachhang"},
  {key: "Tên khách hàng", value: "tenkhachhang"},
  {key: "Ngày sinh", value: "ngaysinh", format: formatDate},
  {key: "Địa chỉ", value: "diachi"},
  {key: "Email", value: "mail"},
  {key: "Số điện thoại", value: "sodienthoai"},
  {key: "Ngày tham gia", value: "ngaythamgia", format: formatDate},
]

function KhachHangForm() {
  const [data, setData] = useContext(KhachHangContext)

  function onDataChange(key, e) {
    setData(src => ({...src, [key]: e.target.value}))
  }

  return (
    <Form className='mx-5 px-5 my-4'>
      <Form.Group className="mb-3">
        <Form.Label className='fw-bold'>Tên khách hàng</Form.Label>
        <Form.Control type="text" value={data.tenkhachhang} onChange={onDataChange.bind({}, "tenkhachhang")}/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className='fw-bold'>Ngày sinh</Form.Label>
        <Form.Control type="date" value={data.ngaysinh} onChange={onDataChange.bind({}, "ngaysinh")}/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className='fw-bold'>Địa chỉ</Form.Label>
        <Form.Control type="text" value={data.diachi} onChange={onDataChange.bind({}, "diachi")}/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className='fw-bold'>Số điện thoại</Form.Label>
        <Form.Control type="email" value={data.sodienthoai} onChange={onDataChange.bind({}, "sodienthoai")}/>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className='fw-bold'>Email</Form.Label>
        <Form.Control type="email" value={data.mail} onChange={onDataChange.bind({}, "mail")}/>
      </Form.Group>
    </Form>
  )
}

function KhachHang() {
  const [modal, setModal] = useState("")
  const [premodal, setPreModal] = useState("")

  function openModal(NewModal) {
    setPreModal(modal)
    setModal(NewModal)
  }

  const [tableData, setTableData] = useState([])

  const [formData, setFormData] = useState({...defaultKhachHang})
  const [rowClick, setRowClick] = useState()

  const [search, setSearch] = useState('')

  useEffect(function () {
    updateTableData()
  }, [])


  function updateTableData() {
    setTableData([])
    getCustomers().then(data => setTableData(data.Data))
  }

  function onRowClick(data) {
    if (data) setRowClick(data)
  }

  function onOpenUpdateModal() {
    if (!rowClick) return openModal("error")

    setFormData({...rowClick})
    openModal("edit")
  }

  async function onInsertKhachHang() {

    const {tenkhachhang, makhachhang, ngaysinh, diachi, mail, sodienthoai} = formData
    if (tenkhachhang.length * diachi.length * mail.length * sodienthoai.length === 0) return openModal("addFail")
    // return
    const result = await insertCustomer([formData])
    if (!result.success) return

    setFormData({...defaultKhachHang})
    updateTableData()
    openModal("addSuccess")
  }

  async function onUpdateKhachHang() {
    const {tenkhachhang, makhachhang, ngaysinh, diachi, mail, sodienthoai} = formData
    if (tenkhachhang.length * diachi.length * mail.length * sodienthoai.length === 0) return openModal("editFail")

    const result = await updateCustomer(formData)
    if (!result.success) return

    setFormData({...defaultKhachHang})
    updateTableData()
    setModal("")
    openModal("editSuccess")
  }

  return (
    <>
      <Page2
        sidebarWidth={20}
        toolbarHeight={15}
        sidebar={<SideNavbar/>}
        tools={<>
          <ToolBtn color={colors.green} icon={faCirclePlus} title="Thêm"
                   onClick={e => {
                     setFormData({...defaultKhachHang})
                     openModal("add")
                   }}/>
          <ToolBtn color={colors.orange_2} icon={faPencil} title="Sửa"
                   onClick={e => {
                     if (!rowClick) return openModal("error")

                     setFormData({...rowClick})
                     openModal("edit")
                   }}/>
          <ToolBtn color={colors.yellow_2} icon={faTrashCan} title="Xóa"
                   onClick={async e => {
                     if (!rowClick) return openModal("error")

                     const result = await deleteCustomer([rowClick])

                     if (!result.success) return

                     setFormData({...defaultKhachHang})
                     updateTableData()
                     openModal("deleteSuccess")
                   }}/>
        </>}
        rightSec={<FlexForm>
          <FormControl className='w-auto' type='text' placeholder='Tìm kiếm' value={search}
                       onChange={e => setSearch(e.target.value)}/>
          <IconBtn className='w-auto btn-primary btn-lg btn-success' icon={faMagnifyingGlass}
                   onClick={e => {
                     setTableData(src => [...src].filter(i => i.tenkhachhang.includes(search)))
                   }}/>
          <IconBtn className='w-auto btn-primary' icon={faArrowRotateRight} title={"Làm mới"}
                   onClick={updateTableData}/>
        </FlexForm>}
        dataTable={<TableA headers={khachHangHeader} data={tableData} onClick={data => {
          console.log(data)
          if (!data) return
          const newOne = {
            diachi: data.diachi,
            mail: data.mail,
            makhachhang: +data.makhachhang,
            ngaysinh: data.ngaysinh.split("T")[0],
            ngaythamgia: data.ngaythamgia.split("T")[0],
            sodienthoai: data.sodienthoai,
            tenkhachhang: data.tenkhachhang,
          }
          setRowClick(newOne)
        }}/>}
      />

      <KhachHangContext.Provider value={[formData, setFormData]}>
        {/* Them khach hang */}
        <Modal show={modal === "add"} centered backdrop="static" size='lg'>
          <HeaderModalA title={"THÊM KHÁCH HÀNG"}/>

          <Modal.Body>
            <KhachHangForm/>
          </Modal.Body>

          <Modal.Footer className='d-flex justify-content-center gap-5 py-3'>
            <Button variant='primary' style={{width: "25%"}} onClick={onInsertKhachHang}>Thêm khách hàng</Button>
            <Button variant='danger' style={{width: "25%"}} onClick={openModal.bind({})}>Hủy bỏ</Button>
          </Modal.Footer>
        </Modal>

        {/* Sua thong tinn khach hang */}
        <Modal show={modal === "edit"} centered backdrop="static" size='lg'>
          <HeaderModalA title={"CHỈNH SỬA KHÁCH HÀNG"}/>

          <Modal.Body>
            <KhachHangForm/>
          </Modal.Body>

          <Modal.Footer className='d-flex justify-content-center gap-5 py-3'>
            <Button variant='primary' style={{width: "25%"}} onClick={onUpdateKhachHang}>Lưu thông tin</Button>
            <Button variant='danger' style={{width: "25%"}} onClick={openModal.bind({})}>Hủy bỏ</Button>
          </Modal.Footer>
        </Modal>

        <ErrorModal show={modal === "error"} onHide={openModal.bind({})}>
          Hãy chọn một khách hàng!!!
        </ErrorModal>

        <AlertModal show={modal === "addSuccess"} message={"Thêm thành công"} onHide={openModal.bind({}, "")}/>
        <AlertModal show={modal === "editSuccess"} message={"Sửa thành công"} onHide={openModal.bind({}, "")}/>
        <AlertModal show={modal === "addFail"} message={"Hãy điền đầy đủ thông tin!!!"}
                    onHide={openModal.bind({}, premodal)}/>
        <AlertModal show={modal === "editFail"} message={"Hãy điền đầy đủ thông tin!!!"}
                    onHide={openModal.bind({}, premodal)}/>
        <AlertModal show={modal === "deleteSuccess"} message={"Xóa thành công!"} onHide={openModal.bind({}, "")}/>
      </KhachHangContext.Provider>
    </>
  )
}


export default KhachHang