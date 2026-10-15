import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.attributes.AttributeKeywords

// TC_021: Thêm mới thuộc tính RAM khi để trống trường dung lượng
// Phan he: Thuộc tính sản phẩm | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/attributes')
AttributeKeywords.addSizeAttribute('RAM', '')
WebUI.delay(1)
AuthKeywords.logout()

WebUI.closeBrowser()
