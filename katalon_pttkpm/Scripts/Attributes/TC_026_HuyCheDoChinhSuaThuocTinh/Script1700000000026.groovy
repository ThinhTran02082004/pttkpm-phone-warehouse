import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.attributes.AttributeKeywords

// TC_026: Hủy chế độ chỉnh sửa thuộc tính
// Phan he: Thuộc tính sản phẩm | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/attributes')
AttributeKeywords.selectAttributeType('Thương hiệu')
AttributeKeywords.clickEditAttribute('Apple')
AttributeKeywords.cancelEdit()
AuthKeywords.logout()

WebUI.closeBrowser()
