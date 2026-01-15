import React, { useState, useEffect, useRef } from 'react';

const useLoginLogic = (validUsername, validPassword, storageKey = 'login') => {
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '', rememberMe: false });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const loginModalRef = useRef(null);

  useEffect(() => {
    const accepted = localStorage.getItem(`${storageKey}_privacyAccepted`) === 'true';
    setPrivacyAccepted(accepted);

    const loggedInUser = localStorage.getItem(`${storageKey}_loggedInUser`);
    if (loggedInUser === validUsername) {
      setIsLoggedIn(true);
      setCurrentUser({ username: validUsername });
    }

    document.body.classList.add('opacity-0');
    setTimeout(() => {
      document.body.classList.remove('opacity-0');
      document.body.classList.add('transition-opacity', 'duration-500');

      if (!accepted) {
      } else if (!isLoggedIn) {
        setShowLoginModal(true);
      }
    }, 10);
  }, []);

  const handlePrivacyAccept = (privacyCheck) => {
    if (privacyCheck) {
      localStorage.setItem(`${storageKey}_privacyAccepted`, 'true');
      setPrivacyAccepted(true);
      setTimeout(() => {
        setShowLoginModal(true);
      }, 200);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (loginForm.username === validUsername && loginForm.password === validPassword) {
      localStorage.setItem(`${storageKey}_loggedInUser`, validUsername);

      if (loginForm.rememberMe) {
        localStorage.setItem(`${storageKey}_rememberedUser`, validUsername);
      } else {
        localStorage.removeItem(`${storageKey}_rememberedUser`);
      }

      showNotification('登录成功！', 'success');
      setIsLoggedIn(true);
      setCurrentUser({ username: validUsername });
      setShowLoginModal(false);
    } else {
      showNotification('用户名或密码错误，请重试', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(`${storageKey}_loggedInUser`);
    setIsLoggedIn(false);
    setCurrentUser(null);
    showNotification('已退出登录', 'info');
    setTimeout(() => {
      setShowLoginModal(true);
    }, 500);
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleModalClick = (ref, setShow) => {
    return (e) => {
      if (ref.current && e.target === ref.current) {
        setShow(false);
      }
    };
  };

  return {
    privacyAccepted,
    isLoggedIn,
    currentUser,
    showLoginModal,
    setShowLoginModal,
    loginForm,
    setLoginForm,
    passwordVisible,
    setPasswordVisible,
    notification,
    loginModalRef,
    handlePrivacyAccept,
    handleLogin,
    handleLogout,
    showNotification,
    handleModalClick
  };
};

const LoginModal = ({
  showLoginModal,
  setShowLoginModal,
  loginForm,
  setLoginForm,
  passwordVisible,
  setPasswordVisible,
  loginModalRef,
  handleLogin,
  handleModalClick,
  onLogin
}) => {
  if (!showLoginModal) return null;

  return (
    <div
      id="loginModal"
      ref={loginModalRef}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
    >
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100">
        <div className="p-6 border-b">
          <div className="flex justify-center items-center">
            <h3 className="text-xl font-semibold text-secondary">用户登录</h3>
          </div>
        </div>
        <div className="p-6">
          <form className="space-y-4 login-form" onSubmit={handleLogin}>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                用户名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="请输入用户名"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                密码 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="请输入密码"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition pr-10"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary toggle-password"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                >
                  <i className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                checked={loginForm.rememberMe}
                onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                记住我
              </label>
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                登录
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const PrivacyModal = ({ privacyAccepted, privacyCheck, setPrivacyCheck, onAccept }) => {
  if (privacyAccepted) return null;

  return (
    <div className="modal privacy-modal fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-2xl font-semibold text-secondary">隐私政策与用户协议</h3>
        </div>
        <div className="p-6 overflow-y-auto privacy-content">
          <h4 className="text-lg font-medium mb-4">隐私政策</h4>
          <p className="mb-4">感谢您使用大米巨能写解锁工具。保护您的隐私是我们的首要任务。本隐私政策旨在帮助您了解我们如何收集、使用和保护您提供的信息。</p>
          <h5 className="text-md font-medium mt-6 mb-2">1. 信息收集</h5>
          <p className="mb-4">我们可能收集以下信息：</p>
          <ul className="list-disc pl-6 mb-4">
            <li>个人信息：用户名、电子邮件地址等</li>
            <li>设备信息：设备型号、SN号等</li>
            <li>使用信息：解锁请求记录、使用时间等</li>
          </ul>
          <h5 className="text-md font-medium mt-6 mb-2">2. 信息使用</h5>
          <p className="mb-4">我们使用收集的信息：</p>
          <ul className="list-disc pl-6 mb-4">
            <li>提供、维护和改进我们的服务</li>
            <li>处理您的解锁请求</li>
            <li>发送通知和更新</li>
            <li>保护我们服务的安全性</li>
          </ul>
          <h5 className="text-md font-medium mt-6 mb-2">3. 信息保护</h5>
          <p className="mb-4">我们采取合理措施保护您的信息不被未经授权的访问、披露、修改或销毁。然而，请注意，互联网传输并非完全安全，我们不能保证您传输给我们的信息的安全性。</p>
          <h5 className="text-md font-medium mt-6 mb-2">4. Cookie的使用</h5>
          <p className="mb-4">我们使用Cookie来改善您的体验、提供定制内容和分析使用模式。您可以在浏览器设置中拒绝Cookie，但这可能会影响某些功能。</p>
          <h5 className="text-md font-medium mt-6 mb-2">5. 第三方服务</h5>
          <p className="mb-4">我们的服务可能包含第三方服务提供商的链接或集成。我们不对这些第三方的隐私实践负责，建议您查看他们的隐私政策。</p>
          <h5 className="text-md font-medium mt-6 mb-2">6. 未成年人保护</h5>
          <p className="mb-4">我们不故意收集13岁以下未成年人的个人信息。如果我们发现我们收集了未成年人的信息，我们将立即删除这些信息。</p>
          <h5 className="text-md font-medium mt-6 mb-2">7. 隐私政策的变更</h5>
          <p className="mb-4">我们可能会不时更新本隐私政策。我们将通过在网站上发布新的隐私政策来通知您任何变更。我们鼓励您定期查看本隐私政策。</p>
          <h5 className="text-md font-medium mt-6 mb-2">8. 联系我们</h5>
          <p className="mb-4">如果您对本隐私政策有任何问题或疑虑，请联系我们。</p>

          <h4 className="text-lg font-medium mt-8 mb-4">用户协议</h4>
          <p className="mb-4">请仔细阅读本用户协议，它规定了使用大米巨能写解锁工具的条款和条件。通过使用我们的服务，您同意遵守本协议的所有条款。</p>
          <h5 className="text-md font-medium mt-6 mb-2">1. 服务描述</h5>
          <p className="mb-4">大米巨能写解锁工具是一个在线服务，旨在帮助用户解锁大米巨能写设备的限制功能。</p>
          <h5 className="text-md font-medium mt-6 mb-2">2. 使用条件</h5>
          <p className="mb-4">要使用我们的服务，您必须：</p>
          <ul className="list-disc pl-6 mb-4">
            <li>至少18岁或达到您所在地区的法定年龄</li>
            <li>拥有使用我们服务所需的法律能力</li>
            <li>提供真实、准确、完整和最新的信息</li>
          </ul>
          <h5 className="text-md font-medium mt-6 mb-2">3. 用户行为</h5>
          <p className="mb-4">您同意不会：</p>
          <ul className="list-disc pl-6 mb-4">
            <li>使用我们的服务进行任何非法活动</li>
            <li>尝试未经授权访问我们的系统或服务器</li>
            <li>干扰或破坏我们的服务或相关服务器和网络</li>
            <li>侵犯他人的知识产权或其他权利</li>
          </ul>
          <h5 className="text-md font-medium mt-6 mb-2">4. 免责声明</h5>
          <p className="mb-4">我们的服务按"原样"和"可用"提供，不附带任何形式的保证，无论是明示还是暗示。我们不保证服务将不间断、无错误或完全安全。</p>
          <h5 className="text-md font-medium mt-6 mb-2">5. 责任限制</h5>
          <p className="mb-4">在法律允许的最大范围内，我们不对因使用或无法使用我们的服务而导致的任何间接、附带、特殊、后果性或惩罚性损害承担责任。</p>
          <h5 className="text-md font-medium mt-6 mb-2">6. 终止</h5>
          <p className="mb-4">我们有权在任何时候，基于任何理由，立即终止或暂停您对我们服务的访问，无需事先通知。</p>
          <h5 className="text-md font-medium mt-6 mb-2">7. 法律适用</h5>
          <p className="mb-4">本协议受中国法律管辖，不考虑其法律冲突规定。</p>
          <h5 className="text-md font-medium mt-6 mb-2">8. 协议修改</h5>
          <p className="mb-4">我们可能会不时修改本协议。修改后的协议将在网站上发布，您继续使用我们的服务将视为接受修改后的条款。</p>
        </div>
        <div className="p-6 border-t">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="privacyCheck"
              className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
              checked={privacyCheck}
              onChange={(e) => setPrivacyCheck(e.target.checked)}
            />
            <label htmlFor="privacyCheck" className="ml-2 block text-sm text-gray-700">
              我已阅读并同意隐私政策与用户协议
            </label>
          </div>
          <button
            className={`w-full py-3 px-4 rounded-lg transition duration-300 font-medium ${privacyCheck
              ? 'bg-primary hover:bg-primary/90 text-white transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!privacyCheck}
            onClick={onAccept}
          >
            同意并继续
          </button>
        </div>
      </div>
    </div>
  );
};

const Notification = ({ notification }) => {
  if (!notification.show) return null;

  const bgColor = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  }[notification.type] || 'bg-blue-500';

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transition-all duration-300`}>
      {notification.message}
    </div>
  );
};

export { useLoginLogic, LoginModal, PrivacyModal, Notification };
export default useLoginLogic;
