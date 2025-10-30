import React, { useRef } from 'react';

const UnlockModal = ({ 
  showUnlockModal, 
  setShowUnlockModal, 
  unlockForm, 
  setUnlockForm, 
  onUnlock 
}) => {
  const unlockModalRef = useRef(null);
  
  if (!showUnlockModal) return null;
  
  const handleModalClick = (e) => {
    if (unlockModalRef.current && e.target === unlockModalRef.current) {
      setShowUnlockModal(false);
    }
  };
  
  return (
    <div
      id="unlockModal"
      ref={unlockModalRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={handleModalClick}
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-secondary">设备解锁</h3>
            <button
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setShowUnlockModal(false)}
            >
              <i className="fa fa-times text-xl"></i>
            </button>
          </div>
        </div>
        <div className="p-6">
          <form className="space-y-4 unlock-form" onSubmit={onUnlock}>
            <div>
              <label htmlFor="deviceModel" className="block text-sm font-medium text-gray-700 mb-1">
                设备型号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="deviceModel"
                name="deviceModel"
                placeholder="请输入设备型号"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                value={unlockForm.deviceModel}
                onChange={(e) => setUnlockForm(prev => ({ ...prev, deviceModel: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="deviceSN" className="block text-sm font-medium text-gray-700 mb-1">
                SN号 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="deviceSN"
                name="deviceSN"
                placeholder="请输入设备SN号"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                value={unlockForm.deviceSN}
                onChange={(e) => setUnlockForm(prev => ({ ...prev, deviceSN: e.target.value }))}
              />
              <p className="mt-1 text-xs text-gray-500">SN号通常位于设备底部或包装盒上</p>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                解锁设备
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UnlockModal;