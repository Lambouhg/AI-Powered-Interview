import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

if (!process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY || !process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION) {
  throw new Error("Azure Speech credentials are not configured");
}

// Log configuration (remove in production)
console.log('Speech Config:', {
  region: process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION,
  keyLength: process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY?.length
});

// Create speech config
const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
  process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION
);

// Set security options
speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_InitialSilenceTimeoutMs, "5000");
speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_EndSilenceTimeoutMs, "1000");
speechConfig.setProperty(sdk.PropertyId.SpeechServiceConnection_EnableAudioLogging, "true");

export const startSpeechRecognition = (onResult, onError, language = 'en-US') => {
  try {
    // Create a new speech config for each recognition session
    const sessionConfig = sdk.SpeechConfig.fromSubscription(
      process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
      process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION
    );

    // Set the language for this session
    sessionConfig.speechRecognitionLanguage = language;

    // Create audio config with specific options
    const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
    
    // Create speech recognizer with specific options
    const recognizer = new sdk.SpeechRecognizer(sessionConfig, audioConfig);

    // Set up event handlers
    recognizer.recognized = (_, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        onResult(e.result.text);
      }
    };

    recognizer.canceled = (_, e) => {
      console.log('Speech recognition canceled:', {
        reason: e.reason,
        errorCode: e.errorCode,
        errorDetails: e.errorDetails
      });
      
      if (e.reason === sdk.CancellationReason.Error) {
        onError(e.errorDetails || 'Speech recognition failed');
      }
    };

    // Set up connection event handler
    recognizer.connected = () => {
      console.log('Speech recognition connected successfully');
    };

    recognizer.disconnected = (_, e) => {
      console.log('Speech recognition disconnected:', e);
    };

    // Start continuous recognition
    recognizer.startContinuousRecognitionAsync(
      () => {
        console.log("Speech recognition started successfully");
      },
      (error) => {
        console.error("Error starting speech recognition:", error);
        onError(error);
      }
    );

    return recognizer;
  } catch (error) {
    console.error("Error in startSpeechRecognition:", error);
    onError(error);
    return null;
  }
};

export const stopSpeechRecognition = (recognizer) => {
  if (!recognizer) {
    console.warn('No recognizer to stop');
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    try {
      // First try to stop the recognition
      recognizer.stopContinuousRecognitionAsync(
        () => {
          console.log("Speech recognition stopped successfully");
          try {
            recognizer.close();
            resolve();
          } catch (closeError) {
            console.error("Error closing recognizer:", closeError);
            resolve(); // Still resolve as the main operation (stopping) was successful
          }
        },
        (error) => {
          console.error("Error stopping speech recognition:", {
            error,
            errorMessage: error?.message,
            errorCode: error?.code
          });
          try {
            recognizer.close();
          } catch (closeError) {
            console.error("Error closing recognizer after stop error:", closeError);
          }
          reject(error);
        }
      );
    } catch (error) {
      console.error("Error in stopSpeechRecognition:", error);
      try {
        recognizer.close();
      } catch (closeError) {
        console.error("Error closing recognizer after exception:", closeError);
      }
      reject(error);
    }
  });
};

// Function to convert speech to text for a single utterance
export const speechToText = async (language = 'en-US') => {
  return new Promise((resolve, reject) => {
    try {
      const sessionConfig = sdk.SpeechConfig.fromSubscription(
        process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
        process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION
      );
      sessionConfig.speechRecognitionLanguage = language;

      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new sdk.SpeechRecognizer(sessionConfig, audioConfig);

      recognizer.recognizeOnceAsync(
        (result) => {
          if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            resolve(result.text);
          } else {
            reject(new Error("Speech recognition failed"));
          }
          recognizer.close();
        },
        (error) => {
          console.error("Error in speechToText:", error);
          reject(error);
          recognizer.close();
        }
      );
    } catch (error) {
      console.error("Error in speechToText:", error);
      reject(error);
    }
  });
};

// Function to convert text to speech
export const textToSpeech = async (text, language = 'vi-VN', voiceName = 'vi-VN-HoaiMyNeural') => {
  return new Promise((resolve, reject) => {
    try {
      // Create speech synthesizer
      const sessionConfig = sdk.SpeechConfig.fromSubscription(
        process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY,
        process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION
      );
      
      // Set speech synthesis output format and voice
      sessionConfig.speechSynthesisLanguage = language;
      sessionConfig.speechSynthesisVoiceName = voiceName;
      
      // Create audio output for default speakers
      const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput();
      
      // Create synthesizer with provided config
      const synthesizer = new sdk.SpeechSynthesizer(sessionConfig, audioConfig);
      
      // Set up event handlers
      synthesizer.synthesisStarted = () => {
        console.log('Speech synthesis started');
      };
      
      synthesizer.synthesisCompleted = () => {
        console.log('Speech synthesis completed');
        resolve();
      };
      
      synthesizer.SynthesisCanceled = (_, e) => {
        console.error('Speech synthesis canceled:', e);
        reject(new Error(`Speech synthesis canceled: ${e.errorDetails || 'Unknown error'}`));
      };
      
      // Start synthesis
      synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            console.log('Speech synthesis successful');
            synthesizer.close();
            resolve();
          } else {
            console.error('Speech synthesis failed:', result);
            synthesizer.close();
            reject(new Error(`Speech synthesis failed: ${result.errorDetails || 'Unknown error'}`));
          }
        },
        (error) => {
          console.error('Speech synthesis error:', error);
          synthesizer.close();
          reject(error);
        }
      );
    } catch (error) {
      console.error('Error in textToSpeech:', error);
      reject(error);
    }
  });
};