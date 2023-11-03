// Query all open tabs
chrome.tabs.query({}, function (tabs) {
    var tabList = document.getElementById('tabList');
    // For each tab
    for (let tab of tabs) {
        // Create a div element
        var div = document.createElement('div');
        div.className = "tab";

        // Create a title
        var title = document.createElement('p');
        title.className = "tab-title";
        title.textContent = tab.title.substring(0, 13);
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