import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper

// TC_012: Chặn truy cập trực tiếp đường dẫn /products khi chưa login
// Phan he: Xác thực & Điều hướng | Do uu tien: P1

WebUI.openBrowser('')
WebUI.navigateToUrl(GlobalVariable.BASE_URL + '/products')
WebUI.delay(2)
WebUI.verifyMatch(WebUI.getUrl(), '.*login.*', true)

WebUI.closeBrowser()
