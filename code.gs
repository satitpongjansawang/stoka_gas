/**
 * Inventory Stock Counting Application
 * สำหรับกิจกรรมนับสต๊อกประจำปีของคลังสินค้า
 */

// AppSheet API Configuration
const APPSHEET_CONFIG = {
  appId: '01e6b78c-d614-4803-9045-aa7591ccff63',
  tableName: 'update_physical_counts',
  apiKey: 'V2-Axvzl-ldpHG-ma1Zj-ly2nj-XMuB6-XhPye-hiNm4-QDw3J'
};

/**
 * แสดงหน้า Web App
 */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Inventory Stock Counting')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * ค้นหาข้อมูลจาก AppSheet API
 * @param {string} plant - สถานที่นับ (เช่น 'SIAM')
 * @param {string} countDate - วันที่นับสต๊อก (รูปแบบ MM/DD/YYYY)
 * @returns {Object} ผลลัพธ์จาก API
 */
function searchInventoryData(plant, countDate) {
  try {
    const url = `https://api.appsheet.com/api/v2/apps/${APPSHEET_CONFIG.appId}/tables/${APPSHEET_CONFIG.tableName}/Action`;

    const payload = {
      "Action": "Find",
      "Properties": {
        "Locale": "en-US",
        "Selector": `Filter(${APPSHEET_CONFIG.tableName}, AND([plant] = '${plant}', [set_count_date] = '${countDate}'))`
      },
      "Rows": []
    };

    const options = {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'ApplicationAccessKey': APPSHEET_CONFIG.apiKey
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (responseCode === 200) {
      const data = JSON.parse(responseText);
      return {
        success: true,
        data: data,
        count: Array.isArray(data) ? data.length : 0
      };
    } else {
      return {
        success: false,
        error: `API Error: ${responseCode}`,
        details: responseText
      };
    }

  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * ดึงรายการ Plant ที่มีในระบบ (สามารถปรับแต่งได้ตามความต้องการ)
 * @returns {Array} รายการ Plant
 */
function getPlantList() {
  // รายการ Plant - สามารถปรับแต่งหรือดึงจาก database ได้
  return [
    { value: 'SIAM', label: 'SIAM' },
    { value: 'THAI', label: 'THAI' }
  ];
}

/**
 * ตรวจสอบว่า API Key ถูกต้องหรือไม่
 * @param {string} apiKey - AppSheet API Key
 * @returns {Object} ผลการตรวจสอบ
 */
function validateApiKey(apiKey) {
  if (!apiKey || apiKey.trim() === '') {
    return {
      valid: false,
      message: 'กรุณาใส่ API Key'
    };
  }
  return {
    valid: true,
    message: 'API Key ถูกต้อง'
  };
}

/**
 * บันทึกข้อมูลจำนวนนับไปยัง AppSheet API
 * @param {Object} updateData - ข้อมูลที่ต้องการอัพเดท
 * @returns {Object} ผลลัพธ์จาก API
 */
function saveCountData(updateData) {
  try {
    const url = `https://api.appsheet.com/api/v2/apps/${APPSHEET_CONFIG.appId}/tables/${APPSHEET_CONFIG.tableName}/Action`;

    const payload = {
      "Action": "Edit",
      "Properties": {
        "Locale": "en-US"
      },
      "Rows": [updateData]
    };

    const options = {
      method: 'POST',
      contentType: 'application/json',
      headers: {
        'ApplicationAccessKey': APPSHEET_CONFIG.apiKey
      },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();

    if (responseCode === 200) {
      const data = JSON.parse(responseText);
      return {
        success: true,
        data: data,
        message: 'บันทึกข้อมูลสำเร็จ'
      };
    } else {
      return {
        success: false,
        error: `API Error: ${responseCode}`,
        details: responseText
      };
    }

  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}
