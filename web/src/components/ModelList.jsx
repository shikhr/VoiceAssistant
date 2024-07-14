import PropTypes from 'prop-types';
import ModelSelect from './ModelSelect';

const ModelList = ({
  models,
  selectedLLM,
  selectedSTT,
  setSelectedLLM,
  setSelectedSTT,
}) => {
  return (
    <div className="w-full flex justify-center gap-8">
      <ModelSelect
        options={models.slice(0, -1).map((model) => ({
          value: model.id,
          label: model.id,
        }))}
        value={selectedLLM}
        onChange={(e) => setSelectedLLM(e.target.value)}
        placeholder="Select a LLM"
      />
      <ModelSelect
        options={[
          {
            value: 'whisper-base-local',
            label: 'whisper-base-local',
          },
          {
            value: models.at(-1).id,
            label: models.at(-1).id,
          },
        ]}
        value={selectedSTT}
        onChange={(e) => setSelectedSTT(e.target.value)}
        placeholder="Select a Transcription Model"
      />
    </div>
  );
};
ModelList.propTypes = {
  models: PropTypes.array.isRequired,
  selectedLLM: PropTypes.string.isRequired,
  selectedSTT: PropTypes.string.isRequired,
  setSelectedLLM: PropTypes.func.isRequired,
  setSelectedSTT: PropTypes.func.isRequired,
};

export default ModelList;
