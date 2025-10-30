import React, { useRef } from 'react';

const ResultModal = ({ 
  showResultModal, 
  setShowResultModal, 
  resultModal 
}) => {
  const resultModalRef = useRef(null);
  
  if (!showResultModal) return null;
  
  const handleModalClick = (e) => {
    if (resultModalRef.current && e.target === resultModalRef.current) {
      setShowResultModal(false);
    }
  };
  
  const getIconClass = () => {
    switch (resultModal.type) {
      case 'success':
        return 'fa-check-circle text-green-500';
      case 'error':
        return 'fa-times-circle text-red-500';
      case 'warning':
        return 'fa-exclamation-triangle text-yellow-500';
      default:
        return 'fa-info-circle text-blue-500';
    }
  };
  
  const getButtonClass = () => {
    switch (resultModal.type) {
      case 'success':
        return 'bg-green-500 hover:bg-green-600';
      case 'error':
        return 'bg-red-500 hover:bg-red-600';
      case 'warning':
        return 'bg-yellow-500 hover:bg-yellow-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };
  
  return (
    <div
      id="resultModal"
      ref={resultModalRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleModalClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100">
        <div className="p-6 text-center">
          <div className="mb-4">
            <i className={`fa ${getIconClass()} text-6xl`}></i>
          </div>
          <h3 className="text-xl font-semibold text-secondary mb-2">
            {resultModal.title}
          </h3>
          <p className="text-gray-600 mb-6">
            {resultModal.message}
          </p>
          <button
            className={`${getButtonClass()} text-white font-medium py-2 px-6 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50`}
            onClick={() => setShowResultModal(false)}
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;