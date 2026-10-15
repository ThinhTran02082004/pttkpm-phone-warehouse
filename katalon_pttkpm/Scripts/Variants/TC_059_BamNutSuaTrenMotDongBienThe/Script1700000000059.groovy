import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_059: Bấm nút 'Sửa' trên một dòng Biến thể
// Phan he: Biến thể sản phẩm | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
WebUI.click(WebUIHelper.xpath("//button[contains(@aria-label, 'Sửa') and contains(@aria-label, 'VAR_')]"))
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
