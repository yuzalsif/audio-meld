// Create an array to store tab names with music playback
const tabsWithMusic = [];

// Create an AudioContext
const audioContext = new (chrome.window.AudioContext || chrome.window.webkitAudioContext)();

// Create an analyser node to process audio data
const analyser = audioContext.createAnalyser();

// Function to update the list of tabs with music
function updateTabsWithMusic() {
  chrome.tabs.query({}, (tabs) => {
    tabsWithMusic.length = 0; // Clear the existing list

    tabs.forEach((tab) => {
      if (tab.audible) {
        tabsWithMusic.push(tab.title);
      }
    });

    console.log('Tabs with music:', tabsWithMusic.join(', '));
  });
}

// Set up audio analysis logic
navigator.mediaDevices.getUserMedia({ audio: true })
  .then((stream) => {
    const audioSource = audioContext.createMediaStreamSource(stream);
    audioSource.connect(analyser);

    // Schedule the updateTabsWithMusic function to run periodically
    setInterval(updateTabsWithMusic, 5000); // Every 5 seconds
  })
  .catch((error) => {
    console.error('Error accessing audio:', error);
  });

