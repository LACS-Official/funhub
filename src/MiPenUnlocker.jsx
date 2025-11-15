import React, { useState, useEffect, useRef } from 'react';
import './MiPenUnlocker.css'; 

const MiPenUnlocker = () => {
  // 状态管理
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showBindSuccessModal, setShowBindSuccessModal] = useState(false);
  const [showPhysicalUnlockPage, setShowPhysicalUnlockPage] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState({ title: '', message: '', type: '' });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [privacyCheck, setPrivacyCheck] = useState(false);
  const [deviceBound, setDeviceBound] = useState(false);
  
  // 三步弹窗相关状态
  const [showStep1Modal, setShowStep1Modal] = useState(false);
  const [showStep2Modal, setShowStep2Modal] = useState(false);
  const [showStep3Modal, setShowStep3Modal] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [step1Deadline, setStep1Deadline] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(5);
  const [unlockProgressStep, setUnlockProgressStep] = useState(0);
  const [unlockProgressPercentage, setUnlockProgressPercentage] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('');
  const [unlockSteps] = useState([
    '正在验证设备信息',
    '正在解锁',
    '解锁完毕'
  ]);
  
  // 表单状态
  const [loginForm, setLoginForm] = useState({ username: '', password: '', rememberMe: false });
  const [unlockForm, setUnlockForm] = useState({ deviceModel: '', deviceSN: '' });
  
  // 密码可见性状态
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // 模拟用户数据
  const [mockUsers, setMockUsers] = useState(() => {
    const savedUsers = localStorage.getItem('mockUsers');
    return savedUsers ? JSON.parse(savedUsers) : [{ username: 'lacs', password: 'appfun', email: 'a@lacs.email' }];
  });
  
  // 引用
  const loginModalRef = useRef(null);
  const unlockModalRef = useRef(null);
  const resultModalRef = useRef(null);
  
  // 初始化
  useEffect(() => {
    // 检查隐私条款接受状态
    const accepted = localStorage.getItem('privacyAccepted') === 'true';
    setPrivacyAccepted(accepted);
    
    // 检查登录状态
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (loggedInUser) {
      const user = mockUsers.find(u => u.username === loggedInUser);
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
      }
    }
    
    // 页面加载动画
    document.body.classList.add('opacity-0');
    setTimeout(() => {
      document.body.classList.remove('opacity-0');
      document.body.classList.add('transition-opacity', 'duration-500');
      
      // 根据状态显示相应的模态框
      if (!accepted) {
        // 显示隐私条款（在组件中直接渲染）
      } else if (!isLoggedIn) {
        setShowLoginModal(true);
      }
    }, 10);
    
    // 键盘事件监听
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowUnlockModal(false);
        setShowResultModal(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // 保存用户数据 - 仅用于内部状态管理
  const saveUsers = () => {
    localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
  };
  
  // 处理隐私条款同意
  const handlePrivacyAccept = () => {
    if (privacyCheck) {
      localStorage.setItem('privacyAccepted', 'true');
      setPrivacyAccepted(true);
      setTimeout(() => {
        setShowLoginModal(true);
      }, 200);
    }
  };
  
  // 处理登录
  const handleLogin = (e) => {
    e.preventDefault();
    const user = mockUsers.find(u => u.username === loginForm.username && u.password === loginForm.password);
    
    if (user) {
      localStorage.setItem('loggedInUser', user.username);
      
      if (loginForm.rememberMe) {
        localStorage.setItem('rememberedUser', user.username);
      } else {
        localStorage.removeItem('rememberedUser');
      }
      
      showNotification('登录成功！', 'success');
      setIsLoggedIn(true);
      setCurrentUser(user);
      setShowLoginModal(false);
    } else {
      showNotification('用户名或密码错误，请重试', 'error');
    }
  };
  

  
  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    setIsLoggedIn(false);
    setCurrentUser(null);
    showNotification('已退出登录', 'info');
    setTimeout(() => {
      setShowLoginModal(true);
    }, 500);
  };
  
  // 处理申请解锁
  const handleApplyUnlock = (e) => {
    e.preventDefault();
    
    if (!unlockForm.deviceModel || !unlockForm.deviceSN) {
      showNotification('请填写完整的设备信息', 'error');
      return;
    }
    
    setShowUnlockModal(false);
    setShowProgressModal(true);
    setProgress(0);
    
    // 模拟绑定设备的进度
    simulateUnlockProgress(() => {
      setShowProgressModal(false);
      setDeviceBound(true);
      setShowBindSuccessModal(true);
    });
  };
  
  // 处理物理解锁 - 触发第一步弹窗
  const handlePhysicalUnlock = () => {
    setShowPhysicalUnlockPage(false);
    setShowStep1Modal(true);
    setCanProceed(false);
    setStep1Deadline(Date.now() + 5000);
    setRemainingSeconds(5);
    
    // 强制阅读机制：5秒后允许点击同意
    setTimeout(() => {
      setCanProceed(true);
    }, 5000);
  };
  
  // 处理第一步弹窗同意
  const handleStep1Agree = () => {
    setShowStep1Modal(false);
    setTimeout(() => {
      setShowStep2Modal(true);
    }, 300);
  };
  
  // 处理第二步弹窗确认
  const handleStep2Confirm = () => {
    setShowStep2Modal(false);
    setTimeout(() => {
      setShowStep3Modal(true);
      startUnlockProgress();
    }, 300);
  };
  
  // 开始解锁进度模拟
  const startUnlockProgress = () => {
    setUnlockProgressStep(0);
    setUnlockProgressPercentage(0);
    setCurrentStepText(unlockSteps[0]);
    
    // 模拟进度
    const progressInterval = setInterval(() => {
      setUnlockProgressPercentage(prev => {
        const newProgress = prev + 1;
        
        // 更新步骤文本
        if (newProgress >= 33 && unlockProgressStep < 1) {
          setUnlockProgressStep(1);
          setCurrentStepText(unlockSteps[1]);
        } else if (newProgress >= 66 && unlockProgressStep < 2) {
          setUnlockProgressStep(2);
          setCurrentStepText(unlockSteps[2]);
        }
        
        // 完成进度
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          // 显示随机解锁结果
          setTimeout(() => {
            setShowStep3Modal(false);
            showRandomUnlockResult();
          }, 1000);
        }
        
        return newProgress;
      });
    }, 50);
  };

  useEffect(() => {
    if (!showStep1Modal || canProceed || !step1Deadline) return;
    const interval = setInterval(() => {
      const left = Math.max(0, Math.ceil((step1Deadline - Date.now()) / 1000));
      setRemainingSeconds(left);
    }, 250);
    return () => clearInterval(interval);
  }, [showStep1Modal, canProceed, step1Deadline]);
  
  // 显示随机解锁结果
  const showRandomUnlockResult = () => {
    const results = [
      { title: '解锁成功', message: '您的设备已成功解锁，可以正常使用了。', type: 'success' },
      { title: '解锁失败', message: '解锁过程中出现错误，请重试。', type: 'failed' },
      { title: '解锁失败', message: '设备验证失败，无法解锁。', type: 'failed' },
      { title: '解锁等待', message: '需要等待24小时后重试。', type: 'wait' },
      { title: '解锁等待', message: '需要等待72小时后重试。', type: 'wait' }
    ];
    
    const randomIndex = Math.floor(Math.random() * results.length);
    const selectedResult = results[randomIndex];
    
    setResult(selectedResult);
    setShowResultModal(true);
  };
  
  // 模拟解锁进度
  const simulateUnlockProgress = (callback) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(callback, 500);
      }
      setProgress(Math.round(progress));
    }, 300);
  };
  
  // 显示解锁结果
  const showUnlockResult = () => {
    const results = [
      { text: '等待168小时', type: 'wait', probability: 0.3 },
      { text: '等待500小时', type: 'wait', probability: 0.2 },
      { text: '等待1680小时', type: 'wait', probability: 0.2 },
      { text: '当前设备无法解锁', type: 'failed', probability: 0.2 },
      { text: '当前设备已成功解锁', type: 'success', probability: 0.1 }
    ];
    
    const random = Math.random();
    let cumulativeProbability = 0;
    let selectedResult = null;
    
    for (const result of results) {
      cumulativeProbability += result.probability;
      if (random < cumulativeProbability) {
        selectedResult = result;
        break;
      }
    }
    
    let title, message, type;
    
    if (selectedResult.type === 'success') {
      title = '解锁成功';
      message = `${selectedResult.text}\n恭喜！您的设备现在可以正常使用了。`;
      type = 'success';
    } else if (selectedResult.type === 'wait') {
      title = '解锁等待中';
      message = `${selectedResult.text}\n系统需要进一步验证您的设备信息，请耐心等待。`;
      type = 'wait';
    } else {
      title = '解锁失败';
      message = `${selectedResult.text}\n请检查设备连接状态，或稍后重试。`;
      type = 'failed';
    }
    
    setResult({ title, message, type });
    setShowResultModal(true);
  };
  
  // 渲染绑定成功模态框
  const renderBindSuccessModal = () => {
    if (!showBindSuccessModal) return null;
    
    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={() => setShowBindSuccessModal(false)}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-6">
            <div className="text-center mb-4">
              <i className="fa fa-check-circle text-green-500 text-5xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-center text-secondary mb-2">
              设备绑定成功
            </h3>
            <p className="text-center text-gray-600 mb-6">
              您的设备信息已成功提交并绑定。<br />
              请点击下一步进入物理解锁流程。
            </p>
            <button
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
              onClick={() => {
                setShowBindSuccessModal(false);
                setShowPhysicalUnlockPage(true);
              }}
            >
              下一步
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染物理解锁页面
  const renderPhysicalUnlockPage = () => {
    if (!showPhysicalUnlockPage) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-secondary">巨能写解锁工具 V1.0.0</h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowPhysicalUnlockPage(false)}
              >
                <i className="fa fa-times text-xl"></i>
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-8">
              {/* 左侧图片 */}
              <div className="flex-1 flex items-center justify-center">
                <img 
                  src="https://img.lacs.cc/i/25-11/03/未命名的设计.webp" 
                  alt="大米巨能写设备" 
                  className="max-w-full h-auto rounded-lg"
                />
              </div>
              
              {/* 右侧内容 */}
              <div className="flex-1">
                <div className="mb-6">
                  <h4 className="text-xl font-medium text-secondary mb-4">已连接笔身</h4>
                  <p className="text-gray-600 mb-4">
                    请保持笔身合盖状态下插入数据线连接电脑
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h5 className="font-medium text-gray-900 mb-2">解锁须知</h5>
                  <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                    <li>解锁后系统将失去安全保护，导致您的隐私被泄露或财产损失</li>
                    <li>纸质识别、查找位置等依赖系统安全性的服务将变得不可靠</li>
                    <li>解锁过程中遇到其他问题？点击查看FAQ</li>
                  </ol>
                </div>
                
                <button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
                  onClick={handlePhysicalUnlock}
                >
                  开始解锁设备
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // 显示通知
  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };
  
  // 处理模态框背景点击
  const handleModalClick = (ref, setShow) => {
    return (e) => {
      if (ref.current && e.target === ref.current) {
        setShow(false);
      }
    };
  };
  
  // 渲染隐私条款模态框
  const renderPrivacyModal = () => {
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
                id="acceptPrivacy"
                className="h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary"
                checked={privacyCheck}
                onChange={(e) => setPrivacyCheck(e.target.checked)}
              />
              <label htmlFor="acceptPrivacy" className="ml-2 block text-sm text-gray-700">
                我已阅读并同意隐私政策和用户协议
              </label>
            </div>
            <button
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50 accept-privacy-btn"
              disabled={!privacyCheck}
              onClick={handlePrivacyAccept}
            >
              同意并继续
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染登录模态框
  const renderLoginModal = () => {
    if (!showLoginModal) return null;
    
    return (
      <div
        id="loginModal"
        ref={loginModalRef}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]"
        onClick={handleModalClick(loginModalRef, setShowLoginModal)}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-secondary">用户登录</h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowLoginModal(false)}
              >
                <i className="fa fa-times text-xl"></i>
              </button>
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
  
  // 渲染注册模态框 - 已移除注册功能
  
  // 渲染解锁模态框
  const renderUnlockModal = () => {
    if (!showUnlockModal) return null;
    
    return (
      <div
        id="unlockModal"
        ref={unlockModalRef}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={handleModalClick(unlockModalRef, setShowUnlockModal)}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all scale-100">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-secondary">申请解锁</h3>
              <button
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowUnlockModal(false)}
              >
                <i className="fa fa-times text-xl"></i>
              </button>
            </div>
          </div>
          <div className="p-6">
            <form className="space-y-4 unlock-form" onSubmit={handleApplyUnlock}>
              <div>
                <label htmlFor="deviceModel" className="block text-sm font-medium text-gray-700 mb-1">
                  设备型号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="deviceModel"
                  name="deviceModel"
                  placeholder="请输入设备型号"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                  value={unlockForm.deviceModel}
                  onChange={(e) => setUnlockForm(prev => ({ ...prev, deviceModel: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="deviceSN" className="block text-sm font-medium text-gray-700 mb-1">
                  SN号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="deviceSN"
                  name="deviceSN"
                  placeholder="请输入设备SN号"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition"
                  value={unlockForm.deviceSN}
                  onChange={(e) => setUnlockForm(prev => ({ ...prev, deviceSN: e.target.value }))}
                />
                <p className="mt-1 text-xs text-gray-500">SN号通常位于设备底部或包装盒上</p>
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  提交申请
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染结果模态框
  const renderResultModal = () => {
    if (!showResultModal) return null;
    
    let buttonColor = 'bg-primary';
    let icon = '';
    
    switch (result.type) {
      case 'success':
        buttonColor = 'bg-green-500';
        icon = '<i class="fa fa-check-circle text-green-500 text-5xl"></i>';
        break;
      case 'wait':
        buttonColor = 'bg-amber-500';
        icon = '<i class="fa fa-clock-o text-amber-500 text-5xl"></i>';
        break;
      case 'failed':
        buttonColor = 'bg-red-500';
        icon = '<i class="fa fa-times-circle text-red-500 text-5xl"></i>';
        break;
    }
    
    return (
      <div
        id="resultModal"
        ref={resultModalRef}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={handleModalClick(resultModalRef, setShowResultModal)}
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-6">
            <div className="text-center mb-4 result-icon" dangerouslySetInnerHTML={{ __html: icon }} />
            <h3 className="text-xl font-semibold text-center text-secondary mb-2 result-title">
              {result.title}
            </h3>
            <p className="text-center text-gray-600 mb-6 whitespace-pre-line result-message">
              {result.message}
            </p>
            <button
              className={`w-full ${buttonColor} hover:opacity-90 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-opacity-50`}
              onClick={() => setShowResultModal(false)}
            >
              确定
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染进度模态框
  const renderProgressModal = () => {
    if (!showProgressModal) return null;
    
    return (
      <div id="progressModal" className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6">
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-2">正在解锁</h3>
            <p className="text-gray-600">请稍候，系统正在处理您的解锁请求...</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-gray-500 text-right">{progress}%</p>
        </div>
      </div>
    );
  };
  
  // 渲染第一步弹窗 - 重要提示
  const renderStep1Modal = () => {
    if (!showStep1Modal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-secondary text-center">重要提示</h3>
          </div>
          <div className="p-6">
            <div className="bg-yellow-50 p-4 rounded-lg mb-6 border-l-4 border-yellow-500">
              <p className="text-gray-800 mb-4">解锁将会清除书写数据，是否继续</p>
              <p className="text-gray-800">近期有大量用户上报第三方ROM有笔油吸油行为，造成了用户的财产损失，请谨慎解锁刷机</p>
            </div>
            
            <div className="flex gap-4">
              <button
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-300"
                onClick={() => setShowStep1Modal(false)}
              >
                取消
              </button>
              <button
                className={`flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-300 ${!canProceed ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleStep1Agree}
                disabled={!canProceed}
              >
                {canProceed ? '同意' : `${remainingSeconds}秒后可点击`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染第二步弹窗 - 同意确认
  const renderStep2Modal = () => {
    if (!showStep2Modal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-secondary text-center">确认信息</h3>
          </div>
          <div className="p-6">
            <div className="text-center mb-6">
              <i className="fa fa-check-circle text-green-500 text-5xl mb-4"></i>
              <p className="text-gray-800">您已确认了解所有风险，准备继续解锁流程</p>
            </div>
            
            <button
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
              onClick={handleStep2Confirm}
            >
              开始解锁
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染第三步弹窗 - 解锁进度
  const renderStep3Modal = () => {
    if (!showStep3Modal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-secondary text-center">解锁进度</h3>
          </div>
          <div className="p-6">
            {/* 进度百分比指示器 */}
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">当前进度</span>
                <span className="font-medium text-primary">{unlockProgressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${unlockProgressPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* 当前步骤状态 */}
            <div className="text-center py-6">
              <i className="fa fa-cog fa-spin text-primary text-4xl mb-4"></i>
              <h4 className="text-lg font-medium text-secondary mb-2">{currentStepText}</h4>
              <p className="text-gray-600">请耐心等待，不要关闭此窗口...</p>
            </div>
            
            {/* 步骤指示器 */}
            <div className="flex justify-between">
              {unlockSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${index <= unlockProgressStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'}`}
                  >
                    {index + 1}
                  </div>
                  <p className={`text-xs text-center ${index <= unlockProgressStep ? 'text-primary' : 'text-gray-500'}`}>
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // 渲染通知
  const renderNotification = () => {
    if (!notification.show) return null;
    
    const getTypeClass = () => {
      switch (notification.type) {
        case 'success': return 'bg-green-500';
        case 'error': return 'bg-red-500';
        case 'warning': return 'bg-yellow-500';
        case 'info': return 'bg-blue-500';
        default: return 'bg-gray-500';
      }
    };
    
    const getIconClass = () => {
      switch (notification.type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-exclamation-circle';
        case 'warning': return 'fa-exclamation-triangle';
        case 'info': return 'fa-info-circle';
        default: return 'fa-bell';
      }
    };
    
    return (
      <div className={`fixed top-5 right-5 ${getTypeClass()} text-white py-3 px-5 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out z-50 flex items-center`}>
        <i className={`fa ${getIconClass()} mr-3 text-xl`}></i>
        <span>{notification.message}</span>
      </div>
    );
  };
  
  // 渲染主内容
  const renderMainContent = () => {
    if (!isLoggedIn) return null;
    
    return (
      <>
        {/* 导航栏 */}
        <nav className="bg-white shadow-md main-nav">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-secondary">大米巨能写解锁工具</h1>
            </div>
            <div className="flex items-center user-info">
              <span className="text-gray-600 mr-3">欢迎， <span className="font-medium text-primary logged-username">{currentUser?.username}</span></span>
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-1.5 rounded-lg transition duration-200 logout-btn"
                onClick={handleLogout}
              >
                退出登录
              </button>
            </div>
          </div>
        </nav>
        
        {/* 主要内容 */}
        <main className="container mx-auto px-4 py-8 main-content">
          <div className="text-center mb-12">
            <p className="text-gray-600 max-w-2xl mx-auto">
              使用我们的解锁工具，轻松解除大米巨能写设备的功能限制，获得完整的使用体验。
              解锁后，您将能够使用所有高级功能。
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-custom p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-semibold text-secondary mb-4">解锁步骤</h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-0.5">1</div>
                    <div>
                      <h4 className="font-medium text-gray-900">输入设备信息</h4>
                      <p className="text-gray-600 text-sm">请准确输入您的设备型号和SN号</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-0.5">2</div>
                    <div>
                      <h4 className="font-medium text-gray-900">验证设备</h4>
                      <p className="text-gray-600 text-sm">系统将验证您的设备信息</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 h-8 w-8 bg-primary text-white rounded-full flex items-center justify-center mr-3 mt-0.5">3</div>
                    <div>
                      <h4 className="font-medium text-gray-900">解锁完成</h4>
                      <p className="text-gray-600 text-sm">按照提示完成设备解锁</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                            <button
                  className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50 text-lg unlock-btn"
                  onClick={() => setShowUnlockModal(true)}
                >
                  申请解锁
                </button>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-secondary mb-6 text-center">解锁提示</h3>
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
              <div className="flex">
                <div className="flex-shrink-0">
                  <i className="fa fa-info-circle text-amber-500 text-xl"></i>
                </div>
                <div className="ml-3">
                  <p className="text-amber-700">
                    请注意，解锁过程可能需要一定时间，具体取决于设备型号和系统验证状态。
                    解锁成功后，您可能需要重启设备才能完全生效。
                  </p>
                </div>
              </div>
            </div>
            
          </div>
          <footer className="text-center text-gray-600 text-sm py-4">
            &copy; 2025 领创工作室. All rights reserved.
            <a href="https://www.lacs.cc" className="text-primary hover:underline">领创工作室官网</a>
          </footer>
        </main>
        
      </>
    );
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {renderPrivacyModal()}
      {renderLoginModal()}
      {renderUnlockModal()}
      {renderBindSuccessModal()}
      {renderPhysicalUnlockPage()}
      {renderResultModal()}
      {renderProgressModal()}
      {renderStep1Modal()}
      {renderStep2Modal()}
      {renderStep3Modal()}
      {renderNotification()}
      {renderMainContent()}
    </div>
  );
};

export default MiPenUnlocker;