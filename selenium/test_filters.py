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

# 特效与滤镜模块(当只有一个人时）
driver=webdriver.Chrome()
driver.get("https://webrtc.april8.xyz/?username=herrshen#")
time.sleep(3)
driver.set_window_size(1565, 847)
# 共享摄像头
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(4) > .ant-col:nth-child(2) span").click()
'''
# 特效截图
element = driver.find_element(By.CSS_SELECTOR, ".ant-col-12 > .ant-dropdown-trigger")
actions = ActionChains(driver)
actions.move_to_element(element).perform()
element = driver.find_element(By.CSS_SELECTOR, "body")
actions = ActionChains(driver)
actions.move_to_element(element, 0, 0).perform()
driver.find_element(By.CSS_SELECTOR, ".ant-dropdown-menu-item-active").click()
'''
# 切换5种视频滤镜
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(8) > .ant-col:nth-child(2) span").click()
time.sleep(3)
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(8) > .ant-col:nth-child(2) span").click()
time.sleep(3)
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(8) > .ant-col:nth-child(2) span").click()
time.sleep(3)
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(8) > .ant-col:nth-child(2) span").click()
time.sleep(3)
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(8) > .ant-col:nth-child(2) span").click()
time.sleep(3)
# 切换特效截图窗口
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(9) > .ant-col:nth-child(1) span").click()
'''
# 特效截图
element = driver.find_element(By.CSS_SELECTOR, ".ant-col-12 > .ant-dropdown-trigger")
actions = ActionChains(driver)
actions.move_to_element(element).perform()
element = driver.find_element(By.CSS_SELECTOR, "body")
actions = ActionChains(driver)
actions.move_to_element(element, 0, 0).perform()
driver.find_element(By.CSS_SELECTOR, ".ant-dropdown-menu-item-active").click()
# 报错"无视频信息！"
assert self.driver.switch_to.alert.text == "无视频信息！"
'''
# 切换滤镜窗口
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(8) > .ant-col:nth-child(1) span").click()
# 切换视频滤镜
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(8) > .ant-col:nth-child(2) span").click()
# 报错"无视频信息"
assert driver.switch_to.alert.text == "无视频信息"
