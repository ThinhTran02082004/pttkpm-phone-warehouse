import './style.module.css'
import Layout1 from "../../../components/layouts/layout1";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMobileScreen, faUserGear, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";
import TableA from "../../../components/tables/tableA";

import Chart from 'react-apexcharts'
import { useEffect, useRef, useState } from "react";
import colors from "../../../utilities/colors";
import { getOverall } from "../../../api/statistics";
import { formatDate } from "../../../utilities/others";

const tableHD = [
  { key: "Ngày", value: "thoigian", format: formatDate },
  { key: "Vốn (VNĐ)", value: "von" },
  { key: "Doanh thu (VNĐ)", value: "doanhthu" },
  { key: "Lợi nhuận (VNĐ)", value: "loinhuan" },
]

const defaultOptions = {
  chart: {
    type: 'line',
    // dropShadow: {enabled: true, color: '#000', top: 18, left: 7, blur: 10, opacity: 0.2},
    zoom: { enabled: false },
    toolbar: { show: false }
  },
  colors: [colors.orange, colors.green, colors.blue],
  dataLabels: { enabled: true },
  stroke: { curve: 'smooth' },
  // title:      {text: 'Thống kê doanh thu 7 ngày gần nhất', align: 'center'},
  markers: { size: 1 },
  xaxis: {
    title: { text: "Ngày" },
    categories: [],
  },
  yaxis: {
    title: { text: 'Số tiền' },
  },
  legend: { position: 'bottom', horizontalAlign: 'center', offsetY: 0, offsetX: 0 }
}

function ThongKeTongQuan() {
  const [data, setData] = useState({})
  const chart = useRef(null)
  useEffect(() => {
    getOverall().then(({ Data }) => {
      // data.doanhthu.forEach(item => item.thoigian = item.thoigian.split("T")[0])
      setData(Data)

    })
  }, []);

  let options = {},
    series = []
  try {
    options = {
      ...defaultOptions,
      xaxis: {
        title: { text: "Ngày" },
        categories: data.doanhthu?.map(i => formatDate(i.thoigian)) || [],
      },
    }

    series = [
      { name: "Vốn", data: data?.doanhthu?.map(i => +i.von) || [] },
      { name: "Doanh thu", data: data?.doanhthu?.map(i => +i.doanhthu) || [] },
      { name: "Lợi nhuận", data: data?.doanhthu?.map(i => +i.loinhuan) || [] },
    ]

  } catch (e) {
    console.error(e)
  }
  return (
    <Layout1
      topPart={<>
        <div className="p-1 d-flex gap-5 border border-3 border-black w-100 align-items-center justify-content-center">
          <FontAwesomeIcon icon={faMobileScreen} size="3x" />
          <div className="text-center">
            <h3 className="m-0">{data?.sanpham?.[0]?.sanpham ?? "..."}</h3>
            <p className="m-0 fw-bold fs-5">Sản phẩm hiện có</p>
          </div>
        </div>
        <div className="p-1 d-flex gap-5 border border-3 border-black w-100 align-items-center justify-content-center">
          <FontAwesomeIcon icon={faUserGroup} size="3x" />
          <div className="text-center">
            <h3 className="m-0">{data?.khachhang?.[0]?.khachhang ?? "..."}</h3>
            <p className="m-0 fw-bold fs-5">Khách hàng</p>
          </div>
        </div>
        <div className="p-1 d-flex gap-5 border border-3 border-black w-100 align-items-center justify-content-center">
          <FontAwesomeIcon icon={faUserGear} size="3x" />
          <div className="text-center">
            <h3 className="m-0">{data?.nhanvien?.[0]?.nhanvien ?? "..."}</h3>
            <p className="m-0 fw-bold fs-5">Nhân viên</p>
          </div>
        </div>
      </>}
      middlePart={<>
        <h4 className="text-center">Thống kê doanh thu 7 ngày gần nhất</h4>
        <Chart options={options} series={series} type='line' width={"100%"} height={"100%"} />
      </>}
      bottomPart={<>
        <div className="justify-content-end d-flex">
          <Button variant="success">Xuất Excel</Button>
        </div>
        <div className="border overflow-auto h-100">
          <TableA headers={tableHD} data={data.doanhthu} />
        </div>
      </>}
    />
  )
}

export default ThongKeTongQuan