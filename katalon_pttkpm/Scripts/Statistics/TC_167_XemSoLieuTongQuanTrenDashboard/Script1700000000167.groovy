import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.statistics.StatisticsKeywords

// TC_167: Xem số liệu tổng quan trên Dashboard vận hành
// Phan he: Báo cáo Thống kê & Dashboard | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/dashboard')
WebUI.waitForElementPresent(WebUIHelper.xpath("//section[contains(@class,'dashboard')] | //div[contains(@class,'overview-card')] | //div[contains(@class,'dashboard-grid')]"), 10)
AuthKeywords.logout()

WebUI.closeBrowser()
