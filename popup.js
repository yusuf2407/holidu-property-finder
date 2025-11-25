// Initialize elements
let btnApartmentId = document.getElementById('btnApartmentId');
let txtApartmentId = document.getElementById('apartmentId');

let selDomain = document.getElementById('domain');

var settings = {
  page : 'checkout'
};

// Reset scroll position to top on load
window.addEventListener('load', function() {
  setTimeout(() => {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    window.scrollTo(0, 0);
  }, 0);
  
  // Fix icon paths for webstore compatibility
  fixIconPaths();
  
  // Initialize all toggles as disabled
  initializeToggles();
  
  // Make entire checkbox/radio elements clickable
  makeElementsClickable();
});

// Fix icon paths using chrome.runtime.getURL() for webstore compatibility
function fixIconPaths() {
  try {
    // Fix logo image
    const logoImg = document.querySelector('.logo-horizontal');
    if (logoImg) {
      logoImg.src = chrome.runtime.getURL('Holidu_Horizontal Logo_White_RGB.png');
      logoImg.onerror = function() {
        console.error('Failed to load logo image:', this.src);
      };
    }
    
    // Fix house icons in header subtitle (first and second img tags)
    const headerSubtitle = document.querySelector('.header-subtitle');
    if (headerSubtitle) {
      const houseIcons = headerSubtitle.querySelectorAll('img');
      if (houseIcons.length >= 1) {
        houseIcons[0].src = chrome.runtime.getURL('house-icon.png');
        houseIcons[0].onerror = function() {
          console.error('Failed to load house-icon.png:', this.src);
        };
      }
      if (houseIcons.length >= 2) {
        houseIcons[1].src = chrome.runtime.getURL('houses-icon.png');
        houseIcons[1].onerror = function() {
          console.error('Failed to load houses-icon.png:', this.src);
        };
      }
    }
    
    // Fix warning icon
    const warningIcon = document.querySelector('.warning-icon-img');
    if (warningIcon) {
      warningIcon.src = chrome.runtime.getURL('pngwing.com.png');
      warningIcon.onerror = function() {
        console.error('Failed to load warning icon:', this.src);
      };
    }
  } catch (error) {
    console.error('Error fixing icon paths:', error);
  }
}

// Function to make entire elements clickable
function makeElementsClickable() {
  // Make checkbox-group clickable
  document.querySelectorAll('.checkbox-group').forEach(group => {
    // Skip if it's inside a checkbox-with-flag or discount-item (already handled)
    if (group.closest('.checkbox-with-flag') || group.closest('.discount-item')) return;
    
    group.addEventListener('click', function(e) {
      // Don't trigger if clicking directly on checkbox (already works)
      if (e.target.type === 'checkbox') return;
      
      // Don't trigger if clicking on label (it already toggles the checkbox via 'for' attribute)
      if (e.target.tagName === 'LABEL' || e.target.closest('label')) return;
      
      const checkbox = this.querySelector('input[type="checkbox"]');
      if (checkbox && !checkbox.disabled) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });
  
  // Make checkbox-with-flag clickable
  document.querySelectorAll('.checkbox-with-flag').forEach(element => {
    element.addEventListener('click', function(e) {
      // Don't trigger if clicking on checkbox, toggle button, or their children
      if (e.target.type === 'checkbox' || 
          e.target.classList.contains('flag-toggle') || 
          e.target.classList.contains('toggle-slider') ||
          e.target.closest('.flag-toggle')) return;
      
      const checkbox = this.querySelector('input[type="checkbox"]');
      if (checkbox && !checkbox.disabled) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });
  
  // Make discount-item clickable
  document.querySelectorAll('.discount-item').forEach(item => {
    item.addEventListener('click', function(e) {
      // Don't trigger if clicking on checkbox or percentage input
      if (e.target.type === 'checkbox' || e.target.type === 'number') return;
      
      const checkbox = this.querySelector('input[type="checkbox"]');
      if (checkbox && !checkbox.disabled) {
        checkbox.checked = !checkbox.checked;
        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });
  
  // Make radio-item clickable
  document.querySelectorAll('.radio-item').forEach(item => {
    item.addEventListener('click', function(e) {
      // Don't trigger if clicking directly on radio or label (they already work)
      if (e.target.type === 'radio' || e.target.tagName === 'LABEL') return;
      
      const radio = this.querySelector('input[type="radio"]');
      if (radio && !radio.disabled) {
        radio.checked = true;
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
  });
}

// Function to initialize toggle states based on checkboxes
function initializeToggles() {
  // Get all checkboxes that have associated flag toggles
  const checkboxesWithToggles = document.querySelectorAll('input[type="checkbox"][id$="Costs"], input[type="checkbox"][id*="TouristTax"], input[type="checkbox"][id*="Deposit"]');
  
  checkboxesWithToggles.forEach(checkbox => {
    const toggleButton = document.getElementById(checkbox.id + '_flag');
    
    if (toggleButton) {
      // Set initial disabled state
      if (!checkbox.checked) {
        toggleButton.classList.add('disabled');
        toggleButton.style.pointerEvents = 'none';
      }
      
      // Add event listener to enable/disable toggle when checkbox changes
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          // Enable toggle
          toggleButton.classList.remove('disabled');
          toggleButton.style.pointerEvents = 'auto';
        } else {
          // Disable toggle and reset to positive
          toggleButton.classList.add('disabled');
          toggleButton.style.pointerEvents = 'none';
          toggleButton.classList.remove('negative');
          toggleButton.classList.add('positive');
          toggleButton.setAttribute('data-state', 'positive');
        }
      });
    }
  });
}

// Store original button text
const originalButtonText = btnApartmentId.value;

// Function to update search status with animated dots
let dotsInterval = null;

function updateSearchStatus(statusText) {
  // Clear any existing interval
  if (dotsInterval) {
    clearInterval(dotsInterval);
    dotsInterval = null;
  }
  
  if (!statusText) {
    // Reset to original
    btnApartmentId.value = originalButtonText;
    return;
  }
  
  // If it's "Found", don't animate - just show it
  if (statusText === 'Found') {
    btnApartmentId.value = 'Found!';
    return;
  }
  
  let dotCount = 0;
  
  // Animate dots without shifting text (fixed 3-character space for dots)
  dotsInterval = setInterval(() => {
    dotCount = (dotCount + 1) % 4;
    const dots = '.'.repeat(dotCount).padEnd(3, ' '); // Always 3 characters
    btnApartmentId.value = statusText + dots;
  }, 400);
  
  // Set initial state
  btnApartmentId.value = statusText + '   '; // 3 spaces initially
}

// Function to set button loading state
function setButtonLoading(isLoading) {
  if (isLoading) {
    btnApartmentId.disabled = true;
    btnApartmentId.classList.add('btn-loading');
    // Don't set the text here - let updateSearchStatus handle it
  } else {
    btnApartmentId.disabled = false;
    btnApartmentId.classList.remove('btn-loading');
    btnApartmentId.value = originalButtonText;
    
    // Clear dots animation
    if (dotsInterval) {
      clearInterval(dotsInterval);
      dotsInterval = null;
    }
  }
}

// Make updateSearchStatus globally available for search.js
window.updateSearchStatus = updateSearchStatus;



// Initialize CTA to launch process
btnApartmentId.addEventListener("click", async (event) => {
  event.preventDefault(); // Prevent form submission
  
  // Set loading state
  setButtonLoading(true);
  
  // Set initial status (will be updated by search.js)
  updateSearchStatus('Searching');
  
  try {
    let propertyId = (txtApartmentId.value === "") ? null : txtApartmentId.value;
    await findTestProperty(propertyId);
  } catch (error) {
    console.error('Error in findTestProperty:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      propertyId: txtApartmentId.value || null
    });
    alert('An error occurred. Please try again. Check console for details.');
  } finally {
    // Remove loading state
    setButtonLoading(false);
  }
});

document.addEventListener("keyup", function(event) {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    btnApartmentId.click();
  }
});


/*
- Get 
- Get criteria
- Find a matching property ID
- Find available dates
- Launch the URL
*/

async function findTestProperty(propertyId){
  
  let propertyCriteria, property, freeCancellation;
  let maxAttempts = 5;
  let attempts = 0;
  let isManualId = propertyId !== null; // User manually entered ID

  // Retry loop to find property with availability
  while (attempts < maxAttempts) {
    attempts++;
    
    if (propertyId === null){
      propertyCriteria = getCriteria();
      property = await findProperty(propertyCriteria);
      
      if (property && property.isMultiUnitSearch) {
        // Handle Multi-unit parent structure search
        const multiUnitIds = await getMultiUnitPropertyIds();
        if (multiUnitIds.length > 0) {
          // Pick a random Multi-unit property ID
          const randomIndex = Math.floor(Math.random() * multiUnitIds.length);
          propertyId = multiUnitIds[randomIndex];
          console.log(`Selected Multi-unit property ID: ${propertyId}`);
        } else {
          alert('No Multi-unit parent structure properties found');
          return;
        }
      } else if (property) {
        // Handle regular property search
        propertyId = property.id;
        freeCancellation = property.hasFreeCancellation;
      }
    }
    
    if (propertyId === null){
      alert('No property with selected criteria has been found');
      return;
    }
    
    console.log(`🔍 Attempt ${attempts}/${maxAttempts}: Checking property ${propertyId}`);
    
    // Check availability
    let { checkin, checkout } = await findAvailableDates(propertyId, freeCancellation);
    
    // If availability found, open the property
    if (checkin && checkout) {
      console.log(`✅ Property ${propertyId} has availability!`);
      constructURL(propertyId, checkin, checkout, property);
      return;
    }
    
    // No availability found
    console.log(`❌ Property ${propertyId} has no availability`);
    
    // If user manually entered ID, don't retry - just open without dates
    if (isManualId) {
      console.log(`ℹ️  Manual ID entry - opening property ${propertyId} without dates`);
      constructURL(propertyId, null, null, property);
      return;
    }
    
    // Auto-search mode: quarantine and retry
    console.log(`🔄 Quarantining property ${propertyId} and retrying...`);
    
    // Check if it's a test property (never quarantine test properties)
    const isTestProperty = property?.isTestProperty === true;
    
    if (!isTestProperty) {
      // Quarantine the property
      const provider = property?.provider || 'UNKNOWN';
      await saveToUnavailableDatabase(propertyId, provider, 'no_availability_from_list_page');
      console.log(`🚫 Property ${propertyId} quarantined`);
    } else {
      console.log(`🧪 Property ${propertyId} is a test property - skipping quarantine`);
    }
    
    // Reset for next attempt
    propertyId = null;
    property = null;
  }
  
  // If we exhausted all attempts
  alert(`Could not find a property with availability after ${maxAttempts} attempts. Please try different criteria or try again later.`);
}

// ES Query Logs Button Handler
document.getElementById('viewQueryLogs')?.addEventListener('click', function() {
  chrome.storage.local.get(['esQueryLogs'], function(result) {
    const logs = result.esQueryLogs || [];
    
    if (logs.length === 0) {
      alert('No ES queries logged yet.\n\nPerform a search first, then check logs here!');
      return;
    }
    
    // Naya window open karo formatted logs ke saath
    const logWindow = window.open('', 'ES Query Logs', 'width=900,height=700');
    
    if (!logWindow) {
      alert('Popup blocked!\n\nPlease disable popup blocker and try again.');
      return;
    }
    
    // Build HTML string manually to avoid template literal issues
    let html = '';
    html += '<!DOCTYPE html>';
    html += '<html>';
    html += '<head>';
    html += '<title>ES Query Logs - Conqueror Testos</title>';
    html += '<style>';
    html += 'body { font-family: Monaco, Menlo, monospace; margin: 0; padding: 20px; background: #1e1e1e; color: #d4d4d4; }';
    html += 'h2 { color: #4ec9b0; margin-bottom: 15px; font-size: 20px; }';
    html += '.controls { margin-bottom: 20px; padding: 15px; background: #252526; border-radius: 6px; display: flex; gap: 10px; }';
    html += 'button { padding: 10px 20px; background: #0e639c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px; }';
    html += 'button:hover { background: #1177bb; }';
    html += 'button.danger { background: #d32f2f; }';
    html += 'button.danger:hover { background: #e53935; }';
    html += '.stats { flex: 1; color: #858585; font-size: 12px; }';
    html += 'pre { background: #252526; padding: 15px; overflow: auto; border-radius: 6px; border: 1px solid #3c3c3c; font-size: 12px; }';
    html += '.log-entry { margin-bottom: 30px; border: 1px solid #3c3c3c; border-radius: 6px; overflow: hidden; }';
    html += '.log-header { background: #2d2d30; padding: 12px 15px; border-bottom: 1px solid #3c3c3c; display: flex; justify-content: space-between; }';
    html += '.log-number { color: #4ec9b0; font-weight: bold; font-size: 14px; }';
    html += '.log-time { color: #858585; font-size: 11px; }';
    html += '.log-index { color: #dcdcaa; font-size: 11px; background: #1e1e1e; padding: 3px 8px; border-radius: 3px; }';
    html += '.log-content { padding: 15px; }';
    html += '.section-title { color: #569cd6; font-weight: bold; margin-bottom: 8px; font-size: 13px; }';
    html += '.success-msg { color: #4ec9b0; padding: 10px; text-align: center; background: #252526; border-radius: 4px; margin-top: 10px; display: none; }';
    html += '</style>';
    html += '</head>';
    html += '<body>';
    html += '<h2>ES Query Logs (' + logs.length + ' total)</h2>';
    html += '<div class="controls">';
    html += '<button onclick="copyAllLogs()">Copy All Logs</button>';
    html += '<button onclick="clearAllLogs()" class="danger">Clear All Logs</button>';
    html += '<div class="stats">Last updated: ' + new Date(logs[logs.length - 1].timestamp).toLocaleString() + '</div>';
    html += '</div>';
    html += '<div id="successMsg" class="success-msg">Copied to clipboard!</div>';
    html += '<div id="logsContainer">';
    
    // Render logs directly in HTML
    const reversedLogs = [...logs].reverse();
    reversedLogs.forEach(function(log, idx) {
      const date = new Date(log.timestamp);
      const timeStr = date.toLocaleTimeString() + ', ' + date.toLocaleDateString();
      
      html += '<div class="log-entry">';
      html += '<div class="log-header">';
      html += '<span class="log-number">Query #' + (idx + 1) + '</span>';
      html += '<span class="log-index">Index: ' + (log.index || 'unknown') + '</span>';
      html += '<span class="log-time">' + timeStr + '</span>';
      html += '</div>';
      html += '<div class="log-content">';
      html += '<div class="section-title">SEARCH CRITERIA:</div>';
      html += '<pre>' + JSON.stringify(log.criteria || {}, null, 2) + '</pre>';
      html += '<div class="section-title" style="margin-top: 15px;">ELASTICSEARCH QUERY:</div>';
      html += '<pre>' + JSON.stringify(log.query || {}, null, 2) + '</pre>';
      html += '</div>';
      html += '</div>';
    });
    
    html += '</div>';
    html += '<script>';
    html += 'function copyAllLogs() {';
    html += '  var text = "ES QUERY LOGS\\n" + "=".repeat(60) + "\\n\\n";';
    html += '  var logs = ' + JSON.stringify(logs) + ';';
    html += '  logs.forEach(function(log, idx) {';
    html += '    text += "\\n" + "=".repeat(60) + "\\n";';
    html += '    text += "Query #" + (idx + 1) + " - " + new Date(log.timestamp).toLocaleString() + "\\n";';
    html += '    text += "Index: " + log.index + "\\n";';
    html += '    text += "=".repeat(60) + "\\n\\n";';
    html += '    text += "CRITERIA:\\n" + JSON.stringify(log.criteria, null, 2) + "\\n\\n";';
    html += '    text += "ES QUERY:\\n" + JSON.stringify(log.query, null, 2) + "\\n";';
    html += '  });';
    html += '  navigator.clipboard.writeText(text).then(function() {';
    html += '    var msg = document.getElementById("successMsg");';
    html += '    msg.style.display = "block";';
    html += '    setTimeout(function() { msg.style.display = "none"; }, 2000);';
    html += '  });';
    html += '}';
    html += 'function clearAllLogs() {';
    html += '  if (confirm("Are you sure you want to delete all logs?")) {';
    html += '    if (window.opener && window.opener.chrome && window.opener.chrome.storage) {';
    html += '      window.opener.chrome.storage.local.remove("esQueryLogs", function() {';
    html += '        alert("All logs cleared!");';
    html += '        window.close();';
    html += '      });';
    html += '    } else {';
    html += '      alert("Cannot clear logs - extension context not available");';
    html += '    }';
    html += '  }';
    html += '}';
    html += '</script>';
    html += '</body>';
    html += '</html>';
    
    // Write complete HTML at once
    logWindow.document.open();
    logWindow.document.write(html);
    logWindow.document.close();
  });
});
