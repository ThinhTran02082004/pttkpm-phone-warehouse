import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.attributes.AttributeKeywords

// TC_028: Kích hoạt lại một thuộc tính đang ngưng hoạt động
// Phan he: Thuộc tính sản phẩm | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/attributes')
AttributeKeywords.selectAttributeType('Thương hiệu')
AttributeKeywords.toggleAttributeStatus('Apple')
WebUI.delay(1)
AttributeKeywords.toggleAttributeStatus('Apple')
AuthKeywords.logout()

WebUI.closeBrowser()
