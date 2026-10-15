import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.attributes.AttributeKeywords

// TC_025: Chỉnh sửa thông tin tên thuộc tính
// Phan he: Thuộc tính sản phẩm | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/attributes')
AttributeKeywords.selectAttributeType('Thương hiệu')
AttributeKeywords.updateTextAttribute('Apple', 'Apple Global')
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
