import React, { useState, useEffect, useRef } from 'react';

const CallComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState(null);
  const audioRef = useRef(null);
  const silenceThreshold = 0.7; // Volume threshold to detect silence
  const silenceDuration = 3000; // Duration (in ms) to consider as silence
  const silenceTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null); // Use a ref to store the MediaRecorder

  // Initialize WebSocket connection when the component mounts
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/call/');
    setSocket(ws);

    ws.onmessage = (event) => {
      // Handle the audio response from the backend
      playAudio(event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close(); // Cleanup WebSocket connection on component unmount
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    };
  }, []);

  const startRecording = async () => {
    if (isRecording) {
      // If already recording, stop the recording
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return; // Exit the function early
    }

    setIsRecording(true);

    // Capture audio from user's microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newMediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = newMediaRecorder; // Store the MediaRecorder in the ref

    const chunks = [];
    newMediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
      // Send audio data to the WebSocket server
      if (socket && isRecording) {
        socket.send(event.data); // Send each audio chunk to the server
      }
    };

    newMediaRecorder.onstop = () => {
      // Combine the chunks into one audio blob when recording stops
      const audioBlob = new Blob(chunks, { type: 'audio/webm' }); // Adjust the MIME type as needed
      if (socket) {
        socket.send(audioBlob); // Send the final audio blob to the server
      }
      setIsRecording(false);
    };

    newMediaRecorder.start();

    // Set up audio context and analyser for silence detection
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 2048;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkSilence = () => {
      analyser.getByteFrequencyData(dataArray);
      // Calculate the average volume on a scale of 0 to 1
      const averageVolume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length / 255; // Normalize to 0-1 scale

      console.log('Checking silence, Average Volume:', averageVolume);

      if (averageVolume < silenceThreshold) {
        // If silence is detected, start a timer
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            console.log('Silence detected, stopping recording...');
            mediaRecorderRef.current.stop(); // Stop recording after the silence duration
            silenceTimeoutRef.current = null; // Reset timeout reference
          }, silenceDuration);
        }
      } else {
        // If not silent, clear the timeout
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null; // Reset timeout reference
        }
      }

      requestAnimationFrame(checkSilence); // Continue checking for silence
    };

    checkSilence(); // Start the silence detection
  };

  const playAudio = (audioData) => {
    const audioBlob = new Blob([audioData], { type: 'audio/webm' }); // Adjust MIME type if necessary
    const audioUrl = URL.createObjectURL(audioBlob);
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play(); // Play the audio response from the backend
    }
  };

  return (
    <div>
      <h2>Call AI (WebSocket Enabled)</h2>
      <button onClick={startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Call'}
      </button>
      <audio ref={audioRef} controls />
    </div>
  );
};

export default CallComponent;