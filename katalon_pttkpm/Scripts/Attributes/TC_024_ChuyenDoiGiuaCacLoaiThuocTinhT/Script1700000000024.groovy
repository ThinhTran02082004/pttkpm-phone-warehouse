import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.attributes.AttributeKeywords

// TC_024: Chuyển đổi giữa các loại thuộc tính trong dropdown
// Phan he: Thuộc tính sản phẩm | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/attributes')
AttributeKeywords.selectAttributeType('Xuất xứ')
AttributeKeywords.selectAttributeType('Màu sắc')
AuthKeywords.logout()

WebUI.closeBrowser()
