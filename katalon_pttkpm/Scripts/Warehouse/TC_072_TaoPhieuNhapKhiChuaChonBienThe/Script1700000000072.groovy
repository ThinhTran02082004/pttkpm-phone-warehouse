import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.warehouse.WarehouseKeywords

// TC_072: Tạo phiếu nhập khi chưa chọn Biến thể nhập
// Phan he: Nhập kho & IMEI | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/imports')
WarehouseKeywords.submitImport()
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
