import React, { useRef } from 'react';

const ProgressModal = ({ 
  showProgressModal, 
  progress 
}) => {
  const progressModalRef = useRef(null);
  
  if (!showProgressModal) return null;
  
  const getProgressPercentage = () => {
    return Math.round(progress.percentage);
  };
  
  return (
    <div
      id="progressModal"
      ref={progressModalRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100">
        <div className="p-6">
          <h3 className="text-xl font-semibold text-secondary mb-4 text-center">
            {progress.title}
          </h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>{progress.message}</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-primary h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500">
            请稍候，正在处理中...
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressModal;