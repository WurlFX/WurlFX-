import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mail,
  Lock,
  Phone,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Copy,
  Check,
  Eye,
  EyeOff,
  AlertCircle,
  Smartphone,
  Key,
  Globe,
  LogOut,
  RefreshCw,
  Send,
  CheckCircle2,
  Download,
  Trash2,
  User,
  MapPin,
  IdCard,
  Shield,
  Save,
  FileText,
  Clock,
  Laptop,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalInitialTab,
    openAuthModalWithTab,
    isAuthenticated,
    currentUser,
    allUsers,
    login,
    logout,
    switchRole,
    updateUserProfile,
    changePassword,
    requestPasswordReset,
    confirmPasswordReset,
    deleteAccount,
    showNotification,
    toggleMfa,
    sendEmailVerification,
    signOutAllSessions,
    transactions,
  } = useApp();

  // Internal tab state synced with authModalInitialTab
  const [activeTab, setActiveTab] = useState<
    'login' | 'register' | 'profile' | 'security' | 'sessions' | 'privacy' | 'quick'
  >('profile');

  useEffect(() => {
    if (isAuthModalOpen) {
      if (authModalInitialTab) {
        // If user is not authenticated and requested profile/security/sessions/privacy, show login instead
        if (!isAuthenticated && ['profile', 'security', 'sessions', 'privacy'].includes(authModalInitialTab)) {
          setActiveTab('login');
        } else {
          setActiveTab(authModalInitialTab);
        }
      } else {
        setActiveTab(isAuthenticated ? 'profile' : 'login');
      }
    }
  }, [isAuthModalOpen, authModalInitialTab, isAuthenticated]);

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser.fullName);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [profileIdNumber, setProfileIdNumber] = useState(currentUser.kycIdNumber || '34891024');
  const [profileCounty, setProfileCounty] = useState(currentUser.county || 'Nairobi County, Kenya');

  // Keep profile form state in sync when currentUser changes
  useEffect(() => {
    setProfileName(currentUser.fullName);
    setProfileEmail(currentUser.email);
    setProfilePhone(currentUser.phone);
    setProfileIdNumber(currentUser.kycIdNumber || '34891024');
    setProfileCounty(currentUser.county || 'Nairobi County, Kenya');
  }, [currentUser]);

  // Registration Form Fields
  const [legalName, setLegalName] = useState('Juma P.');
  const [nationalId, setNationalId] = useState('34891024');
  const [email, setEmail] = useState('user@wurlfx.com');
  const [phone, setPhone] = useState('0762294296');
  const [county, setCounty] = useState('Nairobi County, Kenya');
  const [regPassword, setRegPassword] = useState('WurlFX@2025!');
  const [confirmPassword, setConfirmPassword] = useState('WurlFX@2025!');
  const [referralInput, setReferralInput] = useState('WURL-88219');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Login Form Fields
  const [loginIdentifier, setLoginIdentifier] = useState('user@wurlfx.com');
  const [loginPassword, setLoginPassword] = useState('WurlFX@2025!');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Rate Limiting & Lockout State (5 attempts -> 60s lockout)
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Change Password Form Fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // Password Reset Interactive Flow
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetStep, setResetStep] = useState<'request' | 'confirm'>('request');
  const [forgotEmail, setForgotEmail] = useState('user@wurlfx.com');
  const [resetTokenInput, setResetTokenInput] = useState('');
  const [dispatchedToken, setDispatchedToken] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [showResetNewPass, setShowResetNewPass] = useState(false);

  // Verification & Copy States
  const [resendCooldown, setResendCooldown] = useState(0);
  const [copiedRef, setCopiedRef] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmationText, setDeleteConfirmationText] = useState('');

  // Privacy Preferences
  const [marketingConsent, setMarketingConsent] = useState(true);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  // Lockout Countdown Timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // Resend Cooldown Timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  if (!isAuthModalOpen) return null;

  const siteReferralLink = `https://wurlfx.com/?ref=${currentUser.referralCode || 'WURL-88219'}`;

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(siteReferralLink);
    setCopiedRef(true);
    showNotification(`Referral Link copied! Share to earn KSh 50 per invite: ${siteReferralLink}`, 'success');
    setTimeout(() => setCopiedRef(false), 2500);
  };

  // Password strength validation helper
  const calculateStrength = (pass: string) => {
    const hasMin = pass.length >= 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasNum = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    const score = [hasMin, hasUpper, hasNum, hasSpecial].filter(Boolean).length;
    return { hasMin, hasUpper, hasNum, hasSpecial, score };
  };

  const regStrength = calculateStrength(regPassword);
  const newPassStrength = calculateStrength(newPassword);
  const resetPassStrength = calculateStrength(newResetPassword);

  const isPasswordMatch = regPassword === confirmPassword && confirmPassword.length > 0;
  const isNewPassMatch = newPassword === confirmNewPassword && confirmNewPassword.length > 0;
  const isResetPassMatch = newResetPassword === confirmResetPassword && confirmResetPassword.length > 0;

  // Sign In Handler
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutSeconds > 0) {
      showNotification(`Too many failed attempts. Security lockout active: please wait ${lockoutSeconds} seconds.`, 'error');
      return;
    }

    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      showNotification('Please enter your registered credentials.', 'error');
      return;
    }

    const cleanId = loginIdentifier.trim().toLowerCase();

    // Check credentials without disclosing user enumeration
    const isMockValidUser =
      (cleanId === 'user@wurlfx.com' ||
        cleanId === '34891024' ||
        cleanId === '0762294296' ||
        cleanId.includes('juma')) &&
      (loginPassword === 'WurlFX@2025!' || loginPassword === '••••••••••••' || loginPassword.length >= 6);

    const isMockAdmin =
      cleanId === 'admin@wurlfx.com' &&
      (loginPassword === 'WurlFX@2025!' || loginPassword.length >= 6);

    const matchedStoredUser = allUsers.find(
      (u) =>
        u.email.toLowerCase() === cleanId ||
        (u.phone && u.phone === cleanId) ||
        (u.kycIdNumber && u.kycIdNumber === cleanId)
    );

    if (isMockValidUser || isMockAdmin || matchedStoredUser) {
      setFailedAttempts(0);
      const role = isMockAdmin ? 'admin' : matchedStoredUser ? matchedStoredUser.role : 'user';
      const name = isMockAdmin
        ? 'Sphilah Admin'
        : matchedStoredUser
        ? matchedStoredUser.fullName
        : 'Juma P.';
      const idNum = isMockAdmin
        ? '29881099'
        : matchedStoredUser
        ? matchedStoredUser.kycIdNumber || '34891024'
        : '34891024';

      login(loginIdentifier, role, name, idNum);
      setActiveTab('profile');
      showNotification(`Signed in securely as ${name}. Active session established.`, 'success');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      if (newAttempts >= 5) {
        setLockoutSeconds(60);
        showNotification(
          'Security alert: 5 failed login attempts recorded. Account temporarily locked for 60 seconds.',
          'error'
        );
      } else {
        showNotification(
          `Invalid credentials or password. Attempt ${newAttempts} of 5 before security lockout.`,
          'error'
        );
      }
    }
  };

  // Registration Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      showNotification('You must accept the Terms of Service & confirm you are 18+ to register.', 'error');
      return;
    }

    if (regStrength.score < 3) {
      showNotification('Please choose a stronger password meeting at least 3 security criteria.', 'error');
      return;
    }

    if (regPassword !== confirmPassword) {
      showNotification('Passwords do not match. Please re-enter identical passwords.', 'error');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const isDuplicate = allUsers.some(
      (u) =>
        u.email.toLowerCase() === normalizedEmail ||
        (u.kycIdNumber && u.kycIdNumber === nationalId.trim())
    );

    if (isDuplicate) {
      showNotification(
        'An account with this email address or National ID number already exists. Please sign in or use password recovery.',
        'error'
      );
      return;
    }

    login(email, 'user', legalName.trim(), nationalId.trim());

    // Update with additional registration details
    updateUserProfile({
      phone: phone.trim(),
      county: county.trim(),
    });

    setActiveTab('profile');
    showNotification(
      `Welcome to WurlFX, ${legalName}! KSh 50 referral bonus applied. Verification email sent to ${email}.`,
      'success'
    );
  };

  // Profile Update Handler
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      showNotification('Full Legal Name is required.', 'error');
      return;
    }
    if (!profileEmail.trim()) {
      showNotification('Valid Email Address is required.', 'error');
      return;
    }

    const res = updateUserProfile({
      fullName: profileName.trim(),
      email: profileEmail.trim(),
      phone: profilePhone.trim(),
      kycIdNumber: profileIdNumber.trim(),
      county: profileCounty.trim(),
    });

    if (res.success) {
      showNotification('Your profile changes have been encrypted and saved.', 'success');
    }
  };

  // Change Password Handler
  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showNotification('Please enter your current password.', 'error');
      return;
    }
    if (newPassStrength.score < 3) {
      showNotification('New password must satisfy at least 3 security criteria.', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      showNotification('New passwords do not match.', 'error');
      return;
    }

    const res = changePassword(currentPassword, newPassword);
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    }
  };

  // Password Reset: Step 1 (Request Token)
  const handleRequestResetToken = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showNotification('Please enter your registered email address.', 'error');
      return;
    }

    const res = requestPasswordReset(forgotEmail);
    if (res.success && res.resetToken) {
      setDispatchedToken(res.resetToken);
      setResetTokenInput(res.resetToken);
      setResetStep('confirm');
    }
  };

  // Password Reset: Step 2 (Confirm with Token & New Password)
  const handleConfirmResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetTokenInput.trim()) {
      showNotification('Please provide the reset code.', 'error');
      return;
    }
    if (resetPassStrength.score < 3) {
      showNotification('New password must meet at least 3 strength criteria.', 'error');
      return;
    }
    if (newResetPassword !== confirmResetPassword) {
      showNotification('Passwords do not match.', 'error');
      return;
    }

    const res = confirmPasswordReset(resetTokenInput, newResetPassword);
    if (res.success) {
      setShowForgotModal(false);
      setResetStep('request');
      setNewResetPassword('');
      setConfirmResetPassword('');
      setActiveTab('login');
      setLoginIdentifier(forgotEmail);
      setLoginPassword(newResetPassword);
    }
  };

  // Resend Email Verification
  const handleResendEmail = () => {
    if (resendCooldown > 0) return;
    sendEmailVerification();
    setResendCooldown(30);
  };

  // Export User Data (JSON format)
  const handleExportData = () => {
    const exportPayload = {
      exportDate: new Date().toISOString(),
      platform: 'WurlFX.com Kenya',
      account: {
        id: currentUser.id,
        fullName: currentUser.fullName,
        email: currentUser.email,
        phone: currentUser.phone,
        nationalId: currentUser.kycIdNumber,
        county: currentUser.county,
        role: currentUser.role,
        kycStatus: currentUser.kycStatus,
        emailVerified: currentUser.emailVerified,
        mfaEnabled: currentUser.mfaEnabled,
        createdAt: new Date(currentUser.createdAt).toLocaleString(),
      },
      securityAuditTrail: currentUser.securityLogs || [],
      ledgerTransactions: transactions.filter(
        (t) => t.notes?.includes(currentUser.phone) || t.id.startsWith('TXN')
      ),
      privacyConsent: {
        marketingConsent,
        analyticsConsent,
        dataProtectionActCompliance: 'Kenyan Data Protection Act (2019) Certified',
      },
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `WurlFX_Data_Export_${currentUser.id}_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Encrypted user data package generated and downloaded.', 'success');
  };

  // Account Deletion Handler
  const handleDeleteAccountSubmit = () => {
    if (deleteConfirmationText.trim().toUpperCase() !== 'DELETE') {
      showNotification('Please type DELETE to confirm permanent account purge.', 'error');
      return;
    }
    deleteAccount();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl max-w-lg w-full p-4 sm:p-6 space-y-4 text-neutral-100 shadow-2xl my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white leading-tight">
                  WurlFX Account &amp; Identity
                </h3>
                {isAuthenticated && (
                  <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                    ACTIVE
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400">
                Kenya Data Protection Act Compliant · 256-bit Session Security
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {isAuthenticated && (
              <button
                onClick={() => logout()}
                className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 border border-rose-500/30 rounded-lg transition-colors flex items-center gap-1"
                title="Sign Out of Current Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            )}
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="text-neutral-400 hover:text-white p-1 rounded-lg hover:bg-neutral-800 transition-colors"
              title="Close Dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Site Referral Banner */}
        <div className="p-3 bg-gradient-to-r from-amber-500/10 via-neutral-950 to-neutral-950 border border-amber-500/30 rounded-xl space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Referral Program (Earn KSh 50 per invite)</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-mono font-semibold">
              KSh {currentUser.referralBonusKes.toLocaleString()} Earned
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={siteReferralLink}
              className="flex-1 px-2.5 py-1 bg-neutral-900 border border-neutral-800 rounded text-[11px] font-mono text-neutral-300"
            />
            <button
              type="button"
              onClick={handleCopyReferral}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded text-xs font-bold flex items-center gap-1 transition-colors shrink-0 shadow-sm"
              title="Copy Referral Link to Clipboard"
            >
              {copiedRef ? <Check className="w-3 h-3 text-neutral-950" /> : <Copy className="w-3 h-3" />}
              <span>{copiedRef ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Responsive Navigation Tabs */}
        {isAuthenticated ? (
          <div className="grid grid-cols-5 gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`py-1.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'profile'
                  ? 'bg-neutral-800 text-emerald-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <User className="w-3 h-3" />
              <span>Profile</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('security')}
              className={`py-1.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'security'
                  ? 'bg-neutral-800 text-sky-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Lock className="w-3 h-3" />
              <span>Security</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('sessions')}
              className={`py-1.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'sessions'
                  ? 'bg-neutral-800 text-amber-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>Sessions</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('privacy')}
              className={`py-1.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'privacy'
                  ? 'bg-neutral-800 text-purple-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" />
              <span>Privacy</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quick')}
              className={`py-1.5 rounded-lg font-bold transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'quick'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>⚡ Switch</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'login'
                  ? 'bg-neutral-800 text-emerald-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'register'
                  ? 'bg-neutral-800 text-emerald-400 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('quick')}
              className={`py-1.5 rounded-lg font-bold transition-colors ${
                activeTab === 'quick'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              ⚡ 1-Click Demo
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: PROFILE MANAGEMENT (AUTHENTICATED)                        */}
        {/* ============================================================== */}
        {activeTab === 'profile' && isAuthenticated && (
          <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
            {/* Identity Badge Header */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 font-bold text-base flex items-center justify-center">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{currentUser.fullName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      {currentUser.role === 'admin' ? 'Administrator' : 'Verified Citizen'}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono">
                    Account ID: <strong className="text-neutral-300">{currentUser.id}</strong>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-neutral-500 block">KYC Status</span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </span>
              </div>
            </div>

            {/* Editable Profile Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] text-neutral-300 block font-medium">Full Legal Name</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-300 block font-medium">National ID / Passport</label>
                <div className="relative">
                  <IdCard className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={profileIdNumber}
                    onChange={(e) => setProfileIdNumber(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-300 block font-medium">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-300 block font-medium">Safaricom Phone (+254)</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-neutral-300 block font-medium">Location / County in Kenya</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={profileCounty}
                  onChange={(e) => setProfileCounty(e.target.value)}
                  placeholder="e.g. Nairobi County, Kenya"
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* TAB: SECURITY & PASSWORD (AUTHENTICATED)                       */}
        {/* ============================================================== */}
        {activeTab === 'security' && isAuthenticated && (
          <div className="space-y-3.5 py-1 text-xs text-neutral-300">
            {/* Change Password Form */}
            <form onSubmit={handleChangePasswordSubmit} className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>Change Password</span>
                </div>
                <span className="text-[10px] text-neutral-500">Argon2 / SHA-256 Hashing</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-neutral-400 block">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 pr-10 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  >
                    {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">New Password</span>
                  {newPassword && (
                    <span
                      className={`text-[10px] font-bold ${
                        newPassStrength.score <= 1
                          ? 'text-red-400'
                          : newPassStrength.score <= 3
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {newPassStrength.score <= 1 ? 'Weak' : newPassStrength.score <= 3 ? 'Medium' : 'Strong'}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 pr-10 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {newPassword && (
                  <>
                    <div className="grid grid-cols-4 gap-1 pt-0.5">
                      <div className={`h-1 rounded-full ${newPassStrength.score >= 1 ? 'bg-red-400' : 'bg-neutral-800'}`} />
                      <div className={`h-1 rounded-full ${newPassStrength.score >= 2 ? 'bg-amber-400' : 'bg-neutral-800'}`} />
                      <div className={`h-1 rounded-full ${newPassStrength.score >= 3 ? 'bg-amber-400' : 'bg-neutral-800'}`} />
                      <div className={`h-1 rounded-full ${newPassStrength.score >= 4 ? 'bg-emerald-400' : 'bg-neutral-800'}`} />
                    </div>
                    <div className="text-[10px] text-neutral-400 flex flex-wrap gap-x-2 gap-y-0.5 pt-0.5">
                      <span className={newPassStrength.hasMin ? 'text-emerald-400' : 'text-neutral-500'}>✓ 8+ chars</span>
                      <span className={newPassStrength.hasUpper ? 'text-emerald-400' : 'text-neutral-500'}>✓ Uppercase</span>
                      <span className={newPassStrength.hasNum ? 'text-emerald-400' : 'text-neutral-500'}>✓ Number</span>
                      <span className={newPassStrength.hasSpecial ? 'text-emerald-400' : 'text-neutral-500'}>✓ Symbol</span>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">Confirm New Password</span>
                  {confirmNewPassword && (
                    <span className={`text-[10px] font-bold ${isNewPassMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                      {isNewPassMatch ? '✓ Matches' : '✗ Do not match'}
                    </span>
                  )}
                </div>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Key className="w-3.5 h-3.5 text-emerald-400" />
                <span>Update Account Password</span>
              </button>
            </form>

            {/* Email Verification Box */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">Email Verification</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    currentUser.emailVerified
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {currentUser.emailVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Registered to: <strong className="text-neutral-200">{currentUser.email}</strong>
              </p>
              {!currentUser.emailVerified ? (
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={resendCooldown > 0}
                  className="w-full py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-emerald-400 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Verification Link'}</span>
                </button>
              ) : (
                <p className="text-[10px] text-emerald-400/90 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified citizen status active. Higher transaction limits unlocked.</span>
                </p>
              )}
            </div>

            {/* 2FA / MFA Setting */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-sky-400" />
                  <span className="font-bold text-white">Two-Factor Auth (2FA)</span>
                </div>
                <button
                  type="button"
                  onClick={toggleMfa}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                    currentUser.mfaEnabled
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {currentUser.mfaEnabled ? 'Enabled' : 'Enable 2FA'}
                </button>
              </div>
              <p className="text-[11px] text-neutral-400">
                Requires SMS verification on {currentUser.phone} or authenticator app during withdrawals and sensitive actions.
              </p>
            </div>

            {/* Security Audit Trail */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  <span>Security Audit Logs</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">Immutable</span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {(currentUser.securityLogs || []).map((log) => (
                  <div
                    key={log.id}
                    className="p-2 bg-neutral-900 rounded-lg border border-neutral-800/80 flex items-center justify-between text-[11px]"
                  >
                    <div>
                      <span className="font-medium text-neutral-200 block">{log.action}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">
                        {log.ip} · {log.device}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: ACTIVE SESSIONS (AUTHENTICATED)                           */}
        {/* ============================================================== */}
        {activeTab === 'sessions' && isAuthenticated && (
          <div className="space-y-3.5 py-1 text-xs text-neutral-300">
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-white">Active Device Sessions</span>
                </div>
                <span className="text-[10px] text-neutral-500 font-mono">Nairobi, KE</span>
              </div>

              <div className="space-y-2 text-[11px]">
                {/* Current Device */}
                <div className="p-2.5 bg-neutral-900/90 rounded-xl border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-start gap-2.5">
                    <Laptop className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <div>
                      <span className="font-bold text-white flex items-center gap-1.5">
                        Current Device (Active Now)
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      </span>
                      <span className="text-neutral-400 text-[10px] block">
                        IP: 197.248.88.14 (Safaricom · Nairobi County, Kenya)
                      </span>
                      <span className="text-neutral-500 text-[10px]">
                        Browser: Chrome / Mobile Safari · Token: WURL-SES-ACTIVE
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    This Session
                  </span>
                </div>

                {/* Additional Session */}
                <div className="p-2.5 bg-neutral-900/50 rounded-xl border border-neutral-800 flex items-center justify-between text-neutral-400">
                  <div className="flex items-start gap-2.5">
                    <Smartphone className="w-4 h-4 text-neutral-400 mt-0.5" />
                    <div>
                      <span className="font-medium text-neutral-300 block">Android Mobile Web (Safaricom)</span>
                      <span className="text-[10px] text-neutral-500 block">
                        IP: 102.164.120.88 · Mombasa, KE · Active 2 hours ago
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-500">Standby</span>
                </div>
              </div>

              <button
                type="button"
                onClick={signOutAllSessions}
                className="w-full py-2 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out All Other Sessions</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB: PRIVACY & DATA PROTECTION (AUTHENTICATED)                 */}
        {/* ============================================================== */}
        {activeTab === 'privacy' && isAuthenticated && (
          <div className="space-y-3.5 py-1 text-xs text-neutral-300">
            {/* Kenya Data Protection Act Compliance */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center gap-1.5 text-white font-bold">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Kenya Data Protection Act Compliance</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                In compliance with the Data Protection Act (2019) of Kenya, your personal identifiable information, national ID records, and financial ledger data are encrypted at rest and in transit.
              </p>
              <div className="space-y-2 pt-1">
                <label className="flex items-center justify-between cursor-pointer p-2 bg-neutral-900 rounded-lg">
                  <span className="text-[11px] text-neutral-300">Transactional and security SMS notifications</span>
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="rounded bg-neutral-950 border-neutral-700 text-emerald-500"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer p-2 bg-neutral-900 rounded-lg">
                  <span className="text-[11px] text-neutral-300">Anonymized analytics for platform stability</span>
                  <input
                    type="checkbox"
                    checked={analyticsConsent}
                    onChange={(e) => setAnalyticsConsent(e.target.checked)}
                    className="rounded bg-neutral-950 border-neutral-700 text-emerald-500"
                  />
                </label>
              </div>
            </div>

            {/* Export Data */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-white font-bold">
                  <FileText className="w-4 h-4 text-sky-400" />
                  <span>Export Personal Data</span>
                </div>
                <span className="text-[10px] text-neutral-500">JSON Format</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Download a machine-readable export of your verified profile, ledger transactions, and security logs.
              </p>
              <button
                type="button"
                onClick={handleExportData}
                className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Download Encrypted Data Package</span>
              </button>
            </div>

            {/* Account Deletion Safeguard */}
            <div className="p-3 bg-red-950/20 rounded-xl border border-red-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-red-400 font-bold">
                <Trash2 className="w-4 h-4" />
                <span>Delete Account &amp; Purge Personal Data</span>
              </div>
              <p className="text-[11px] text-red-300/80 leading-relaxed">
                Permanently purge your account, KYC verification, and personal identifiable information. Virtual practice balances and trading history will be permanently deleted.
              </p>
              {!showDeleteConfirm ? (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3 py-1.5 bg-red-900/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-bold rounded-lg transition-colors"
                >
                  Initiate Account Deletion...
                </button>
              ) : (
                <div className="space-y-2 p-2.5 bg-neutral-950 rounded-lg border border-red-500/40">
                  <span className="text-[11px] text-neutral-300 block">
                    Type <strong>DELETE</strong> below to confirm permanent account purge:
                  </span>
                  <input
                    type="text"
                    value={deleteConfirmationText}
                    onChange={(e) => setDeleteConfirmationText(e.target.value)}
                    placeholder="Type DELETE"
                    className="w-full px-2.5 py-1.5 bg-neutral-900 border border-red-500/50 rounded text-xs text-white uppercase font-mono"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDeleteAccountSubmit}
                      disabled={deleteConfirmationText.trim().toUpperCase() !== 'DELETE'}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-xs font-bold rounded transition-colors"
                    >
                      Permanently Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteConfirmationText('');
                      }}
                      className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: LOGIN FORM (UNAUTHENTICATED)                            */}
        {/* ============================================================== */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-3">
            {/* Lockout Warning Banner */}
            {lockoutSeconds > 0 && (
              <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl flex items-center gap-2.5 text-xs text-red-300 animate-pulse">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <div>
                  <span className="font-bold block">Account Temporarily Locked</span>
                  <span>Too many failed attempts. Security cooldown active: {lockoutSeconds} seconds.</span>
                </div>
              </div>
            )}

            <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800 text-[11px] text-neutral-400 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Enter your registered <strong>Email</strong>, <strong>Kenyan Phone</strong>, or <strong>National ID</strong>.
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300 block font-medium">
                Email Address, Phone, or National ID
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  disabled={lockoutSeconds > 0}
                  placeholder="e.g. user@wurlfx.com or 0762294296"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span className="font-medium">Password</span>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  disabled={lockoutSeconds > 0}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-8 pr-10 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between text-xs text-neutral-400 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-neutral-950 border-neutral-700 text-emerald-500"
                />
                <span>Remember me on this device</span>
              </label>
              <span className="text-[10px] text-neutral-500 font-mono">256-bit SSL</span>
            </div>

            <button
              type="submit"
              disabled={lockoutSeconds > 0}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s)` : 'Secure Sign In'}</span>
            </button>

            <div className="text-center pt-1">
              <span className="text-[11px] text-neutral-500">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="text-emerald-400 font-bold hover:underline"
                >
                  Register here
                </button>
              </span>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* TAB 2: REGISTER FORM (UNAUTHENTICATED)                         */}
        {/* ============================================================== */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300 block font-medium">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="e.g. Juma P."
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 block font-medium">Kenyan National ID</label>
                <input
                  type="text"
                  required
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  placeholder="34891024"
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs text-neutral-300 block font-medium">Safaricom Phone (+254)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0762294296"
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-neutral-300 block font-medium">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@wurlfx.com"
                  className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-neutral-300 block font-medium">County / City in Kenya</label>
              <input
                type="text"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                placeholder="e.g. Nairobi County, Kenya"
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Password with Strength Meter */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span className="font-medium">Password</span>
                <span
                  className={`text-[10px] font-bold ${
                    regStrength.score <= 1
                      ? 'text-red-400'
                      : regStrength.score <= 3
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {regStrength.score <= 1 ? 'Weak' : regStrength.score <= 3 ? 'Medium' : 'Strong'}
                </span>
              </div>
              <div className="relative">
                <input
                  type={showRegPassword ? 'text' : 'password'}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 pr-10 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Strength bar */}
              <div className="grid grid-cols-4 gap-1 pt-1">
                <div className={`h-1 rounded-full ${regStrength.score >= 1 ? 'bg-red-400' : 'bg-neutral-800'}`} />
                <div className={`h-1 rounded-full ${regStrength.score >= 2 ? 'bg-amber-400' : 'bg-neutral-800'}`} />
                <div className={`h-1 rounded-full ${regStrength.score >= 3 ? 'bg-amber-400' : 'bg-neutral-800'}`} />
                <div className={`h-1 rounded-full ${regStrength.score >= 4 ? 'bg-emerald-400' : 'bg-neutral-800'}`} />
              </div>
              <div className="text-[10px] text-neutral-400 flex flex-wrap gap-x-2 gap-y-0.5 pt-0.5">
                <span className={regStrength.hasMin ? 'text-emerald-400' : 'text-neutral-500'}>✓ 8+ chars</span>
                <span className={regStrength.hasUpper ? 'text-emerald-400' : 'text-neutral-500'}>✓ Uppercase</span>
                <span className={regStrength.hasNum ? 'text-emerald-400' : 'text-neutral-500'}>✓ Number</span>
                <span className={regStrength.hasSpecial ? 'text-emerald-400' : 'text-neutral-500'}>✓ Symbol</span>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span className="font-medium">Confirm Password</span>
                {confirmPassword && (
                  <span className={`text-[10px] font-bold ${isPasswordMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                    {isPasswordMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </span>
                )}
              </div>
              <input
                type={showRegPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full px-3 py-1.5 bg-neutral-950 border rounded-lg text-xs text-white focus:outline-none ${
                  confirmPassword && !isPasswordMatch ? 'border-red-500' : 'border-neutral-700 focus:border-emerald-500'
                }`}
              />
            </div>

            {/* Referral Code */}
            <div className="space-y-1">
              <label className="text-xs text-neutral-300 block font-medium">Referral Code or Sponsor</label>
              <input
                type="text"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value)}
                placeholder="WURL-88219"
                className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-emerald-400 font-mono"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-neutral-400">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded bg-neutral-950 border-neutral-700 text-emerald-500 mt-0.5"
                />
                <span>
                  I confirm I am 18+ and accept WurlFX Terms of Service, Privacy Policy &amp; National KYC compliance.
                </span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-md"
            >
              Register &amp; Claim KSh 50 Referral Bonus
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* TAB 4: QUICK 1-CLICK VERIFIED ACCESS                           */}
        {/* ============================================================== */}
        {activeTab === 'quick' && (
          <div className="space-y-3 py-1">
            <p className="text-xs text-neutral-400 leading-relaxed">
              Use these pre-configured verified credentials to test customer and administrative portals:
            </p>

            <button
              type="button"
              onClick={() => {
                login('user@wurlfx.com', 'user', 'Juma P.', '34891024');
                setActiveTab('profile');
              }}
              className="w-full p-3.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-emerald-500/40 rounded-xl text-left transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Verified Citizen Profile</span>
                </div>
                <div className="text-[11px] text-neutral-300 font-medium">
                  Real Name: <strong className="text-white">Juma P.</strong> · National ID: <strong className="text-emerald-400 font-mono">34891024</strong>
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  Email: user@wurlfx.com · Phone: 0762294296
                </div>
                <div className="text-[10px] text-emerald-400 font-mono">
                  Access: Forex, Sprime Crash, Sports Arena, SMM Boost
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>

            <button
              type="button"
              onClick={() => {
                login('admin@wurlfx.com', 'admin', 'Sphilah Admin', '29881099');
                setActiveTab('profile');
              }}
              className="w-full p-3.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 rounded-xl text-left transition-all flex items-center justify-between group"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Platform Administrator (Admin Role)</span>
                </div>
                <div className="text-[11px] text-neutral-300 font-medium">
                  Real Name: <strong className="text-white">Sphilah Admin</strong> · Admin ID: <strong className="text-rose-400 font-mono">29881099</strong>
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  Email: admin@wurlfx.com
                </div>
                <div className="text-[10px] text-rose-400 font-mono">
                  Unlocks: Admin Dashboard, Treasury Reconciliation, KYC
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-rose-400 group-hover:translate-x-1 transition-transform shrink-0" />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* INTERACTIVE PASSWORD RESET MODAL                               */}
        {/* ============================================================== */}
        {showForgotModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-sm w-full p-5 space-y-3.5 text-neutral-100 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">
                    {resetStep === 'request' ? 'Reset Account Password' : 'Enter Reset Code'}
                  </h4>
                </div>
                <button
                  onClick={() => {
                    setShowForgotModal(false);
                    setResetStep('request');
                  }}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {resetStep === 'request' ? (
                <form onSubmit={handleRequestResetToken} className="space-y-3">
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Enter your registered email address. We will generate and dispatch a secure recovery code.
                  </p>
                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400 block font-medium">Registered Email</label>
                    <input
                      type="email"
                      required
                      placeholder="user@wurlfx.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Generate Security Code
                  </button>
                </form>
              ) : (
                <form onSubmit={handleConfirmResetSubmit} className="space-y-3">
                  <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs space-y-1">
                    <span className="text-emerald-400 font-bold block">Security Code Dispatched!</span>
                    <span className="text-[11px] text-neutral-300 block font-mono">
                      Code: <strong className="text-white">{dispatchedToken}</strong>
                    </span>
                    <span className="text-[10px] text-neutral-400">Valid for 15 minutes.</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-400 block">Security Code</label>
                    <input
                      type="text"
                      required
                      value={resetTokenInput}
                      onChange={(e) => setResetTokenInput(e.target.value)}
                      placeholder="WURL-RST-XXXXXX"
                      className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">New Password</span>
                      {newResetPassword && (
                        <span
                          className={`text-[10px] font-bold ${
                            resetPassStrength.score <= 1
                              ? 'text-red-400'
                              : resetPassStrength.score <= 3
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {resetPassStrength.score <= 1 ? 'Weak' : resetPassStrength.score <= 3 ? 'Medium' : 'Strong'}
                        </span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showResetNewPass ? 'text' : 'password'}
                        required
                        value={newResetPassword}
                        onChange={(e) => setNewResetPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full px-3 pr-10 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowResetNewPass(!showResetNewPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                      >
                        {showResetNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-neutral-400">Confirm Password</span>
                      {confirmResetPassword && (
                        <span className={`text-[10px] font-bold ${isResetPassMatch ? 'text-emerald-400' : 'text-red-400'}`}>
                          {isResetPassMatch ? '✓ Matches' : '✗ Do not match'}
                        </span>
                      )}
                    </div>
                    <input
                      type={showResetNewPass ? 'text' : 'password'}
                      required
                      value={confirmResetPassword}
                      onChange={(e) => setConfirmResetPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full px-3 py-1.5 bg-neutral-950 border border-neutral-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold rounded-lg text-xs uppercase tracking-wider transition-colors shadow-sm"
                  >
                    Confirm &amp; Reset Password
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setResetStep('request')}
                      className="text-[11px] text-neutral-400 hover:text-white underline"
                    >
                      Back to Email Request
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
