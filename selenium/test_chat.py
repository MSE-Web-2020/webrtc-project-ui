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

# 聊天模块
driver=webdriver.Chrome()
driver.get("https://webrtc.april8.xyz/?username=herrshen#")
driver.set_window_size(1565, 847)
driver.find_element(By.CSS_SELECTOR, ".ant-input-wrapper > .ant-input").click()
# 打字，测试聊天
driver.find_element(By.CSS_SELECTOR, ".ant-input-wrapper > .ant-input").send_keys("测试聊天")
# 发送
driver.find_element(By.CSS_SELECTOR, ".ant-input-wrapper > .ant-input").send_keys(Keys.ENTER)
# driver.execute_script("window.scrollTo(0,0)")
element = driver.find_element(By.CSS_SELECTOR, ".ant-col-24 > .ant-dropdown-trigger > span:nth-child(1)")
actions = ActionChains(driver)
actions.move_to_element(element).perform()
# 选中更多功能
element = driver.find_element(By.CSS_SELECTOR, "body")
actions = ActionChains(driver)
actions.move_to_element(element, 0, 0).perform()
driver.find_element(By.CSS_SELECTOR, ".ant-dropdown-menu-item-active").click()
