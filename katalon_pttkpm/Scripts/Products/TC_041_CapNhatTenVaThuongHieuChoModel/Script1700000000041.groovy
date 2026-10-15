import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_041: Cập nhật tên và thương hiệu cho Model sản phẩm
// Phan he: Model sản phẩm | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
ProductKeywords.updateModelName('IP15PM', 'iPhone 15 Pro Max Pro')
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
