package internal

import com.kms.katalon.core.configuration.RunConfiguration
import com.kms.katalon.core.main.TestCaseMain


/**
 * This class is generated automatically by Katalon Studio and should not be modified or deleted.
 */
public class GlobalVariable {
     
    /**
     * <p>Profile default : Đường dẫn Frontend web application</p>
     */
    public static Object BASE_URL
     
    /**
     * <p>Profile default : T&ecirc;n đăng nhập Admin</p>
     */
    public static Object ADMIN_USER
     
    /**
     * <p>Profile default : Mật khẩu Admin</p>
     */
    public static Object ADMIN_PASS
     
    /**
     * <p>Profile default : T&ecirc;n đăng nhập Quản l&yacute; kho</p>
     */
    public static Object WAREHOUSE_USER
     
    /**
     * <p>Profile default : Thời gian chờ timeout mặc định (gi&acirc;y)</p>
     */
    public static Object DEFAULT_TIMEOUT
     

    static {
        try {
            def selectedVariables = TestCaseMain.getGlobalVariables('default')
			selectedVariables += TestCaseMain.getGlobalVariables(RunConfiguration.getExecutionProfile())
    
            BASE_URL = selectedVariables['BASE_URL']
            ADMIN_USER = selectedVariables['ADMIN_USER']
            ADMIN_PASS = selectedVariables['ADMIN_PASS']
            WAREHOUSE_USER = selectedVariables['WAREHOUSE_USER']
            DEFAULT_TIMEOUT = selectedVariables['DEFAULT_TIMEOUT']
            
        } catch (Exception e) {
            TestCaseMain.logGlobalVariableError(e)
        }
    }
}
