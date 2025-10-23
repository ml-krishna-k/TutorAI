// Main Application Logic
class MindMateApp {
    constructor() {
        this.initializeEventListeners();
        this.initializeVoiceRecognition();
    }

    initializeEventListeners() {
        // Dashboard card navigation
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.dashboard-card');
            if (card && card.dataset.page) {
                this.navigateToPage(card.dataset.page);
            }
        });

        // Back button navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('.back-btn') || e.target.closest('.back-btn')) {
                e.preventDefault();
                showPage('dashboardPage');
            }
        });
    }

    navigateToPage(pageId) {
        console.log('Navigating to page:', pageId);
        switch(pageId) {
            case 'neetJeePage':
                console.log('Loading NEET JEE corner...');
                this.loadNeetJeePage();
                break;
            case 'askDoubtPage':
                console.log('Loading doubt page...');
                this.loadDoubtPage();
                break;
            case 'studyPlanPage':
                console.log('Loading study plan page...');
                this.loadStudyPlanPage();
                break;
            case 'practiceQuizPage':
                console.log('Loading practice quiz page...');
                this.loadPracticeQuizPage();
                break;
            case 'progressPage':
                console.log('Loading progress page...');
                this.loadProgressPage();
                break;
            default:
                console.warn('Unknown page:', pageId);
        }
    }

    loadDoubtPage() {
        console.log('Redirecting to doubt.html');
        showMessage('Loading doubt page...', 'success');
        setTimeout(() => {
            try {
                window.location.href = 'doubt.html';
            } catch (error) {
                console.error('Error navigating to doubt page:', error);
                showMessage('Error loading doubt page. Please try again.', 'error');
            }
        }, 1000);
    }

    loadStudyPlanPage() {
        console.log('Redirecting to study-plan.html');
        showMessage('Loading study plan page...', 'success');
        setTimeout(() => {
            try {
                window.location.href = 'study-plan.html';
            } catch (error) {
                console.error('Error navigating to study plan page:', error);
                showMessage('Error loading study plan page. Please try again.', 'error');
            }
        }, 1000);
    }

    loadPracticeQuizPage() {
        console.log('Redirecting to practice-quiz.html');
        showMessage('Loading practice quiz page...', 'success');
        setTimeout(() => {
            try {
                window.location.href = 'practice-quiz.html';
            } catch (error) {
                console.error('Error navigating to practice quiz page:', error);
                showMessage('Error loading practice quiz page. Please try again.', 'error');
            }
        }, 1000);
    }

    loadProgressPage() {
        console.log('Redirecting to progress.html');
        showMessage('Loading progress page...', 'success');
        setTimeout(() => {
            try {
                window.location.href = 'progress.html';
            } catch (error) {
                console.error('Error navigating to progress page:', error);
                showMessage('Error loading progress page. Please try again.', 'error');
            }
        }, 1000);
    }

    loadNeetJeePage() {
        console.log('Redirecting to NEET JEE corner');
        showMessage('Loading NEET JEE corner...', 'success');
        setTimeout(() => {
            try {
                window.location.href = '../JEENEET/index.html';
            } catch (error) {
                console.error('Error navigating to NEET JEE corner:', error);
                showMessage('Error loading NEET JEE corner. Please try again.', 'error');
            }
        }, 1000);
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
            };

            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('Voice input:', transcript);
                
                // Find and populate the doubt input if on doubt page
                const doubtInput = document.getElementById('doubtInput');
                if (doubtInput) {
                    doubtInput.value = transcript;
                    doubtInput.focus();
                }
            };

            this.recognition.onerror = (event) => {
                console.error('Voice recognition error:', event.error);
                showMessage('Voice recognition error. Please try again.', 'error');
            };

            this.recognition.onend = () => {
                console.log('Voice recognition ended');
                const voiceBtn = document.getElementById('voiceBtn');
                if (voiceBtn) {
                    voiceBtn.classList.remove('recording');
                }
            };
        } else {
            console.warn('Speech recognition not supported in this browser');
        }
    }

    startVoiceRecognition() {
        if (this.recognition) {
            try {
                this.recognition.start();
                const voiceBtn = document.getElementById('voiceBtn');
                if (voiceBtn) {
                    voiceBtn.classList.add('recording');
                }
            } catch (error) {
                console.error('Error starting voice recognition:', error);
                showMessage('Could not start voice recognition.', 'error');
            }
        } else {
            showMessage('Voice recognition not supported in your browser.', 'error');
        }
    }

    // Utility method to save user activity
    async saveUserActivity(activity) {
        if (!currentUser) return;

        try {
            await firestore.collection('userActivities').add({
                userId: currentUser.uid,
                activity: activity,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Error saving user activity:', error);
        }
    }

    // Method to track user engagement
    trackEngagement(action, details = {}) {
        const engagement = {
            action: action,
            details: details,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Save to local storage for offline capability
        const engagements = JSON.parse(localStorage.getItem('userEngagements') || '[]');
        engagements.push(engagement);
        localStorage.setItem('userEngagements', JSON.stringify(engagements));

        // Also save to Firebase if user is logged in
        this.saveUserActivity({
            type: 'engagement',
            data: engagement
        });
    }

    // Initialize the app
    initialize() {
        console.log('MindMate App initialized');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.mindMateApp = new MindMateApp();
    window.mindMateApp.initialize();

    // Class selection logic
    const classButtons = {
        'class1Btn': '../class 1/index.html',
        'class2Btn': '../class 1/index.html',
        'class3Btn': '../class 1/index.html',
        'class4Btn': '../class 1/index.html',
        'class5Btn': '../class5/index.html',
        'class6Btn': '../class5/index.html',
        'class7Btn': '../class5/index.html',
        'class8Btn': '../class5/index.html',
        'class9Btn': '../class5/index.html',
        'class10Btn': '../class10/index.html',
        'class11Btn': '../class10/index.html',
        'class12Btn': '../class10/index.html'
    };

    // Add event listeners for all class buttons
    Object.keys(classButtons).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {
                window.location.href = classButtons[buttonId];
            });
        }
    });
});