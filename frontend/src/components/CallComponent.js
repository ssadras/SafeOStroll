import React, { useState, useEffect, useRef } from 'react';
import './CallComponent.css'; // Import the CSS file for styling

const CallComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState(null);
  const audioRef = useRef(null);
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
    <div className="call-container">
      <div className={`listening-circle ${isRecording ? 'active' : ''}`} onClick={startRecording}>
        {isRecording ? 'Stop' : 'Start'}
      </div>
      <audio ref={audioRef} controls className="audio-controls" />
    </div>
  );
};

export default CallComponent;
