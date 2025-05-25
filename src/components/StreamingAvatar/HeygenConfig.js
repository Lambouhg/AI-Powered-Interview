// Avatar options based on HeyGen's available avatars
export const AVATARS = [
  { avatar_id: "f93ba3fdb7d647aba9d1bc0387323279", name: "LinhLinh" },
];

// Language options for speech-to-text
export const LANGUAGES = [
  { label: "English", value: "en", key: "en" },
  { label: "Vietnamese", value: "vi", key: "vi" },
];

// Session states
export const SessionState = {
  INACTIVE: 'inactive',
  CONNECTING: 'connecting',
  CONNECTED: 'connected'
};

// Message sender types
export const MessageSender = {
  USER: 'USER',
  AVATAR: 'AVATAR'
};

// Voice configurations for different languages
export const voiceConfig = {
  en: {
    voiceId: '', // English voice - Rachel (Default ElevenLabs voice)
    model: 'eleven_multilingual_v2'
  },
  vi: {
    voiceId: '9a247a37f3c04e6aa934171998b9659c', // Vietnamese voice
    model: 'eleven_multilingual_v2'
  }
};
