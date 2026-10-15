import './style.module.css'
import Layout2 from "../../../components/layouts/layout2";
import { Button, FormControl, FormGroup, FormLabel, InputGroup } from "react-bootstrap";
import GroupShadow from "../../../components/Forms/GroupShadow";
import InputGroupText from "react-bootstrap/InputGroupText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import InputShadow from "../../../components/Forms/InputShadow";
import TableA from "../../../components/tables/tableA";
import { useEffect, useState } from "react";
import { getMaxAndDay, getTonKho } from "../../../api/statistics";

const tableHD = [
  { key: "Mã sản phẩm", value: "madanhmucsanpham" },
  { key: "Tên sản phẩm", value: "tendanhmucsanpham" },
  { key: "Tồn đầu kỳ", value: "tondau", format: t => +(t ?? 0) },
  { key: "Nhập trong kỳ", value: "tongnhap", format: t => +(t ?? 0) },
  { key: "Xuất trong kỳ", value: "tongxuat", format: t => +(t ?? 0) },
  { key: "Tồn cuối kì", value: "toncuoi", format: t => +(t ?? 0) },
]

function ThongKeTonKho() {
  const [form, setForm] = useState({ ngaybatdau: "", ngayketthuc: "" })
  const [table, setTable] = useState([])

  useEffect(() => {
    getMaxAndDay().then(({ Data }) => {
      setForm({
        ngaybatdau: Data[0].mindate.split("T")[0],
        ngayketthuc: Data[0].maxdate.split("T")[0]
      })
    })
  }, []);
  useEffect(() => {
    console.log(form)
    getTonKho(form.ngaybatdau, form.ngayketthuc).then(data => {
      setTable(data.Data)
      console.log('ddddd', data)
      // console.log('dddddd', data)
    })

  }, [form])
  return (
    <Layout2
      leftPart={<>
        <FormGroup>
          <FormLabel className="fw-bold">Tìm kiếm sản phẩm</FormLabel>
          <GroupShadow>
            <InputGroup>
              <InputGroupText>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </InputGroupText>
              <FormControl />
            </InputGroup>
          </GroupShadow>
        </FormGroup>

        <FormGroup>
          <FormLabel className="fw-bold">Từ ngày</FormLabel>
          <InputShadow type="date" value={form.ngaybatdau} onChange={e => setForm(f => ({ ...f, ngaybatdau: e.target.value }))} />
        </FormGroup>

        <FormGroup>
          <FormLabel className="fw-bold">Đến ngày</FormLabel>
          <InputShadow type="date" value={form.ngayketthuc} onChange={e => setForm(f => ({ ...f, ngayketthuc: e.target.value }))} />
        </FormGroup>
        <div className="d-flex flex-column gap-2 justify-content-center align-items-center">
          <Button className="w-75" variant="success">Xuất excel</Button>
          <Button className="w-75" variant="primary">Làm mới</Button>
        </div>
      </>}
      rightPart={<>
        <div className="h-100 overflow-auto border">
          <TableA headers={tableHD} data={table} />
          {/*<div style={{height: "1000px"}}></div>*/}
        </div>
        <h2 className="text-end text-danger pb-3">Tổng số lượng tồn kho: {table.reduce((acc, i) => acc + (+i.tongnhap - +i.tongxuat + +(i.tondau ?? 0)), 0)}</h2>
      </>}
    />
  )
}

export default ThongKeTonKho