package com.pttkpm.common

import com.kms.katalon.core.annotation.Keyword
import java.util.Random

public class DataGenerator {

    private static Random rand = new Random()

    /**
     * Sinh số IMEI ngẫu nhiên 15 chữ số hợp lệ cho thiết bị di động
     */
    @Keyword
    public static String generateRandomIMEI() {
        StringBuilder imei = new StringBuilder("86")
        for (int i = 0; i < 13; i++) {
            imei.append(rand.nextInt(10))
        }
        return imei.toString()
    }

    /**
     * Sinh danh sách nhiều số IMEI ngăn cách bằng dấu xuống dòng để nhập kho
     */
    @Keyword
    public static String generateIMEIList(int count) {
        StringBuilder list = new StringBuilder()
        for (int i = 0; i < count; i++) {
            list.append(generateRandomIMEI())
            if (i < count - 1) {
                list.append("\n")
            }
        }
        return list.toString()
    }

    /**
     * Sinh số điện thoại Việt Nam ngẫu nhiên 10 số (bắt đầu bằng 09...)
     */
    @Keyword
    public static String generateRandomPhone() {
        StringBuilder phone = new StringBuilder("09")
        for (int i = 0; i < 8; i++) {
            phone.append(rand.nextInt(10))
        }
        return phone.toString()
    }

    /**
     * Sinh email ngẫu nhiên hợp lệ
     */
    @Keyword
    public static String generateRandomEmail(String prefix) {
        long timestamp = System.currentTimeMillis() % 1000000
        return prefix.toLowerCase() + "_" + timestamp + "@testmail.com"
    }

    /**
     * Sinh mã định danh ngẫu nhiên (VD: EMP_12345, IMP_67890)
     */
    @Keyword
    public static String generateRandomCode(String prefix) {
        long timestamp = System.currentTimeMillis() % 100000
        return prefix + "_" + timestamp
    }
}
