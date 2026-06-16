import api from '../api/axios';
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY;

class PinService {
  // Generate PIN untuk akun
  async generatePin(userId, email) {
    try {
      const response = await api.post('/pin/generate', {
        userId,
        email
      });
      return response.data;
    } catch (error) {
      console.error('Error generating PIN:', error);
      throw error;
    }
  }

  // Verifikasi PIN
  async verifyPin(userId, pin) {
    try {
      const response = await api.post('/pin/verify', {
        userId,
        pin
      });
      return response.data;
    } catch (error) {
      console.error('Error verifying PIN:', error);
      throw error;
    }
  }

  // Dapatkan PIN untuk akun
  async getPin(userId) {
    try {
      const response = await api.get(`/pin/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting PIN:', error);
      throw error;
    }
  }

  // Reset PIN
  async resetPin(userId) {
    try {
      const response = await api.post('/pin/reset', { userId });
      return response.data;
    } catch (error) {
      console.error('Error resetting PIN:', error);
      throw error;
    }
  }

  // Enkripsi PIN
  encryptPin(pin) {
    return CryptoJS.AES.encrypt(pin, ENCRYPTION_KEY).toString();
  }

  // Dekripsi PIN
  decryptPin(encryptedPin) {
    const bytes = CryptoJS.AES.decrypt(encryptedPin, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Generate PIN acak
  generateRandomPin(length = 6) {
    const chars = '0123456789';
    let pin = '';
    for (let i = 0; i < length; i++) {
      pin += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pin;
  }

  // Validasi PIN
  validatePin(pin) {
    const pinLength = parseInt(process.env.REACT_APP_PIN_LENGTH) || 6;
    if (!pin || pin.length !== pinLength) {
      return { valid: false, message: `PIN harus ${pinLength} digit` };
    }
    if (!/^\d+$/.test(pin)) {
      return { valid: false, message: 'PIN hanya boleh terdiri dari angka' };
    }
    return { valid: true, message: 'PIN valid' };
  }

  // Format PIN untuk display
  formatPin(pin) {
    if (!pin) return '';
    const parts = pin.match(/.{1,2}/g);
    return parts ? parts.join(' ') : pin;
  }
}

export default new PinService();
