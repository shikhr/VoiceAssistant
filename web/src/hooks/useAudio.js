import { useRef } from 'react';

const useAudio = () => {
  const audioContextRef = useRef(null);
  const sourceRef = useRef(null);

  const playAudio = (audioData, sampleRate) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext ||
        window.webkitAudioContext)();
    }

    const audioBuffer = audioContextRef.current.createBuffer(
      1,
      audioData.length,
      sampleRate
    );
    const channelData = audioBuffer.getChannelData(0);
    channelData.set(audioData);

    sourceRef.current = audioContextRef.current.createBufferSource();
    sourceRef.current.buffer = audioBuffer;
    sourceRef.current.connect(audioContextRef.current.destination);

    sourceRef.current.start(0);

    return new Promise((resolve) => {
      sourceRef.current.onended = resolve;
    });
  };

  return { playAudio };
};

export default useAudio;
