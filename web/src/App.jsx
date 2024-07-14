import { useEffect, useState } from 'react';
import ModelList from './components/ModelList';
import VoiceChat from './components/VoiceChat';
const App = () => {
  const [models, setModels] = useState([]);
  const [selectedLLM, setSelectedLLM] = useState('');
  const [selectedSTT, setSelectedSTT] = useState('whisper-base-local');

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_models_list');
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        let models = await response.json();
        models = models.data;
        setModels(models);
        setSelectedLLM(models[0]?.id);
      } catch (err) {
        console.log(err);
      }
    };

    fetchModels();
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-900 text-white p-2">
      {models.length > 0 && (
        <ModelList
          models={models}
          selectedLLM={selectedLLM}
          selectedSTT={selectedSTT}
          setSelectedLLM={setSelectedLLM}
          setSelectedSTT={setSelectedSTT}
        />
      )}
      <VoiceChat selectedLLM={selectedLLM} selectedSTT={selectedSTT} />
    </div>
  );
};

export default App;
