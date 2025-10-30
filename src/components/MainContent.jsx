import React from 'react';

const MainContent = ({ 
  isLoggedIn, 
  setShowUnlockModal 
}) => {
  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <section className="max-w-4xl mx-auto mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-4">小米触控笔解锁工具</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            专为小米触控笔设计的解锁工具，帮助您轻松解锁设备限制，充分发挥触控笔的全部功能。
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-secondary mb-6">解锁步骤</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">1</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">登录账号</h3>
              <p className="text-gray-600">登录您的小米账号，以便验证设备所有权</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">2</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">输入设备信息</h3>
              <p className="text-gray-600">输入触控笔的设备型号和SN号</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-primary text-2xl font-bold">3</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">完成解锁</h3>
              <p className="text-gray-600">系统将自动处理并完成设备解锁</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <button
              className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
              onClick={() => isLoggedIn ? setShowUnlockModal(true) : alert('请先登录')}
            >
              {isLoggedIn ? '开始解锁' : '请先登录'}
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-secondary mb-6">支持的设备型号</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <i className="fa fa-check-circle text-green-500 text-xl"></i>
              <span>小米触控笔 2</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fa fa-check-circle text-green-500 text-xl"></i>
              <span>小米触控笔 2S</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fa fa-check-circle text-green-500 text-xl"></i>
              <span>小米触控笔 Pro</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fa fa-check-circle text-green-500 text-xl"></i>
              <span>小米触控笔 Pro 2</span>
            </div>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <i className="fa fa-info-circle mr-2"></i>
              如果您的设备型号不在列表中，请联系客服获取支持。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;