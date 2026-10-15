import './style.module.css'

const tableHD = [
  {key: "Ngày", value: ""},
  {key: "Vốn", value: ""},
  {key: "Doanh thu", value: ""},
  {key: "Lợi nhuận", value: ""},
]
const Layout1 = function ({topPart, middlePart, bottomPart}) {
  return (
    <div className="w-100 h-100 d-flex flex-column p-5 gap-2">
      <div className="d-flex _h-10 gap-5 justify-content-around">
        {topPart}
      </div>

      <div className="w-100 _h-45">
        {middlePart}
      </div>

      <div className="w-100 _h-45 d-flex flex-column gap-2">
        {bottomPart}
      </div>
    </div>
  )
}

export default Layout1;