import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      {/* 导航栏 */}
      <nav className="bg-white dark:bg-gray-800 shadow-md">
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
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary mb-4">Welcome to FunHub</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            探索各种创意网页项目，体验不同的交互设计和功能实现
          </p>

        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 小米笔解锁工具卡片 */}
            <div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:-translate-y-1" 
              onClick={() => window.location.href = '/mipen-unlocker'}
            >
              <div className="flex items-center mb-4">
                <div className="bg-primary/10 p-3 rounded-lg mr-4">
                  <i className="fa fa-unlock-alt text-primary text-2xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-secondary">小米笔解锁工具</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                解除小米巨能写设备的功能限制，获得完整的使用体验
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">工具类</span>
                <button className="text-primary hover:text-primary/80 font-medium flex items-center">
                  立即体验
                  <i className="fa fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>

            {/* 占位卡片 - 可用于未来扩展 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex items-center justify-center">
              <div className="text-center">
                <i className="fa fa-plus-circle text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-400">更多创意项目即将推出</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-600 dark:text-gray-300">
            <p className="mb-2">© 2025 领创工作室. 保留所有权利.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              一个专注于创意网页开发的集合平台
            </p>
          </div>
                    <div className="flex justify-center">
            <a href="https://www.lacs.cc" className="text-primary font-medium flex items-center">
              领创工作室官网
              <i className="fa fa-arrow-right ml-2"></i>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;