const voiceSettings = {
  'en-US': {
    voiceName: 'en-US-JennyNeural',
    language: 'en-US'
  },
  'vi-VN': {
    voiceName: 'vi-VN-HoaiMyNeural',
    language: 'vi-VN'
  }
};

export const getVoiceSettings = (languageCode) => {
  return voiceSettings[languageCode] || voiceSettings['en-US'];
};

export const supportedLanguages = [
  { code: 'en-US', label: 'English' },
  { code: 'vi-VN', label: 'Tiếng Việt' }
];
