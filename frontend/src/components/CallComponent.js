import React, { useState, useEffect, useRef } from 'react';

const CallComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState(null);
  const audioRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  // Initialize WebSocket connection when the component mounts
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/call/');
    setSocket(ws);

    ws.onmessage = (event) => {
      // On receiving audio from the backend, play the audio response
      console.log('Received audio data:', event.data);
    
      playAudio(event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close(); // Cleanup WebSocket connection on component unmount
    };
  }, []);

  const startRecording = async () => {
    setIsRecording(true);

    // Capture audio from user's microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newMediaRecorder = new MediaRecorder(stream);

    setMediaRecorder(newMediaRecorder);
    newMediaRecorder.start();

    const chunks = [];
    newMediaRecorder.ondataavailable = (event) => {
      // Store each audio chunk and send it to the WebSocket server
      chunks.push(event.data);
      if (socket) {
        socket.send(event.data); // Send audio chunks to the WebSocket server in real-time
      }
    };

    newMediaRecorder.onstop = () => {
      // Stop recording and combine the chunks into one audio blob
      const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
      playAudio(audioBlob); // Play the recorded audio
      setIsRecording(false);
    };

    // Stop recording automatically after 5 seconds (can be adjusted)
    setTimeout(() => {
      newMediaRecorder.stop();
    }, 5000);
  };

  const playAudio = (audioData) => {
    // Convert received data or recorded data into a playable audio
    const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  return (
    <div>
      <h2>Call AI (WebSocket Enabled)</h2>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Call'}
      </button>
      <audio ref={audioRef} controls />
    </div>
  );
};

export default CallComponent;
