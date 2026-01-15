import React, { useRef } from 'react';

const RegisterModal = ({ 
  showRegisterModal, 
  setShowRegisterModal, 
  setShowLoginModal, 
  registerForm, 
  setRegisterForm, 
  regPasswordVisible, 
  setRegPasswordVisible, 
  onRegister 
}) => {
  const registerModalRef = useRef(null);
  
  if (!showRegisterModal) return null;
  
  const handleLoginClick = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };
  
  return (
    <div
      id="registerModal"
      ref={registerModalRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100">
        <div className="p-6 border-b">
          <div className="flex justify-center items-center">
            <h3 className="text-xl font-semibold text-secondary">用户注册</h3>
          </div>
        </div>
        <div className="p-6">
          <form className="space-y-4 register-form" onSubmit={onRegister}>
            <div>
              <label htmlFor="regUsername" className="block text-sm font-medium text-gray-700 mb-1">
                用户名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="regUsername"
                name="regUsername"
                placeholder="请设置用户名"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                value={registerForm.username}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="regEmail" className="block text-sm font-medium text-gray-700 mb-1">
                邮箱 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="regEmail"
                name="regEmail"
                placeholder="请输入邮箱"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                value={registerForm.email}
                onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="regPassword" className="block text-sm font-medium text-gray-700 mb-1">
                密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={regPasswordVisible ? "text" : "password"}
                  id="regPassword"
                  name="regPassword"
                  placeholder="请设置密码（至少6位）"
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition pr-10"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                  onClick={() => setRegPasswordVisible(!regPasswordVisible)}
                >
                  <i className={`fa ${regPasswordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                注册
              </button>
            </div>
            <div className="text-center text-sm">
              <span className="text-gray-600">已有账号？</span>
              <button
                type="button"
                className="text-primary hover:text-primary/80 ml-1 transition-colors"
                onClick={handleLoginClick}
              >
                返回登录
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;