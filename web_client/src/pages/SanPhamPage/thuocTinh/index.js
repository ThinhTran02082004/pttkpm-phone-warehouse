import {useEffect, useState} from 'react'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAndroid, faEmpire,} from '@fortawesome/free-brands-svg-icons'
import {faBrush, faComputer, faMemory, faMountainCity, faX} from '@fortawesome/free-solid-svg-icons'
import {Button, Form, FormControl, InputGroup, Modal} from 'react-bootstrap'

import Page1 from '../../../components/layouts/Page1'
import ThuocTinhBtn from '../../../components/buttons/thuocTinhBtn'
import TableA from '../../../components/tables/tableA'
import HeaderModalA from '../../../components/modals/headerA'
import SideNavbar from '../../../components/layouts/sideBar'
import GroupShadow from '../../../components/Forms/GroupShadow'
import {
  deleteProductAttributes,
  getProductAttributes,
  insertProductAttributes,
  updateProductAttributes
} from "../../../api/Products/product-attributes";
import AlertModal from "../../../components/modals/alertModal";

const keys = {
  thuongHieu: "thuongHieu",
  xuatXu: "xuatXu",
  heDieuHanh: "heDieuHanh",
  ram: "ram",
  rom: "rom",
  mauSac: "mauSac"
}

const headers = {
  [keys.thuongHieu]: [
    {key: "Mã thương hiệu", value: "ma"},
    {key: "Tên thương hiệu", value: "tenthuonghieu"},
    {key: "mathuonghieu", value: "mathuonghieu", hide: true},
  ],
  [keys.xuatXu]: [
    {key: "Mã xuất xứ", value: "ma"},
    {key: "Tên xuất xứ", value: "tenxuatxu"},
    {key: "maxuatxu", value: "maxuatxu", hide: true},
  ],
  [keys.heDieuHanh]: [
    {key: "Mã hệ điều hành", value: "ma"},
    {key: "Tên hệ điều hành", value: "tenhedieuhanh"},
    {key: "mahedieuhanh", value: "mahedieuhanh", hide: true},
  ],
  [keys.ram]: [
    {key: "Mã ram", value: "ma"},
    {key: "Dung lượng ram (GB)", value: "dungluongram"},
    {key: "maram", value: "maram", hide: true},
  ],
  [keys.rom]: [
    {key: "Mã rom", value: "ma"},
    {key: "Dung lượng rom (GB)", value: "dungluongrom"},
    {key: "marom", value: "marom", hide: true},
  ],
  [keys.mauSac]: [
    {key: "Mã màu sắc", value: "ma"},
    {key: "Tên màu sắc", value: "tenmausac"},
    {key: "mamausac", value: "mamausac"},
  ]
}

const defaultValues = {
  [keys.thuongHieu]: {mathuonghieu: undefined, tenthuonghieu: "",},
  [keys.xuatXu]: {maxuatxu: undefined, tenxuatxu: ""},
  [keys.heDieuHanh]: {mahedieuhanh: undefined, tenhedieuhanh: ""},
  [keys.ram]: {maram: undefined, dungluongram: ""},
  [keys.rom]: {marom: undefined, dungluongrom: ""},
  [keys.mauSac]: {mamausac: undefined, tenmausac: ""}
}

function ThuocTinh() {
  const [modal, setModal] = useState("")
  const [premodal, setPreModal] = useState("")

  const formData = {
    [keys.thuongHieu]: useState({...defaultValues[keys.thuongHieu]}),
    [keys.xuatXu]: useState({...defaultValues[keys.xuatXu]}),
    [keys.heDieuHanh]: useState({...defaultValues[keys.heDieuHanh]}),
    [keys.ram]: useState({...defaultValues[keys.ram]}),
    [keys.rom]: useState({...defaultValues[keys.rom]}),
    [keys.mauSac]: useState({...defaultValues[keys.mauSac]})
  }

  const [tableData, setTableData] = useState([])

  function updateTableData() {
    setTableData([])

    getProductAttributes(modal)
      .then(response => setTableData(response.Data))
  }

  useEffect(() => {
    if (modal.length === 0) return
    updateTableData()

  }, [modal]);

  function openModal(newModal) {
    setPreModal(modal)
    setModal(newModal);
  }


  function onRowclick(row) {
    if (row) return formData[modal]?.[1](row)
  }

  function onClearField() {
    formData[modal][1]({...defaultValues[modal]})
  }

  function onChange(key, e) {
    formData[modal]?.[1](src => ({...src, [key]: e.target.value}))
  }

  function onCloseModal() {

    setModal("")
  }

  async function onInsert(e) {
    // console.log('ddd', Object.values(formData[modal][0]))
    // return;
    if (Object.values(formData[modal][0])[1].length === 0)
      return openModal("failAdd")

    const result = await insertProductAttributes(modal, [formData[modal][0]], "")
    if (!result) return

    formData[modal]?.[1]({...defaultValues[modal]})
    updateTableData()
    openModal("successAdd")
  }

  async function onUpdate(e) {
    if (Object.values(formData[modal][0]).reduce((acc, i) => acc * (i?.length ?? 0), 1) === 0)
      return openModal("failEdit")

    const result = await updateProductAttributes(modal, formData[modal][0], "")
    console.log({result, a: formData[modal][0]})
    if (!result) return

    formData[modal][1]({...defaultValues[modal]})
    updateTableData()
    openModal("successUpdate")
  }

  async function onDelete(e) {

    if (Object.values(formData[modal][0])[0] == null) return openModal("failDelete")

    const result = await deleteProductAttributes(modal, [formData[modal][0]], "")
    console.log({result, a: formData[modal][0]})
    if (!result) return

    formData[modal][1]({...defaultValues[modal]})
    updateTableData()
    openModal("successDelete")
  }

  return (
    <>
      <Page1 sidebar={<SideNavbar/>}>
        <div className='d-flex flex-wrap flex-grow-1 h-100'>
          <div className="d-flex w-50 p-5">
            <ThuocTinhBtn className={["_bg-green-1 _bg-green-hover-0 w-100 h-100"].join(" ")} icon={faEmpire}
                          title="Thương hiệu" onClick={openModal.bind({}, keys.thuongHieu)}/>
          </div>
          <div className="d-flex w-50 p-5">
            <ThuocTinhBtn className={["_bg-red-1 _bg-red-hover-0 w-100 h-100"].join(" ")} icon={faMountainCity}
                          title="Xuất xứ" onClick={openModal.bind({}, keys.xuatXu)}/>
          </div>
          <div className="d-flex w-50 p-5">
            <ThuocTinhBtn className={["_bg-orange-1 _bg-orange-hover-0 w-100 h-100"].join(" ")} icon={faAndroid}
                          title="Hệ điều hành" onClick={openModal.bind({}, keys.heDieuHanh)}/>
          </div>
          <div className="d-flex w-50 p-5">
            <ThuocTinhBtn className={["_bg-purple-1 _bg-purple-hover-0 w-100 h-100"].join(" ")} icon={faComputer}
                          title="Ram" onClick={openModal.bind({}, keys.ram)}/>
          </div>
          <div className="d-flex w-50 p-5">
            <ThuocTinhBtn className={["_bg-pink-1 _bg-pink-hover-0 w-100 h-100"].join(" ")} icon={faMemory} title="Rom"
                          onClick={openModal.bind({}, keys.rom)}/>
          </div>
          <div className="d-flex w-50 p-5">
            <ThuocTinhBtn className={["_bg-yellow-1 _bg-yellow-hover-0 w-100 h-100"].join(" ")} icon={faBrush}
                          title="Màu sắc" onClick={openModal.bind({}, keys.mauSac)}/>
          </div>
        </div>
      </Page1>

      <Modal backdrop="static" show={Object.values(keys).includes(modal)} scrollable centered size='lg'>
        {modal === keys.thuongHieu && <HeaderModalA title="Thương hiệu"/>}
        {modal === keys.xuatXu && <HeaderModalA title="Xuất xứ"/>}
        {modal === keys.heDieuHanh && <HeaderModalA title="Hệ điều hành"/>}
        {modal === keys.ram && <HeaderModalA title="Ram"/>}
        {modal === keys.rom && <HeaderModalA title="Rom"/>}
        {modal === keys.mauSac && <HeaderModalA title="Màu sắc"/>}

        <Modal.Body className='overflow-y-hidden' style={{height: "60vh"}}>
          <div className='h-100'>
            <div className='align-items-center w-100 d-flex justify-content-center gap-4 mb-4'>
              {modal === keys.thuongHieu && <FontAwesomeIcon size='6x' icon={faEmpire} className='col-auto'/>}
              {modal === keys.xuatXu && <FontAwesomeIcon size='6x' icon={faMountainCity} className='col-auto'/>}
              {modal === keys.heDieuHanh && <FontAwesomeIcon size='6x' icon={faAndroid} className='col-auto'/>}
              {modal === keys.ram && <FontAwesomeIcon size='6x' icon={faComputer} className='col-auto'/>}
              {modal === keys.rom && <FontAwesomeIcon size='6x' icon={faMemory} className='col-auto'/>}
              {modal === keys.mauSac && <FontAwesomeIcon size='6x' icon={faBrush} className='col-auto'/>}

              <Form className='w-50'>
                {modal === keys.thuongHieu && <h5 className='text-nowrap fw-bold'>Thương hiệu</h5>}
                {modal === keys.xuatXu && <h5 className='text-nowrap fw-bold'>Xuất xứ</h5>}
                {modal === keys.heDieuHanh && <h5 className='text-nowrap fw-bold'>Hệ điều hành</h5>}
                {modal === keys.ram && <h5 className='text-nowrap fw-bold'>Ram</h5>}
                {modal === keys.rom && <h5 className='text-nowrap fw-bold'>Rom</h5>}
                {modal === keys.mauSac && <h5 className='text-nowrap fw-bold'>Màu sắc</h5>}

                <Form.Group className='d-flex gap-2 align-items-center'>
                  <GroupShadow>
                    {modal === keys.thuongHieu
                      && <FormControl value={formData[keys.thuongHieu][0].tenthuonghieu}
                                      onChange={onChange.bind({}, "tenthuonghieu")}/>}

                    {modal === keys.xuatXu
                      && <FormControl value={formData[keys.xuatXu][0].tenxuatxu}
                                      onChange={onChange.bind({}, "tenxuatxu")}/>}

                    {modal === keys.heDieuHanh
                      && <FormControl value={formData[keys.heDieuHanh][0].tenhedieuhanh}
                                      onChange={onChange.bind({}, "tenhedieuhanh")}/>}

                    {modal === keys.ram
                      && <FormControl type='number' value={formData[keys.ram][0].dungluongram}
                                      onChange={onChange.bind({}, "dungluongram")}/>}

                    {modal === keys.rom
                      && <FormControl type='number' value={formData[keys.rom][0].dungluongrom}
                                      onChange={onChange.bind({}, "dungluongrom")}/>}

                    {modal === keys.mauSac
                      && <FormControl value={formData[keys.mauSac][0].tenmausac}
                                      onChange={onChange.bind({}, "tenmausac")}/>}

                    {(modal === keys.rom || modal === keys.ram) && <InputGroup.Text>GB</InputGroup.Text>}
                  </GroupShadow>
                  <Button className='shadow-sm' variant='danger' onClick={onClearField}>
                    <FontAwesomeIcon icon={faX} className='p-0 m-0'/>
                  </Button>
                </Form.Group>
              </Form>
            </div>

            <div className='justify-content-center mx-3' style={{height: "70%"}}>
              <div className='overflow-y-auto h-100 border border-black' style={{}}>
                <TableA headers={headers[modal]} data={tableData.slice(0, 100)} onClick={onRowclick}/>
              </div>
            </div>
          </div>
        </Modal.Body>

        <Modal.Footer className='d-flex justify-content-center gap-5 py-4'>
          <Button className='shadow-sm' style={{width: "15%"}} variant='info' onClick={onInsert}>Thêm</Button>
          <Button className='shadow-sm' style={{width: "15%"}} variant='success' onClick={onUpdate}>Sửa</Button>
          <Button className='shadow-sm' style={{width: "15%"}} variant='danger' onClick={onDelete}>Xóa</Button>
          <Button className='shadow-sm' style={{width: "15%"}} variant='dark'
                  onClick={openModal.bind({}, "")}>Đóng</Button>
        </Modal.Footer>
      </Modal>

      <AlertModal show={modal === 'successAdd'} onHide={openModal.bind({}, premodal)} message={'Thêm thành công'}/>
      <AlertModal show={modal === 'successUpdate'} onHide={openModal.bind({}, premodal)} message={'Sửa thành công'}/>
      <AlertModal show={modal === 'failAdd'} onHide={openModal.bind({}, premodal)} message={'Hãy điền đủ thông tin.'}/>
      <AlertModal show={['failDelete', 'failEdit'].includes(modal)}
                  onHide={openModal.bind({}, premodal)}
                  message={'Hãy chọn 1 thuộc tính!!!'}/>
      <AlertModal show={modal === 'successDelete'} onHide={openModal.bind({}, premodal)}
                  message={'Hãy điền đủ thông tin!!!'}/>
      {/*<AlertModal show={show === 'failEdit'} onHide={onCloseModal} message={'Hãy điền đủ thông tin!!!'}/>*/}
    </>
  )
}

export default ThuocTinh