
/**
 * This class is generated automatically by Katalon Studio and should not be modified or deleted.
 */

import java.lang.String

import com.kms.katalon.core.testobject.TestObject



def static "com.pttkpm.roles.RoleKeywords.createRole"(
    	String code	
     , 	String name	
     , 	String description	) {
    (new com.pttkpm.roles.RoleKeywords()).createRole(
        	code
         , 	name
         , 	description)
}


def static "com.pttkpm.roles.RoleKeywords.clickEditRole"(
    	String code	) {
    (new com.pttkpm.roles.RoleKeywords()).clickEditRole(
        	code)
}


def static "com.pttkpm.roles.RoleKeywords.updateRole"(
    	String code	
     , 	String name	
     , 	String description	) {
    (new com.pttkpm.roles.RoleKeywords()).updateRole(
        	code
         , 	name
         , 	description)
}


def static "com.pttkpm.roles.RoleKeywords.toggleRoleStatus"(
    	String code	) {
    (new com.pttkpm.roles.RoleKeywords()).toggleRoleStatus(
        	code)
}


def static "com.pttkpm.roles.RoleKeywords.cancelEdit"() {
    (new com.pttkpm.roles.RoleKeywords()).cancelEdit()
}


def static "com.pttkpm.roles.RoleKeywords.exportExcel"() {
    (new com.pttkpm.roles.RoleKeywords()).exportExcel()
}


def static "com.pttkpm.roles.RoleKeywords.createRole"(
    	String code	
     , 	String name	) {
    (new com.pttkpm.roles.RoleKeywords()).createRole(
        	code
         , 	name)
}


def static "com.pttkpm.roles.RoleKeywords.updateRole"(
    	String code	
     , 	String name	) {
    (new com.pttkpm.roles.RoleKeywords()).updateRole(
        	code
         , 	name)
}

 /**
     * Sinh số IMEI ngẫu nhiên 15 chữ số hợp lệ cho thiết bị di động
     */ 
def static "com.pttkpm.common.DataGenerator.generateRandomIMEI"() {
    (new com.pttkpm.common.DataGenerator()).generateRandomIMEI()
}

 /**
     * Sinh danh sách nhiều số IMEI ngăn cách bằng dấu xuống dòng để nhập kho
     */ 
def static "com.pttkpm.common.DataGenerator.generateIMEIList"(
    	int count	) {
    (new com.pttkpm.common.DataGenerator()).generateIMEIList(
        	count)
}

 /**
     * Sinh số điện thoại Việt Nam ngẫu nhiên 10 số (bắt đầu bằng 09...)
     */ 
def static "com.pttkpm.common.DataGenerator.generateRandomPhone"() {
    (new com.pttkpm.common.DataGenerator()).generateRandomPhone()
}

 /**
     * Sinh email ngẫu nhiên hợp lệ
     */ 
def static "com.pttkpm.common.DataGenerator.generateRandomEmail"(
    	String prefix	) {
    (new com.pttkpm.common.DataGenerator()).generateRandomEmail(
        	prefix)
}

 /**
     * Sinh mã định danh ngẫu nhiên (VD: EMP_12345, IMP_67890)
     */ 
def static "com.pttkpm.common.DataGenerator.generateRandomCode"(
    	String prefix	) {
    (new com.pttkpm.common.DataGenerator()).generateRandomCode(
        	prefix)
}

 /**
     * Tô viền đỏ phần tử trên trang web để trực quan hóa khi chạy demo kiểm thử
     */ 
def static "com.pttkpm.common.WebUIHelper.highlightElement"(
    	TestObject testObject	) {
    (new com.pttkpm.common.WebUIHelper()).highlightElement(
        	testObject)
}

 /**
     * Xóa sạch dữ liệu cũ trong ô nhập liệu và điền dữ liệu mới an toàn
     */ 
def static "com.pttkpm.common.WebUIHelper.clearAndSetText"(
    	TestObject testObject	
     , 	String text	) {
    (new com.pttkpm.common.WebUIHelper()).clearAndSetText(
        	testObject
         , 	text)
}

 /**
     * Chờ trang web và AJAX hoàn tất tải (document.readyState == 'complete')
     */ 
def static "com.pttkpm.common.WebUIHelper.waitForPageReady"(
    	int timeoutSeconds	) {
    (new com.pttkpm.common.WebUIHelper()).waitForPageReady(
        	timeoutSeconds)
}

 /**
     * Cuộn màn hình đến phần tử cần thao tác
     */ 
def static "com.pttkpm.common.WebUIHelper.scrollToElement"(
    	TestObject testObject	) {
    (new com.pttkpm.common.WebUIHelper()).scrollToElement(
        	testObject)
}

 /**
     * Kiểm tra banner thành công (AlertBanner type=success) xuất hiện
     */ 
def static "com.pttkpm.common.WebUIHelper.verifySuccessBanner"(
    	int timeout	) {
    (new com.pttkpm.common.WebUIHelper()).verifySuccessBanner(
        	timeout)
}

 /**
     * Kiểm tra banner lỗi (AlertBanner type=error) xuất hiện
     */ 
def static "com.pttkpm.common.WebUIHelper.verifyErrorBanner"(
    	int timeout	) {
    (new com.pttkpm.common.WebUIHelper()).verifyErrorBanner(
        	timeout)
}

 /**
     * Kiểm tra trong bảng DataTable có dòng chứa đoạn text
     */ 
def static "com.pttkpm.common.WebUIHelper.verifyRowExists"(
    	String text	
     , 	int timeout	) {
    (new com.pttkpm.common.WebUIHelper()).verifyRowExists(
        	text
         , 	timeout)
}

 /**
     * Chọn option trong select: theo nhãn nếu có, ngược lại chọn option đầu tiên khác rỗng
     */ 
def static "com.pttkpm.common.WebUIHelper.selectOption"(
    	TestObject select	
     , 	String label	) {
    (new com.pttkpm.common.WebUIHelper()).selectOption(
        	select
         , 	label)
}


def static "com.pttkpm.common.WebUIHelper.verifySuccessBanner"() {
    (new com.pttkpm.common.WebUIHelper()).verifySuccessBanner()
}


def static "com.pttkpm.common.WebUIHelper.verifyErrorBanner"() {
    (new com.pttkpm.common.WebUIHelper()).verifyErrorBanner()
}


def static "com.pttkpm.common.WebUIHelper.verifyRowExists"(
    	String text	) {
    (new com.pttkpm.common.WebUIHelper()).verifyRowExists(
        	text)
}


def static "com.pttkpm.employees.EmployeeKeywords.addEmployee"(
    	String code	
     , 	String fullName	
     , 	String email	
     , 	String phone	
     , 	String gender	) {
    (new com.pttkpm.employees.EmployeeKeywords()).addEmployee(
        	code
         , 	fullName
         , 	email
         , 	phone
         , 	gender)
}


def static "com.pttkpm.employees.EmployeeKeywords.clickEditEmployee"(
    	String code	) {
    (new com.pttkpm.employees.EmployeeKeywords()).clickEditEmployee(
        	code)
}


def static "com.pttkpm.employees.EmployeeKeywords.updateEmployee"(
    	String code	
     , 	String fullName	
     , 	String phone	) {
    (new com.pttkpm.employees.EmployeeKeywords()).updateEmployee(
        	code
         , 	fullName
         , 	phone)
}


def static "com.pttkpm.employees.EmployeeKeywords.toggleEmployeeStatus"(
    	String code	) {
    (new com.pttkpm.employees.EmployeeKeywords()).toggleEmployeeStatus(
        	code)
}


def static "com.pttkpm.employees.EmployeeKeywords.cancelEdit"() {
    (new com.pttkpm.employees.EmployeeKeywords()).cancelEdit()
}


def static "com.pttkpm.employees.EmployeeKeywords.exportExcel"() {
    (new com.pttkpm.employees.EmployeeKeywords()).exportExcel()
}


def static "com.pttkpm.employees.EmployeeKeywords.addEmployee"(
    	String code	
     , 	String fullName	
     , 	String email	
     , 	String phone	) {
    (new com.pttkpm.employees.EmployeeKeywords()).addEmployee(
        	code
         , 	fullName
         , 	email
         , 	phone)
}


def static "com.pttkpm.accounts.AccountKeywords.createAccount"(
    	String username	
     , 	String password	
     , 	String employee	
     , 	String role	) {
    (new com.pttkpm.accounts.AccountKeywords()).createAccount(
        	username
         , 	password
         , 	employee
         , 	role)
}


def static "com.pttkpm.accounts.AccountKeywords.clickEditAccount"(
    	String username	) {
    (new com.pttkpm.accounts.AccountKeywords()).clickEditAccount(
        	username)
}


def static "com.pttkpm.accounts.AccountKeywords.updateAccountRole"(
    	String username	
     , 	String roleLabel	) {
    (new com.pttkpm.accounts.AccountKeywords()).updateAccountRole(
        	username
         , 	roleLabel)
}


def static "com.pttkpm.accounts.AccountKeywords.toggleAccountStatus"(
    	String username	) {
    (new com.pttkpm.accounts.AccountKeywords()).toggleAccountStatus(
        	username)
}


def static "com.pttkpm.accounts.AccountKeywords.cancelEdit"() {
    (new com.pttkpm.accounts.AccountKeywords()).cancelEdit()
}


def static "com.pttkpm.accounts.AccountKeywords.createAccount"(
    	String username	
     , 	String password	
     , 	String employee	) {
    (new com.pttkpm.accounts.AccountKeywords()).createAccount(
        	username
         , 	password
         , 	employee)
}


def static "com.pttkpm.accounts.AccountKeywords.createAccount"(
    	String username	
     , 	String password	) {
    (new com.pttkpm.accounts.AccountKeywords()).createAccount(
        	username
         , 	password)
}

 /**
     * Khởi động trình duyệt và đăng nhập với tài khoản Quản trị viên (Admin)
     */ 
def static "com.pttkpm.auth.AuthKeywords.loginAsAdmin"() {
    (new com.pttkpm.auth.AuthKeywords()).loginAsAdmin()
}

 /**
     * Đăng nhập với tài khoản và mật khẩu tùy chỉnh
     */ 
def static "com.pttkpm.auth.AuthKeywords.loginWith"(
    	String username	
     , 	String password	) {
    (new com.pttkpm.auth.AuthKeywords()).loginWith(
        	username
         , 	password)
}

 /**
     * Gửi form đăng nhập nhưng KHÔNG yêu cầu thành công (dùng cho test sai mật khẩu, bỏ trống...)
     */ 
def static "com.pttkpm.auth.AuthKeywords.submitLoginForm"(
    	String username	
     , 	String password	) {
    (new com.pttkpm.auth.AuthKeywords()).submitLoginForm(
        	username
         , 	password)
}

 /**
     * Đăng xuất khỏi hệ thống
     */ 
def static "com.pttkpm.auth.AuthKeywords.logout"() {
    (new com.pttkpm.auth.AuthKeywords()).logout()
}

 /**
     * Điều hướng nhanh đến phân hệ theo path (ví dụ: '/employees', '/imports')
     */ 
def static "com.pttkpm.auth.AuthKeywords.navigateTo"(
    	String path	) {
    (new com.pttkpm.auth.AuthKeywords()).navigateTo(
        	path)
}


def static "com.pttkpm.partners.PartnerKeywords.addCustomer"(
    	String code	
     , 	String name	
     , 	String phone	
     , 	String email	) {
    (new com.pttkpm.partners.PartnerKeywords()).addCustomer(
        	code
         , 	name
         , 	phone
         , 	email)
}


def static "com.pttkpm.partners.PartnerKeywords.addSupplier"(
    	String code	
     , 	String name	
     , 	String phone	
     , 	String email	) {
    (new com.pttkpm.partners.PartnerKeywords()).addSupplier(
        	code
         , 	name
         , 	phone
         , 	email)
}

 /**
     * Bấm "Sửa" trên dòng theo mã (aria-label="Sửa {code}")
     */ 
def static "com.pttkpm.partners.PartnerKeywords.clickEdit"(
    	String code	) {
    (new com.pttkpm.partners.PartnerKeywords()).clickEdit(
        	code)
}

 /**
     * Bấm "Ngưng" hoặc "Kích hoạt" trên dòng theo mã
     */ 
def static "com.pttkpm.partners.PartnerKeywords.toggleStatus"(
    	String code	) {
    (new com.pttkpm.partners.PartnerKeywords()).toggleStatus(
        	code)
}

 /**
     * Điền thông tin chung phiếu nhập. supplier = null sẽ chọn NCC đầu tiên.
     */ 
def static "com.pttkpm.warehouse.WarehouseKeywords.fillImportHeader"(
    	String code	
     , 	String supplier	
     , 	String notes	) {
    (new com.pttkpm.warehouse.WarehouseKeywords()).fillImportHeader(
        	code
         , 	supplier
         , 	notes)
}

 /**
     * Điền một dòng nhập (index bắt đầu từ 0). variant = null sẽ chọn biến thể đầu tiên.
     */ 
def static "com.pttkpm.warehouse.WarehouseKeywords.fillImportLine"(
    	int index	
     , 	String unitCost	
     , 	String imeiText	
     , 	String variant	) {
    (new com.pttkpm.warehouse.WarehouseKeywords()).fillImportLine(
        	index
         , 	unitCost
         , 	imeiText
         , 	variant)
}


def static "com.pttkpm.warehouse.WarehouseKeywords.addImportLine"() {
    (new com.pttkpm.warehouse.WarehouseKeywords()).addImportLine()
}


def static "com.pttkpm.warehouse.WarehouseKeywords.submitImport"() {
    (new com.pttkpm.warehouse.WarehouseKeywords()).submitImport()
}

 /**
     * Tạo nhanh một phiếu nhập 1 dòng
     */ 
def static "com.pttkpm.warehouse.WarehouseKeywords.createImport"(
    	String code	
     , 	String unitCost	
     , 	String imeiText	
     , 	String supplier	
     , 	String variant	) {
    (new com.pttkpm.warehouse.WarehouseKeywords()).createImport(
        	code
         , 	unitCost
         , 	imeiText
         , 	supplier
         , 	variant)
}


def static "com.pttkpm.warehouse.WarehouseKeywords.fillImportHeader"(
    	String code	
     , 	String supplier	) {
    (new com.pttkpm.warehouse.WarehouseKeywords()).fillImportHeader(
        	code
         , 	supplier)
}


def static "com.pttkpm.warehouse.WarehouseKeywords.fillImportHeader"(
    	String code	) {
    (new com.pttkpm.warehouse.WarehouseKeywords()).fillImportHeader(
        	code)
}


def static "com.pttkpm.warehouse.WarehouseKeywords.fillImportLine"(
    	int index	
     , 	String unitCost	
     , 	String imeiText	) {
    (new com.pttkpm.warehouse.WarehouseKeywords()).fillImportLine(
        	index
         , 	unitCost
         , 	imeiText)
}


def static "com.pttkpm.warehouse.WarehouseKeywords.createImport"(
    	String code	
     , 	String unitCost	
     , 	String imeiText	
     , 	String supplier	) {
    (new com.pttkpm.warehouse.WarehouseKeywords()).createImport(
        	code
         , 	unitCost
         , 	imeiText
         , 	supplier)
}


def static "com.pttkpm.warehouse.WarehouseKeywords.createImport"(
    	String code	
     , 	String unitCost	
     , 	String imeiText	) {
    (new com.pttkpm.warehouse.WarehouseKeywords()).createImport(
        	code
         , 	unitCost
         , 	imeiText)
}

 /**
     * Tạo model sản phẩm. brand/origin/os để null sẽ chọn option đầu tiên có sẵn.
     */ 
def static "com.pttkpm.products.ProductKeywords.createModel"(
    	String code	
     , 	String name	
     , 	String brand	
     , 	String origin	
     , 	String os	) {
    (new com.pttkpm.products.ProductKeywords()).createModel(
        	code
         , 	name
         , 	brand
         , 	origin
         , 	os)
}

 /**
     * Bấm nút "Sửa" trên dòng model theo mã (aria-label="Sửa model {code}")
     */ 
def static "com.pttkpm.products.ProductKeywords.clickEditModel"(
    	String code	) {
    (new com.pttkpm.products.ProductKeywords()).clickEditModel(
        	code)
}

 /**
     * Đổi tên model đang sửa và bấm "Cập nhật model"
     */ 
def static "com.pttkpm.products.ProductKeywords.updateModelName"(
    	String code	
     , 	String newName	) {
    (new com.pttkpm.products.ProductKeywords()).updateModelName(
        	code
         , 	newName)
}

 /**
     * Tạo biến thể (RAM/ROM/Màu/Giá) cho model. Các select để null sẽ chọn option đầu tiên.
     */ 
def static "com.pttkpm.products.ProductKeywords.createVariant"(
    	String code	
     , 	String modelLabel	
     , 	String purchasePrice	
     , 	String sellingPrice	
     , 	String ram	
     , 	String rom	
     , 	String color	) {
    (new com.pttkpm.products.ProductKeywords()).createVariant(
        	code
         , 	modelLabel
         , 	purchasePrice
         , 	sellingPrice
         , 	ram
         , 	rom
         , 	color)
}

 /**
     * Tìm IMEI hoặc model trong khối "Danh sách IMEI"
     */ 
def static "com.pttkpm.products.ProductKeywords.searchInventory"(
    	String keyword	) {
    (new com.pttkpm.products.ProductKeywords()).searchInventory(
        	keyword)
}


def static "com.pttkpm.products.ProductKeywords.createModel"(
    	String code	
     , 	String name	
     , 	String brand	
     , 	String origin	) {
    (new com.pttkpm.products.ProductKeywords()).createModel(
        	code
         , 	name
         , 	brand
         , 	origin)
}


def static "com.pttkpm.products.ProductKeywords.createModel"(
    	String code	
     , 	String name	
     , 	String brand	) {
    (new com.pttkpm.products.ProductKeywords()).createModel(
        	code
         , 	name
         , 	brand)
}


def static "com.pttkpm.products.ProductKeywords.createModel"(
    	String code	
     , 	String name	) {
    (new com.pttkpm.products.ProductKeywords()).createModel(
        	code
         , 	name)
}


def static "com.pttkpm.products.ProductKeywords.createVariant"(
    	String code	
     , 	String modelLabel	
     , 	String purchasePrice	
     , 	String sellingPrice	
     , 	String ram	
     , 	String rom	) {
    (new com.pttkpm.products.ProductKeywords()).createVariant(
        	code
         , 	modelLabel
         , 	purchasePrice
         , 	sellingPrice
         , 	ram
         , 	rom)
}


def static "com.pttkpm.products.ProductKeywords.createVariant"(
    	String code	
     , 	String modelLabel	
     , 	String purchasePrice	
     , 	String sellingPrice	
     , 	String ram	) {
    (new com.pttkpm.products.ProductKeywords()).createVariant(
        	code
         , 	modelLabel
         , 	purchasePrice
         , 	sellingPrice
         , 	ram)
}


def static "com.pttkpm.products.ProductKeywords.createVariant"(
    	String code	
     , 	String modelLabel	
     , 	String purchasePrice	
     , 	String sellingPrice	) {
    (new com.pttkpm.products.ProductKeywords()).createVariant(
        	code
         , 	modelLabel
         , 	purchasePrice
         , 	sellingPrice)
}


def static "com.pttkpm.services.ServiceKeywords.createTicket"(
    	String code	
     , 	String imei	
     , 	String ticketType	
     , 	String issueDescription	
     , 	String receivedAt	) {
    (new com.pttkpm.services.ServiceKeywords()).createTicket(
        	code
         , 	imei
         , 	ticketType
         , 	issueDescription
         , 	receivedAt)
}


def static "com.pttkpm.services.ServiceKeywords.updateTicketStatus"(
    	String code	
     , 	String action	) {
    (new com.pttkpm.services.ServiceKeywords()).updateTicketStatus(
        	code
         , 	action)
}


def static "com.pttkpm.services.ServiceKeywords.exportExcel"() {
    (new com.pttkpm.services.ServiceKeywords()).exportExcel()
}


def static "com.pttkpm.services.ServiceKeywords.createTicket"(
    	String code	
     , 	String imei	
     , 	String ticketType	
     , 	String issueDescription	) {
    (new com.pttkpm.services.ServiceKeywords()).createTicket(
        	code
         , 	imei
         , 	ticketType
         , 	issueDescription)
}


def static "com.pttkpm.services.ServiceKeywords.createTicket"(
    	String code	
     , 	String imei	
     , 	String ticketType	) {
    (new com.pttkpm.services.ServiceKeywords()).createTicket(
        	code
         , 	imei
         , 	ticketType)
}


def static "com.pttkpm.services.ServiceKeywords.createTicket"(
    	String code	
     , 	String imei	) {
    (new com.pttkpm.services.ServiceKeywords()).createTicket(
        	code
         , 	imei)
}


def static "com.pttkpm.services.ServiceKeywords.createTicket"(
    	String code	) {
    (new com.pttkpm.services.ServiceKeywords()).createTicket(
        	code)
}


def static "com.pttkpm.statistics.StatisticsKeywords.applyDateFilter"(
    	String startDate	
     , 	String endDate	) {
    (new com.pttkpm.statistics.StatisticsKeywords()).applyDateFilter(
        	startDate
         , 	endDate)
}


def static "com.pttkpm.statistics.StatisticsKeywords.resetFilter"() {
    (new com.pttkpm.statistics.StatisticsKeywords()).resetFilter()
}


def static "com.pttkpm.statistics.StatisticsKeywords.exportRevenueCsv"() {
    (new com.pttkpm.statistics.StatisticsKeywords()).exportRevenueCsv()
}


def static "com.pttkpm.statistics.StatisticsKeywords.exportRevenueExcel"() {
    (new com.pttkpm.statistics.StatisticsKeywords()).exportRevenueExcel()
}


def static "com.pttkpm.statistics.StatisticsKeywords.exportInventoryCsv"() {
    (new com.pttkpm.statistics.StatisticsKeywords()).exportInventoryCsv()
}


def static "com.pttkpm.statistics.StatisticsKeywords.exportInventoryExcel"() {
    (new com.pttkpm.statistics.StatisticsKeywords()).exportInventoryExcel()
}


def static "com.pttkpm.exports.ExportKeywords.fillExportHeader"(
    	String code	
     , 	String customer	
     , 	String notes	
     , 	String soldAt	) {
    (new com.pttkpm.exports.ExportKeywords()).fillExportHeader(
        	code
         , 	customer
         , 	notes
         , 	soldAt)
}


def static "com.pttkpm.exports.ExportKeywords.fillExportLine"(
    	int index	
     , 	String unitPrice	
     , 	String imeiText	
     , 	String variant	) {
    (new com.pttkpm.exports.ExportKeywords()).fillExportLine(
        	index
         , 	unitPrice
         , 	imeiText
         , 	variant)
}


def static "com.pttkpm.exports.ExportKeywords.addExportLine"() {
    (new com.pttkpm.exports.ExportKeywords()).addExportLine()
}


def static "com.pttkpm.exports.ExportKeywords.submitExport"() {
    (new com.pttkpm.exports.ExportKeywords()).submitExport()
}


def static "com.pttkpm.exports.ExportKeywords.createExport"(
    	String code	
     , 	String unitPrice	
     , 	String imeiText	
     , 	String customer	
     , 	String variant	) {
    (new com.pttkpm.exports.ExportKeywords()).createExport(
        	code
         , 	unitPrice
         , 	imeiText
         , 	customer
         , 	variant)
}


def static "com.pttkpm.exports.ExportKeywords.exportExcel"() {
    (new com.pttkpm.exports.ExportKeywords()).exportExcel()
}


def static "com.pttkpm.exports.ExportKeywords.fillExportHeader"(
    	String code	
     , 	String customer	
     , 	String notes	) {
    (new com.pttkpm.exports.ExportKeywords()).fillExportHeader(
        	code
         , 	customer
         , 	notes)
}


def static "com.pttkpm.exports.ExportKeywords.fillExportHeader"(
    	String code	
     , 	String customer	) {
    (new com.pttkpm.exports.ExportKeywords()).fillExportHeader(
        	code
         , 	customer)
}


def static "com.pttkpm.exports.ExportKeywords.fillExportHeader"(
    	String code	) {
    (new com.pttkpm.exports.ExportKeywords()).fillExportHeader(
        	code)
}


def static "com.pttkpm.exports.ExportKeywords.fillExportLine"(
    	int index	
     , 	String unitPrice	
     , 	String imeiText	) {
    (new com.pttkpm.exports.ExportKeywords()).fillExportLine(
        	index
         , 	unitPrice
         , 	imeiText)
}


def static "com.pttkpm.exports.ExportKeywords.createExport"(
    	String code	
     , 	String unitPrice	
     , 	String imeiText	
     , 	String customer	) {
    (new com.pttkpm.exports.ExportKeywords()).createExport(
        	code
         , 	unitPrice
         , 	imeiText
         , 	customer)
}


def static "com.pttkpm.exports.ExportKeywords.createExport"(
    	String code	
     , 	String unitPrice	
     , 	String imeiText	) {
    (new com.pttkpm.exports.ExportKeywords()).createExport(
        	code
         , 	unitPrice
         , 	imeiText)
}


def static "com.pttkpm.attributes.AttributeKeywords.selectAttributeType"(
    	String label	) {
    (new com.pttkpm.attributes.AttributeKeywords()).selectAttributeType(
        	label)
}


def static "com.pttkpm.attributes.AttributeKeywords.addTextAttribute"(
    	String typeLabel	
     , 	String code	
     , 	String name	) {
    (new com.pttkpm.attributes.AttributeKeywords()).addTextAttribute(
        	typeLabel
         , 	code
         , 	name)
}


def static "com.pttkpm.attributes.AttributeKeywords.addSizeAttribute"(
    	String typeLabel	
     , 	String sizeGb	) {
    (new com.pttkpm.attributes.AttributeKeywords()).addSizeAttribute(
        	typeLabel
         , 	sizeGb)
}


def static "com.pttkpm.attributes.AttributeKeywords.clickEditAttribute"(
    	String codeOrLabel	) {
    (new com.pttkpm.attributes.AttributeKeywords()).clickEditAttribute(
        	codeOrLabel)
}


def static "com.pttkpm.attributes.AttributeKeywords.updateTextAttribute"(
    	String codeOrLabel	
     , 	String newName	) {
    (new com.pttkpm.attributes.AttributeKeywords()).updateTextAttribute(
        	codeOrLabel
         , 	newName)
}


def static "com.pttkpm.attributes.AttributeKeywords.toggleAttributeStatus"(
    	String codeOrLabel	) {
    (new com.pttkpm.attributes.AttributeKeywords()).toggleAttributeStatus(
        	codeOrLabel)
}


def static "com.pttkpm.attributes.AttributeKeywords.cancelEdit"() {
    (new com.pttkpm.attributes.AttributeKeywords()).cancelEdit()
}


def static "com.pttkpm.attributes.AttributeKeywords.exportExcel"() {
    (new com.pttkpm.attributes.AttributeKeywords()).exportExcel()
}
