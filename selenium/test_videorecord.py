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
from time import sleep

class TestVideorecord():
  def setup_method(self, method):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_videorecord(self):
    # 视频录制
    # 1 | 打开主页
    self.driver.get("https://localhost:3030/?username=herrshen#")
    # 2 | 最大化窗口
    self.driver.set_window_size(1565, 847)
    # 3 | 共享摄像头
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(5) > .ant-col:nth-child(1) span").click()
    # 4 | 开始录制
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(7) > .ant-col:nth-child(1) span").click()
    # 5 | 录制10秒
    sleep(10)
    # 6 | 结束录制
    self.driver.find_element(By.CSS_SELECTOR, ".ant-btn-dashed > span:nth-child(2)").click()
    # 7 | 预览视频
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(8) > .ant-col:nth-child(2) span").click()
    # 8 | 保存录制
    element = self.driver.find_element(By.CSS_SELECTOR, ".ant-col-12 > .ant-dropdown-trigger > span:nth-child(1)")
    actions = ActionChains(self.driver)
    actions.move_to_element(element).perform()
    # 9 |
    element = self.driver.find_element(By.CSS_SELECTOR, "body")
    actions = ActionChains(self.driver)
    actions.move_to_element(element, 0, 0).perform()
    # 10 | 共享桌面
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(4) > .ant-col:nth-child(2) span").click()
    # 11 | 切换视频录制按钮
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(6) span").click()
    # 12 | 开始录制
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(7) > .ant-col:nth-child(1) span").click()
    # 13| 录制10秒
    sleep(10)
    # 14 | 结束录制
    self.driver.find_element(By.CSS_SELECTOR, ".ant-btn-dashed > span:nth-child(2)").click()
    # 15 | 切换预览视频按钮
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(8) > .ant-col:nth-child(1) span").click()
    # 16 | 预览视频
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(8) > .ant-col:nth-child(2) span").click()
    # 17 | 切换预览视频按钮
    self.driver.find_element(By.CSS_SELECTOR, ".ant-row:nth-child(8) > .ant-col:nth-child(1) span").click()
    # 18 | 应弹出 ”无可预览的存储视频文件！“的报错
    assert self.driver.switch_to.alert.text == "无可预览的存储视频文件！"
