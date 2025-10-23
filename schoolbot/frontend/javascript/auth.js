// Authentication Logic
class AuthManager {
    constructor() {
        this.isLoginMode = true;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Auth toggle button
        const authToggleBtn = document.getElementById('authToggleBtn');
        if (authToggleBtn) {
            authToggleBtn.addEventListener('click', () => this.toggleAuthMode());
        }

        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }

        // Google sign-in
        const googleSignInBtn = document.getElementById('googleSignIn');
        if (googleSignInBtn) {
            googleSignInBtn.addEventListener('click', () => this.handleGoogleSignIn());
        }

        // Test user creation
        const createTestUserBtn = document.getElementById('createTestUserBtn');
        if (createTestUserBtn) {
            createTestUserBtn.addEventListener('click', () => this.createTestUser());
        }

        // Test dashboard bypass
        const testDashboardBtn = document.getElementById('testDashboardBtn');
        if (testDashboardBtn) {
            testDashboardBtn.addEventListener('click', () => this.testDashboard());
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    }

    toggleAuthMode() {
        this.isLoginMode = !this.isLoginMode;
        
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const authTitle = document.getElementById('authTitle');
        const authButton = document.getElementById('authButton');
        const authToggleText = document.getElementById('authToggleText');
        const authToggleBtn = document.getElementById('authToggleBtn');
        
        if (this.isLoginMode) {
            // Switch to login mode
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
            authTitle.textContent = 'Welcome Young Learner! 🌟';
            authButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            authToggleText.textContent = "Don't have an account?";
            authToggleBtn.textContent = 'Sign Up';
        } else {
            // Switch to register mode
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
            authTitle.textContent = 'Join MindMate Family! 🚀';
            authButton.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
            authToggleText.textContent = 'Already have an account?';
            authToggleBtn.textContent = 'Sign In';
        }
    }

    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        console.log('Attempting login for:', email);
        showLoading('Signing in...');

        try {
            if (!auth || !auth.signInWithEmailAndPassword) {
                throw new Error('Authentication not available');
            }
            
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            console.log('Login successful for:', userCredential.user.email);
            
            // Update user info
            currentUser = userCredential.user;
            
            // Update welcome message
            const welcomeUser = document.getElementById('welcomeUser');
            if (welcomeUser) {
                welcomeUser.textContent = `Welcome, ${currentUser.displayName || currentUser.email}!`;
            }
            
            // Show dashboard
            showPage('dashboardPage');
            showMessage('Login successful! Welcome back!', 'success');
            
        } catch (error) {
            console.error('Login error:', error);
            showMessage(formatFirebaseError(error), 'error');
        } finally {
            hideLoading();
        }
    }

    async handleRegister(event) {
        event.preventDefault();

        const name = document.getElementById('regName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const studentClass = document.getElementById('studentClass').value;
        const board = document.getElementById('studentBoard').value;
        const goal = document.getElementById('studentGoal').value;

        if (!name || !email || !password || !studentClass || !board || !goal) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Password validation
        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long.', 'error');
            return;
        }

        showLoading('Creating account...');

        try {
            if (!auth || !auth.createUserWithEmailAndPassword) {
                throw new Error('Authentication not available');
            }

            // Create user account
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Update user profile
            if (user.updateProfile) {
                await user.updateProfile({
                    displayName: name
                });
            }

            // Save additional user data to Firestore
            if (firestore) {
                await firestore.collection('users').doc(user.uid).set({
                    name: name,
                    email: email,
                    class: studentClass,
                    board: board,
                    goal: goal,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }

            // Update current user
            currentUser = user;
            
            // Update welcome message
            const welcomeUser = document.getElementById('welcomeUser');
            if (welcomeUser) {
                welcomeUser.textContent = `Welcome, ${name}!`;
            }
            
            // Show dashboard
            showPage('dashboardPage');
            showMessage('Account created successfully! Welcome to MindMate!', 'success');
            console.log('User registered:', user.email);
        } catch (error) {
            console.error('Registration error:', error);
            showMessage(formatFirebaseError(error), 'error');
        } finally {
            hideLoading();
        }
    }

    async handleGoogleSignIn() {
        if (!auth || !auth.signInWithPopup || !googleProvider) {
            showMessage('Google sign-in not available.', 'error');
            return;
        }

        showLoading('Connecting with Google...');

        try {
            const result = await auth.signInWithPopup(googleProvider);
            const user = result.user;
            
            // Check if this is a new user
            if (result.additionalUserInfo && result.additionalUserInfo.isNewUser) {
                // Save basic user data for new Google users
                if (firestore) {
                    await firestore.collection('users').doc(user.uid).set({
                        name: user.displayName || 'Google User',
                        email: user.email,
                        class: '', // User will need to update this
                        board: '',
                        goal: '',
                        provider: 'google',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            } else {
                // Update last login for existing users
                if (firestore) {
                    await firestore.collection('users').doc(user.uid).update({
                        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }

            // Update current user
            currentUser = user;
            
            // Update welcome message
            const welcomeUser = document.getElementById('welcomeUser');
            if (welcomeUser) {
                welcomeUser.textContent = `Welcome, ${user.displayName || user.email}!`;
            }
            
            // Show dashboard
            showPage('dashboardPage');
            showMessage('Google sign-in successful! Welcome back!', 'success');
            console.log('Google sign-in successful:', user.email);
        } catch (error) {
            console.error('Google sign-in error:', error);
            if (error.code !== 'auth/popup-closed-by-user') {
                showMessage(formatFirebaseError(error), 'error');
            }
        } finally {
            hideLoading();
        }
    }

    async handleLogout() {
        console.log('Logout requested');
        showLoading('Signing out...');
        
        try {
            if (auth && auth.signOut) {
                await auth.signOut();
                console.log('Logout successful');
            }
            
            // Clear current user
            currentUser = null;
            
            // Show login page
            showPage('loginPage');
            showMessage('Logged out successfully. Come back soon!', 'success');
            
            // Clear any stored data
            localStorage.removeItem('userEngagements');
            
        } catch (error) {
            console.error('Logout error:', error);
            showMessage('Error during logout. Please try again.', 'error');
        } finally {
            hideLoading();
        }
    }

    testDashboard() {
        console.log('Test dashboard accessed');
        showPage('dashboardPage');
        showMessage('Test mode activated! Welcome to MindMate!', 'success');
        
        // Update welcome message for test mode
        const welcomeUser = document.getElementById('welcomeUser');
        if (welcomeUser) {
            welcomeUser.textContent = 'Welcome, Test User!';
        }
    }

    async updateUserProfile(updates) {
        if (!currentUser) {
            throw new Error('No user logged in');
        }

        try {
            if (firestore) {
                await firestore.collection('users').doc(currentUser.uid).update({
                    ...updates,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    }

    // Test function to create a test user (for debugging)
    async createTestUser() {
        try {
            const testEmail = 'test@mindmate.com';
            const testPassword = 'test123456';
            
            console.log('Creating test user...');
            
            if (!auth || !auth.createUserWithEmailAndPassword) {
                throw new Error('Authentication not available');
            }
            
            const userCredential = await auth.createUserWithEmailAndPassword(testEmail, testPassword);
            
            // Save test user data
            if (firestore) {
                await firestore.collection('users').doc(userCredential.user.uid).set({
                    name: 'Test User',
                    email: testEmail,
                    class: '10',
                    board: 'CBSE',
                    goal: 'School',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            }
            
            console.log('Test user created successfully:', testEmail);
            showMessage('Test user created! Email: test@mindmate.com, Password: test123456', 'success');
        } catch (error) {
            console.error('Error creating test user:', error);
            if (error.code === 'auth/email-already-in-use') {
                showMessage('Test user already exists! Use test@mindmate.com with password: test123456', 'info');
            } else {
                showMessage('Error creating test user: ' + error.message, 'error');
            }
        }
    }
}

// Initialize Auth Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authManager = new AuthManager();
});