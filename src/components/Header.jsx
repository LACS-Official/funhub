import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ currentUser, onLogout, title = '工具箱' }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-secondary">{title}</h1>
          </Link>
        </div>
        <div className="flex items-center">
          {currentUser ? (
            <>
              <span className="text-gray-600 mr-3">
                欢迎， <span className="font-medium text-primary">{currentUser.username}</span>
              </span>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-lg transition duration-200"
                onClick={onLogout}
              >
                退出登录
              </button>
            </>
          ) : null}
        </div>
      </div>
    </nav>
  );
};

export default Header;
