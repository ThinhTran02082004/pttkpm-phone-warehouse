import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_034: Tạo Model sản phẩm khi để trống Tên model
// Phan he: Model sản phẩm | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
ProductKeywords.createModel('MDL_ERR_NONAME', '')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
