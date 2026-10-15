import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.statistics.StatisticsKeywords

// TC_169: Xuất Báo cáo Doanh thu ra file Excel
// Phan he: Báo cáo Thống kê & Dashboard | Do uu tien: P2

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/statistics')
StatisticsKeywords.exportRevenueExcel()
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
