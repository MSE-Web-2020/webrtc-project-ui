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

# 共享模块
driver=webdriver.Chrome()
driver.get("https://webrtc.april8.xyz/?username=herrshen#")
driver.set_window_size(1565, 847)
# 共享摄像头
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(4) > .ant-col:nth-child(2) span").click()
time.sleep(5)
# 共享桌面
driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(4) > .ant-col:nth-child(1) span").click()
