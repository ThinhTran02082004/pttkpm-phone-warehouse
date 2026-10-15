import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.warehouse.WarehouseKeywords

// TC_079: Nhập ghi chú cho phiếu nhập kho
// Phan he: Nhập kho & IMEI | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/imports')
String code = DataGenerator.generateRandomCode('IMP')
WarehouseKeywords.fillImportHeader(code, null, 'Ghi chu nhap kho test')
WarehouseKeywords.fillImportLine(0, '15000000', DataGenerator.generateIMEIList(2))
WarehouseKeywords.submitImport()
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
