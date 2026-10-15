import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_045: Kiểm tra hiển thị ảnh thumbnail trong bảng Model
// Phan he: Model sản phẩm | Do uu tien: P3

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
WebUI.waitForElementPresent(WebUIHelper.xpath("//table//tr"), 10)
AuthKeywords.logout()

WebUI.closeBrowser()
