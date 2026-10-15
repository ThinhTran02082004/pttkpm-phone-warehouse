import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_064: Xuất danh sách Biến thể ra file Excel
// Phan he: Biến thể sản phẩm | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
WebUI.click(WebUIHelper.xpath("//button[normalize-space(.)='Xuất Excel']"))
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
