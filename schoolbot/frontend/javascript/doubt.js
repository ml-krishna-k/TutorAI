// Doubt Page Logic
class DoubtManager {
    constructor() {
        this.currentImageFile = null;
        this.isProcessing = false;
        this.initialize();
    }

    initialize() {
        this.setupEventListeners();
        this.initializeVoiceRecognition();
        this.checkAuthStatus();
        
        // Start emotion detection for doubt system
        setTimeout(() => {
            if (window.emotionDetection) {
                window.emotionDetection.startEmotionDetection(10); // Use class 10 questions for general doubt system
            }
        }, 2000);
    }

    setupEventListeners() {
        // Text doubt submission
        const askTextBtn = document.getElementById('askTextBtn');
        if (askTextBtn) {
            askTextBtn.addEventListener('click', () => this.handleTextDoubt());
        }

        // Voice input
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.addEventListener('click', () => this.startVoiceRecognition());
        }

        // Image upload
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageUpload(e));
        }

        // Image doubt submission
        const askImageBtn = document.getElementById('askImageBtn');
        if (askImageBtn) {
            askImageBtn.addEventListener('click', () => this.handleImageDoubt());
        }

        // Rephrase button
        const rephraseBtn = document.getElementById('rephraseBtn');
        if (rephraseBtn) {
            rephraseBtn.addEventListener('click', () => this.rephraseExplanation());
        }

        // Enter key submission for textarea
        const doubtInput = document.getElementById('doubtInput');
        if (doubtInput) {
            doubtInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleTextDoubt();
                }
            });
        }
    }

    checkAuthStatus() {
        // Check if user is authenticated
        if (auth && auth.onAuthStateChanged) {
            auth.onAuthStateChanged((user) => {
                if (!user) {
                    // Redirect to login if not authenticated
                    window.location.href = 'index.html';
                } else {
                    currentUser = user;
                }
            });
        } else {
            console.warn('Auth not available, continuing without authentication check');
        }
    }

    async handleTextDoubt() {
        if (this.isProcessing) return;

        const doubtInput = document.getElementById('doubtInput');
        const question = doubtInput.value.trim();

        if (!question) {
            showMessage('Please enter your question first!', 'error');
            doubtInput.focus();
            return;
        }

        this.isProcessing = true;
        this.disableInputs();
        showLoading('Processing your question...');

        try {
            // Use Gemini API to get response
            const response = await this.askGeminiText(question);
            this.displayResponse(response);
            
            // Save doubt to user history
            await this.saveDoubtHistory({
                type: 'text',
                question: question,
                response: response,
                timestamp: new Date()
            });

            // Track engagement
            if (window.mindMateApp) {
                window.mindMateApp.trackEngagement('doubt_asked', {
                    type: 'text',
                    questionLength: question.length
                });
            }
        } catch (error) {
            console.error('Error processing text doubt:', error);
            this.displayError('Sorry, I encountered an error processing your question. Please try again.');
        } finally {
            this.isProcessing = false;
            this.enableInputs();
            hideLoading();
        }
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        
        if (!file) {
            showMessage('Please select a valid image file.', 'error');
            return;
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showMessage('Please select a valid image file.', 'error');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showMessage('Image size should be less than 5MB.', 'error');
            return;
        }

        this.currentImageFile = file;
        this.displayImagePreview(file);
        
        // Show the ask image button
        const askImageBtn = document.getElementById('askImageBtn');
        if (askImageBtn) {
            askImageBtn.style.display = 'inline-block';
        }
    }

    displayImagePreview(file) {
        const reader = new FileReader();
        const imagePreview = document.getElementById('imagePreview');
        
        reader.onload = function(e) {
            if (imagePreview) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }
        };
        
        reader.readAsDataURL(file);
    }

    async handleImageDoubt() {
        if (this.isProcessing || !this.currentImageFile) return;

        this.isProcessing = true;
        this.disableInputs();
        showLoading('Analyzing your image...');

        try {
            // Use Gemini API to get response
            const response = await this.askGeminiImage(this.currentImageFile);
            this.displayResponse(response);
            
            // Save doubt to user history
            await this.saveDoubtHistory({
                type: 'image',
                question: 'Image-based question',
                response: response,
                timestamp: new Date()
            });

            // Track engagement
            if (window.mindMateApp) {
                window.mindMateApp.trackEngagement('doubt_asked', {
                    type: 'image',
                    fileSize: this.currentImageFile.size
                });
            }
        } catch (error) {
            console.error('Error processing image doubt:', error);
            this.displayError('Sorry, I encountered an error analyzing your image. Please try again.');
        } finally {
            this.isProcessing = false;
            this.enableInputs();
            hideLoading();
        }
    }

    async askGeminiText(question) {
        if (!window.geminiAPI) {
            throw new Error('Gemini API not available');
        }
        
        return await window.geminiAPI.generateTextResponse(question, {
            isEducational: true,
            questionType: this.detectQuestionType(question)
        });
    }

    async askGeminiImage(imageFile) {
        if (!window.geminiAPI) {
            throw new Error('Gemini API not available');
        }
        
        const prompt = "Please analyze this image and provide a detailed educational explanation. If it's a math problem, solve it step-by-step. If it's from any other subject, provide a clear and comprehensive explanation.";
        
        return await window.geminiAPI.generateImageResponse(imageFile, prompt, {
            isEducational: true
        });
    }

    detectQuestionType(question) {
        const mathKeywords = ['solve', 'calculate', 'equation', 'formula', 'math', 'mathematics', 'algebra', 'geometry', 'trigonometry', 'calculus'];
        const scienceKeywords = ['science', 'physics', 'chemistry', 'biology', 'experiment', 'molecule', 'atom', 'reaction'];
        const historyKeywords = ['history', 'historical', 'war', 'battle', 'king', 'queen', 'empire', 'ancient', 'medieval'];
        
        const lowerQuestion = question.toLowerCase();
        
        if (mathKeywords.some(keyword => lowerQuestion.includes(keyword))) {
            return 'math';
        } else if (scienceKeywords.some(keyword => lowerQuestion.includes(keyword))) {
            return 'science';
        } else if (historyKeywords.some(keyword => lowerQuestion.includes(keyword))) {
            return 'history';
        }
        
        return null;
    }

    displayResponse(response) {
        const responseDiv = document.getElementById('doubtResponse');
        const contentDiv = document.getElementById('responseContent');
        
        if (responseDiv && contentDiv) {
            responseDiv.style.display = 'block';
            
            // Typewriter effect for better UX
            contentDiv.innerHTML = '';
            let index = 0;
            const typeWriter = () => {
                if (index < response.length) {
                    contentDiv.innerHTML += response.charAt(index);
                    index++;
                    setTimeout(typeWriter, 10);
                }
            };
            typeWriter();
            
            // Scroll to response
            responseDiv.scrollIntoView({ behavior: 'smooth' });
        }
    }

    displayError(errorMessage) {
        const responseDiv = document.getElementById('doubtResponse');
        const contentDiv = document.getElementById('responseContent');
        
        if (responseDiv && contentDiv) {
            responseDiv.style.display = 'block';
            contentDiv.innerHTML = `
                <div class="error-response">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${errorMessage}</p>
                </div>
            `;
            
            // Add error styling
            responseDiv.classList.add('error');
        }
    }

    async rephraseExplanation() {
        const contentDiv = document.getElementById('responseContent');
        if (!contentDiv || !contentDiv.textContent) {
            showMessage('No response to rephrase.', 'error');
            return;
        }

        showLoading('Rephrasing explanation...');

        try {
            const originalResponse = contentDiv.textContent;
            const rephrasePrompt = `Please rephrase this explanation in a more engaging, story-like manner while keeping all the important information: ${originalResponse}`;
            
            const newResponse = await this.askGeminiText(rephrasePrompt);
            this.displayResponse(newResponse);
        } catch (error) {
            console.error('Error rephrasing explanation:', error);
            showMessage('Unable to rephrase explanation. Please try again.', 'error');
        } finally {
            hideLoading();
        }
    }

    async saveDoubtHistory(doubtData) {
        if (!currentUser || !firestore) return;

        try {
            await firestore.collection('userDoubts').add({
                userId: currentUser.uid,
                ...doubtData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error saving doubt history:', error);
            // Don't show error to user as this is background functionality
        }
    }

    initializeVoiceRecognition() {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';

            this.recognition.onstart = () => {
                console.log('Voice recognition started');
                const voiceBtn = document.getElementById('voiceBtn');
                if (voiceBtn) {
                    voiceBtn.classList.add('recording');
                }
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('Voice input:', transcript);
                
                // Find and populate the doubt input
                const doubtInput = document.getElementById('doubtInput');
                if (doubtInput) {
                    doubtInput.value = transcript;
                    doubtInput.focus();
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                showMessage('Voice recognition error. Please try again.', 'error');
                this.resetVoiceButton();
            };

            this.recognition.onend = () => {
                console.log('Voice recognition ended');
                this.resetVoiceButton();
            };
        } else {
            console.warn('Speech recognition not supported in this browser');
        }
    }

    startVoiceRecognition() {
        if (this.recognition) {
            try {
                this.recognition.start();
            } catch (error) {
                console.error('Error starting voice recognition:', error);
                showMessage('Could not start voice recognition.', 'error');
            }
        } else {
            showMessage('Voice recognition not supported in your browser.', 'error');
        }
    }

    resetVoiceButton() {
        const voiceBtn = document.getElementById('voiceBtn');
        if (voiceBtn) {
            voiceBtn.classList.remove('recording');
        }
    }

    disableInputs() {
        const inputs = document.querySelectorAll('#doubtInput, #askTextBtn, #askImageBtn, #voiceBtn');
        inputs.forEach(input => {
            input.disabled = true;
        });
    }

    enableInputs() {
        const inputs = document.querySelectorAll('#doubtInput, #askTextBtn, #askImageBtn, #voiceBtn');
        inputs.forEach(input => {
            input.disabled = false;
        });
    }

    async loadDoubtHistory(limit = 10) {
        if (!currentUser || !firestore) return [];

        try {
            const snapshot = await firestore
                .collection('userDoubts')
                .where('userId', '==', currentUser.uid)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error loading doubt history:', error);
            return [];
        }
    }

    async displayDoubtHistory() {
        const history = await this.loadDoubtHistory();
        // Implementation for displaying history
        console.log('Doubt history loaded:', history.length, 'items');
    }

    async exportDoubtHistory() {
        const history = await this.loadDoubtHistory(100);
        
        if (history.length === 0) {
            showMessage('No doubt history to export.', 'info');
            return;
        }

        const dataStr = JSON.stringify(history, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `doubt_history_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    cleanup() {
        this.currentImageFile = null;
        this.isProcessing = false;
        
        if (this.recognition) {
            this.recognition.abort();
        }
    }
}

// Initialize Doubt Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.doubtManager = new DoubtManager();
    console.log('Doubt Manager initialized');
});