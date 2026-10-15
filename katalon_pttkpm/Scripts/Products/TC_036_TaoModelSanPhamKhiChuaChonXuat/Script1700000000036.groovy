import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_036: Tạo Model sản phẩm khi chưa chọn Xuất xứ
// Phan he: Model sản phẩm | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
WebUIHelper.clearAndSetText(WebUIHelper.byId('product-model-code'), 'MDL_NOATTR')
WebUIHelper.clearAndSetText(WebUIHelper.byId('product-model-name'), 'Model Missing Attr')
WebUI.click(WebUIHelper.primaryButton('Lưu model'))
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
