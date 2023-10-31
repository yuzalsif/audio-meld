// Listen for a message from the popup script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'set_main_tab') {
      // Save the main tab ID
      chrome.storage.local.set({mainTab: request.tabId});
  } else if (request.message === 'set_background_tab') {
      // Save the background tab ID
      chrome.storage.local.set({backgroundTab: request.tabId});
  }
});

// Monitor the audio output of the main tab
function monitorMainTabAudio() {
  chrome.storage.local.get(['mainTab', 'backgroundTab'], function(result) {
    let mainTabId = result.mainTab;
    let backgroundTabId = result.backgroundTab;

    // Create an AudioContext
    let audioContext = new AudioContext();

    // Create a MediaStreamSource from the main tab's audio output
    chrome.tabCapture.capture({audio: true, video: false, audioConstraints: {mandatory: {chromeMediaSource: 'tab', chromeMediaSourceId: mainTabId}}}, function(stream) {
      let source = audioContext.createMediaStreamSource(stream);

      // Create a GainNode for the background tab's audio output
      let gainNode = audioContext.createGain();

      // Connect the source to the gainNode
      source.connect(gainNode);

      // Create a MediaStreamDestination for the background tab's audio output
      let destination = audioContext.createMediaStreamDestination();

      // Create a MediaRecorder to record the background tab's audio output
      let recorder = new MediaRecorder(destination.stream);

      // Connect the gainNode to the destination
      gainNode.connect(destination);

      // Start the recorder
      recorder.start();

      // Listen for messages from the popup script
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.message === 'set_main_tab') {
          // Save the main tab ID
          chrome.storage.local.set({mainTab: request.tabId});
        } else if (request.message === 'set_background_tab') {
          // Save the background tab ID
          chrome.storage.local.set({backgroundTab: request.tabId});

          // Create a MediaStreamSource from the background tab's audio output
          chrome.tabCapture.capture({audio: true, video: false, audioConstraints: {mandatory: {chromeMediaSource: 'tab', chromeMediaSourceId: backgroundTabId}}}, function(stream) {
            let backgroundSource = audioContext.createMediaStreamSource(stream);

            // Connect the backgroundSource to the gainNode
            backgroundSource.connect(gainNode);
          });
        } else if (request.message === 'adjust_volume') {
          // Adjust the volume of the background tab's audio output
          gainNode.gain.value = request.volume;
        }
      });
    });
  });
}

// Call the monitor function every second
setInterval(monitorMainTabAudio, 1000);