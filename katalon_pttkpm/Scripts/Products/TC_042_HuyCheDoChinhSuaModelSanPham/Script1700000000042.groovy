import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.products.ProductKeywords

// TC_042: Hủy chế độ chỉnh sửa Model sản phẩm
// Phan he: Model sản phẩm | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/products')
ProductKeywords.clickEditModel('IP15PM')
WebUI.click(WebUIHelper.xpath("//button[normalize-space(.)='Hủy chỉnh sửa']"))
AuthKeywords.logout()

WebUI.closeBrowser()
