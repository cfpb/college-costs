"""
script to automate downloading of paying-for-college data update

alternate method: download full survey data files and harvest needed fields
- manual method:
    - go to datafiles page: https://nces.ed.gov/ipeds/datacenter/DataFiles.aspx
    - choose latest year
    - choose Institutional Characteristics suite
      - download HD2013, IC2013, IC2013_AY
    - choose Fall Enrollment
      - download EF2013D
    - choose Graduation Rates
      - download GR2013
    choose Student Financial Aid and Net Price
      -download SFA1213
- direct method: download specific urls
    - Institutional Characteristics - directory info: http://nces.ed.gov/ipeds/datacenter/data/HD2013.zip
    - Institutional Characteristics - educational offerings: https://nces.ed.gov/ipeds/datacenter/data/IC2013.zip
    - Institutional Characteristics - student charges: https://nces.ed.gov/ipeds/datacenter/data/IC2013_AY.zip
    - Fall Enrollment: http://nces.ed.gov/ipeds/datacenter/data/EF2013D.zip
    - Graduation Rates: http://nces.ed.gov/ipeds/datacenter/data/GR2013.zip
    - Student Financial Aid and Net Price: http://nces.ed.gov/ipeds/datacenter/data/SFA1213.zip

- harvest according to Dynamic Disclosures Data Guide 2015-09-24
"""
import datetime
import time
import os
import gzip
import zipfile

from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

SCRIPT = os.path.basename(__file__)
IPEDS_URL = "http://nces.ed.gov/ipeds/datacenter/"
LATEST_YEAR = datetime.datetime.now().year-2
DIRECTORY_IDS = {'city': 'cbVar_1_110_101_10011',
                 'state': 'cbVar_1_110_101_10016',
                 'zip': 'cbVar_1_110_101_10021',
                 'control': 'cbVar_1_110_101_10096',
                 'highest_level': 'cbVar_1_110_101_10101',
                 'undergraduate': 'cbVar_1_110_101_10106',
                 'graduate': 'cbVar_1_110_101_10111'}
# 'on_campus': '',# missing from directory info

STUDENT_CHARGE_IDS = {'in_district_tuition': 'cbVar_13_609_170_11951',
                      'in_state_tuition': 'cbVar_13_609_170_11966',
                      'out_state_tuition': 'cbVar_13_609_170_11981',
                      'campus_room': 'cbVar_13_609_170_12011',
                      'off_campus_room_no_fam': 'cbVar_13_609_170_12041',
                      'campus_other': 'cbVar_13_609_170_12026',
                      'off_campus_other_fam': 'cbVar_13_609_170_12071',
                      'off_campus_other_no_fam': 'cbVar_13_609_170_12056',
                      'books': 'cbVar_13_609_170_11996'}

INSTATE_IDS = {'avg_net_grants': 'cbVar_7_512_397_70711',
               'avg_net_0k': 'cbVar_7_512_397_70726',
               'avg_net_30k': 'cbVar_7_512_397_70731',
               'avg_net_48k': 'cbVar_7_512_397_70736',
               'avg_net_75k': 'cbVar_7_512_397_70741',
               'avg_net_110k': 'cbVar_7_512_397_70746'}

ALL_STUDENT_IDS = {'avg_net_grants': 'cbVar_7_512_398_70966',
                   'avg_net_0k': 'cbVar_7_512_398_70981',
                   'avg_net_30k': 'cbVar_7_512_398_70986',
                   'avg_net_48k': 'cbVar_7_512_398_70991',
                   'avg_net_75k': 'cbVar_7_512_398_70996',
                   'avg_net_110k': 'cbVar_7_512_398_71001'}


def select_ids(ID_dict, driver):
    """select a batch of fields by ID"""
    for ID in ID_dict:
        driver.find_element_by_id(ID_dict[ID]).click()


def download_tuition(folder):
    """download selected tuition-data fields from IPEDS"""
    chromeOptions = webdriver.ChromeOptions()
    prefs = {"download.default_directory": folder}
    chromeOptions.add_experimental_option("prefs", prefs)
    driver = webdriver.Chrome(chrome_options=chromeOptions)
    driver.get(IPEDS_URL)
    driver.implicitly_wait(30)
    driver.find_element_by_id('tdInstData').find_element_by_tag_name('a').click()
    driver.find_element_by_id('ibtnLoginLevelOne').click()
    driver.find_element_by_link_text('By Groups').click()
    driver.find_element_by_link_text('EZ Group').click()
    driver.find_element_by_id('10001:misc').click()
    try:
        driver.find_element_by_id('contentPlaceHolder_ibtnSearch').click()
    except:
        time.sleep(1)
        try:
            driver.find_element_by_id('contentPlaceHolder_ibtnSearch').click()
        except:
            driver.quit()
    try:
        driver.find_element_by_xpath("//img[contains(@title,'Continue')]").click()
    except:
        time.sleep(1)
        try:
            driver.find_element_by_xpath("//img[contains(@title,'Continue')]").click()
        except:
            driver.quit()
    driver.find_element_by_id('divSurveyTitle1').click()
    driver.find_element_by_id('divFileTitle110').click()
    driver.find_element_by_id('divSectionTitle101_110').click()
    driver.find_element_by_id('cbYear_1_110_101_%s' % LATEST_YEAR).click()
    select_ids(DIRECTORY_IDS, driver)
    driver.find_element_by_id('divSection163_110').click()  # special learning
    driver.find_element_by_id('cbYear_1_110_163_%s' % LATEST_YEAR).click()
    driver.find_element_by_id('cbVar_1_110_163_15401').click()  # distance ed
    driver.find_element_by_id('divSurvey13').click()  # student charges
    driver.find_element_by_id('divFile609').click()
    driver.find_element_by_id('divSection170_609').click()
    driver.find_element_by_id('cbYear_13_609_170_%s' % LATEST_YEAR).click()
    select_ids(STUDENT_CHARGE_IDS, driver)
    driver.find_element_by_id('divSurvey7').click()  # aid, net price
    driver.find_element_by_id('divFile512').click()  # avg net price
    driver.find_element_by_id('divSection397_512').click()  # students in-state
    driver.find_element_by_id('cbYear_7_512_397_%s' % LATEST_YEAR).click()
    select_ids(INSTATE_IDS, driver)
    driver.find_element_by_id('divSection398_512').click()  # all students
    driver.find_element_by_id('cbYear_7_512_398_%s' % LATEST_YEAR).click()
    select_ids(ALL_STUDENT_IDS, driver)
    driver.find_element_by_id('imgContinueButton').click()
    try:
        driver.find_element_by_id('contentMainBody_iActionButton').click()
    except:
        time.sleep(2)
        try:
            driver.find_element_by_id('contentMainBody_iActionButton').click()
        except:
            driver.quit()
    try:
        driver.find_element_by_id('contentPlaceHolder_imgbtnGetCustomDataSet').click()
    except:
        time.sleep(2)
        try:
            driver.find_element_by_id('contentPlaceHolder_imgbtnGetCustomDataSet').click()
        except:
            driver.quit()
    time.sleep(10)
    driver.quit()
#
#
# if __name__ == '__main__':
#     starter = datetime.datetime.now()
#     download_folder = sys.argv[1]
#     download_tuition(download_folder)
#     endmsg = "%s took %s to download tuition data from IPEDS"
#     print endmsg % (SCRIPT, (datetime.datetime.now()-starter))
