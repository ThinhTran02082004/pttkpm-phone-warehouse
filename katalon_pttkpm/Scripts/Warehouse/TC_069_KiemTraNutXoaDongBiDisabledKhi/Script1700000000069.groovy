import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.warehouse.WarehouseKeywords

// TC_069: Kiểm tra nút 'Xóa dòng' bị disabled khi chỉ có 1 dòng
// Phan he: Nhập kho & IMEI | Do uu tien: P3

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/imports')
WarehouseKeywords.addImportLine()
WebUI.click(WebUIHelper.xpath("//button[normalize-space(.)='Xóa dòng']"))
AuthKeywords.logout()

WebUI.closeBrowser()
