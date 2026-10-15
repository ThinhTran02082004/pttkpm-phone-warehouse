import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.warehouse.WarehouseKeywords

// TC_085: Kiểm tra phân quyền: User không có quyền nhập kho
// Phan he: Nhập kho & IMEI | Do uu tien: P1

AuthKeywords.loginWith('sales01', '123456')
AuthKeywords.navigateTo('/imports')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
