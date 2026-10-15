import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_044: Kích hoạt lại Model sản phẩm đang ngưng
// Phan he: Model sản phẩm | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
WebUI.click(WebUIHelper.xpath("//button[@aria-label='Ngưng IP15PM' or @aria-label='Kích hoạt IP15PM']"))
WebUI.delay(1)
WebUI.click(WebUIHelper.xpath("//button[@aria-label='Ngưng IP15PM' or @aria-label='Kích hoạt IP15PM']"))
AuthKeywords.logout()

WebUI.closeBrowser()
