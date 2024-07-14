import { useEffect, useState } from 'react';
import { useMicVAD } from '@ricky0123/vad-react';
import useSocket from '../hooks/useSocket';
import useAudio from '../hooks/useAudio';
import MessageList from './MessageList';
import SpeakIcon from './SpeakIcon';
import PropTypes from 'prop-types';

const VoiceChat = ({ selectedLLM, selectedSTT }) => {
  const [messages, setMessages] = useState([]);
  const [isWaiting, setIsWaiting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const { isConnected, socket } = useSocket();
  const { playAudio, stopAudio } = useAudio();

  const { loading, listening, errored, userSpeaking, start, pause, toggle } =
    useMicVAD({
      startOnLoad: true,
      positiveSpeechThreshold: 0.6,
      minSpeechFrames: 5,
      preSpeechPadFrames: 10,
      onSpeechStart: () => {
        stopAudio();
      },
      onSpeechEnd: (audio) => {
        if (socket.connected && selectedLLM) {
          const history = messages.slice(0, 5).reverse().flat();
          socket.emit('audio_data', audio.buffer, history, {
            selectedLLM,
            selectedSTT,
          });
          setIsWaiting(true);
          pause();
        }
      },
    });

  useEffect(() => {
    const handlePromptResponse = async (prompt, response, audio_data, rate) => {
      setIsWaiting(false);
      setMessages((prevMessages) => [
        [
          { type: 'prompt', content: prompt },
          { type: 'response', content: response },
        ],
        ...prevMessages,
      ]);
      start();
      setIsPlaying(true);
      await playAudio(audio_data, rate);
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
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white p-2">
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

VoiceChat.propTypes = {
  selectedLLM: PropTypes.string.isRequired,
  selectedSTT: PropTypes.string.isRequired,
};

export default VoiceChat;
