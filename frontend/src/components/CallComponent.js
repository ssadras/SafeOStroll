import React, { useState, useEffect, useRef } from 'react';
import './CallComponent.css'; // Import the CSS file for styling
import { UserContext } from '../UserContext';

const CallComponent = () => { // Accept onDistress as a prop
  const [isRecording, setIsRecording] = useState(false);
  const [socket, setSocket] = useState(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null); // Use a ref to store the MediaRecorder
  const [colorIndex, setColorIndex] = useState(0); // State to manage color index
  const colors = [ // Muted colors including purple and blue for the transition
    'radial-gradient(circle at center, #2a2a37, #383846)', // Dark gray
    'radial-gradient(circle at center, #383846, #4a4a58)', // Darker gray
    'radial-gradient(circle at center, #4a4a58, #5c5c6e)', // Grayish blue
    'radial-gradient(circle at center, #5c5c6e, #7e7e8a)', // Muted blue
    'radial-gradient(circle at center, #7e7e8a, #B0A4C4)', // Soft purple
    'radial-gradient(circle at center, #B0A4C4, #9B7BB3)', // Muted purple
    'radial-gradient(circle at center, #9B7BB3, #7B5B9B)', // Darker muted purple
    'radial-gradient(circle at center, #7B5B9B, #5B9B9B)', // Muted teal
  ];

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

  // Change color every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 2000); // Adjust the interval time as needed

    return () => clearInterval(interval); // Cleanup interval on component unmount
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

    // Analyze the audio stream to detect screams
    analyzeAudio(stream);
  };

  const handleDistress = () => {
    const userId = 2;

    console.log('Distress button clicked');
    // setLoading(true);

    // call the backend API to send distress signal with post request with user_id as the payload
    fetch('http://localhost:8000/api/member/ask-help-nearby-members/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    })
      .then((response) => {
        if (response.ok) {
          console.log('Distress signal sent successfully');
          alert('Distress signal sent successfully');
        } else {
          console.error('Failed to send distress signal');
          alert('Failed to send distress signal');
        }
      })
      .catch((error) => {
        console.error('Error sending distress signal:', error);
        alert('Error sending distress signal');
      });
  };

  const analyzeAudio = (stream) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    
    source.connect(analyser);
    analyser.fftSize = 2048;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    const checkForScreams = () => {
      analyser.getByteFrequencyData(dataArray);

      // Calculate the average volume
      const averageVolume = dataArray.reduce((a, b) => a + b) / dataArray.length;

      // Adjust the threshold as necessary
      if (averageVolume > 125) { // Example threshold for detecting a scream
        handleDistress(); // Trigger the distress button action
      }

      requestAnimationFrame(checkForScreams);
    };

    requestAnimationFrame(checkForScreams);
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
      <div
        className={`listening-circle ${isRecording ? 'active' : ''}`}
        onClick={startRecording}
        style={{ background: colors[colorIndex] }} // Apply color transition here
      >
        {isRecording ? 'Stop' : 'Start'}
      </div>
      <audio ref={audioRef} controls className="audio-controls" />
    </div>
  );
};

export default CallComponent;
