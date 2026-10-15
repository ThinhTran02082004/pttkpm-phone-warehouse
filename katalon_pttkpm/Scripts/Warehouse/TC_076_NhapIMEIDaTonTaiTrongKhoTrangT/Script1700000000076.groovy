import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.warehouse.WarehouseKeywords

// TC_076: Nhập IMEI đã tồn tại trong kho (trạng thái in_stock)
// Phan he: Nhập kho & IMEI | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/imports')
String code = DataGenerator.generateRandomCode('IMP')
WarehouseKeywords.createImport(code, '15000000', '864201060000001\n864201060000001')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
