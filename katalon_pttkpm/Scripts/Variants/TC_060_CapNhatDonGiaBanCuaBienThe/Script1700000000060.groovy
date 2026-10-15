import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_060: Cập nhật Đơn giá bán của Biến thể
// Phan he: Biến thể sản phẩm | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
WebUI.click(WebUIHelper.xpath("//button[contains(@aria-label, 'Sửa') and contains(@aria-label, 'VAR_')]"))
WebUIHelper.clearAndSetText(WebUIHelper.byId('variant-selling-price'), '29000000')
WebUI.click(WebUIHelper.primaryButton('Cập nhật biến thể'))
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
