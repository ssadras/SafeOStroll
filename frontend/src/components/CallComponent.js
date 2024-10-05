import React, { useState, useEffect, useRef } from 'react';

const CallComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState(null);
  const audioRef = useRef(null);
  const silenceThreshold = 0.7; // Volume threshold to detect silence
  const silenceDuration = 3000; // Duration (in ms) to consider as silence
  const silenceTimeoutRef = useRef(null);
  const mediaRecorderRef = useRef(null); // Use a ref to store the MediaRecorder

  // Initialize WebSocket connection and start recording when the component mounts
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/call/');
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error', error);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    setSocket(ws);

    ws.onmessage = (event) => {
      // Handle the audio response from the backend
      playAudio(event.data);
    };

    // Start recording automatically when component mounts
    startRecording();

    return () => {
      ws.close(); // Cleanup WebSocket connection on component unmount
      if (silenceTimeoutRef.current) clearTimeout(silenceTimeoutRef.current);
    };
  }, []);

  const startRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      return;
    }

    setIsRecording(true);

    try {
      // Capture audio from user's microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newMediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = newMediaRecorder;

      const chunks = [];

      // Capture audio chunks
      newMediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
        console.log('Chunk received:', event.data);
        
        // Send each chunk to the server if the WebSocket is open
        if (socket && socket.readyState === WebSocket.OPEN && isRecording) {
          socket.send(event.data);
          console.log('Chunk sent to WebSocket');
        } else {
          console.error('WebSocket is not open');
        }
      };

      newMediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(audioBlob);
          console.log('Final audio blob sent');
        }
        setIsRecording(false);
      };

      newMediaRecorder.start();
      console.log('Recording started');

      // Set up silence detection
      setupSilenceDetection(stream);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const setupSilenceDetection = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 2048;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkSilence = () => {
      analyser.getByteFrequencyData(dataArray);
      const averageVolume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length / 255;
      console.log('Average Volume:', averageVolume);

      if (averageVolume < silenceThreshold) {
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            console.log('Silence detected, stopping recording...');
            mediaRecorderRef.current.stop(); // Stop recording after the silence duration
            silenceTimeoutRef.current = null;
          }, silenceDuration);
        }
      } else {
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      }

      requestAnimationFrame(checkSilence);
    };

    checkSilence(); // Start checking for silence
  };

  const playAudio = (audioData) => {
    const audioBlob = new Blob([audioData], { type: 'audio/webm' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  return (
    <div>
      <h2>Call AI (WebSocket Enabled)</h2>
      {/* Recording starts automatically when navigated */}
      <audio ref={audioRef} controls />
    </div>
  );
};

export default CallComponent;
