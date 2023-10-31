// Query all open tabs
chrome.tabs.query({}, function(tabs) {
    var tabList = document.getElementById('tabList');
    // For each tab
    for (let tab of tabs) {
        // Create a list item
        var li = document.createElement('li');
        li.textContent = tab.title;
        // Create a button to set as main tab
        var mainButton = document.createElement('button');
        mainButton.textContent = 'Set as main tab';
        mainButton.addEventListener('click', function() {
            // Send a message to the background script
            chrome.runtime.sendMessage({message: 'set_main_tab', tabId: tab.id});
        });
        li.appendChild(mainButton);
        // Create a button to set as background tab
        var backgroundButton = document.createElement('button');
        backgroundButton.textContent = 'Set as background tab';
        backgroundButton.addEventListener('click', function() {
            // Send a message to the background script
            chrome.runtime.sendMessage({message: 'set_background_tab', tabId: tab.id});
        });
        li.appendChild(backgroundButton);
        // Add the list item to the list
        tabList.appendChild(li);
    }
});