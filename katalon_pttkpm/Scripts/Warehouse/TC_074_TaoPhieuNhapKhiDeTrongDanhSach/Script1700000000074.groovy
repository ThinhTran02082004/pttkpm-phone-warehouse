import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.warehouse.WarehouseKeywords

// TC_074: Tạo phiếu nhập khi để trống danh sách IMEI
// Phan he: Nhập kho & IMEI | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/imports')
WarehouseKeywords.submitImport()
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
