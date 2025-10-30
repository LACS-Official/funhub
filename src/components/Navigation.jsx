import React from 'react';

const Navigation = ({ 
  isLoggedIn, 
  username, 
  setShowLoginModal, 
  onLogout 
}) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-primary">
              <i className="fa fa-pen-fancy text-2xl"></i>
            </div>
            <h1 className="text-xl font-bold text-secondary">小米触控笔解锁工具</h1>
          </div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">首页</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">使用指南</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">支持</a>
            <a href="#" className="text-gray-600 hover:text-primary transition-colors">关于</a>
          </nav>
          
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{username}</span>
                </div>
                <button
                  className="text-gray-600 hover:text-primary transition-colors"
                  onClick={onLogout}
                >
                  <i className="fa fa-sign-out-alt"></i>
                </button>
              </div>
            ) : (
              <button
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                onClick={() => setShowLoginModal(true)}
              >
                登录
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation;