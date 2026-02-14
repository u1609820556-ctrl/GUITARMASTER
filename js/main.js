import { AudioEngine } from './audio-engine.js';
import { App } from './app.js';

// Expose to global scope for inline onclick="" handlers in HTML templates
window.App = App;
window.AudioEngine = AudioEngine;

document.addEventListener('DOMContentLoaded', () => {
    AudioEngine.init();
    App.init();

    // Resume AudioContext on first user interaction (required by browsers)
    const resumeAudioContext = async () => {
        if (AudioEngine.audioContext && AudioEngine.audioContext.state === 'suspended') {
            try {
                await AudioEngine.audioContext.resume();
            } catch (error) {
                console.error('Failed to resume AudioContext:', error);
            }
        }
        // Remove listeners after first interaction
        document.removeEventListener('click', resumeAudioContext);
        document.removeEventListener('touchstart', resumeAudioContext);
        document.removeEventListener('keydown', resumeAudioContext);
    };

    // Add listeners for first user interaction
    document.addEventListener('click', resumeAudioContext);
    document.addEventListener('touchstart', resumeAudioContext);
    document.addEventListener('keydown', resumeAudioContext);
});
