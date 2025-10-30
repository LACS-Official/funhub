import React, { useEffect } from 'react';

const Notification = ({ 
  notification, 
  setNotification 
}) => {
  useEffect(() => {
    if (notification.show) {
      const timer = setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [notification.show, setNotification]);
  
  if (!notification.show) return null;
  
  const getNotificationClass = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      default:
        return 'bg-blue-500';
    }
  };
  
  const getIconClass = () => {
    switch (notification.type) {
      case 'success':
        return 'fa-check-circle';
      case 'error':
        return 'fa-times-circle';
      case 'warning':
        return 'fa-exclamation-triangle';
      default:
        return 'fa-info-circle';
    }
  };
  
  return (
    <div
      id="notification"
      className={`fixed top-4 right-4 ${getNotificationClass()} text-white px-6 py-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-0`}
    >
      <div className="flex items-center">
        <i className={`fa ${getIconClass()} mr-3`}></i>
        <span>{notification.message}</span>
        <button
          className="ml-4 text-white hover:text-gray-200"
          onClick={() => setNotification(prev => ({ ...prev, show: false }))}
        >
          <i className="fa fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Notification;