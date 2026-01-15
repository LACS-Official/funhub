import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import { useLoginLogic, LoginModal, PrivacyModal, Notification } from './components/LoginLogic.jsx';
import './MiPenUnlocker.css';

const MiRainbowBattery = () => {
  const VALID_USERNAME = 'lacs';
  const VALID_PASSWORD = 'appfunhub';

  const navigate = useNavigate();
  const location = useLocation();
  const isToolsPage = location.pathname === '/mi-rainbow-battery/tools';

  const {
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
    handleModalClick,
    showNotification
  } = useLoginLogic(VALID_USERNAME, VALID_PASSWORD, 'funhub_login');

  const [showDeviceConnectedModal, setShowDeviceConnectedModal] = useState(false);
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [showFlashModal, setShowFlashModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [currentTab, setCurrentTab] = useState('unlock');
  const [privacyCheck, setPrivacyCheck] = useState(false);

  const [unlockProgress, setUnlockProgress] = useState(0);
  const [flashProgress, setFlashProgress] = useState(0);
  const [selectedRom, setSelectedRom] = useState(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState({
    isUnlocked: false,
    romName: 'MIUI官方版',
    romVersion: 'V14.0.10.0',
    isRooted: false,
    securityPatch: '2024-12',
    batteryHealth: '完美',
    bootloaderStatus: '已锁定',
    verificationStatus: '已验证'
  });
  const [selectedRootMethods, setSelectedRootMethods] = useState({});
  const [selectedRootModules, setSelectedRootModules] = useState({});

  const romList = [
    { id: 1, name: 'MIUI14官方包', version: 'V14.0.10.0', tags: ['稳定安全'] },
    { id: 2, name: 'HyperOS官方包', version: 'V1.0.5.0', tags: ['流畅', '耗电量有所增加'] },
    { id: 3, name: 'HyperOS领创官改包', version: 'V1.0.5.0.CN', tags: ['更开放', '内置高级设置'] },
    { id: 4, name: 'ColorOS', version: 'V13.0.0', tags: ['可变彩虹颜色'] },
    { id: 5, name: 'H2OS', version: 'V3.0.0', tags: ['氢动力', '系统毛坯'] }
  ];

  const rootMethods = [
    { id: 1, name: 'Magisk官方', description: '通过Magisk管理器获取Root权限' },
    { id: 2, name: 'KernelSU', description: '基于内核的Root方案' },
    { id: 3, name: 'APatch', description: 'Android Patch工具' }
  ];

  const rootModules = [
    { id: 1, name: 'LSPosed', description: 'Xposed框架替代品' },
    { id: 2, name: 'EdXposed', description: 'ART虚拟机框架' },
    { id: 3, name: 'Zygisk', description: 'Magisk模块' },
  ];

  useEffect(() => {
    document.body.classList.add('opacity-0');
    setTimeout(() => {
      document.body.classList.remove('opacity-0');
      document.body.classList.add('transition-opacity', 'duration-500');
    }, 10);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowDeviceConnectedModal(false);
        setShowUnlockModal(false);
        setShowFlashModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLidOpened = () => {
    setIsConnecting(true);
    setConnectionSuccess(false);
    const loadingTime = Math.random() * 2000 + 1000;
    setTimeout(() => {
      setConnectionSuccess(true);
      setTimeout(() => {
        setIsConnecting(false);
        setConnectionSuccess(false);
        setShowDeviceConnectedModal(true);
      }, 1000);
    }, loadingTime);
  };

  const handleConfirm = () => {
    setShowDeviceConnectedModal(false);
    navigate('/mi-rainbow-battery/tools');
  };

  const handleCancel = () => {
    setShowDeviceConnectedModal(false);
  };

  const handleStartUnlock = () => {
    setShowUnlockModal(true);
    setIsUnlocking(true);
    setUnlockProgress(0);

    const interval = setInterval(() => {
      setUnlockProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUnlocking(false);
          setDeviceStatus(prev => ({ ...prev, isUnlocked: true }));
          showNotification('解锁成功！', 'success');
          return 100;
        }
        return prev + 2;
      });
    }, 80);
  };

  const handleCloseUnlockModal = () => {
    setShowUnlockModal(false);
    setUnlockProgress(0);
  };

  const handleStartFlash = () => {
    if (!isLoggedIn) {
      showNotification('请先登录', 'warning');
      return;
    }

    if (!deviceStatus.isUnlocked) {
      showNotification('请先解锁设备后才能刷机', 'warning');
      return;
    }

    if (!selectedRom) {
      showNotification('请先选择ROM包', 'warning');
      return;
    }

    const selectedRomData = romList.find(r => r.id === selectedRom);

    setShowFlashModal(true);
    setIsFlashing(true);
    setFlashProgress(0);

    const interval = setInterval(() => {
      setFlashProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFlashing(false);
          setDeviceStatus(prev => ({
            ...prev,
            romName: selectedRomData.name,
            romVersion: selectedRomData.version,
            isRooted: false
          }));
          showNotification('刷机成功！', 'success');
          return 100;
        }
        return prev + 1.5;
      });
    }, 60);
  };

  const handleCloseFlashModal = () => {
    setShowFlashModal(false);
    setFlashProgress(0);
  };

  const handleStartRoot = () => {
    if (!isLoggedIn) {
      showNotification('请先登录', 'warning');
      return;
    }

    if (!deviceStatus.isUnlocked) {
      showNotification('请先解锁设备后才能获取Root', 'warning');
      return;
    }

    const selectedCount = Object.keys(selectedRootMethods).filter(k => selectedRootMethods[k]).length;
    const moduleCount = Object.keys(selectedRootModules).filter(k => selectedRootModules[k]).length;

    if (selectedCount === 0 && moduleCount === 0) {
      showNotification('请至少选择一个Root方式或模块', 'warning');
      return;
    }

    setDeviceStatus(prev => ({ ...prev, isRooted: true }));
    showNotification('Root成功！', 'success');
  };

  const renderSearchAnimation = () => (
    <div className="flex justify-center items-center mb-8">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-gray-300"></div>
        <div className="absolute inset-0 rounded-full border-4 border-orange-500 search-ring-1"></div>
        <div className="absolute inset-0 rounded-full border-4 border-orange-500 search-ring-2"></div>
        <div className="absolute inset-0 rounded-full bg-orange-500 search-icon-container flex items-center justify-center">
          <i className="fa fa-search text-white text-xl"></i>
        </div>
      </div>
    </div>
  );

  const renderDeviceConnectedModal = () => {
    if (!showDeviceConnectedModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-6 text-center">
            <div className="mb-4">
              <i className="fa fa-check-circle text-green-500 text-6xl"></i>
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-4">设备已连接</h3>
            <img
              src="https://img.lacs.cc/i/26-01/15/mi_battery_open.gif"
              alt="设备已连接"
              className="w-full h-auto rounded-lg mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-300"
              >
                取消
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 px-4 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition duration-300"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderConnectingModal = () => {
    if (!isConnecting) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-8">
          <div className="text-center">
            {connectionSuccess ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <i className="fa fa-check-circle text-green-500 text-6xl animate-[scale_0.3s_ease-out]"></i>
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">连接成功</h3>
                <p className="text-gray-600">正在跳转...</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-primary rounded-full animate-ping"></div>
                  <i className="fa-brands fa-bluetooth-b text-primary text-3xl absolute inset-0 flex items-center justify-center"></i>
                </div>
                <h3 className="text-xl font-semibold text-secondary mb-2">正在连接设备</h3>
                <p className="text-gray-600">请稍候...</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderUnlockModal = () => {
    if (!showUnlockModal) return null;

    const getUnlockStatus = () => {
      if (unlockProgress < 30) return '正在验证设备信息...';
      if (unlockProgress < 70) return '正在执行解锁操作...';
      if (unlockProgress < 100) return '正在完成解锁...';
      return '解锁成功！';
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-secondary text-center">解锁进度</h3>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">当前进度</span>
                <span className="font-medium text-primary">{unlockProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${unlockProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center py-4">
              <i className={`fa fa-cog text-primary text-4xl mb-4 ${isUnlocking ? 'fa-spin' : ''}`}></i>
              <p className="text-gray-700 font-medium">{getUnlockStatus()}</p>
            </div>
            {unlockProgress >= 100 && (
              <button
                onClick={handleCloseUnlockModal}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
              >
                完成
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderFlashModal = () => {
    if (!showFlashModal) return null;

    const getFlashStatus = () => {
      if (flashProgress < 20) return '正在下载ROM包...';
      if (flashProgress < 40) return '正在验证文件完整性...';
      if (flashProgress < 60) return '正在备份当前系统...';
      if (flashProgress < 80) return '正在刷入新系统...';
      if (flashProgress < 100) return '正在优化系统配置...';
      return '刷机完成！';
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
          <div className="p-6 border-b">
            <h3 className="text-xl font-semibold text-secondary text-center">刷机进度</h3>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">当前进度</span>
                <span className="font-medium text-primary">{flashProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-orange-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${flashProgress}%` }}
                ></div>
              </div>
            </div>
            <div className="text-center py-4">
              <i className={`fa fa-refresh text-orange-500 text-4xl mb-4 ${isFlashing ? 'fa-spin' : ''}`}></i>
              <p className="text-gray-700 font-medium">{getFlashStatus()}</p>
            </div>
            {flashProgress >= 100 && (
              <button
                onClick={handleCloseFlashModal}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition duration-300"
              >
                完成
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 显示通知

  const renderDeviceConnectionArea = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header currentUser={currentUser} onLogout={handleLogout} title="彩虹电池刷机工具" />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-secondary mb-4">彩虹电池刷机工具</h2>
              <p className="text-lg text-gray-600">专业的小米彩虹电池设备管理与刷机解决方案</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mx-auto mb-4">
                  <i className="fa fa-unlock-alt text-white text-xl"></i>
                </div>
                <h3 className="font-semibold text-blue-800 mb-2">设备解锁</h3>
                <p className="text-sm text-blue-700">安全解锁Bootloader，释放设备全部潜力</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center mx-auto mb-4">
                  <i className="fa fa-download text-white text-xl"></i>
                </div>
                <h3 className="font-semibold text-purple-800 mb-2">系统刷机</h3>
                <p className="text-sm text-purple-700">支持多种ROM包，轻松切换系统</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
                  <i className="fa fa-user-shield text-white text-xl"></i>
                </div>
                <h3 className="font-semibold text-green-800 mb-2">Root权限</h3>
                <p className="text-sm text-green-700">获取最高权限，自由定制系统</p>
              </div>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
              <h4 className="font-medium text-amber-800 mb-2">功能特点</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• 支持小米彩虹电池全系设备</li>
                <li>• 官方ROM、第三方ROM、官改包全面支持</li>
                <li>• 官改包内置高级设置，提供更多自定义选项</li>
                <li>• 智能电池管理，延长设备使用寿命</li>
                <li>• 安全可靠，操作简单</li>
              </ul>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
              <h4 className="font-medium text-gray-800 mb-4">使用说明</h4>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                  <span>确保设备电量充足（建议50%以上）</span>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                  <span>打开设备盖子，点击下方连接按钮</span>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                  <span>根据需求选择解锁、刷机或Root操作</span>
                </div>
                <div className="flex items-start">
                  <span className="w-6 h-6 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                  <span>耐心等待操作完成，期间请勿断开连接</span>
                </div>
              </div>
            </div>

            {renderSearchAnimation()}
            <div className="text-center">
              <button
                onClick={handleLidOpened}
                className="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                已开盖，立即连接
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  const renderToolsPage = () => {
    const isOfficialMod = deviceStatus.romName.includes('官改包');
    const tabs = [
      { id: 'unlock', label: '解锁' },
      { id: 'flash', label: '刷机' },
      { id: 'root', label: 'Root' }
    ];

    if (isOfficialMod) {
      tabs.push({ id: 'advanced', label: '高级设置' });
    }

    const renderTabContent = () => {
      switch (currentTab) {
        case 'unlock':
          return (
            <div className="p-6">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
                <h4 className="font-medium text-amber-800 mb-2">解锁须知</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>1. 解锁后设备将失去官方保修</li>
                  <li>2. 解锁会清除所有用户数据</li>
                  <li>3. 部分安全功能可能受到影响</li>
                  <li>4. 请确保设备电量充足</li>
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <i className="fa fa-info-circle text-blue-500 mr-2"></i>
                    <h5 className="font-medium text-blue-800">设备信息</h5>
                  </div>
                  <div className="space-y-1 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span>设备型号：</span>
                      <span className="font-medium">小米彩虹电池</span>
                    </div>
                    <div className="flex justify-between">
                      <span>当前系统：</span>
                      <span className="font-medium">{deviceStatus.romName} {deviceStatus.romVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>电池状态：</span>
                      <span className={`font-medium ${deviceStatus.batteryHealth === '完美' ? 'text-green-600' : 'text-amber-600'}`}>{deviceStatus.batteryHealth}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <i className="fa fa-shield-alt text-green-500 mr-2"></i>
                    <h5 className="font-medium text-green-800">安全状态</h5>
                  </div>
                  <div className="space-y-1 text-sm text-green-700">
                    <div className="flex justify-between">
                      <span>Bootloader：</span>
                      <span className={`font-medium ${deviceStatus.isUnlocked ? 'text-green-600' : 'text-amber-600'}`}>{deviceStatus.isUnlocked ? '已解锁' : '已锁定'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>安全补丁：</span>
                      <span className="font-medium">{deviceStatus.securityPatch}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>验证状态：</span>
                      <span className="font-medium">{deviceStatus.verificationStatus}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-center mb-3">
                  <i className="fa fa-list-ol text-purple-500 mr-2"></i>
                  <h5 className="font-medium text-purple-800">解锁流程</h5>
                </div>
                <div className="space-y-2 text-sm text-purple-700">
                  <div className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                    <span>连接设备到电脑</span>
                  </div>
                  <div className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                    <span>执行解锁命令，等待设备重启</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleStartUnlock}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                开始解锁
              </button>
            </div>
          );
        case 'flash':
          return (
            <div className="p-6">
              <h4 className="text-lg font-medium text-secondary mb-4">选择ROM包</h4>
              <div className="flex gap-6">
                <div className="flex-1 space-y-3">
                  {romList.map(rom => (
                    <label
                      key={rom.id}
                      className={`flex items-center p-4 border rounded-lg cursor-pointer transition duration-300 ${selectedRom === rom.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <input
                        type="radio"
                        name="rom"
                        value={rom.id}
                        checked={selectedRom === rom.id}
                        onChange={() => setSelectedRom(rom.id)}
                        className="w-4 h-4 text-primary mr-3"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{rom.name}</p>
                        <p className="text-sm text-gray-500">版本：{rom.version}</p>
                        {rom.tags && rom.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {rom.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
                <div className="w-64 flex flex-col gap-4">
                  <button
                    onClick={handleStartFlash}
                    disabled={!selectedRom || isFlashing}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50 ${!selectedRom || isFlashing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                      }`}
                  >
                    {isFlashing ? '刷机中...' : '开始刷机'}
                  </button>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h5 className="font-medium text-yellow-800 mb-2">注意事项</h5>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• 确保设备电量充足</li>
                      <li>• 刷机过程中请勿断开连接</li>
                      <li>• 建议备份重要数据</li>
                      <li>• 刷机有风险，请谨慎操作</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        case 'root':
          return (
            <div className="p-6">
              <h4 className="text-lg font-medium text-secondary mb-4">选择Root方式</h4>
              <div className="space-y-3 mb-6">
                {rootMethods.map(method => (
                  <label
                    key={method.id}
                    className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition duration-300"
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedRootMethods[method.id]}
                      onChange={(e) => setSelectedRootMethods(prev => ({ ...prev, [method.id]: e.target.checked }))}
                      className="w-4 h-4 text-primary mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{method.name}</p>
                      <p className="text-sm text-gray-500">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              <h4 className="text-lg font-medium text-secondary mb-4">常用模块</h4>
              <div className="space-y-3 mb-6">
                {rootModules.map(module => (
                  <label
                    key={module.id}
                    className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition duration-300"
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedRootModules[module.id]}
                      onChange={(e) => setSelectedRootModules(prev => ({ ...prev, [module.id]: e.target.checked }))}
                      className="w-4 h-4 text-primary mr-3"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{module.name}</p>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              <button
                onClick={handleStartRoot}
                className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                开始获取Root
              </button>
            </div>
          );
        case 'advanced':
          return (
            <div className="p-6">
              <h4 className="text-lg font-medium text-secondary mb-4">高级设置</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-4 text-center">
                  <i className="fa fa-battery-full text-green-500 text-3xl mb-2"></i>
                  <p className="text-2xl font-bold text-green-700">19%</p>
                  <p className="text-xs text-green-600">电池电量</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-4 text-center">
                  <i className="fa fa-bolt text-blue-500 text-3xl mb-2"></i>
                  <p className="text-2xl font-bold text-blue-700">7.6V</p>
                  <p className="text-xs text-blue-600">电压</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-lg p-4 text-center">
                  <i className="fa fa-thermometer-half text-orange-500 text-3xl mb-2"></i>
                  <p className="text-2xl font-bold text-orange-700">10°C</p>
                  <p className="text-xs text-orange-600">温度</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-4 text-center">
                  <i className="fa fa-clock text-purple-500 text-3xl mb-2"></i>
                  <p className="text-2xl font-bold text-purple-700">06h</p>
                  <p className="text-xs text-purple-600">充电时间</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h5 className="font-medium text-blue-800 mb-2">充电保护</h5>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary mr-3" defaultChecked />
                      <span className="text-sm text-gray-700">过充保护</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary mr-3" defaultChecked />
                      <span className="text-sm text-gray-700">温度保护</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary mr-3" />
                      <span className="text-sm text-gray-700">智能充电（80%停止）</span>
                    </label>
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h5 className="font-medium text-purple-800 mb-2">充电模式</h5>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="chargeMode" className="w-4 h-4 text-primary mr-3" defaultChecked />
                      <span className="text-sm text-gray-700">超级快充</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="chargeMode" className="w-4 h-4 text-primary mr-3" />
                      <span className="text-sm text-gray-700">标准充电</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="chargeMode" className="w-4 h-4 text-primary mr-3" />
                      <span className="text-sm text-gray-700">慢充模式</span>
                    </label>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h5 className="font-medium text-green-800 mb-2">电池健康</h5>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary mr-3" defaultChecked />
                      <span className="text-sm text-gray-700">自动校准</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary mr-3" />
                      <span className="text-sm text-gray-700">深度放电保护</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary mr-3" />
                      <span className="text-sm text-gray-700">循环次数提醒</span>
                    </label>
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h5 className="font-medium text-orange-800 mb-2">省电优化</h5>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary mr-3" defaultChecked />
                      <span className="text-sm text-gray-700">智能省电</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary mr-3" />
                      <span className="text-sm text-gray-700">极致省电模式</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary mr-3" />
                      <span className="text-sm text-gray-700">后台应用限制</span>
                    </label>
                  </div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h5 className="font-medium text-red-800 mb-2">电池信息</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">电池健康度</span>
                      <span className="text-sm font-medium text-red-700">100%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">循环次数</span>
                      <span className="text-sm font-medium text-red-700">156次</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">设计容量</span>
                      <span className="text-sm font-medium text-red-700">2026mAh</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-700">实际容量</span>
                      <span className="text-sm font-medium text-red-700">2026mAh</span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-medium text-yellow-800 mb-2">充电曲线优化</h5>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary mr-3" defaultChecked />
                      <span className="text-sm text-gray-700">三段式充电</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary mr-3" />
                      <span className="text-sm text-gray-700">涓流充电延长</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="w-4 h-4 text-primary mr-3" />
                      <span className="text-sm text-gray-700">低温充电优化</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header currentUser={currentUser} onLogout={handleLogout} title="彩虹电池工具箱" />
        <div className="flex-1 container mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="p-6 border-b bg-gradient-to-r from-primary/10 to-orange-500/10">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                    <i className="fa fa-check text-white"></i>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-secondary">彩虹电池工具箱</h2>
                    <p className="text-sm text-green-600 font-medium">设备已连接</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-gray-600 transition duration-300"
                >
                  <i className="fa fa-sign-out text-xl"></i>
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${deviceStatus.isUnlocked ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  <i className={`fa ${deviceStatus.isUnlocked ? 'fa-unlock text-green-500' : 'fa-lock text-gray-400'} mr-1`}></i>
                  {deviceStatus.isUnlocked ? '已解锁' : '未解锁'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                  <i className="fa-solid fa-grip text-blue-500 mr-1"></i>
                  {deviceStatus.romName} {deviceStatus.romVersion}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${deviceStatus.isRooted ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                  <i className={`fa ${deviceStatus.isRooted ? 'fa-root text-purple-500' : 'fa-ban text-gray-400'} mr-1`}></i>
                  {deviceStatus.isRooted ? '已Root' : '未Root'}
                </span>
              </div>
            </div>
            <div className="border-b">
              <div className="flex">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setCurrentTab(tab.id)}
                    className={`flex-1 py-4 px-6 text-center font-medium transition duration-300 ${currentTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              {renderTabContent()}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <PrivacyModal
        privacyAccepted={privacyAccepted}
        privacyCheck={privacyCheck}
        setPrivacyCheck={setPrivacyCheck}
        onAccept={() => handlePrivacyAccept(privacyCheck)}
      />
      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        passwordVisible={passwordVisible}
        setPasswordVisible={setPasswordVisible}
        loginModalRef={loginModalRef}
        handleLogin={handleLogin}
        handleModalClick={handleModalClick}
      />
      {renderDeviceConnectedModal()}
      {renderConnectingModal()}
      {renderUnlockModal()}
      {renderFlashModal()}
      <Notification notification={notification} />
      {isToolsPage ? renderToolsPage() : null}
      {!isToolsPage && isLoggedIn && privacyAccepted ? renderDeviceConnectionArea() : null}
      {!isToolsPage && (!isLoggedIn || !privacyAccepted) ? renderDeviceConnectionArea() : null}
    </div>
  );
};

export default MiRainbowBattery;
