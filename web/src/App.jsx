import { useEffect, useState } from 'react';
import { useMicVAD } from '@ricky0123/vad-react';
import useSocket from './hooks/useSocket';
import useAudio from './hooks/useAudio';
import MessageList from './components/MessageList';
import SpeakIcon from './components/SpeakIcon';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const { isConnected, socket } = useSocket();
  const { playAudio } = useAudio();

  const { loading, listening, errored, userSpeaking, start, pause, toggle } =
    useMicVAD({
      startOnLoad: true,
      positiveSpeechThreshold: 0.7,
      minSpeechFrames: 2,
      preSpeechPadFrames: 10,
      onSpeechStart: () => {
        console.log('Speech start detected');
      },
      onSpeechEnd: (audio) => {
        console.log('end speech');
        if (socket.connected) {
          socket.emit('audio_data', audio);
          setIsWaiting(true);
          pause();
        }
      },
    });

  useEffect(() => {
    const handlePromptResponse = async (prompt, response, audio_data, rate) => {
      setIsWaiting(false);
      setMessages((prevMessages) => [
        { type: 'prompt', content: prompt },
        { type: 'response', content: response },
        ...prevMessages,
      ]);
      setIsPlaying(true);
      await playAudio(audio_data, rate);
      start();
      setIsPlaying(false);
    };
    const handleNoPromptFound = () => {
      setIsWaiting(false);
      start();
    };
    socket.on('prompt_response', handlePromptResponse);
    socket.on('no_prompt_recognised', handleNoPromptFound);
    return () => {
      socket.off('prompt_response', handlePromptResponse);
    };
  }, [socket, playAudio, start, pause]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-2">
      <MessageList messages={messages} />
      <SpeakIcon
        isConnected={isConnected}
        isWaiting={isWaiting}
        userSpeaking={userSpeaking}
        listening={listening}
        isPlaying={isPlaying}
        isLoading={loading}
        toggle={toggle}
      />
      {errored && (
        <div className="mt-4 text-red-500">Error: {errored.message}</div>
      )}
    </div>
  );
};

export default App;
