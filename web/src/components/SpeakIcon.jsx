import clsx from 'clsx';
import PropTypes from 'prop-types';
import './BackgroundAnimate.css';

const SpeakIcon = ({
  isConnected,
  isWaiting,
  userSpeaking,
  listening,
  isPlaying,
  toggle,
}) => {
  return (
    <div
      onClick={() => {
        if (isPlaying || isWaiting || userSpeaking) return;
        if (!isConnected) {
          toggle();
          return;
        }
      }}
      className={clsx(
        'text-sm overflow-hidden border-4 fixed bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center',
        (isPlaying || userSpeaking) &&
          'shadow-[0_0_2px_#fff,inset_0_0_2px_#fff,0_0_5px_#08f,0_0_15px_#08f,0_0_10px_#08f]'
      )}
    >
      <div
        className={clsx(
          'w-full h-full text-center  bg-gradient-to-r transition-all',
          !listening &&
            !(isPlaying || isWaiting || userSpeaking) &&
            'from-gray-400 via-gray-500 to-gray-600',
          isPlaying || isWaiting
            ? 'from-pink-500 p-4 via-red-500 to-yellow-500'
            : 'from-green-400  via-cyan-500 to-blue-500',
          (isPlaying || userSpeaking) && 'background-animate',
          isWaiting && 'animate-spin'
        )}
      ></div>
    </div>
  );
};

SpeakIcon.propTypes = {
  isConnected: PropTypes.bool.isRequired,
  isWaiting: PropTypes.bool.isRequired,
  userSpeaking: PropTypes.bool.isRequired,
  listening: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
};
export default SpeakIcon;