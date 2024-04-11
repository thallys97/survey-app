import React from 'react';

const SuccessMessage = ({ message, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-green-100 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 rounded shadow-md">
        <p className="text-green-600">{message}</p>
        <button
          onClick={onClose}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default SuccessMessage;