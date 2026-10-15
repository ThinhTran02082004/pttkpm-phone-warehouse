import com.kms.katalon.core.main.TestCaseMain
import com.kms.katalon.core.logging.KeywordLogger
import com.kms.katalon.core.testcase.TestCaseBinding
import com.kms.katalon.core.driver.internal.DriverCleanerCollector
import com.kms.katalon.core.model.FailureHandling
import com.kms.katalon.core.configuration.RunConfiguration
import java.util.UUID
import com.kms.katalon.core.webui.contribution.WebUiDriverCleaner
import com.kms.katalon.core.mobile.contribution.MobileDriverCleaner
import com.kms.katalon.core.cucumber.keyword.internal.CucumberDriverCleaner
import com.kms.katalon.core.windows.keyword.contribution.WindowsDriverCleaner
import com.kms.katalon.core.llm.keyword.contribution.LlmDriverCleaner
import com.kms.katalon.core.testng.keyword.internal.TestNGDriverCleaner


import com.katalon.execution.application.ExecutionMain

DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.webui.contribution.WebUiDriverCleaner())
DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.mobile.contribution.MobileDriverCleaner())
DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.cucumber.keyword.internal.CucumberDriverCleaner())
DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.windows.keyword.contribution.WindowsDriverCleaner())
DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.llm.keyword.contribution.LlmDriverCleaner())
DriverCleanerCollector.getInstance().addDriverCleaner(new com.kms.katalon.core.testng.keyword.internal.TestNGDriverCleaner())


RunConfiguration.setExecutionSettingFile('C:\\Users\\trant\\AppData\\Local\\Temp\\Katalon\\Test Cases\\Auth\\TC_004_DangNhapThatBaiKhiTaiKhoanKhon\\20261015_223942_309\\execution.properties')

TestCaseMain.beforeStart()

new ExecutionMain().init();

Map<String, String> tcProperties = new HashMap<String, String>();

def __tcBinding = new TestCaseBinding('Test Cases/Auth/TC_004_DangNhapThatBaiKhiTaiKhoanKhon', [:])
if (__tcBinding != null) { __tcBinding.setTestCaseExecutionId(UUID.fromString('650e5ff4-5d76-4425-93e3-b907b2e9fdcb')) }


        TestCaseMain.runTestCase('Test Cases/Auth/TC_004_DangNhapThatBaiKhiTaiKhoanKhon', __tcBinding, FailureHandling.STOP_ON_FAILURE , false, tcProperties)
    
