// Study Plan Management
class StudyPlanManager {
    constructor() {
        this.subjects = [];
        this.goals = [];
        this.schedule = {};
        this.currentUser = null;
        this.initialize();
    }

    initialize() {
        this.checkAuthStatus();
        this.setupEventListeners();
        this.loadStudyPlan();
    }

    checkAuthStatus() {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = 'index.html';
            } else {
                this.currentUser = user;
                this.loadUserData();
            }
        });
    }

    setupEventListeners() {
        // Generate AI Plan
        const generatePlanBtn = document.getElementById('generatePlanBtn');
        if (generatePlanBtn) {
            generatePlanBtn.addEventListener('click', () => this.generateAIPlan());
        }

        // Add Subject
        const addSubjectBtn = document.getElementById('addSubjectBtn');
        if (addSubjectBtn) {
            addSubjectBtn.addEventListener('click', () => this.showAddSubjectForm());
        }

        // Save Subject
        const saveSubjectBtn = document.getElementById('saveSubjectBtn');
        if (saveSubjectBtn) {
            saveSubjectBtn.addEventListener('click', () => this.saveSubject());
        }

        // Cancel Subject
        const cancelSubjectBtn = document.getElementById('cancelSubjectBtn');
        if (cancelSubjectBtn) {
            cancelSubjectBtn.addEventListener('click', () => this.hideAddSubjectForm());
        }

        // Export Plan
        const exportPlanBtn = document.getElementById('exportPlanBtn');
        if (exportPlanBtn) {
            exportPlanBtn.addEventListener('click', () => this.exportPlan());
        }
    }

    async loadUserData() {
        try {
            const userDoc = await firestore.collection('users').doc(this.currentUser.uid).get();
            const userData = userDoc.data();
            
            if (userData) {
                this.loadStudyPlan();
                this.updateOverview();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    async loadStudyPlan() {
        try {
            // Load subjects
            const subjectsSnapshot = await firestore
                .collection('users')
                .doc(this.currentUser.uid)
                .collection('subjects')
                .get();

            this.subjects = subjectsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Load goals
            const goalsSnapshot = await firestore
                .collection('users')
                .doc(this.currentUser.uid)
                .collection('goals')
                .get();

            this.goals = goalsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            this.renderSubjects();
            this.renderGoals();
            this.generateSchedule();
            this.loadStudyTips();
        } catch (error) {
            console.error('Error loading study plan:', error);
        }
    }

    renderSubjects() {
        const subjectsGrid = document.getElementById('subjectsGrid');
        if (!subjectsGrid) return;

        if (this.subjects.length === 0) {
            subjectsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book-open"></i>
                    <h3>No subjects added yet</h3>
                    <p>Add your first subject to start creating your study plan!</p>
                    <button class="btn-primary" onclick="studyPlanManager.showAddSubjectForm()">
                        <i class="fas fa-plus"></i>
                        Add First Subject
                    </button>
                </div>
            `;
            return;
        }

        subjectsGrid.innerHTML = this.subjects.map(subject => `
            <div class="subject-card" data-subject-id="${subject.id}">
                <div class="subject-header">
                    <h3>${subject.name}</h3>
                    <div class="subject-actions">
                        <button class="btn-icon" onclick="studyPlanManager.editSubject('${subject.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="studyPlanManager.deleteSubject('${subject.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="subject-details">
                    <span class="difficulty-badge ${subject.difficulty}">${subject.difficulty}</span>
                    <span class="hours-badge">${subject.studyHours} hrs/week</span>
                </div>
                <div class="subject-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${subject.progress || 0}%"></div>
                    </div>
                    <span class="progress-text">${subject.progress || 0}% completed</span>
                </div>
            </div>
        `).join('');
    }

    renderGoals() {
        const goalsList = document.getElementById('goalsList');
        if (!goalsList) return;

        if (this.goals.length === 0) {
            goalsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-target"></i>
                    <h3>No goals set yet</h3>
                    <p>Set your first study goal to track your progress!</p>
                </div>
            `;
            return;
        }

        goalsList.innerHTML = this.goals.map(goal => `
            <div class="goal-item" data-goal-id="${goal.id}">
                <div class="goal-header">
                    <h4>${goal.title}</h4>
                    <span class="goal-deadline">${new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
                <p class="goal-description">${goal.description}</p>
                <div class="goal-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${goal.progress || 0}%"></div>
                    </div>
                    <span class="progress-text">${goal.progress || 0}% completed</span>
                </div>
            </div>
        `).join('');
    }

    generateSchedule() {
        const scheduleGrid = document.getElementById('scheduleGrid');
        if (!scheduleGrid) return;

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        
        scheduleGrid.innerHTML = days.map(day => `
            <div class="schedule-day">
                <h4>${day}</h4>
                <div class="day-schedule" id="schedule-${day.toLowerCase()}">
                    <!-- Schedule items will be populated based on subjects -->
                </div>
            </div>
        `).join('');

        this.populateSchedule();
    }

    populateSchedule() {
        // Simple schedule generation based on subjects
        this.subjects.forEach(subject => {
            const hoursPerDay = Math.ceil(subject.studyHours / 7);
            const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            
            days.forEach(day => {
                const daySchedule = document.getElementById(`schedule-${day}`);
                if (daySchedule) {
                    daySchedule.innerHTML += `
                        <div class="schedule-item ${subject.difficulty}">
                            <span class="subject-name">${subject.name}</span>
                            <span class="study-time">${hoursPerDay}h</span>
                        </div>
                    `;
                }
            });
        });
    }

    async generateAIPlan() {
        if (!this.currentUser) return;

        showLoading('Generating personalized study plan...');

        try {
            const userData = await firestore.collection('users').doc(this.currentUser.uid).get();
            const userInfo = userData.data();

            const prompt = `Create a personalized study plan for a ${userInfo.class}th grade student studying ${userInfo.board} board with goal: ${userInfo.goal}. 
            Include:
            1. Recommended subjects to focus on
            2. Weekly study schedule
            3. Study goals for the next month
            4. Tips for effective studying
            Format the response as JSON with sections: subjects, schedule, goals, tips`;

            const response = await window.geminiAPI.generateTextResponse(prompt);
            
            // Parse and apply the AI-generated plan
            this.applyAIPlan(response);
            
            showMessage('AI study plan generated successfully!', 'success');
        } catch (error) {
            console.error('Error generating AI plan:', error);
            showMessage('Failed to generate AI plan. Please try again.', 'error');
        } finally {
            hideLoading();
        }
    }

    applyAIPlan(aiResponse) {
        try {
            // This would parse the AI response and apply it to the study plan
            // For now, we'll just show a success message
            console.log('AI Plan Response:', aiResponse);
        } catch (error) {
            console.error('Error applying AI plan:', error);
        }
    }

    showAddSubjectForm() {
        const form = document.getElementById('addSubjectForm');
        if (form) {
            form.style.display = 'block';
        }
    }

    hideAddSubjectForm() {
        const form = document.getElementById('addSubjectForm');
        if (form) {
            form.style.display = 'none';
            // Reset form
            document.getElementById('subjectName').value = '';
            document.getElementById('subjectDifficulty').value = 'medium';
            document.getElementById('studyHours').value = '5';
        }
    }

    async saveSubject() {
        const name = document.getElementById('subjectName').value.trim();
        const difficulty = document.getElementById('subjectDifficulty').value;
        const studyHours = parseInt(document.getElementById('studyHours').value);

        if (!name) {
            showMessage('Please enter a subject name.', 'error');
            return;
        }

        try {
            const subjectData = {
                name: name,
                difficulty: difficulty,
                studyHours: studyHours,
                progress: 0,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await firestore
                .collection('users')
                .doc(this.currentUser.uid)
                .collection('subjects')
                .add(subjectData);

            this.hideAddSubjectForm();
            this.loadStudyPlan();
            showMessage('Subject added successfully!', 'success');
        } catch (error) {
            console.error('Error saving subject:', error);
            showMessage('Failed to add subject. Please try again.', 'error');
        }
    }

    async deleteSubject(subjectId) {
        if (confirm('Are you sure you want to delete this subject?')) {
            try {
                await firestore
                    .collection('users')
                    .doc(this.currentUser.uid)
                    .collection('subjects')
                    .doc(subjectId)
                    .delete();

                this.loadStudyPlan();
                showMessage('Subject deleted successfully!', 'success');
            } catch (error) {
                console.error('Error deleting subject:', error);
                showMessage('Failed to delete subject. Please try again.', 'error');
            }
        }
    }

    updateOverview() {
        const todayTasks = document.getElementById('todayTasks');
        const studyTime = document.getElementById('studyTime');
        const weeklyProgress = document.getElementById('weeklyProgress');

        if (todayTasks) {
            const completedTasks = this.goals.filter(goal => goal.completed).length;
            todayTasks.textContent = `${completedTasks} tasks completed`;
        }

        if (studyTime) {
            const totalHours = this.subjects.reduce((sum, subject) => sum + subject.studyHours, 0);
            studyTime.textContent = `${totalHours} hours this week`;
        }

        if (weeklyProgress) {
            const totalProgress = this.subjects.reduce((sum, subject) => sum + (subject.progress || 0), 0);
            const avgProgress = this.subjects.length > 0 ? Math.round(totalProgress / this.subjects.length) : 0;
            weeklyProgress.textContent = `${avgProgress}% completed`;
        }
    }

    loadStudyTips() {
        const tipsCarousel = document.getElementById('tipsCarousel');
        if (!tipsCarousel) return;

        const tips = [
            {
                icon: 'fas fa-clock',
                title: 'Pomodoro Technique',
                description: 'Study for 25 minutes, then take a 5-minute break.'
            },
            {
                icon: 'fas fa-brain',
                title: 'Active Recall',
                description: 'Test yourself instead of just re-reading material.'
            },
            {
                icon: 'fas fa-map',
                title: 'Mind Mapping',
                description: 'Create visual connections between concepts.'
            },
            {
                icon: 'fas fa-users',
                title: 'Study Groups',
                description: 'Learn with peers to gain different perspectives.'
            }
        ];

        tipsCarousel.innerHTML = tips.map(tip => `
            <div class="tip-card">
                <div class="tip-icon">
                    <i class="${tip.icon}"></i>
                </div>
                <h4>${tip.title}</h4>
                <p>${tip.description}</p>
            </div>
        `).join('');
    }

    exportPlan() {
        const planData = {
            subjects: this.subjects,
            goals: this.goals,
            schedule: this.schedule,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(planData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = 'study-plan.json';
        link.click();

        showMessage('Study plan exported successfully!', 'success');
    }
}

// Initialize Study Plan Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.studyPlanManager = new StudyPlanManager();
}); 