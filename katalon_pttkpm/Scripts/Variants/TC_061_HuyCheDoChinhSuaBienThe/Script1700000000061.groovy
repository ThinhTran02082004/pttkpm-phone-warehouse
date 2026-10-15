import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_061: Hủy chế độ chỉnh sửa Biến thể
// Phan he: Biến thể sản phẩm | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
WebUI.click(WebUIHelper.xpath("//button[contains(@aria-label, 'Sửa') and contains(@aria-label, 'VAR_')]"))
WebUI.click(WebUIHelper.xpath("//button[normalize-space(.)='Hủy chỉnh sửa']"))
AuthKeywords.logout()

WebUI.closeBrowser()
