import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.attributes.AttributeKeywords

// TC_023: Thêm mới thuộc tính Màu sắc (Color) hợp lệ
// Phan he: Thuộc tính sản phẩm | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/attributes')
String code = DataGenerator.generateRandomCode('COL')
AttributeKeywords.addTextAttribute('Màu sắc', code, 'Titan ' + code)
WebUI.verifyEqual(WebUIHelper.verifySuccessBanner(), true, FailureHandling.STOP_ON_FAILURE)
AuthKeywords.logout()

WebUI.closeBrowser()
