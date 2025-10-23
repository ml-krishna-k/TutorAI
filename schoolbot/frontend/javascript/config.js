// Firebase Configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
    apiKey: "AIzaSyCHGK4nRd-AwtU_Xk81rXq0QJwJvWaR-6E",
    authDomain: "mindmate-68b2e.firebaseapp.com",
    projectId: "mindmate-68b2e",
    storageBucket: "mindmate-68b2e.appspot.com",
    messagingSenderId: "123456789012", // Add your actual messaging sender ID
    appId: "1:123456789012:web:abcdef1234567890" // Add your actual app ID
};

// Global variables
let auth, firestore, googleProvider;
let currentUser = null;
let isLoginMode = true;
let firebaseInitialized = false;

// Check if Firebase is available and initialize
function initializeFirebase() {
    try {
        // Wait for Firebase to load
        if (typeof firebase === 'undefined') {
            console.warn('Firebase is not loaded! Creating fallback functions.');
            createFirebaseFallback();
            return false;
        }

        // Check if Firebase is already initialized
        if (firebase.apps && firebase.apps.length > 0) {
            console.log('Firebase already initialized');
            firebaseInitialized = true;
            return true;
        }

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        
        // Initialize Firebase services
        auth = firebase.auth();
        firestore = firebase.firestore();
        
        // Google Auth Provider
        googleProvider = new firebase.auth.GoogleAuthProvider();
        googleProvider.setCustomParameters({
            prompt: 'select_account'
        });
        
        firebaseInitialized = true;
        console.log('Firebase initialized successfully');
        return true;
    } catch (error) {
        console.error('Firebase initialization error:', error);
        createFirebaseFallback();
        return false;
    }
}

// Create fallback functions for testing without Firebase
function createFirebaseFallback() {
    console.log('Creating Firebase fallback for testing');
    
    // Mock Firebase Auth
    auth = {
        onAuthStateChanged: (callback) => {
            // Simulate no user initially
            callback(null);
        },
        signInWithEmailAndPassword: async (email, password) => {
            // For testing, allow any email/password
            if (email === 'test@mindmate.com' && password === 'test123456') {
                return {
                    user: {
                        uid: 'test-user-id',
                        email: email,
                        displayName: 'Test User'
                    }
                };
            }
            throw new Error('Invalid credentials');
        },
        createUserWithEmailAndPassword: async (email, password) => {
            return {
                user: {
                    uid: 'new-user-id',
                    email: email,
                    displayName: 'New User'
                }
            };
        },
        signInWithPopup: async (provider) => {
            return {
                user: {
                    uid: 'google-user-id',
                    email: 'google@test.com',
                    displayName: 'Google User'
                },
                additionalUserInfo: {
                    isNewUser: true
                }
            };
        },
        signOut: async () => {
            console.log('Mock signout');
            return Promise.resolve();
        }
    };

    // Mock Firestore
    firestore = {
        collection: (name) => ({
            doc: (id) => ({
                get: () => Promise.resolve({ data: () => null }),
                set: () => Promise.resolve(),
                update: () => Promise.resolve()
            }),
            add: () => Promise.resolve({ id: 'mock-id' })
        })
    };

    // Mock Google Provider
    googleProvider = {
        setCustomParameters: () => {}
    };
}

// Utility Functions
function showLoading(message = 'Loading...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        const spinner = overlay.querySelector('.loading-spinner p');
        if (spinner) {
            spinner.textContent = message;
        }
        overlay.style.display = 'flex';
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showMessage(message, type = 'info') {
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // Hide existing messages
    const existingError = document.getElementById('errorMessage');
    const existingSuccess = document.getElementById('successMessage');
    
    if (existingError) existingError.style.display = 'none';
    if (existingSuccess) existingSuccess.style.display = 'none';
    
    // Show new message
    const messageElement = type === 'error' ? existingError : existingSuccess;
    if (messageElement) {
        messageElement.textContent = message;
        messageElement.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 5000);
    }
}

function updateDateTime() {
    const now = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    const dateTimeString = now.toLocaleDateString('en-US', options);
    
    const dateTimeElement = document.getElementById('currentDateTime');
    if (dateTimeElement) {
        dateTimeElement.textContent = dateTimeString;
    }
}

function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show the target page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function formatFirebaseError(error) {
    if (!error || !error.code) {
        return 'An unexpected error occurred. Please try again.';
    }
    
    switch (error.code) {
        case 'auth/user-not-found':
            return 'No account found with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters long.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/popup-closed-by-user':
            return 'Sign-in was cancelled.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        default:
            return error.message || 'An error occurred. Please try again.';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    
    // Wait a bit for Firebase to load, then initialize
    setTimeout(() => {
        initializeFirebase();
        
        updateDateTime();
        setInterval(updateDateTime, 60000); // Update every minute
        
        // Test Firebase connection
        console.log('Testing Firebase connection...');
        console.log('Auth object:', auth);
        console.log('Firestore object:', firestore);
        console.log('Firebase initialized:', firebaseInitialized);
        
        // For testing purposes, if Firebase is not available, show dashboard directly
        if (!firebaseInitialized) {
            console.log('Firebase not available, showing dashboard for testing');
            showPage('dashboardPage');
            return;
        }
        
        // Check if user is already signed in
        if (auth && auth.onAuthStateChanged) {
            auth.onAuthStateChanged((user) => {
                if (user) {
                    console.log('User already signed in:', user.email);
                    currentUser = user;
                    showPage('dashboardPage');
                    
                    // Update welcome message
                    const welcomeUser = document.getElementById('welcomeUser');
                    if (welcomeUser) {
                        welcomeUser.textContent = `Welcome, ${user.displayName || user.email}!`;
                    }
                } else {
                    console.log('No user signed in, showing login page');
                    currentUser = null;
                    showPage('loginPage');
                }
            });
        } else {
            console.log('Auth not available, showing login page');
            showPage('loginPage');
        }
        
        // Test CSS loading
        console.log('Testing CSS loading...');
        const styles = document.styleSheets;
        console.log('Loaded stylesheets:', styles.length);
        for (let i = 0; i < styles.length; i++) {
            try {
                console.log(`Stylesheet ${i}:`, styles[i].href);
            } catch (e) {
                console.log(`Stylesheet ${i}: [Protected]`);
            }
        }
    }, 1000);
});

// Add global error handler
window.addEventListener('error', function(e) {
    console.error('Global JavaScript error:', e.error);
    console.error('Error details:', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
    });
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Export global functions and variables for other scripts
window.MindMate = {
    auth,
    firestore,
    googleProvider,
    currentUser,
    firebaseInitialized,
    showLoading,
    hideLoading,
    showMessage,
    showPage,
    updateDateTime,
    formatFirebaseError
};