import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_047: Kiểm tra danh sách dropdown Thương hiệu đồng bộ từ Module Thuộc tính
// Phan he: Model sản phẩm | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
WebUI.waitForElementPresent(WebUIHelper.byId('product-brand'), 5)
AuthKeywords.logout()

WebUI.closeBrowser()
