import {
  createContext,
  useContext,
  useEffect,
  useState
} from 'react'
import {
  faArrowRotateRight,
  faCirclePlus,
  faMagnifyingGlass,
  faPencil,
  faTrashCan,
  faCircleInfo
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  Button,
  Form,
  FormCheck,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  ModalBody,
  ModalFooter,
  Table
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
import {
  deleteRole,
  getPermissionData,
  getRolePermissions,
  getRoles,
  insertPermission,
  insertRole,
  updateRole
} from "../../../api/Roles/roles";
import ErrorModal from "../../../components/modals/errorModal";
import { removeVietnameseTones } from "../../../utilities/others";

const tableHd = [{ key: "Mã nhóm quyền", value: "manhomquyen" }, { key: "Tên nhóm quyền", value: "tenhienthi" }, { key: "Ghi chú", value: "ghichu" },]


function permToStr({ machucnang, tenchucnang, mahanhdong, tenhanhdong }) {
  return `${machucnang}_${tenchucnang}_${mahanhdong}_${tenhanhdong}`
}

function parsePermissions(permissions = [], value = false) {
  return Object.fromEntries(permissions.map(i => [permToStr(i), value]))
}

function parsePermissionString(str) {
  const [maChucNang, tenChucNang, maHanhDong, tenHanhDong] = str.split('_')
  return { maChucNang: +maChucNang, tenChucNang, maHanhDong: +maHanhDong, tenHanhDong }
}


const FormContext = createContext({})

function PhanQuyen() {
  const [modal, setModal] = useState("")
  const [tableData, setTableData] = useState([])
  const [rowClick, setRowClick] = useState()

  const [editData, setEditData] = useState()
  useEffect(() => {
    updateTableData()
  }, [])


  function updateTableData() {
    setTableData([])
    getRoles().then(data => setTableData(data.roles))
  }

  async function onRowClick(row) {
    // console.log(row)
    setRowClick(row)
  }

  function onOpenAddModal() {
    setModal("add")
    setRowClick()
  }

  function onOpenEditModal() {
    if (!rowClick) return setModal("error")
    setModal("edit")
  }

  async function onInsertPerm({ danhsachquyen, ghichu, tenhienthi, tennhomquyen }) {
    const result = await insertRole([{ tennhomquyen, ghichu, tenhienthi }])
    if (!result.success) return await deleteRole(result.body)

    const perm = await insertPermission(danhsachquyen.map(({ maquyenhan }) => ({ manhomquyen: result.body[0].manhomquyen, maquyenhan })))
    if (!perm.success) return await deleteRole(result.body)

    updateTableData()
  }

  async function onUpdateRole({ danhsachquyen, ...data }) {
    const result = await updateRole(data)
    const perm = await insertPermission(danhsachquyen.map(({ maquyenhan }) => ({ manhomquyen: data.manhomquyen, maquyenhan })))
    if (!result.success || !perm.success) return

    onCloseModal()
    updateTableData()
  }

  async function onDeleteRole() {
    if (!rowClick) return setModal("error")
    const result = await deleteRole([rowClick])

    if (!result.success) return

    updateTableData()
  }

  function onCloseModal() {
    setModal("")
    setEditData({})
  }

  return (<>
    <Page2
      sidebar={<SideNavbar />}
      tools={<>
        <ToolBtn className="_border-green-focus" color={colors.green} icon={faCirclePlus} title="Thêm" onClick={onOpenAddModal} />
        <ToolBtn className="_border-orange-focus-2" color={colors.orange_2} icon={faPencil} title="Sửa" onClick={onOpenEditModal} />
        <ToolBtn className="_border-yellow-focus-2" color={colors.yellow_2} icon={faTrashCan} title="Xóa" onClick={onDeleteRole} />
        <ToolBtn className="_border-blue-focus" color={colors.blue} icon={faCircleInfo} title="Chi tiết"
          onClick={e => {
            if (!rowClick) return setModal("error")
            setModal("open")
          }} />
      </>}
      rightSec={<FlexForm>
        <InputShadow as={FormControl} className="w-auto" placeholder="Tìm kiếm" />
        <Button className='d-flex gap-2 align-items-center px-4 opacity-2' size='lg' variant='success'>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </Button>
        <Button className='d-flex gap-2 align-items-center' variant='primary'>
          <FontAwesomeIcon icon={faArrowRotateRight} />
          <span>Làm mới</span>
        </Button>
      </FlexForm>}
      dataTable={<TableA headers={tableHd} data={tableData} onClick={onRowClick} />}
    />
    <FormContext.Provider value={rowClick}>
      <PermissionModal title="THÊM NHÓM QUYỀN" submitBtn="Thêm nhóm quyền" show={modal === "add"} onSubmit={onInsertPerm} onHide={setModal.bind({}, "")} />
      <PermissionModal title="CHỈNH SỬA NHÓM QUYỀN" submitBtn="Lưu thông tin" show={modal === "edit"} onSubmit={onUpdateRole} onHide={onCloseModal} />
      <PermissionModal title="CHI TIẾT NHÓM QUYỀN" submitBtn="Xác nhận" show={modal === "open"} onSubmit={onUpdateRole} onHide={onCloseModal} disabled />
    </FormContext.Provider>

    <ErrorModal show={modal === 'error'} onHide={setModal.bind({}, "")}>
      <p>Hãy chọn 1 nhóm quyền</p>
    </ErrorModal>
  </>)
}


function PermissionModal({ title, submitBtn, onHide, onSubmit, disabled = false, ...props }) {
  const rowClick = useContext(FormContext)

  const [tenhienthi, setTenHienThi] = useState("")
  const [ghichu, setGhiChu] = useState("")
  const [quyenHan, setQuyenHan] = useState({})

  const [actions, setActions] = useState([])
  const [permissions, setPermissions] = useState([])
  const [features, setFeatures] = useState([])

  useEffect(() => {
    updateInfo()
  }, [rowClick])

  async function updateInfo() {
    setTenHienThi(rowClick?.tenhienthi || "")
    setGhiChu(rowClick?.ghichu || "")

    const { permissions } = rowClick ? await getRolePermissions(rowClick?.manhomquyen) : []

    getPermissionData().then(data => {
      setActions(data.actions)
      setQuyenHan({ ...parsePermissions(data.permissions), ...parsePermissions(permissions, true) })

      setPermissions(data.permissions)
      setFeatures(data.features)
    })
  }

  async function onFormSubmit() {

    await onSubmit({
      manhomquyen: +rowClick?.manhomquyen,
      tenhienthi,
      tennhomquyen: removeVietnameseTones(tenhienthi).replaceAll(' ', '_'),
      ghichu,
      danhsachquyen: Object.entries(quyenHan)
        .filter(i => i[1])
        .map(i => permissions.find(j => permToStr(j) === i[0]))
    })

    await updateInfo()
  }

  return (
    <Modal {...props} scrollable centered backdrop="static" size='xl' className='vh-100'>
      <HeaderModalA title={title} />

      <ModalBody className='d-flex flex-column _vh-60 overflow-auto px-5 py-3'>
        <Form className='d-flex flex-column gap-3 h-100'>
          <FormGroup className='d-flex gap-5'>
            <FormGroup className='w-50'>
              <FormLabel className='fw-bold'>Tên nhóm quyền</FormLabel>
              <InputShadow disabled={disabled} value={tenhienthi} onChange={e => setTenHienThi(e.target.value)} />
            </FormGroup>

            <FormGroup className='w-50'>
              <FormLabel className='fw-bold'>Ghi chú</FormLabel>
              <InputShadow disabled={disabled} value={ghichu} onChange={e => setGhiChu(e.target.value)} />
            </FormGroup>
          </FormGroup>

          <ContentA As={FormGroup} className="h-100">
            <Table borderless className='w-100 bg-light '>
              <thead className='fw-bold text-nowrap '>
                <tr>
                  <th>Danh mục chức năng</th>
                  {actions.map((i, j) => <th key={j} className='text-center px-3'>{i.tenhienthi}</th>)}
                </tr>
              </thead>

              <tbody>
                {features.map((cn, j) => <tr key={j}>
                  <td>{cn.tenhienthi}</td>
                  {actions.map((hd, k) => {
                    const key = permToStr({ ...cn, ...hd })
                    return (
                      <td key={k}>
                        {quyenHan?.[key] != null
                          && <FormCheck
                            disabled={disabled}
                            className='text-center' checked={quyenHan[key]}
                            onChange={e => setQuyenHan(src => ({ ...src, [key]: e.target.checked }))} />}
                      </td>
                    )
                  })}
                </tr>)}
              </tbody>
            </Table>
          </ContentA>
        </Form>
      </ModalBody>

      <ModalFooter className={[disabled ? 'justify-content-end' : 'justify-content-center', ' p-3 d-flex gap-5'].join(" ")}>
        {!disabled && <Button className='_w-18' variant='primary' onClick={onFormSubmit}>{submitBtn}</Button>}
        <Button className={disabled ? '_w-10' : '_w-18'} variant='danger' onClick={onHide}>Hủy</Button>
      </ModalFooter>
    </Modal>
  )
}

export default PhanQuyen