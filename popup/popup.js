// Query all open tabs
chrome.tabs.query({}, function (tabs) {
    var tabList = document.getElementById('tabList');
    // For each tab
    for (let tab of tabs) {
        // Create a div element
        var div = document.createElement('div');
        div.className = "tab";

        // Create a URL object
        var url = new URL(tab.url);

        // Extract the hostname
        var hostname = url.hostname;

        // Remove 'www.' if it exists
        if (hostname.startsWith('www.')) {
            hostname = hostname.slice(4);
        }

        // Split by '.' and take the last part
        var parts = hostname.split('.');
        var titleText = parts[parts.length - 2];

        // Check if titleText is defined
        if (titleText) {
            // Capitalize the first letter of the title
            titleText = titleText.charAt(0).toUpperCase() + titleText.slice(1);
        } else {
            // Set a default value for titleText
            titleText = "Unknown";
        }

        // Create a title
        var title = document.createElement('p');
        title.className = "tab-title";
        title.textContent = titleText;
        div.appendChild(title);

        // Create a menu button
        var menuButton = document.createElement('img');
        menuButton.className = "menu-button";
        menuButton.src = 'assets/images/menu2.png'; // Path to your image

        menuButton.addEventListener('click', function () {
            // Get the modal content div
            var modalContent = document.getElementById('modal-content');

            // Clear any existing content
            modalContent.innerHTML = '';

            // Option to set as main tab
            var mainOption = document.createElement('button');
            mainOption.textContent = 'Set as main tab'.toUpperCase();
            mainOption.className = "modal-button";
            mainOption.addEventListener('click', function () {
                // Send a message to the background script
                chrome.runtime.sendMessage({ message: 'set_main_tab', tabId: tab.id });

                showMainAndBackgroundTabs(true, titleText);
                // Hide the modal
                hideModal();
            });
            modalContent.appendChild(mainOption);

            // Option to set as background tab
            var backgroundOption = document.createElement('button');
            backgroundOption.textContent = 'Set as background tab'.toUpperCase();
            backgroundOption.className = "modal-button";
            backgroundOption.addEventListener('click', function () {
                // Send a message to the background script
                chrome.runtime.sendMessage({ message: 'set_background_tab', tabId: tab.id });

                showMainAndBackgroundTabs(false, titleText);
                // Hide the modal
                hideModal();
            });
            modalContent.appendChild(backgroundOption);
            // Show the modal
            showModal();
        });

        div.appendChild(menuButton);

        // Add the div to the list
        tabList.appendChild(div);
    }
});

// Create a popup with two options
var popup = document.getElementById('modal');

window.addEventListener('click', function (event) {
    if (event.target == modal) {
        hideModal();
    }
});

// Function to show the modal
function showModal() {
    modal.style.display = 'block';
}

// Function to hide the modal
function hideModal() {
    modal.style.display = 'none';
}

// Show main and background tabs
function showMainAndBackgroundTabs(isMainTab, tabTitle) {
    var tabs = document.querySelectorAll('#tabList div');
    var selectedTabsContainer = document.querySelector('.selected-tabs-container');

    var newTab = document.createElement('div');

    // Create the title and subtitle elements
    var title = document.createElement('div');
    title.classList.add('selected-tab-title');

    var subtitle = document.createElement('div');
    subtitle.classList.add('selected-tab-subtitle');

    // Create the column element
    var column = document.createElement('div');
    column.style.display = 'flex';
    column.style.flexDirection = 'column';

    // Check if the tab is the main tab or a background tab
    if (isMainTab) {
        newTab.classList.add('selected-tab');
        title.textContent = tabTitle;
        subtitle.textContent = 'Main tab';
        column.appendChild(title);
        column.appendChild(subtitle);
        newTab.appendChild(column);
    } else if (!isMainTab) {
        newTab.classList.add('selected-tab');
        title.textContent = tabTitle;
        subtitle.textContent = 'Background tab';
        column.appendChild(title);
        column.appendChild(subtitle);
        newTab.appendChild(column);
    }
    // Add the new tab to the selected tabs container
    if (newTab) {
        selectedTabsContainer.appendChild(newTab);
    }

    // If the container has any child nodes, set its height to 220px
    var container = document.querySelector('.container');
    if (selectedTabsContainer.hasChildNodes()) {
        container.style.height = '220px';
        selectedTabsContainer.style.marginBottom = '12px';
    }
}