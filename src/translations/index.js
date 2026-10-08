import ta from './ta.json';
import hi from './hi.json';
import ml from './ml.json';
import kn from './kn.json';

export const dictionaries = {
  ta,
  hi,
  ml,
  kn
};

export const supportedLanguages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'ml', label: 'Malayalam', native: 'മലയാളം' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
];

export default dictionaries;
