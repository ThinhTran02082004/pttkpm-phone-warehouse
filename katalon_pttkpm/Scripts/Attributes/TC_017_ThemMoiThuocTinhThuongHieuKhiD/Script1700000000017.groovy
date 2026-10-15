import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.attributes.AttributeKeywords

// TC_017: Thêm mới thuộc tính Thương hiệu khi để trống Tên
// Phan he: Thuộc tính sản phẩm | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/attributes')
AttributeKeywords.addTextAttribute('Thương hiệu', 'BR_ERR', '')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
