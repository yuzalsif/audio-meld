// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'set_main_tab') {
    // Save the main tab ID
    chrome.storage.local.set({mainTab: request.tabId});
  } else if (request.message === 'set_background_tab') {
    // Save the background tab ID
    chrome.storage.local.set({backgroundTab: request.tabId});
  }
});

function monitorMainTabAudio() {
  chrome.storage.local.get(['mainTab', 'backgroundTab'], function(result) {
    let mainTabId = result.mainTab;
    let backgroundTabId = result.backgroundTab;

    // Listen for updates to the main tab
    chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
      // If the updated tab is the main tab and the audio status has changed
      if (tabId === mainTabId && changeInfo.hasOwnProperty('audible')) {
        // If audio is playing in the main tab
        if (changeInfo.audible) {
          // Mute the background tab
          chrome.tabs.update(backgroundTabId, {muted: true});
        } else {
          // Unmute the background tab
          chrome.tabs.update(backgroundTabId, {muted: false});
        }
      }
    });
  });
}

// Call the monitor function every second
setInterval(monitorMainTabAudio, 300);