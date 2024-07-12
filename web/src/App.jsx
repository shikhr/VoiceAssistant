import { useEffect, useRef, useState } from 'react';
import { socket } from './socket';
import { useMicVAD } from '@ricky0123/vad-react';
import clsx from 'clsx';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isWaiting, setIsWaiting] = useState(false);
  const speakIconRef = useRef(null);

  const { loading, listening, errored, userSpeaking, start, pause, toggle } =
    useMicVAD({
      startOnLoad: true,
      positiveSpeechThreshold: 0.6,
      minSpeechFrames: 2,
      preSpeechPadFrames: 10,
      onSpeechStart: () => {
        console.log('Speech start detected');
      },
      onFrameProcessed: (probs) => {
        const val = 0.4 + (probs.isSpeech || 0) / 2;
        console.log(val);
        if (probs.isSpeech > 0.5) {
          speakIconRef.current.style.background = getRandRGB(val);
        } else {
          speakIconRef.current.style.background = `rgba(1, 75, 87, 0.4)`;
        }
      },
      onSpeechEnd: (audio) => {
        console.log('end speech');
        if (socket.connected) {
          socket.emit('audio_data', { audio });
          setIsWaiting(true);
          pause();
          // change iswaiting to false after 10 seconds
          // setTimeout(() => {
          //   setIsWaiting(false);
          //   start();
          // }, 10000);
        }
      },
    });

  useEffect(() => {
    // Socket setup
    function onConnect() {
      console.log('WebSocket connected.');
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log('WebSocket connection closed.');
      setIsConnected(false);
    }

    function prompt_Response(prompt, response) {
      console.log('Received response from server:', prompt, response);
      start();
      setIsWaiting(false);
      setMessages((prevMessages) => [
        { type: 'prompt', content: prompt },
        { type: 'response', content: response },
        ...prevMessages,
      ]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('prompt_response', prompt_Response);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);

      socket.off('prompt_response', prompt_Response);
    };
  }, [start]);

  const getRandRGB = (val) => {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgb(${r}, ${g}, ${b}, ${val})`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-2">
      <div
        className={`mb-4 text-lg ${
          isConnected ? 'text-green-500' : 'text-red-500'
        }`}
      >
        {isConnected ? 'Connected' : 'Disconnected'}
      </div>
      <div className="w-full flex flex-col  items-center py-4 max-w-3xl px-3 space-y-4 overflow-auto max-h-[80vh]">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`border-2
            [&:nth-child(2)]:border-2
            min-w-16 px-7 py-2.5 text-lg rounded-3xl whitespace-pre-wrap text-center ${
              message.type === 'prompt'
                ? 'bg-gray-700 text-gray-200 border-gray-500 '
                : 'bg-cyan-800 text-white border-cyan-600'
            }`}
          >
            {message.content}
          </div>
        ))}
      </div>
      <div
        id="speak_icon"
        ref={speakIconRef}
        onClick={toggle}
        className={clsx(
          'text-sm shadow-md shadow-gray-900 border-4 fixed bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center',
          {
            'bg-cyan-700': isWaiting,
            'bg-cyan-500': userSpeaking,
            'bg-blue-500': listening && !userSpeaking,
            'bg-red-500': !listening && !userSpeaking && !isWaiting,
          }
        )}
      >
        {!isConnected
          ? 'OFF'
          : isWaiting
          ? '. . .'
          : userSpeaking
          ? '...'
          : listening
          ? 'ON'
          : 'START'}
      </div>
      {loading && <div className="mt-4 text-yellow-500">Loading...</div>}
      {errored && (
        <div className="mt-4 text-red-500">Error: {errored.message}</div>
      )}
    </div>
  );
};

export default App;
