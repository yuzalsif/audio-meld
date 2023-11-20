// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.storage.local.get(['mainTab', 'backgroundTab'], function (result) {
    let mainTabId = result.mainTab;
    let backgroundTabId = result.backgroundTab;

    if (request.message === 'set_main_tab') {
      if (request.tabId === backgroundTabId) {
        chrome.storage.local.remove('backgroundTab');
        backgroundTabId = null;
      }
      chrome.storage.local.set({ mainTab: request.tabId });
      chrome.tabs.update(request.tabId, { muted: false });
      if (backgroundTabId) {
        chrome.tabs.get(request.tabId, function (tab) {
          if (tab.audible && !tab.mutedInfo.muted) {
            chrome.tabs.update(backgroundTabId, { muted: true });
          }
        });
      }
    } else if (request.message === 'set_background_tab') {
      if (request.tabId === mainTabId) {
        chrome.storage.local.remove('mainTab');
        mainTabId = null;
      }

      if (backgroundTabId) {
        chrome.tabs.update(backgroundTabId, { muted: false });
      }
      chrome.storage.local.set({ backgroundTab: request.tabId });
      if (mainTabId) {
        chrome.tabs.get(mainTabId, function (tab) {
          if (tab.audible && !tab.mutedInfo.muted) {
            chrome.tabs.update(request.tabId, { muted: true });
          }
        });
      }
    }
  });
});

function monitorMainTabAudio() {
  // Listen for updates to the main tab
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    chrome.storage.local.get(['mainTab', 'backgroundTab'], function (result) {
      let mainTabId = result.mainTab;
      let backgroundTabId = result.backgroundTab;
      // If the updated tab is the main tab and the audio status has changed
      if (tabId === mainTabId && changeInfo.hasOwnProperty('audible')) {
        // If audio is playing in the main tab
        if (changeInfo.audible) {
          // Mute the background tab
          chrome.tabs.update(backgroundTabId, { muted: true });
        } else {
          // Unmute the background tab
          chrome.tabs.update(backgroundTabId, { muted: false });
        }
      }
    });
  });
}

// Call the monitor function every 0.3 seconds
setInterval(monitorMainTabAudio, 300);