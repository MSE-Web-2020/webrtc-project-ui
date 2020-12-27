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

class TestChat():
  def setup_method(self, method):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_chat(self):
    # 聊天模块
    # 1 | 打开主页
    self.driver.get("https://localhost:3030/?username=herrshen#")
    # 2 | 最大化窗口
    self.driver.set_window_size(1565, 847)
    # 3 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-input-wrapper > .ant-input").click()
    # 4 | 打字，测试聊天
    self.driver.find_element(By.CSS_SELECTOR, ".ant-input-wrapper > .ant-input").send_keys("测试聊天")
    # 5 |发送
    self.driver.find_element(By.CSS_SELECTOR, ".ant-input-wrapper > .ant-input").send_keys(Keys.ENTER)
    # 6 |
    self.driver.execute_script("window.scrollTo(0,0)")
    # 7 |
    element = self.driver.find_element(By.CSS_SELECTOR, ".ant-col-24 > .ant-dropdown-trigger > span:nth-child(1)")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    # 8 |
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element(element, 0, 0).perform()
    # 9 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-dropdown-menu-item-active").click()
    # 10 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-dropdown-menu-item-active").click()
    # 11 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-input-wrapper > .ant-input").click()
    # 12 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-dropdown-open > span:nth-child(1)").click()
    # 13 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-dropdown-menu-item-active").click()
    # 14 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-dropdown-open > span:nth-child(1)").click()
    # 15 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-dropdown-menu-item-active").click()
    # 16 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-dropdown-open > span:nth-child(1)").click()
    # 17 |
    self.driver.find_element(By.CSS_SELECTOR, ".ant-dropdown-menu-item-active").click()
  
