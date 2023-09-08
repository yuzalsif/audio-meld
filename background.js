chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
  
    chrome.tabCapture.capture({ audio: true }, (stream) => {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const audioSource = audioContext.createMediaStreamSource(stream);
  
      audioSource.connect(analyser);
      analyser.connect(audioContext.destination);
  
      analyser.fftSize = 256; // Adjust as needed
  
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
  
      function detectAudioPlayback() {
        analyser.getByteFrequencyData(dataArray);
  
        // Example: Check if the average frequency data is above a certain threshold
        const averageFrequency = dataArray.reduce((acc, val) => acc + val) / bufferLength;
        if (averageFrequency > 100) {
          console.log('Audio playback detected in tab:', tab.title);
        } else {
          console.log('No audio playback in tab:', tab.title);
        }
  
        // You can customize this detection logic based on your requirements.
        requestAnimationFrame(detectAudioPlayback);
      }
  
      detectAudioPlayback();
    });
  });
  