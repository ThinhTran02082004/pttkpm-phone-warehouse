import {createContext, useContext, useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {
  faArrowRotateRight,
  faCirclePlus,
  faFileExcel,
  faFileExport,
  faMagnifyingGlass,
  faPencil,
  faRectangleList,
  faTrashCan
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  Image,
  InputGroup,
  Modal,
  ModalBody,
  ModalFooter
} from 'react-bootstrap'

import SideNavbar from '../../../components/layouts/sideBar'
import ToolBtn from '../../../components/buttons/toolBtn'
import Page2 from '../../../components/layouts/Page2'
import TableA from '../../../components/tables/tableA'
import HeaderModalA from '../../../components/modals/headerA'
import ContentA from '../../../components/layouts/blockContent'
import ErrorModal from '../../../components/modals/errorModal'
import exportExcel from '../../../components/excel'
import FlexForm from '../../../components/Forms/FlexForm'

import colors from '../../../utilities/colors'
import InputShadow from '../../../components/Forms/InputShadow'
import GroupShadow from '../../../components/Forms/GroupShadow'

import {colToName} from "../../../utilities/others";
import {
  deleteProduct,
  getProducts,
  insertProduct,
  updateProduct,
  updateProductImage
} from "../../../api/Products/products";
import {getProductAttributes} from "../../../api/Products/product-attributes";
import {
  deleteConfigure,
  getProductConfigures,
  insertConfigure,
  updateConfigure
} from "../../../api/Products/configures";
import InputGroupText from "react-bootstrap/InputGroupText";
import {getProductFromConfigureState, getProductState} from "../../../api/Warehouse";

const defaultSanPham = {
  madanhmucsanpham: "",
  tendanhmucsanpham: "",
  chipxuly: "",
  dungluongpin: "",
  kichthuongmanhinh: "",
  cameratruoc: "",
  camerasau: "",
  phienbanhedieuhanh: "",
  thoigianbaohanh: "",
  hinhanh: "",
  xuatxu: "",
  hedieuhanh: "",
  thuonghieu: "",
}

const spHeader = [
  {key: "Mã SP", value: "madanhmucsanpham"},
  {key: "Tên sản phẩm", value: "tendanhmucsanpham"},
  {key: "Phiên bản HĐH", value: "phienbanhedieuhanh"},
  {key: "Thương hiệu", value: "tenthuonghieu"},
  {key: "Hệ điều hành", value: "tenhedieuhanh"},
  {key: "Xuất xứ", value: "tenxuatxu"},
  {key: "Tồn kho", value: "tonkho"},

//   hide
  {key: "thuonghieu", value: "thuonghieu", hide: true},
  {key: "hedieuhanh", value: "hedieuhanh", hide: true},
  {key: "xuatxu", value: "xuatxu", hide: true},
  {key: "chipxuly", value: "chipxuly", hide: true},
  {key: "dungluongpin", value: "dungluongpin", hide: true},
  {key: "kichthuongmanhinh", value: "kichthuongmanhinh", hide: true},
  {key: "cameratruoc", value: "cameratruoc", hide: true},
  {key: "camerasau", value: "camerasau", hide: true},
  {key: "thoigianbaohanh", value: "thoigianbaohanh", hide: true},
  {key: "hinhanh", value: "hinhanh", hide: true}
]


const imeiHeader = [
  {key: "IMEI", value: "maimei"},
  {key: "Mã phiếu nhập", value: "phieunhap"},
  {key: "Mã phiếu xuất", value: "phieuxuat"},
  {key: "Tình trạng", value: "tentinhtrang"},
]

const defaultCauHinh = {
  macauhinh: undefined, ram: "", rom: "", mausac: "", gianhap: "", giaxuat: ""
}
const chHeader = [
  {key: "RAM", value: "dungluongram"},
  {key: "ROM", value: "dungluongrom"},
  {key: "Màu sắc", value: "tenmausac"},
  {key: "Giá nhập", value: "gianhap"},
  {key: "Giá xuất", value: "giaxuat"},
  {key: "macauhinh", value: "macauhinh", hide: true},
  {key: "ram", value: "ram", hide: true},
  {key: "rom", value: "rom", hide: true},
  {key: "mausac", value: "mausac", hide: true},
]

const SanPhamContext = createContext({})

async function getSanPhamFormData() {
  return Object.fromEntries(await Promise
    .all(
      ['xuatxu', 'thuonghieu', 'hedieuhanh', 'ram', 'rom', 'mausac']
        .map(async i => [i, await getProductAttributes(i).then(i => i.Data)])
    ));
}

function SanPham() {
  const [modal, setModal] = useState("");
  const [table, setTable] = useState([])
  const [rowClick, setRowClick] = useState()

  const [formData, setFormData] = useState()

  useEffect(function () {
    getSPData();
    getSanPhamFormData().then(setFormData)
  }, [])

  async function getSPData() {
    setTable([])
    getProducts().then(data => setTable(data.Data))
  }

  function onImportExcel() {
    const elem = document.getElementById("input-xlms")
    elem.click()
    const file = elem.value
  }

  function onExportExcel() {
    const result = table.map(i => Object.fromEntries(Object.entries(i).map(([key, value]) => [colToName[key], value])))
    exportExcel(result, "sản phẩm")
  }

  async function onOpenUpdateModal() {
    if (!rowClick) return setModal("error")
    setModal("edit")
  }

  function onOpenImei() {
    if (!rowClick) return setModal("error")
    setModal("imei")

  }

  async function onInsert() {
    await getSPData()
  }

  async function onUpdate() {
    await getSPData()
  }

  async function onDelete() {
    if (!rowClick) return setModal("error")
    const result = await deleteProduct([rowClick])

    if (!result.success) return;

    setRowClick(undefined)
    await getSPData()
  }

  return (<>
    <Page2
      sidebar={<SideNavbar/>}
      tools={<>
        <FormControl id='input-xlms' className='d-none'/>
        <ToolBtn className="_border-green-focus" color={colors.green} icon={faCirclePlus} title="Thêm"
                 onClick={e => {
                   setModal("add")
                 }}/>
        <ToolBtn className="_border-orange-focus-2" color={colors.orange_2} icon={faPencil} title="Sửa"
                 onClick={onOpenUpdateModal}/>
        <ToolBtn className="_border-yellow-focus-2" color={colors.yellow_2} icon={faTrashCan} title="Xóa"
                 onClick={onDelete}/>
        <ToolBtn className="_border-blue-focus" color={colors.blue} icon={faRectangleList} title="Xem ds  "
                 onClick={onOpenImei}/>
        <ToolBtn className="_border-green-focus" color={colors.green} icon={faFileExcel} title="Nhập Excel"
                 onClick={onImportExcel}/>
        <ToolBtn className="_border-green-focus" color={colors.green} icon={faFileExport} title="Xuất Excel"
                 onClick={onExportExcel}/>
      </>}
      rightSec={<FlexForm>
        <InputShadow as={FormControl} className="w-auto" placeholder="Tìm kiếm"/>
        <Button className='d-flex gap-2 align-items-center px-4 opacity-2' size='lg' variant='success'>
          <FontAwesomeIcon icon={faMagnifyingGlass}/>
        </Button>
        <Button className='d-flex gap-2 align-items-center text-nowrap' variant='primary' onClick={getSPData}>
          <FontAwesomeIcon icon={faArrowRotateRight}/>
          <span>Làm mới</span>
        </Button>
      </FlexForm>}
      dataTable={<TableA headers={spHeader} data={table?.slice(0, 100)} onClick={setRowClick}/>}
    />

    <SanPhamContext.Provider value={[rowClick, setRowClick]}>
      {/* Add SanPham */}
      <InsertSanPhamModal formData={formData} show={modal === 'add'} onSubmit={onInsert}
                          onHide={setModal.bind({}, "")}/>

      {/* Update SanPham */}
      <UpdateSanPhamModal formData={formData} show={modal === 'edit'} onSubmit={onUpdate}
                          onHide={setModal.bind({}, "")}/>

      {/* IMEI */}
      <ImeiModal show={modal === 'imei'} onHide={setModal.bind({}, "")}/>
    </SanPhamContext.Provider>

    <ErrorModal show={modal === "error"} onHide={setModal.bind({}, "")}>
      Phải chọn 1 sản phẩm!!!
    </ErrorModal>
  </>)
}


function InsertSanPhamModal({onHide, onSubmit, formData, ...props}) {
  const [modal, setModal] = useState()
  const [data, setData] = useState({...defaultSanPham})

  useEffect(() => {
    if (props.show) setData({...defaultSanPham})
  }, [props.show]);

  async function onInsert() {
    if (data.madanhmucsanpham) {
      await updateProduct(data)
      setModal('cauHinh')
      return
    }

    let result = await insertProduct([data])
    console.log(result)

    if (!result.success || result.Data.length === 0) return;

    setData(result.Data[0])
    if (typeof onSubmit === 'function') onSubmit()
    setModal('cauHinh')
  }

  async function onClose() {
    await deleteProduct(data)
    if (typeof onHide === 'function') onHide()
  }

  return (<>
    <Modal {...props} scrollable centered size='xl' backdrop="static">
      <HeaderModalA title={"THÊM SẢN PHẨM MỚI"}/>

      <ModalBody>
        <SanPhamForm {...formData} data={data} setData={setData}/>
      </ModalBody>

      <ModalFooter className='justify-content-center gap-5'>
        <Button variant='primary' style={{width: "15%"}} onClick={onInsert}>Tạo cấu hình</Button>
        <Button variant='danger' style={{width: "15%"}} onClick={onClose}>Hủy bỏ</Button>
      </ModalFooter>
    </Modal>

    <CauHinhModal {...formData}
                  sanPham={data}
                  show={modal === 'cauHinh'}
                  onSubmit={onHide}
                  onModalHide={setModal.bind({}, "")}/>
  </>)
}

function UpdateSanPhamModal({onHide, onSubmit, formData, ...prop}) {
  const [rowClick,] = useContext(SanPhamContext)
  const [modal, setModal] = useState("")
  const [data, setData] = useState()

  useEffect(() => {
    setData(rowClick)
  }, [rowClick])

  async function onUpdate() {
    const result = await updateProduct(data)

    if (typeof data?.hinhanh !== 'string') await updateProductImage(data)

    if (!result.success) return;

    if (typeof onSubmit === 'function') onSubmit()
    if (typeof onHide === 'function') onHide()
  }

  return (<>
    <Modal {...prop} scrollable centered size='xl' backdrop="static">
      <HeaderModalA title={"CHỈNH SỬA SẢN PHẨM MỚI"}/>

      <ModalBody>
        <SanPhamForm {...formData} data={data} setData={setData}/>
      </ModalBody>

      <ModalFooter className='justify-content-center gap-5'>
        <Button variant='primary' style={{width: "15%"}} onClick={onUpdate}>Lưu thông tin</Button>
        <Button variant='warning' style={{width: "15%"}} onClick={setModal.bind({}, "cauHinh")}>Sửa cấu hình</Button>
        <Button variant='danger' style={{width: "15%"}} onClick={onHide}>Hủy bỏ</Button>
      </ModalFooter>
    </Modal>

    <CauHinhModal {...formData} sanPham={data} show={modal === 'cauHinh'} onModalHide={setModal.bind({}, "")}/>
  </>)
}


function SanPhamForm({data, setData, xuatxu = [], hedieuhanh = [], thuonghieu = []}) {
  useEffect(() => {
    setData(data => ({
      ...data,
      xuatxu: xuatxu[0]?.maxuatxu,
      hedieuhanh: hedieuhanh[0]?.mahedieuhanh,
      thuonghieu: thuonghieu[0]?.mathuonghieu
    }))
  }, [xuatxu, hedieuhanh, thuonghieu])

  function onDataChange(key, e) {
    if (key !== 'hinhanh') return setData(src => ({...src, [key]: e.target.value}))
    setData(src => ({...src, [key]: e.target.files[0]}))
  }

  return (<Form className='d-flex gap-5 mx-5 justify-content-center'>
    <FormGroup className='d-flex flex-column gap-3 ' style={{width: "40%"}}>
      <InputShadow type='file' onChange={onDataChange.bind({}, "hinhanh")}/>
      <Image className='w-100 h-100 shadow'
             src={typeof data?.hinhanh === 'string' ? data.hinhanh : data?.hinhanh && URL.createObjectURL(data.hinhanh)}/>
      {/*src={img}*/}
    </FormGroup>
    <FormGroup className='d-flex gap-4 flex-wrap w-100'>
      <FormGroup className=' my-3' style={{width: "30%"}}>
        <FormLabel className='fs-6 fw-bold'>Tên sản phẩm</FormLabel>
        <InputShadow type='text' value={data?.tendanhmucsanpham} onChange={onDataChange.bind({}, "tendanhmucsanpham")}/>
      </FormGroup>

      <FormGroup className=' my-3' style={{width: "30%"}}>
        <FormLabel className='fs-6 fw-bold'>Xuất xứ</FormLabel>
        <InputShadow as={FormSelect} value={data?.xuatxu} onChange={onDataChange.bind({}, "xuatxu")}>
          {xuatxu?.slice(0, 50).map((i, j) => <option key={j} value={i.maxuatxu}>{i.tenxuatxu}</option>)}
        </InputShadow>
      </FormGroup>

      <FormGroup className=' my-3' style={{width: "30%"}}>
        <FormLabel className='fs-6 fw-bold'>Chip xử lý</FormLabel>
        <InputShadow type='text' value={data?.chipxuly} onChange={onDataChange.bind({}, "chipxuly")}/>
      </FormGroup>

      <FormGroup className=' my-3' style={{width: "30%"}}>
        <FormLabel className='fs-6 fw-bold'>Dung lượng pin</FormLabel>
        <GroupShadow>
          <FormControl type='number' min={0} value={data?.dungluongpin}
                       onChange={onDataChange.bind({}, "dungluongpin")}/>
          <InputGroup.Text>mAh</InputGroup.Text>
        </GroupShadow>
      </FormGroup>

      <FormGroup className=' my-3' style={{width: "30%"}}>
        <FormLabel className='fs-6 fw-bold'>Kích thước màn</FormLabel>
        <GroupShadow>
          <FormControl type='number' min={0} value={data?.kichthuongmanhinh}
                       onChange={onDataChange.bind({}, "kichthuongmanhinh")}/>
          <InputGroup.Text>inch</InputGroup.Text>
        </GroupShadow>
      </FormGroup>

      <FormGroup className=' my-3' style={{width: "30%"}}>
        <FormLabel className='fs-6 fw-bold'>Camera trước</FormLabel>
        <GroupShadow>
          <FormControl type='number' min={0} value={data?.cameratruoc} onChange={onDataChange.bind({}, "cameratruoc")}/>
          <InputGroup.Text>MP</InputGroup.Text>
        </GroupShadow>
      </FormGroup>

      <FormGroup className=' my-3' style={{width: "30%"}}>
        <FormLabel className='fs-6 fw-bold'>Camera sau</FormLabel>
        <GroupShadow>
          <FormControl type='number' min={0} value={data?.camerasau} onChange={onDataChange.bind({}, "camerasau")}/>
          <InputGroup.Text>MP</InputGroup.Text>
        </GroupShadow>
      </FormGroup>

      <FormGroup className=' my-3' style={{width: "30%"}}>
        <FormLabel className='fs-6 fw-bold'>Hệ điều hành</FormLabel>
        <InputShadow as={FormSelect} value={data?.hedieuhanh} onChange={onDataChange.bind({}, "hedieuhanh")}>
          {hedieuhanh?.slice(0, 50).map((i, j) => <option key={j} value={i.mahedieuhanh}>{i.tenhedieuhanh}</option>)}
        </InputShadow>
      </FormGroup>

      <FormGroup className=' my-3' style={{width: "30%"}}>
        <FormLabel className='fs-6 fw-bold'>Phiên bản hệ điều hành</FormLabel>
        <InputShadow type='text' value={data?.phienbanhedieuhanh}
                     onChange={onDataChange.bind({}, "phienbanhedieuhanh")}/>
      </FormGroup>

      <FormGroup className=' my-3' style={{width: "30%"}}>
        <FormLabel className='fs-6 fw-bold'>Thời gian bảo hành</FormLabel>
        <GroupShadow>
          <FormControl type='number' min={0} value={data?.thoigianbaohanh}
                       onChange={onDataChange.bind({}, "thoigianbaohanh")}/>
          <InputGroup.Text>Tháng</InputGroup.Text>
        </GroupShadow>
      </FormGroup>

      <FormGroup className=' my-3' style={{width: "30%"}}>
        <FormLabel className='fs-6 fw-bold'>Thương hiệu</FormLabel>
        <InputShadow as={FormSelect} value={data?.thuonghieu} onChange={onDataChange.bind({}, "thuonghieu")}>
          {thuonghieu?.slice(0, 50).map((i, j) => <option key={j} value={i.mathuonghieu}>{i.tenthuonghieu}</option>)}
        </InputShadow>
      </FormGroup>
    </FormGroup>
  </Form>)
}

function CauHinhModal({sanPham, onSubmit, onModalHide, show, ram = [], rom = [], mausac = [],}) {
  const [data, setData] = useState({...defaultCauHinh})
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    resetCauHinh()
    updateInfo()
  }, [sanPham])

  function resetCauHinh() {
    setData({
      macauhinh: undefined,
      ram: ram[0]?.maram,
      rom: rom[0]?.marom,
      mausac: mausac[0]?.mamausac,
      gianhap: "",
      giaxuat: ""
    })
  }

  function updateInfo() {
    setTableData([])
    getProductConfigures(sanPham?.madanhmucsanpham).then(data => setTableData(data.Data))
  }

  function onHide() {
    if (tableData.length === 0) return
    if (typeof onModalHide === 'function') onModalHide();
  }

  function onDataChange(key, e) {
    setData(src => ({...src, [key]: e.target.value}))
  }

  async function onInsertCauHinh() {
    const configure = {danhmucsanpham: sanPham.madanhmucsanpham, ...data}
    const result = await insertConfigure([configure])

    if (!result.success) return;

    updateInfo();
    resetCauHinh()
  }

  async function onUpdateCauHinh() {
    const configure = {danhmucsanpham: sanPham.madanhmucsanpham, ...data}
    const result = await updateConfigure(configure)

    if (!result.success) return;

    updateInfo();
    resetCauHinh()
  }

  async function onDeleteCauHinh() {
    const result = await deleteConfigure([data])

    if (!result.success) return
    // return
    updateInfo();
    resetCauHinh()
  }

  function onFormSubmit() {
    if (tableData.length === 0) return;

    onModalHide()
    if (typeof onSubmit === 'function') onSubmit();
  }

  return (<Modal show={show} scrollable size='xl' centered backdrop="static">
    <HeaderModalA title="TẠO CẤU HÌNH"/>

    <ModalBody className='d-flex p-5 flex-column gap-4'>
      <Form className='d-flex justify-content-between gap-4'>
        <FormGroup className='flex-grow-1'>
          <FormLabel className='fw-bold'>RAM</FormLabel>
          <GroupShadow>
            <FormSelect value={data?.ram} onChange={onDataChange.bind({}, "ram")}>
              {ram.map((i, j) => <option key={j} value={i.maram}>{i.dungluongram}</option>)}
            </FormSelect>
            <InputGroupText>GB</InputGroupText>
          </GroupShadow>
        </FormGroup>

        <FormGroup className='flex-grow-1'>
          <FormLabel className='fw-bold'>ROM</FormLabel>
          <GroupShadow>
            <FormSelect value={data?.rom} onChange={onDataChange.bind({}, "rom")}>
              {rom.map((i, j) => <option key={j} value={i.marom}>{i.dungluongrom}</option>)}
            </FormSelect>
            <InputGroupText>GB</InputGroupText>
          </GroupShadow>
        </FormGroup>


        <FormGroup className='flex-grow-1'>
          <FormLabel className='fw-bold'>Màu sắc</FormLabel>

          <InputShadow as={FormSelect} value={data?.mausac} onChange={onDataChange.bind({}, "mausac")}>
            {mausac.map((i, j) => <option key={j} value={i.mamausac}>{i.tenmausac}</option>)}
          </InputShadow>
        </FormGroup>

        <FormGroup className='shadow-1 flex-grow-1'>
          <FormLabel className='fw-bold'>Giá nhập</FormLabel>
          <InputGroup className='shadow-sm'>
            <FormControl type='number' value={data?.gianhap} onChange={onDataChange.bind({}, "gianhap")}/>
            <InputGroup.Text>VNĐ</InputGroup.Text>
          </InputGroup>
        </FormGroup>

        <FormGroup className='flex-grow-1'>
          <FormLabel className='fw-bold'>Giá xuất</FormLabel>
          <GroupShadow className='shadow-sm'>
            <FormControl type='number' value={data?.giaxuat} onChange={onDataChange.bind({}, "giaxuat")}/>
            <InputGroup.Text>VNĐ</InputGroup.Text>
          </GroupShadow>
        </FormGroup>
      </Form>

      <div className='d-flex gap-4' style={{height: "40vh"}}>
        <ContentA style={{width: "80%"}}>
          <TableA index headers={chHeader} data={tableData} onClick={setData}/>
        </ContentA>
        <div className='d-flex flex-column justify-content-around flex-grow-1'>
          <Button className='py-2 fw-semibold shadow-sm' variant='primary' onClick={onInsertCauHinh}>Thêm cấu
            hình</Button>
          <Button className='py-2 fw-semibold shadow-sm' variant='warning' onClick={onUpdateCauHinh}>Sửa cấu
            hình</Button>
          <Button className='py-2 fw-semibold shadow-sm' variant='danger' onClick={onDeleteCauHinh}>Xóa cấu
            hình</Button>
          <Button className='py-2 fw-semibold shadow-sm' variant='success' onClick={updateInfo}>Làm mới</Button>
        </div>
      </div>
    </ModalBody>

    <ModalFooter className='justify-content-center gap-5'>
      <Button className="shadow-sm" variant='primary' style={{width: "15%"}} onClick={onFormSubmit}>Tạo cấu
        hình</Button>
      <Button className="shadow-sm" variant='danger' style={{width: "15%"}} onClick={onHide}>Hủy bỏ</Button>
    </ModalFooter>
  </Modal>)
}

function ImeiModal({onHide, ...prop}) {
  const [rowClick] = useContext(SanPhamContext)

  const [data, setData] = useState({})
  const [form, setForm] = useState({macauhinh: "", matinhtrang: ""})
  const [table, setTable] = useState([])

  useEffect(() => {
    setForm({macauhinh: "*", matinhtrang: "*"})
    getProductFromConfigureState({...form, madanhmucsanpham: rowClick?.madanhmucsanpham})
      .then(({Data}) => setTable(Data))
  }, []);

  useEffect(() => {
    if (!rowClick) return
    getProductConfigures(rowClick.madanhmucsanpham).then(data => setData(src => ({...src, cauhinh: data.Data})))
    getProductState().then(data => setData(src => ({...src, trangthai: data.Data})))
  }, [rowClick])

  useEffect(() => {
    getProductFromConfigureState({...form, madanhmucsanpham: rowClick?.madanhmucsanpham})
      .then(({Data}) => setTable(Data))
  }, [form]);

  return (<Modal {...prop} scrollable size="xl" centered>
    <HeaderModalA title="DANH SÁCH IMEI"/>

    <ModalBody className='d-flex p-5 flex-column'>
      <Form className='d-flex justify-content-between gap-4 mb-3'>
        <FormGroup className='flex-grow-1'>
          <FormLabel className='fw-bold'>Phiên bản</FormLabel>
          <InputShadow as={FormSelect}
                       value={form.macauhinh}
                       onChange={e => setForm(src => ({...src, macauhinh: e.target.value}))}>
            <option value='*'>Tất cả</option>
            {data.cauhinh?.map((i, j) => <option key={j}
                                                 value={i.macauhinh}>{`${i.dungluongrom}GB - ${i.dungluongram}GB - ${i.tenmausac}`}</option>)}
          </InputShadow>
        </FormGroup>

        <FormGroup className='flex-grow-1'>
          <FormLabel className='fw-bold'>Tình trạng</FormLabel>
          <InputShadow as={FormSelect}
                       value={form.matinhtrang}
                       onChange={e => setForm(src => ({...src, matinhtrang: e.target.value}))}>
            <option value='*'>Tất cả</option>
            {data.trangthai?.map((i, j) => <option key={j} value={i.matinhtrang}>{i.tenhienthi}</option>)}
          </InputShadow>
        </FormGroup>

        <FormGroup className='flex-grow-1'>
          <FormLabel className='fw-bold'>Tìm kiếm</FormLabel>
          <InputShadow type='text'/>
        </FormGroup>
      </Form>

      <ContentA style={{height: "40vh"}}>
        <TableA index headers={imeiHeader} data={table}/>
      </ContentA>
    </ModalBody>

    <ModalFooter className='justify-content-center'>
      <Button variant='danger' style={{width: "15%"}} onClick={onHide}>Đóng</Button>
    </ModalFooter>
  </Modal>)
}

export default SanPham;