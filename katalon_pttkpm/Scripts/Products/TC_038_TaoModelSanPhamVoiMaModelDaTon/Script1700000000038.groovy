import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_038: Tạo Model sản phẩm với Mã model đã tồn tại
// Phan he: Model sản phẩm | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
ProductKeywords.createModel('IP15PM', 'Duplicate Model')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
