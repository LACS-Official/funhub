import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="text-primary">
                <i className="fa fa-pen-fancy text-xl"></i>
              </div>
              <h3 className="text-lg font-semibold">小米触控笔解锁工具</h3>
            </div>
            <p className="text-gray-400 text-sm">
              专为小米触控笔设计的解锁工具，帮助您轻松解锁设备限制，充分发挥触控笔的全部功能。
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">首页</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">使用指南</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">支持</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">关于</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">支持</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-primary transition-colors">常见问题</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">联系客服</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">反馈建议</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">更新日志</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">联系我们</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-3">
                <i className="fa fa-envelope"></i>
                <span>support@mipenunlocker.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <i className="fa fa-phone"></i>
                <span>400-123-4567</span>
              </div>
              <div className="flex space-x-4 mt-4">
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-weibo text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-weixin text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <i className="fab fa-qq text-xl"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {currentYear} 小米触控笔解锁工具. 保留所有权利.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:text-primary transition-colors">隐私政策</a>
            <a href="#" className="hover:text-primary transition-colors">用户协议</a>
            <a href="#" className="hover:text-primary transition-colors">免责声明</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;