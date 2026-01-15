import React from 'react';

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-6 h-[20vh]">
      <div className="container mx-auto px-4">
        <div className="text-center text-gray-600">
          <p className="mb-1">© 2025 -2026 领创工作室. 保留所有权利.</p>
          <p className="text-sm text-gray-500">一个专注于创意网页开发的集合平台</p>
        </div>
        <div className="flex justify-center mt-3">
          <a href="https://www.lacs.cc" className="text-primary font-medium flex items-center hover:underline text-sm">
            领创工作室官网
            <i className="fa fa-arrow-right ml-1"></i>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
