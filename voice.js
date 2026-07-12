// voice.js - AI Voice Assistant utilizing Web Speech API

class VoiceAssistant {
    constructor() {
        this.synth = window.speechSynthesis;
        this.recognition = null;
        this.isListening = false;
        
        // Setup Speech Recognition if supported
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = true;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = this.handleCommand.bind(this);
            this.recognition.onerror = (event) => console.error('Speech recognition error', event.error);
            this.recognition.onend = () => {
                // Auto-restart if we are supposed to be listening
                if (this.isListening) {
                    try { this.recognition.start(); } catch (e) {}
                }
            };
        } else {
            console.warn("Speech Recognition API not supported in this browser.");
        }
    }

    // Text-to-Speech
    speak(text) {
        if (!this.synth) return;
        
        // Cancel any ongoing speech
        this.synth.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.1; // Slightly higher pitch for friendly tone
        
        // Try to find a friendly English voice
        const voices = this.synth.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google')));
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        this.synth.speak(utterance);
    }

    // Speech-to-Text Toggle
    toggleListening(buttonElement, callbacks) {
        if (!this.recognition) {
            alert("Sorry, Voice Commands are not supported in your browser. Try Chrome or Edge!");
            return;
        }

        this.callbacks = callbacks; // { onAdd, onRemove, onNext }

        if (this.isListening) {
            this.isListening = false;
            this.recognition.stop();
            buttonElement.classList.remove('listening');
            this.speak("Voice commands disabled.");
        } else {
            this.isListening = true;
            try {
                this.recognition.start();
                buttonElement.classList.add('listening');
                this.speak("Voice commands enabled. Say 'Add', 'Remove', or 'Next'.");
            } catch (e) {
                console.error(e);
            }
        }
    }

    handleCommand(event) {
        const lastResultIndex = event.results.length - 1;
        const transcript = event.results[lastResultIndex][0].transcript.trim().toLowerCase();
        console.log("Heard:", transcript);

        if (!this.callbacks) return;

        if (transcript.includes('add') || transcript.includes('plus')) {
            this.callbacks.onAdd();
        } else if (transcript.includes('remove') || transcript.includes('minus') || transcript.includes('delete')) {
            this.callbacks.onRemove();
        } else if (transcript.includes('next') || transcript.includes('continue') || transcript.includes('level')) {
            this.callbacks.onNext();
        }
    }
}

const voiceAssistant = new VoiceAssistant();

// Ensure voices are loaded (some browsers load them async)
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        // Voices loaded
    };
}
