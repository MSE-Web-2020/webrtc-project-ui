import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

# 视频录制模块(当只有一个人时）
driver=webdriver.Chrome()
driver.get("https://webrtc.april8.xyz/?username=herrshen#")
time.sleep(5)
driver.set_window_size(1565, 847)
# 共享摄像头
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(4) > .ant-col:nth-child(2) span").click()
# 开始录制
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(6) > .ant-col:nth-child(1) > .ant-btn").click()
# 录制10秒
time.sleep(10)
# 结束录制
driver.find_element(By.CSS_SELECTOR, ".ant-btn-dashed > span:nth-child(2)").click()
# 预览视频
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(7) > .ant-col:nth-child(2) span").click()
time.sleep(10)
# 保存录制
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(6) > .ant-col:nth-child(2) span").click()
'''
element = driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(6) > .ant-col:nth-child(2) span")
actions = ActionChains(driver)
actions.move_to_element(element).perform()
element = driver.find_element(By.CSS_SELECTOR, "body")
actions = ActionChains(driver)
actions.move_to_element(element, 0, 0).perform()
driver.find_element(By.CSS_SELECTOR, ".ant-btn-primary:nth-child(2) > span").click()
'''
time.sleep(5)
# 切换视频录制按钮
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(5) span").click()
# 开始录制
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(6) > .ant-col:nth-child(1) span").click()
# 报错"没有视频信息"
assert driver.switch_to.alert.text == "没有视频信息"
time.sleep(5)
# 切换预览视频按钮
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(7) > .ant-col:nth-child(1) > .ant-btn").click()
# 预览视频
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(7) > .ant-col:nth-child(2) span").click()
# 报错""无可预览的存储视频文件！
assert driver.switch_to.alert.text == "无可预览的存储视频文件！"
time.sleep(5)
