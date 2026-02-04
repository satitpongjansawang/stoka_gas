/**
 * Stock Counting PWA - API Functions
 * Browser JavaScript version for Progressive Web App
 */

// AppSheet API Configuration
const APPSHEET_CONFIG = {
  appId: '01e6b78c-d614-4803-9045-aa7591ccff63',
  tableName: 'update_physical_counts',
  apiKey: 'V2-Axvzl-ldpHG-ma1Zj-ly2nj-XMuB6-XhPye-hiNm4-QDw3J'
};

/**
 * Search inventory data from AppSheet API
 * @param {string} plant - Plant location (e.g., 'SIAM', 'ASIA', 'THAI')
 * @param {string} countDate - Count date in MM/DD/YYYY format
 * @param {string} userEmail - User email for who_assigned filter
 * @returns {Promise<Object>} API result
 */
async function searchInventoryData(plant, countDate, userEmail) {
  try {
    const url = `https://api.appsheet.com/api/v2/apps/${APPSHEET_CONFIG.appId}/tables/${APPSHEET_CONFIG.tableName}/Action`;

    const payload = {
      "Action": "Find",
      "Properties": {
        "Locale": "en-US",
        "Selector": `Filter(${APPSHEET_CONFIG.tableName}, AND([plant] = '${plant}', [set_count_date] = '${countDate}', [who_assigned] = '${userEmail}'))`
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
 * Get plant list
 * @returns {Array} Plant list
 */
function getPlantList() {
  return [
    { value: 'SIAM', label: 'SIAM' },
    { value: 'ASIA', label: 'ASIA' },
    { value: 'THAI', label: 'THAI' }
  ];
}

/**
 * Save count data to AppSheet API
 * @param {Object} updateData - Data to update (must include 'Row ID')
 * @returns {Promise<Object>} API result
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
        message: 'Save successful'
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
 * Check if app is online
 * @returns {boolean} Online status
 */
function isOnline() {
  return navigator.onLine;
}

/**
 * Register for online/offline events
 * @param {Function} onlineCallback - Called when online
 * @param {Function} offlineCallback - Called when offline
 */
function registerConnectivityListeners(onlineCallback, offlineCallback) {
  window.addEventListener('online', onlineCallback);
  window.addEventListener('offline', offlineCallback);
}
