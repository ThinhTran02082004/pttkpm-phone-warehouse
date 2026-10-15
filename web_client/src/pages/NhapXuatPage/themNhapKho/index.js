import {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faMagnifyingGlass, faPlus} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ButtonGroup,
  CloseButton,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  FormSelect,
  InputGroup,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalBody,
  ModalHeader
} from 'react-bootstrap'

import SideNavbar from '../../../components/layouts/sideBar'
import TableA from '../../../components/tables/tableA'
import BarCodeScanner from '../../../components/barcode'
import Page4 from '../../../components/layouts/Page4'
import InputShadow from '../../../components/Forms/InputShadow'
import GroupShadow from '../../../components/Forms/GroupShadow'
import {getProductHasConfigure} from "../../../api/Products/products";
import {getSuppliers} from "../../../api/Partners/suppliers";
import {getFreeImport, updateImport} from "../../../api/Warehouse/imports";
import {getProductConfigures} from "../../../api/Products/configures";
import {getEmployees} from "../../../api/Roles/employees";
import {insertProduct} from "../../../api/Warehouse";

const spHeader = [
  {key: "Mã SP", value: "madanhmucsanpham"},
  {key: "Tên sp", value: "tendanhmucsanpham"},
  {key: "RAM", value: "dungluongram"},
  {key: "ROM", value: "dungluongrom"},
  {key: "Màu sắc", value: "tenmausac"},
  {key: "Đơn giá", value: "gianhap"},
  {key: "Số lượng", value: "soluong"},
  {key: "cauhinh", value: "cauhinh", hide: true},
]

const khoHeader = [
  {key: "Tên sp", value: "tendanhmucsanpham"},
  {key: "Số lượng tồn kho", value: "tonkho"},
  {key: "madanhmucsanpham", value: "madanhmucsanpham", hide: true}
]

const defaultData = {
  madanhmucsanpham: "",
  tendanhmucsanpham: "",
  sanpham: [],
  nhacungcap: [],
  cauhinh: [],
  sanphamthem: [],
}
const defaultForm = {
  madanhmucsanpham: "",
  tendanhmucsanpham: "",
  nhacungcap: "",
  macauhinh: "",
  gianhap: ""
}

function ThemNhapKho() {
  const [modal, setModal] = useState("")
  const [data, setData] = useState({...defaultData})
  const [form, setForm] = useState({...defaultForm})

  const [btnState, setBtnState] = useState(true)

  const [imei, setImei] = useState([])
  const [sanPhamThem, setSanPhamThem] = useState([])

  useEffect(() => {
    reset()
  }, [])


  function reset() {
    setData({...defaultData})
    setForm({...defaultForm})

    getProductHasConfigure().then(({Data}) => setData(data => ({...data, sanpham: Data})))
    getSuppliers().then(({Data}) => {
      setData(data => ({...data, nhacungcap: Data}))
      setForm(src => ({...src, nhacungcap: Data[0]?.manhacungcap}))
    })
    getEmployees().then(({Data}) => {
      if (Data.length === 0) return;
      const nv = Data[Math.floor(Math.random() * Data.length)]
      setForm(src => ({...src, manhanvien: nv.manhanvien, hoten: nv.hoten}));
    })
    getFreeImport().then(({Data}) => setData(src => ({...src, phieunhap: Data[0]})))
    setImei([])
  }

  function scanImei(data) {
    if (imei.includes(data)) return;

    setImei(src => ([...src, data]))
    openModal("")
  }

  function openModal(key) {
    setModal(key)
  }

  function onInsertIMEICode(e) {
    e.preventDefault();
    const elem = document.getElementById("imei-input");
    const imeiValue = elem?.value;
    if (!imeiValue || imei.includes(imeiValue)) return;
    setImei(src => ([...src, imeiValue]))
    if (elem) elem.value = ""
  }


  return (<>
    <Page4
      count={sanPhamThem.length}
      sidebar={<SideNavbar/>}
      tableTop={<GroupShadow>
        <InputGroup.Text>Tìm kiếm</InputGroup.Text>
        <Form.Control/>
        <Button variant="success">
          <FontAwesomeIcon icon={faMagnifyingGlass}/>
        </Button>
      </GroupShadow>}
      table={<TableA headers={khoHeader}
                     data={data.sanpham?.slice(0, 100)}
                     onClick={function (row) {
                       if (!row) return

                       // console.log(row)
                       setImei([])
                       getProductConfigures(row.madanhmucsanpham).then(({Data}) => {
                         setData(src => ({
                           ...src,
                           cauhinh: Data,
                           madanhmucsanpham: row.madanhmucsanpham,
                           tendanhmucsanpham: row.tendanhmucsanpham,
                         }))
                         setForm(src => ({
                           ...src,
                           gianhap: Data[0].gianhap,
                           macauhinh: Data[0].macauhinh,
                         }))
                       })
                       setBtnState(true)
                     }}/>}
      tableForm={<Form className='p-3 d-flex gap-3 w-100 flex-column'>
        <FormGroup className='d-flex justify-content-between gap-4'>
          <FormGroup>
            <FormLabel className='fw-bold'>Mã sp</FormLabel>
            <InputShadow as={FormControl} type='text' disabled size='sm' value={data.madanhmucsanpham}/>
          </FormGroup>

          <FormGroup>
            <FormLabel className='fw-bold'>Tên sp</FormLabel>
            <InputShadow as={FormControl} size='sm' type='text' disabled value={data.tendanhmucsanpham}/>
          </FormGroup>
        </FormGroup>

        <FormGroup>
          <FormLabel className='fw-bold'>Cấu hình</FormLabel>
          <InputShadow as={FormSelect} size='sm'
                       disabled={data.cauhinh?.length === 0 || !btnState}
                       value={form.macauhinh}
                       onChange={e => {
                         const value = +e.target.value

                         setForm(src => ({
                           ...src,
                           macauhinh: +value,
                           gianhap: data.cauhinh.find(i => i.macauhinh === value)?.gianhap
                         }))
                         setImei([])
                       }}>
            {data.cauhinh?.map((i, j) =>
              <option key={j} value={i.macauhinh}>
                {i.dungluongrom}GB - {i.dungluongram}GB- {i.tenmausac}
              </option>)}
          </InputShadow>
        </FormGroup>

        <FormGroup>
          <FormLabel className='fw-bold'>Giá nhập</FormLabel>
          <GroupShadow size="sm">
            <FormControl disabled size='sm' type='number' value={form.gianhap}/>
            <InputGroup.Text>VNĐ</InputGroup.Text>
          </GroupShadow>
        </FormGroup>

        <FormGroup className='d-flex gap-2 justify-content-between align-items-center'>
          <FormLabel className='fw-bold'>Mã IMEI</FormLabel>
          <ButtonGroup>
            <Button variant='primary' size="sm" disabled={!data.cauhinh?.length}
                    onClick={setModal.bind({}, "scanIMEI")}>Scan</Button>
            <Button variant='success' size="sm" disabled={!data.cauhinh?.length}>Excel</Button>
          </ButtonGroup>
        </FormGroup>

        <FormGroup>
          <GroupShadow size='sm'>
            <FormControl type='text' id='imei-input' size='sm' disabled={!form.macauhinh}/>
            <Button variant='primary' onClick={onInsertIMEICode} disabled={!form.macauhinh}>
              <FontAwesomeIcon icon={faPlus}/>
            </Button>
          </GroupShadow>

          <div className='h-100 overflow-auto'>
            <ListGroup variant='flush'
                       className='bg-light'
                       onClick={e => {
                         const elem = e.target;
                         const delItem = elem.getAttribute('data-value')
                         if (delItem == null) return
                         setImei(imei.filter(i => i !== delItem))
                       }}>
              {imei?.map((i, j) => <ListGroupItem key={j} data-value={i}>{i}</ListGroupItem>)}
            </ListGroup>
          </div>
        </FormGroup>
      </Form>
      }
      toolBtn={<>
        <Button size='sm' className='w-25 my-3 fw-semibold' variant='success'>Nhập excel</Button>
        <Button size='sm'
                className='w-25 my-3 fw-semibold'
                variant='primary'
                disabled={!btnState}
                onClick={e => {
                  const cauhinh = {...data?.cauhinh.find(i => i.macauhinh === form.macauhinh)}
                  if (!cauhinh) return

                  const head = {
                    madanhmucsanpham: +data.madanhmucsanpham,
                    tendanhmucsanpham: data.tendanhmucsanpham,
                    dungluongram: cauhinh.dungluongram,
                    dungluongrom: cauhinh.dungluongrom,
                    tenmausac: cauhinh.tenmausac,
                    gianhap: cauhinh.gianhap,
                    cauhinh: cauhinh.macauhinh,
                  }

                  const items = [...imei]
                    .filter(i => !sanPhamThem.some(j => j.maimei === i))
                    .map(i => ({...head, maimei: i}))

                  setSanPhamThem(src => [...src, ...items])
                  setImei([])

                }}>Thêm sản phẩm</Button>
        <Button size='sm'
                className='w-25 my-3 fw-semibold'
                variant='warning'
                disabled={btnState}
                onClick={e => {

                  // if (imei.length === 0) return onDeleteProduct();
                  console.log(data.cauhinh)
                  const cauhinh = data?.cauhinh?.find(i => +i.macauhinh === +form.macauhinh)
                  if (!cauhinh) return

                  const head = {
                    madanhmucsanpham: +data.madanhmucsanpham,
                    tendanhmucsanpham: data.tendanhmucsanpham,
                    dungluongram: cauhinh.dungluongram,
                    dungluongrom: cauhinh.dungluongrom,
                    tenmausac: cauhinh.tenmausac,
                    gianhap: cauhinh.gianhap,
                    cauhinh: cauhinh.macauhinh,
                  }
                  // console.log({head, cauhinh})
                  const temp = sanPhamThem.filter(i => i.cauhinh !== cauhinh.macauhinh || imei.includes(i.maimei))
                  const insert = imei.filter(i => temp.every(j => j.maimei !== i)).map(i => ({...head, maimei: i}))
                  console.log(temp, insert)
                  setSanPhamThem([...temp, ...insert])
                  reset()
                  setBtnState(true)
                }}>Sửa sản phẩm</Button>
        <Button size='sm'
                className='w-25 my-3 fw-semibold'
                variant='danger'
                disabled={btnState}
                onClick={e => {
                  setSanPhamThem([...sanPhamThem].filter(i => +i.cauhinh !== +form.macauhinh))
                  reset()
                  setBtnState(true)
                }}>Xóa sản phẩm</Button>
      </>}
      table2={<TableA headers={spHeader}
                      data={sanPhamThem.reduce((acc, i) => {
                        const item = acc.find(j => j.cauhinh === i.cauhinh)
                        if (!item) acc.push({...i, soluong: 1})
                        else item.soluong++;

                        return acc
                      }, [])}
                      onClick={row => {
                        if (!row) return
                        setBtnState(false)
                        setImei([...sanPhamThem].filter(i => +i.cauhinh === +row.cauhinh).map(i => i.maimei))
                        getProductConfigures(row.madanhmucsanpham).then(({Data}) => {
                          setData(src => ({
                            ...src,
                            cauhinh: Data,
                            madanhmucsanpham: row.madanhmucsanpham,
                            tendanhmucsanpham: row.tendanhmucsanpham,
                          }))
                          setForm(src => ({
                            ...src,
                            gianhap: row.gianhap,
                            macauhinh: row.cauhinh,
                          }))
                        })
                      }}/>}
      rightTopForm={<>
        <FormGroup>
          <FormLabel className='fw-bold'>Mã phiếu nhập</FormLabel>
          <InputShadow as={FormControl} disabled value={data?.phieunhap?.maphieunhap}/>
        </FormGroup>

        <FormGroup>
          <FormLabel className='fw-bold'>Nhân viên nhập</FormLabel>
          <InputShadow as={FormControl} disabled value={""}/>
        </FormGroup>

        <FormGroup>
          <FormLabel className='fw-bold'>Nhà cung cấp</FormLabel>
          <InputShadow as={FormSelect} value={form.nhacungcap}
                       onChange={e => setForm(src => ({...src, nhacungcap: e.target.value}))}>
            {data.nhacungcap?.map((i, j) => <option key={j} value={i.manhacungcap}>{i.tennhacungcap}</option>)}
          </InputShadow>
        </FormGroup>
      </>}
      rightBottomForm={<>
        <h5 className='mb-3 text-danger fw-bold'>Tổng tiền: {sanPhamThem.reduce((acc, i) => i.gianhap + acc, 0)}đ</h5>
        <Button className='w-100 fw-semibold' variant='success' onClick={async e => {
          const updateData = {
            maphieunhap: data?.phieunhap?.maphieunhap,
            nhacungcap: form.nhacungcap,
            nhanviennhap: form.manhanvien
          }
          await updateImport(updateData)
          const send = sanPhamThem.map(i => ({
            maimei: i.maimei,
            cauhinh: i.cauhinh,
            phieunhap: data?.phieunhap?.maphieunhap,
            phieuxuat: null,
            tinhtrang: 1
          }))
          const result = await insertProduct(send);
          document.location.replace('/nhap-kho')
        }}>Nhập hàng</Button>
      </>}
    />

    <Modal centered size='lg' scrollable show={modal === "scanIMEI"} backdrop="static">
      <ModalHeader className='bg-primary px-3'>
        <Modal.Title className='text-center w-100 fw-bold fs-2 text-light'>
          QUÉT MÃ IMEI
        </Modal.Title>
        <CloseButton onClick={setModal.bind({}, "")}/>
      </ModalHeader>

      <ModalBody className='vh-100 p-3'>
        <BarCodeScanner onChange={scanImei}/>
      </ModalBody>
    </Modal>
  </>)
}

export default ThemNhapKho