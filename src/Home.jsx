import React from 'react';
import Footer from './components/Footer.jsx';

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 导航栏 */}
      <nav className="bg-white shadow-md border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-primary">
              FunHub
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              创意网页集合平台
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12 bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="text-center mb-12">
          <div className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg mb-6 animate-pulse hover:animate-none transition-all duration-300 hover:scale-105 cursor-default">
            AI太好用了你们知道吗
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to FunHub</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            探索各种创意网页项目，体验不同的交互设计和功能实现
          </p>

        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
              onClick={() => window.location.href = '/mipen-unlocker'}
            >
              <div className="flex items-center mb-4">
                <div className="bg-orange-500/10 p-3 rounded-lg mr-4">
                  <i className="fa fa-unlock-alt text-orange-500 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">大米笔解锁工具</h3>
              </div>
              <p className="text-gray-600 mb-4">
                解除大米巨能写设备的功能限制，获得完整的使用体验
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">工具类</span>
                <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center">
                  立即体验
                  <i className="fa fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
            {/* 大米巨能写设备电池卡片 */}
            <div
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100"
              onClick={() => window.location.href = '/mi-rainbow-battery'}
            >
              <div className="flex items-center mb-4">
                <div className="bg-orange-500/10 p-3 rounded-lg mr-4">
                  <i className="fa fa-battery-full text-orange-500 text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">大米巨能写设备电池</h3>
              </div>
              <p className="text-gray-600 mb-4">
                查看大米巨能写设备的电池状态和健康信息
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">工具类</span>
                <button className="text-orange-500 hover:text-orange-600 font-medium flex items-center">
                  立即体验
                  <i className="fa fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Home;