import React, { useState, useEffect, useRef } from 'react';

const CallComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const audioRef = useRef(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);

  const startRecording = async () => {
    setIsRecording(true);

    // Capture audio from user's microphone
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const newMediaRecorder = new MediaRecorder(stream);

    setMediaRecorder(newMediaRecorder);
    newMediaRecorder.start();

    const chunks = [];
    newMediaRecorder.ondataavailable = (event) => {
      // Store each audio chunk
      chunks.push(event.data);
    };

    newMediaRecorder.onstop = () => {
      // Stop recording and combine the chunks into one audio blob
      const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
      playAudio(audioBlob); // Play the recorded audio
      setIsRecording(false);
    };

    setTimeout(() => {
      newMediaRecorder.stop(); // Automatically stop after 5 seconds (can be adjusted)
    }, 5000);
  };

  const playAudio = (audioBlob) => {
    const audioUrl = URL.createObjectURL(audioBlob);
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play(); // Play the recorded audio
    }
  };

  return (
    <div>
      <h2>Call AI (Test Mode)</h2>
      <button onClick={startRecording} disabled={isRecording}>
        {isRecording ? 'Recording...' : 'Start Call'}
      </button>
      <audio ref={audioRef} controls />
    </div>
  );
};

export default CallComponent;
