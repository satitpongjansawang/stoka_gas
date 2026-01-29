/**
 * Inventory Stock Counting Application
 * Browser JavaScript version (converted from Google Apps Script)
 * สำหรับ deploy บน web server ทั่วไป โดยไม่ต้อง authen กับ Google
 */

// AppSheet API Configuration
const APPSHEET_CONFIG = {
  appId: '01e6b78c-d614-4803-9045-aa7591ccff63',
  tableName: 'update_physical_counts',
  apiKey: 'V2-Axvzl-ldpHG-ma1Zj-ly2nj-XMuB6-XhPye-hiNm4-QDw3J'
};

/**
 * ค้นหาข้อมูลจาก AppSheet API
 * @param {string} plant - สถานที่นับ (เช่น 'SIAM')
 * @param {string} countDate - วันที่นับสต๊อก (รูปแบบ MM/DD/YYYY)
 * @returns {Promise<Object>} ผลลัพธ์จาก API
 */
async function searchInventoryData(plant, countDate) {
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

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ApplicationAccessKey': APPSHEET_CONFIG.apiKey
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data: data,
        count: Array.isArray(data) ? data.length : 0
      };
    } else {
      const errorText = await response.text();
      return {
        success: false,
        error: `API Error: ${response.status}`,
        details: errorText
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
 * ดึงรายการ Plant ที่มีในระบบ
 * @returns {Array} รายการ Plant
 */
function getPlantList() {
  return [
    { value: 'SIAM', label: 'SIAM' },
    { value: 'ASIA', label: 'ASIA' },
    { value: 'THAI', label: 'THAI' }
  ];
}

/**
 * บันทึกข้อมูลจำนวนนับไปยัง AppSheet API
 * @param {Object} updateData - ข้อมูลที่ต้องการอัพเดท (ต้องมี Row ID เป็น key)
 * @returns {Promise<Object>} ผลลัพธ์จาก API
 */
async function saveCountData(updateData) {
  try {
    const url = `https://api.appsheet.com/api/v2/apps/${APPSHEET_CONFIG.appId}/tables/${APPSHEET_CONFIG.tableName}/Action`;

    const payload = {
      "Action": "Edit",
      "Properties": {
        "Locale": "en-US",
        "Timezone": "Asia/Bangkok"
      },
      "Rows": [updateData]
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'ApplicationAccessKey': APPSHEET_CONFIG.apiKey
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data = await response.json();
      return {
        success: true,
        data: data,
        message: 'บันทึกข้อมูลสำเร็จ'
      };
    } else {
      const errorText = await response.text();
      return {
        success: false,
        error: `API Error: ${response.status}`,
        details: errorText
      };
    }

  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}
