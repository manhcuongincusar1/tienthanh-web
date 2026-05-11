import CryptoJS from 'crypto-js';
import defaultSettings from '../../config/defaultSettings';

export const encryptPassword = (password: string) => {
  return CryptoJS.AES.encrypt(password, defaultSettings?.secretKey).toString();
};
