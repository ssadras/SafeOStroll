import React, { useState, useEffect, useRef } from 'react';
import './CallComponent.css';  // Import the CSS file for styling

const CallComponent = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioContextRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const chunksRef = useRef([]);
  
  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/call/');
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      setSocket(ws);
    };

    ws.onmessage = (event) => {
      console.log('Received TTS audio from server');
      playAudio(event.data);
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.close(); // Clean up WebSocket connection
    };
  }, []);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      startRecording();
    }
  }, [socket]);

  const startRecording = async () => {
    if (isRecording) return;
    setIsRecording(true);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data); // Collect audio data in chunks
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        chunksRef.current = []; // Reset chunks for next recording

        if (socket && socket.readyState === WebSocket.OPEN) {
          console.log('Sending audio data to server:', audioBlob);
          socket.send(audioBlob); // Send audio to backend
        }
      };

      mediaRecorder.start(1000); // Record in chunks of 1 second

      detectSilence(mediaRecorder, stream); // Monitor silence
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
    }
  };

  const detectSilence = (mediaRecorder, stream, silenceDelay = 3000, minDecibels = -60) => {
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContextRef.current.createAnalyser();
    const microphone = audioContextRef.current.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.minDecibels = minDecibels;
    
    const data = new Uint8Array(analyser.frequencyBinCount);

    const detect = () => {
      analyser.getByteFrequencyData(data);
      const isSilent = data.every((value) => value === 0);

      if (isSilent) {
        console.log('Silence detected...');
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = setTimeout(() => {
          console.log('Silence duration exceeded, stopping recording...');
          mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop()); // Stop microphone access
          audioContextRef.current.close();
          setIsRecording(false);
        }, silenceDelay);
      } else {
        clearTimeout(silenceTimeoutRef.current); // Reset the silence timer if sound is detected
      }

      if (isRecording) requestAnimationFrame(detect); // Continue checking for silence
    };

    detect();
  };

  const playAudio = (audioData) => {
    const audioBlob = new Blob([audioData], { type: 'audio/webm;codecs=opus' });
    const audioUrl = URL.createObjectURL(audioBlob);

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  return (
    <div className="call-container">
      <div className={`listening-circle ${isRecording ? 'active' : ''}`}>
        <p className="status-text">{isRecording ? "Go ahead, I'm listening" : "Ready"}</p>
      </div>
      <audio ref={audioRef} controls className="audio-controls" />
      <p className="recording-status">{isRecording ? 'Recording in progress...' : 'Responding'}</p>
    </div>
  );
};

export default CallComponent;
