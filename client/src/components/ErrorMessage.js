import React from 'react';

const ErrorMessage = ({ message, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-md">
        <p className="text-red-500">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ErrorMessage;
