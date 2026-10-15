import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_055: Tạo Biến thể với Đơn giá nhập âm hoặc bằng 0
// Phan he: Biến thể sản phẩm | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
String code = DataGenerator.generateRandomCode('VAR')
ProductKeywords.createVariant(code, null, '25000000', '20000000')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
