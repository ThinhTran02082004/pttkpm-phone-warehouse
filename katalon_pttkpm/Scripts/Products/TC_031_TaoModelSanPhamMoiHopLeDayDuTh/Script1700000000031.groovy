import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_031: Tạo Model sản phẩm mới hợp lệ đầy đủ thông tin
// Phan he: Model sản phẩm | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
String code = DataGenerator.generateRandomCode('MDL')
ProductKeywords.createModel(code, 'Model ' + code)
WebUI.verifyEqual(WebUIHelper.verifySuccessBanner(), true, FailureHandling.STOP_ON_FAILURE)
WebUI.verifyEqual(WebUIHelper.verifyRowExists(code), true, FailureHandling.STOP_ON_FAILURE)
AuthKeywords.logout()

WebUI.closeBrowser()
