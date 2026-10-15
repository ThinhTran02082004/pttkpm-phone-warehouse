import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import internal.GlobalVariable
import com.pttkpm.auth.AuthKeywords
import com.pttkpm.common.DataGenerator
import com.pttkpm.common.WebUIHelper
import com.pttkpm.statistics.StatisticsKeywords

// TC_168: Lọc báo cáo thống kê theo khoảng thời gian tùy chọn
// Phan he: Báo cáo Thống kê & Dashboard | Do uu tien: P1

AuthKeywords.loginAsAdmin()
AuthKeywords.navigateTo('/statistics')
StatisticsKeywords.applyDateFilter('2026-01-01', '2026-12-31')
WebUI.delay(2)
AuthKeywords.logout()

WebUI.closeBrowser()
