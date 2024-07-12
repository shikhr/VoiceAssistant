import clsx from 'clsx';
import PropTypes from 'prop-types';

const MessageList = ({ messages }) => {
  return (
    <div className="w-full flex flex-col items-center py-4 max-w-3xl px-3 space-y-4 overflow-auto max-h-[80vh]">
      {messages.map((message, index) => (
        <div
          key={index}
          className={clsx(
            'border-2 min-w-16 px-7 py-2.5 text-lg rounded-3xl transition-all whitespace-pre-wrap text-center',
            message.type === 'prompt'
              ? 'bg-gray-700 text-gray-200 border-gray-500'
              : 'bg-cyan-800 text-white border-cyan-600'
          )}
        >
          {message.content}
        </div>
      ))}
    </div>
  );
};

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
  isPlaying: PropTypes.bool.isRequired,
};
export default MessageList;
