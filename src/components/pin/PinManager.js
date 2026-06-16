import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import pinService from '../../services/pinService';
import toast from 'react-hot-toast';
import {
  KeyIcon,
  ShieldCheckIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  ClipboardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import Modal from '../common/Modal';
import LoadingSpinner from '../common/LoadingSpinner';

const PinManager = () => {
  const { user } = useAuth();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyPin, setVerifyPin] = useState('');
  const [pinHistory, setPinHistory] = useState([]);
  const [pinStatus, setPinStatus] = useState({
    exists: false,
    expiresAt: null,
    lastUsed: null,
    attempts: 0
  });

  useEffect(() => {
    if (user) {
      fetchPinData();
    }
  }, [user]);

  const fetchPinData = async () => {
    setLoading(true);
    try {
      const data = await pinService.getPin(user.uid);
      if (data) {
        setPin(data.pin);
        setPinStatus({
          exists: true,
          expiresAt: data.expiresAt,
          lastUsed: data.lastUsed,
          attempts: data.attempts || 0
        });
        setPinHistory(data.history || []);
      }
    } catch (error) {
      console.error('Error fetching PIN data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePin = async () => {
    setGenerating(true);
    try {
      const result = await pinService.generatePin(user.uid, user.email);
      setPin(result.pin);
      setPinStatus({
        exists: true,
        expiresAt: result.expiresAt,
        lastUsed: null,
        attempts: 0
      });
      toast.success('PIN berhasil dibuat!');
      fetchPinData();
    } catch (error) {
      console.error('Error generating PIN:', error);
      toast.error('Gagal membuat PIN');
    } finally {
      setGenerating(false);
    }
  };

  const handleVerifyPin = async () => {
    if (!verifyPin) {
      toast.error('Masukkan PIN untuk verifikasi');
      return;
    }

    const validation = pinService.validatePin(verifyPin);
    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }

    setVerifying(true);
    try {
      const result = await pinService.verifyPin(user.uid, verifyPin);
      if (result.valid) {
        toast.success('PIN berhasil diverifikasi!');
        setShowVerifyModal(false);
        setVerifyPin('');
        fetchPinData();
      } else {
        toast.error('PIN tidak valid');
        setPinStatus(prev => ({
          ...prev,
          attempts: (prev.attempts || 0) + 1
        }));
      }
    } catch (error) {
      console.error('Error verifying PIN:', error);
      toast.error('Gagal verifikasi PIN');
    } finally {
      setVerifying(false);
    }
  };

  const handleResetPin = async () => {
    if (!window.confirm('Yakin ingin mereset PIN? PIN baru akan dibuat.')) return;
    
    try {
      await pinService.resetPin(user.uid);
      setPin('');
      setPinStatus({
        exists: false,
        expiresAt: null,
        lastUsed: null,
        attempts: 0
      });
      toast.success('PIN berhasil direset');
      fetchPinData();
    } catch (error) {
      console.error('Error resetting PIN:', error);
      toast.error('Gagal reset PIN');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('PIN disalin ke clipboard');
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPinStatusColor = () => {
    if (!pinStatus.exists) return 'text-gray-400';
    if (pinStatus.attempts >= 5) return 'text-red-400';
    if (pinStatus.attempts >= 3) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getPinStatusText = () => {
    if (!pinStatus.exists) return 'Belum dibuat';
    if (pinStatus.attempts >= 5) return 'Terkunci - Hubungi admin';
    if (pinStatus.attempts >= 3) return 'Peringatan - Coba lagi dengan hati-hati';
    return 'Aktif';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <KeyIcon className="w-6 h-6 text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Environment PIN</h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPinStatusColor()} bg-opacity-20 border ${
              pinStatus.exists ? 'border-green-500/20' : 'border-gray-500/20'
            }`}>
              {getPinStatusText()}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* PIN Display */}
        <div className="bg-gray-700/30 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-gray-400 text-sm">PIN Anda</p>
              <div className="flex items-center space-x-3">
                <div className="text-2xl font-mono font-bold text-white tracking-widest">
                  {pin ? (
                    showPin ? (
                      pinService.formatPin(pin)
                    ) : (
                      '●'.repeat(pin.length || 6)
                    )
                  ) : (
                    <span className="text-gray-400">Belum dibuat</span>
                  )}
                </div>
                {pin && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setShowPin(!showPin)}
                      className="p-1 hover:bg-gray-600 rounded-lg transition text-gray-400 hover:text-white"
                    >
                      {showPin ? (
                        <EyeSlashIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(pin)}
                      className="p-1 hover:bg-gray-600 rounded-lg transition text-gray-400 hover:text-white"
                    >
                      <ClipboardIcon className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span className="text-xs text-gray-400">
                {pinStatus.expiresAt ? `Berlaku hingga: ${formatDate(pinStatus.expiresAt)}` : 'Belum aktif'}
              </span>
              {pinStatus.lastUsed && (
                <span className="text-xs text-gray-400">
                  Terakhir digunakan: {formatDate(pinStatus.lastUsed)}
                </span>
              )}
              {pinStatus.attempts > 0 && (
                <span className={`text-xs ${pinStatus.attempts >= 3 ? 'text-red-400' : 'text-yellow-400'}`}>
                  Percobaan gagal: {pinStatus.attempts}/5
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          {!pin ? (
            <button
              onClick={handleGeneratePin}
              disabled={generating}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition flex items-center space-x-2"
            >
              {generating ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <ArrowPathIcon className="w-5 h-5" />
                  <span>Buat PIN</span>
                </>
              )}
            </button>
          ) : (
            <>
              <button
                onClick={() => setShowVerifyModal(true)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center space-x-2"
              >
                <ShieldCheckIcon className="w-5 h-5" />
                <span>Verifikasi PIN</span>
              </button>
              <button
                onClick={handleResetPin}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition flex items-center space-x-2"
              >
                <ArrowPathIcon className="w-5 h-5" />
                <span>Reset PIN</span>
              </button>
            </>
          )}
        </div>

        {/* PIN History */}
        {pinHistory.length > 0 && (
          <div className="mt-6 border-t border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-400 mb-3">Riwayat PIN</h4>
            <div className="space-y-2">
              {pinHistory.slice(0, 5).map((entry, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    {entry.status === 'created' ? (
                      <CheckCircleIcon className="w-4 h-4 text-green-400" />
                    ) : entry.status === 'verified' ? (
                      <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
                    ) : (
                      <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-gray-300">
                      {entry.status === 'created' ? 'PIN dibuat' :
                       entry.status === 'verified' ? 'PIN diverifikasi' :
                       'Percobaan gagal'}
                    </span>
                  </div>
                  <span className="text-gray-400 text-xs">
                    {formatDate(entry.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <ShieldCheckIcon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-400 text-sm font-medium">Informasi PIN</p>
              <ul className="text-xs text-blue-400/70 mt-1 space-y-1 list-disc list-inside">
                <li>PIN digunakan untuk menghubungkan perangkat baru ke akun</li>
                <li>PIN bersifat permanen untuk setiap akun</li>
                <li>PIN berlaku selama {process.env.REACT_APP_PIN_EXPIRY_DAYS || 365} hari</li>
                <li>Jika lupa PIN, silakan reset dan buat PIN baru</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Verify PIN Modal */}
      <Modal
        isOpen={showVerifyModal}
        onClose={() => {
          setShowVerifyModal(false);
          setVerifyPin('');
        }}
        title="Verifikasi PIN"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-white text-sm font-medium mb-2">
              Masukkan PIN Anda
            </label>
            <input
              type="text"
              value={verifyPin}
              onChange={(e) => setVerifyPin(e.target.value.replace(/\D/g, ''))}
              placeholder="Masukkan PIN 6 digit"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center text-2xl font-mono tracking-widest"
              maxLength={6}
              inputMode="numeric"
              autoFocus
            />
            <p className="text-gray-400 text-xs mt-2">PIN terdiri dari 6 digit angka</p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleVerifyPin}
              disabled={verifying || !verifyPin}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {verifying ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <ShieldCheckIcon className="w-5 h-5" />
                  <span>Verifikasi</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowVerifyModal(false);
                setVerifyPin('');
              }}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-lg transition"
            >
              Batal
            </button>
          </div>

          {pinStatus.attempts >= 3 && (
            <div className="p-3 bg-yellow-600/10 border border-yellow-500/20 rounded-lg">
              <p className="text-yellow-400 text-sm flex items-center space-x-2">
                <ExclamationTriangleIcon className="w-4 h-4" />
                <span>Peringatan: {5 - pinStatus.attempts} percobaan tersisa sebelum PIN terkunci</span>
              </p>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PinManager;
