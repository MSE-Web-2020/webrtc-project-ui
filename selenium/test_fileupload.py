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

class TestFileupload():
  def setup_method(self, method):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_fileupload(self):
    # 文件上传模块
    # 1 | 打开主页
    self.driver.get("https://localhost:3030/?username=herrshen#")
    # 2 | 最大化窗口
    self.driver.set_window_size(1565, 847)
    # 3 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-btn:nth-child(2) > span").click()
  
