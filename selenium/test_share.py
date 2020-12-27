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

class TestShare():
  def setup_method(self, method):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_share(self):
    # 共享模块
    # 1 | 打开主页
    self.driver.get("https://localhost:3030/?username=herrshen#")
    # 2 | 最大化窗口
    self.driver.set_window_size(1550, 847)
    # 3 | 左侧的共享摄像头按钮
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(5) > .ant-col:nth-child(1) span").click()
    # 4 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(5) > .ant-col:nth-child(1) span").click()
    # 5 | 右侧的共享摄像头按钮
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(5) > .ant-col:nth-child(2) span").click()
    # 6 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(5) > .ant-col:nth-child(2) span").click()
    # 7 | 共享桌面
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(4) > .ant-col:nth-child(2) span").click()
    # 8 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(4) > .ant-col:nth-child(2) span").click()
    # 9 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(4) > .ant-col:nth-child(2) span").click()
  
