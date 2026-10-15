package com.pttkpm.statistics

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.pttkpm.common.WebUIHelper as H

/**
 * Keyword cho trang /statistics (StatisticsPage.jsx)
 */
public class StatisticsKeywords {

    @Keyword
    public static void applyDateFilter(String startDate, String endDate) {
        H.clearAndSetText(H.byId('statistics-start-date'), startDate)
        H.clearAndSetText(H.byId('statistics-end-date'), endDate)
        WebUI.click(H.xpath("//button[@data-testid='statistics-apply-filter']"))
    }

    @Keyword
    public static void resetFilter() {
        WebUI.click(H.xpath("//button[normalize-space(.)='Đặt lại']"))
    }

    @Keyword
    public static void exportRevenueCsv() {
        WebUI.click(H.xpath("//button[@data-testid='statistics-export-revenue']"))
    }

    @Keyword
    public static void exportRevenueExcel() {
        WebUI.click(H.xpath("//button[normalize-space(.)='Xuất doanh thu Excel']"))
    }

    @Keyword
    public static void exportInventoryCsv() {
        WebUI.click(H.xpath("//button[@data-testid='statistics-export-inventory']"))
    }

    @Keyword
    public static void exportInventoryExcel() {
        WebUI.click(H.xpath("//button[normalize-space(.)='Xuất tồn kho Excel']"))
    }
}
