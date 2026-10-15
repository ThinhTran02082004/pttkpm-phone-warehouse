import {useEffect, useState} from 'react'
import {Button, Form, FormControl, FormGroup, FormLabel, FormSelect, InputGroup, Modal, ModalBody, ModalFooter} from 'react-bootstrap'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faArrowRotateRight, faCircleInfo, faCirclePlus, faMagnifyingGlass, faPencil, faTrashCan} from '@fortawesome/free-solid-svg-icons'

import ToolBtn from '../../../components/buttons/toolBtn'
import Page2 from '../../../components/layouts/Page2'
import SideNavbar from '../../../components/layouts/sideBar'
import TableA from '../../../components/tables/tableA'
import colors from '../../../utilities/colors'
import HeaderModalA from '../../../components/modals/headerA'
import InputShadow from '../../../components/Forms/InputShadow'
import FlexForm from '../../../components/Forms/FlexForm'
import GroupShadow from '../../../components/Forms/GroupShadow'
import {formatDate} from "../../../utilities/others";
import {getReturns} from "../../../api/Warehouse/returns";

const doiTraHeader = [
  {key: "Mã phiếu đổi trả", value: "maphieudoitra"},
  {key: "Mã khách hàng", value: "makhachhang"},
  {key: "Tên khách hàng", value: "tenkhachhang"},
  {key: "Số lượng đổi trả", value: "soluongdoitra"},
  {key: "Ngày đổi trả", value: "thoigiandoitra", format: formatDate},
  {key: "Nhân viên CSKH", value: "tennhanvien"},
  {key: "Ghi chú", value: "ghichu"},
]

function DoiTraHang() {
  const [modal, setModal] = useState("")
  const [data, setData] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  function loadData() {
    getReturns().then(({Data}) => setData(Data || []))
  }

  function openModal(key, e) {
    setModal(key);
  }

  const [choies, setChoices] = useState();
  return (
    <>
      <Page2
        sidebar={<SideNavbar/>}
        tools={<>
          <ToolBtn color={colors.green} icon={faCirclePlus} title="Thêm" onClick={openModal.bind({}, "them")}/>
          <ToolBtn color={colors.orange} icon={faPencil} title="Sửa" onClick={openModal.bind({}, "edit")}/>
          <ToolBtn color={colors.yellow_2} icon={faTrashCan} title="Xóa"/>
          <ToolBtn color={colors.blue} icon={faCircleInfo} title="Chi tiết" onClick={openModal.bind({}, "doiTra")}/>
        </>}
        rightSec={
          <FlexForm>
            <InputShadow as={FormControl} className="w-auto" placeholder="Tìm kiếm"/>
            <Button className='d-flex gap-2 align-items-center px-4 opacity-2' size='lg' variant='success'>
              <FontAwesomeIcon icon={faMagnifyingGlass}/>
            </Button>
            <Button className='d-flex gap-2 align-items-center' variant='primary' onClick={loadData}>
              <FontAwesomeIcon icon={faArrowRotateRight}/>
              <span>Làm mới</span>
            </Button>
          </FlexForm>
        }
        dataTable={<TableA headers={doiTraHeader} data={data}/>}
      />

      <Modal centered show={modal === "them"} size='lg'>
        <HeaderModalA title={"THÊM GIAO DỊCH ĐỔI TRẢ"}/>

        <ModalBody>
          <PhieuDoiTraForm/>
        </ModalBody>

        <ModalFooter className='d-flex gap-5 justify-content-center'>
          <Button className='w-25' variant='primary'>Thêm giao dịch</Button>
          <Button className='w-25' variant='danger' onClick={openModal.bind({}, "")}>Hủy bỏ</Button>
        </ModalFooter>
      </Modal>

      <Modal centered show={modal === "edit"} scrollable size='lg'>
        <HeaderModalA title={"SỬA GIAO DỊCH ĐỔI TRẢ"}/>

        <ModalBody>
          <PhieuDoiTraForm phieuDoiTraID='E'/>
        </ModalBody>

        <ModalFooter className='d-flex gap-5 justify-content-center'>
          <Button className='w-25' variant='primary'>Thêm giao dịch</Button>
          <Button className='w-25' variant='danger' onClick={openModal.bind({}, "")}>Hủy bỏ</Button>
        </ModalFooter>
      </Modal>

      <Modal size='xl' show={modal === "doiTra"} centered scrollable backdrop="static" className='vh-100'>
        <HeaderModalA title={"Phiếu đổi trả"}/>

        <ModalBody className='d-flex flex-column gap-3 h-100 px-5 py-4'>
          <Form className='d-flex justify-content-between border-bottom pb-3 border-3 border-dark'>
            <FormGroup>
              <FormLabel className='fw-bold'>Mã phiếu đổi trả</FormLabel>
              <InputShadow disabled/>
            </FormGroup>
            <FormGroup>
              <FormLabel className='fw-bold'>Mã phiếu đổi trả</FormLabel>
              <InputShadow disabled/>
            </FormGroup>
            <FormGroup>
              <FormLabel className='fw-bold'>Mã phiếu đổi trả</FormLabel>
              <InputShadow disabled/>
            </FormGroup>
            <FormGroup>
              <FormLabel className='fw-bold'>Mã phiếu đổi trả</FormLabel>
              <InputShadow disabled/>
            </FormGroup>
          </Form>

          <Form className='d-flex flex-column gap-2 pb-3 border-bottom pb-3 border-3 border-dark'>
            <FormLabel className='fs-3 fw-bold'>Số thứ tự: {1}</FormLabel>
            <FormGroup className='d-flex gap-5 w-100'>
              <FormGroup className='d-flex flex-column gap-3 w-100'>
                <FormGroup className='d-flex w-100 align-items-center justify-content-between'>
                  <FormLabel className='fw-bold w-50'>Mã IMEI</FormLabel>
                  <InputShadow/>
                </FormGroup>
                <FormGroup className='d-flex w-100 align-items-center justify-content-between'>
                  <FormLabel className='fw-bold w-50'>Tên sản phẩm</FormLabel>
                  <InputShadow/>
                </FormGroup>
                <FormGroup className='d-flex w-100 align-items-center justify-content-between'>
                  <FormLabel className='fw-bold w-50'>Phiên bản</FormLabel>
                  <InputShadow/>
                </FormGroup>
                <FormGroup className='d-flex w-100 align-items-center justify-content-between'>
                  <FormLabel className='fw-bold w-50'>Ngày mua</FormLabel>
                  <InputShadow/>
                </FormGroup>
                <FormGroup className='d-flex w-100 align-items-center justify-content-between'>
                  <FormLabel className='fw-bold w-50'>Mã phiếu xuất</FormLabel>
                  <InputShadow/>
                </FormGroup>
              </FormGroup>

              <div className='h-auto bg-dark' style={{width: "3px"}}></div>
              <FormGroup className='d-flex flex-column gap-4 w-100'>
                <FormGroup className='d-flex w-100 justify-content-between'>
                  <FormLabel className='fw-bold w-50'>Lý do muốn đổi trả</FormLabel>
                  <InputShadow as="textarea" style={{height: "80px"}}/>
                </FormGroup>

                <FormGroup className='d-flex w-100 align-items-center justify-content-between'>
                  <FormLabel className='fw-bold w-50'>Hướng giải quyết</FormLabel>
                  <InputShadow as={FormSelect} value={choies} onChange={e => setChoices(e.target.value)}>
                    <option value={1}>Đổi sản phẩm cùng loại</option>
                    <option value={2}>Trả và hoàn tiền</option>
                  </InputShadow>
                </FormGroup>
                {+choies === 1 &&
                  <FormGroup className='d-flex w-100 align-items-center justify-content-between'>
                    <FormLabel className='fw-bold w-50'>Mã IMEI đổi</FormLabel>
                    <InputShadow/>
                  </FormGroup>
                }

                {+choies === 2 && <>
                  <FormGroup className='d-flex gap-2 w-100 align-items-center justify-content-between'>
                    <FormLabel className='fw-bold w-100'>Tên sản phẩm muốn đổi</FormLabel>
                    <InputShadow/>
                  </FormGroup>
                  <FormGroup className='d-flex w-100 align-items-center justify-content-between'>
                    <FormLabel className='fw-bold w-100'>Số tiền đền bù</FormLabel>
                    <GroupShadow>
                      <FormControl type='number'/>
                      <InputGroup.Text>VNĐ</InputGroup.Text>
                    </GroupShadow>
                  </FormGroup>
                  <FormGroup className='d-flex w-100 justify-content-between'>
                    <FormGroup>
                      <FormLabel className='fw-bold w-50'>Phân loại</FormLabel>
                      <InputShadow/>
                    </FormGroup>
                    <FormGroup>
                      <FormLabel className='fw-bold w-50'>Mã IMEI</FormLabel>
                      <InputShadow/>
                    </FormGroup>
                  </FormGroup>
                </>}

                <FormGroup className='d-flex justify-content-end w-100'>
                  <Button variant='outline' className='w-auto _border-yellow-focus-2'>
                    <FontAwesomeIcon icon={faTrashCan} color={colors.yellow_2} size='2x'/>
                    {/* <p className='m-0 _text-yellow-2'>Xóa</p> */}
                  </Button>
                </FormGroup>
              </FormGroup>
            </FormGroup>

          </Form>
          <FormGroup>
            <Button variant='outline' className='w-auto _border-green-focus'>
              <FontAwesomeIcon icon={faCirclePlus} color={colors.green} size='2x'/>
              {/* <p className='m-0 _text-green'>Thêm<br /> sản phẩm</p> */}
            </Button>
          </FormGroup>

        </ModalBody>

        <ModalFooter className='d-flex justify-content-center gap-5'>
          <Button className='_w-15' variant='primary'>Xuất PDF</Button>
          <Button className='_w-15' variant='danger' onClick={openModal.bind({}, "")}>Đóng</Button>
        </ModalFooter>
      </Modal>
    </>
  )
}

function PhieuDoiTraForm({phieuDoiTraID = ""}) {
  return (
    <Form className='d-flex flex-column gap-3 py-3 px-5 mx-5 h-100 justify-content-center'>
      <FormGroup className='d-flex w-100 align-items-between gap-5'>
        <FormGroup>
          <FormLabel className='fw-bold'>Mã khách hàng</FormLabel>
          <InputShadow as={FormControl} className="_w-100"/>
        </FormGroup>

        {!!phieuDoiTraID && <FormGroup>
          <FormLabel className='fw-bold'>Mã phiếu đổi trả</FormLabel>
          <InputShadow as={FormControl} className="_w-100" disabled value={phieuDoiTraID}/>
        </FormGroup>}
      </FormGroup>
      <FormGroup>
        <FormLabel className='fw-bold'>Tên khách hàng</FormLabel>
        <InputShadow className="_w-100" as={FormControl}/>
      </FormGroup>
      <FormGroup>
        <FormLabel className='fw-bold'>Số lượng đổi trả</FormLabel>
        <InputShadow className="_w-100" as={FormControl} type="number"/>
      </FormGroup>
      <FormGroup>
        <FormLabel className='fw-bold'>Ngày đổi trả</FormLabel>
        <InputShadow className="_w-100" as={FormControl} type="date"/>
      </FormGroup>
      <FormGroup>
        <FormLabel className='fw-bold'>Ghi chú</FormLabel>
        <InputShadow className="_w-100" as={FormControl}/>
      </FormGroup>
      <FormGroup>
        <FormLabel className='fw-bold'>Mã nhân viên CSKH</FormLabel>
        <InputShadow as={FormControl} className=" w-auto"/>
      </FormGroup>
      <FormGroup>
        <FormLabel className='fw-bold'>Tên nhân viên </FormLabel>
        <InputShadow className="_w-100" as={FormControl}/>
      </FormGroup>
    </Form>
  )
}

export default DoiTraHang