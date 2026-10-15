package com.pttkpm.services

import com.kms.katalon.core.annotation.Keyword
import com.kms.katalon.core.webui.keyword.WebUiBuiltInKeywords as WebUI
import com.pttkpm.common.WebUIHelper as H

/**
 * Keyword cho trang /services (ServicesPage.jsx)
 */
public class ServiceKeywords {

    @Keyword
    public static void createTicket(String code, String imei = null, String ticketType = 'warranty', String issueDescription = '', String receivedAt = '') {
        H.clearAndSetText(H.byId('service-code'), code)
        if (imei) {
            H.selectOption(H.byId('service-imei'), imei)
        } else {
            H.selectOption(H.byId('service-imei'), null)
        }
        H.selectOption(H.byId('service-ticket-type'), ticketType)
        if (receivedAt) {
            H.clearAndSetText(H.byId('service-received-at'), receivedAt)
        }
        if (issueDescription) {
            H.clearAndSetText(H.byId('service-issue'), issueDescription)
        }
        WebUI.click(H.primaryButton('Lưu phiếu dịch vụ'))
    }

    @Keyword
    public static void updateTicketStatus(String code, String action) {
        WebUI.click(H.xpath("//button[contains(@aria-label, '" + code + "') and contains(@aria-label, '" + action + "')]"))
    }

    @Keyword
    public static void exportExcel() {
        WebUI.click(H.xpath("//button[normalize-space(.)='Xuất Excel']"))
    }
}
