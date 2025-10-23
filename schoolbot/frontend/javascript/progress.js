// Progress Tracking Management
class ProgressManager {
    constructor() {
        this.currentUser = null;
        this.progressData = {
            quizResults: [],
            studyTime: 0,
            subjects: [],
            achievements: [],
            goals: []
        };
        this.initialize();
    }

    initialize() {
        this.checkAuthStatus();
        this.setupEventListeners();
    }

    checkAuthStatus() {
        auth.onAuthStateChanged((user) => {
            if (!user) {
                window.location.href = 'index.html';
            } else {
                this.currentUser = user;
                this.loadProgressData();
            }
        });
    }

    setupEventListeners() {
        // Chart period filters
        document.addEventListener('click', (e) => {
            if (e.target.matches('.filter-btn')) {
                document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                this.updateChart(e.target.dataset.period);
            }
        });

        // Export buttons
        const exportPDFBtn = document.getElementById('exportPDFBtn');
        if (exportPDFBtn) {
            exportPDFBtn.addEventListener('click', () => this.exportPDF());
        }

        const exportCSVBtn = document.getElementById('exportCSVBtn');
        if (exportCSVBtn) {
            exportCSVBtn.addEventListener('click', () => this.exportCSV());
        }

        const shareProgressBtn = document.getElementById('shareProgressBtn');
        if (shareProgressBtn) {
            shareProgressBtn.addEventListener('click', () => this.shareProgress());
        }
    }

    async loadProgressData() {
        try {
            showLoading('Loading your progress...');

            // Load quiz results
            const quizResultsSnapshot = await firestore
                .collection('users')
                .doc(this.currentUser.uid)
                .collection('quizResults')
                .orderBy('timestamp', 'desc')
                .limit(50)
                .get();

            this.progressData.quizResults = quizResultsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Load subjects
            const subjectsSnapshot = await firestore
                .collection('users')
                .doc(this.currentUser.uid)
                .collection('subjects')
                .get();

            this.progressData.subjects = subjectsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Load goals
            const goalsSnapshot = await firestore
                .collection('users')
                .doc(this.currentUser.uid)
                .collection('goals')
                .get();

            this.progressData.goals = goalsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Calculate achievements
            this.calculateAchievements();

            // Update UI
            this.updateOverview();
            this.renderSubjectProgress();
            this.renderRecentActivity();
            this.renderAchievements();
            this.updateAnalytics();
            this.generateRecommendations();

        } catch (error) {
            console.error('Error loading progress data:', error);
            showMessage('Failed to load progress data.', 'error');
        } finally {
            hideLoading();
        }
    }

    updateOverview() {
        // Calculate total score
        const totalScore = this.progressData.quizResults.reduce((sum, result) => sum + result.score, 0);
        const avgScore = this.progressData.quizResults.length > 0 ? 
            Math.round(totalScore / this.progressData.quizResults.length) : 0;

        // Calculate study streak (simplified)
        const studyStreak = this.calculateStudyStreak();

        // Calculate total study time
        const totalStudyTime = this.progressData.quizResults.reduce((sum, result) => sum + (result.timeTaken || 0), 0);
        const studyHours = Math.round(totalStudyTime / 3600000); // Convert ms to hours

        // Calculate average accuracy
        const totalCorrect = this.progressData.quizResults.reduce((sum, result) => sum + result.correctAnswers, 0);
        const totalQuestions = this.progressData.quizResults.reduce((sum, result) => sum + result.totalQuestions, 0);
        const avgAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        // Update overview cards
        const totalScoreElement = document.getElementById('totalScore');
        const studyStreakElement = document.getElementById('studyStreak');
        const totalStudyTimeElement = document.getElementById('totalStudyTime');
        const avgAccuracyElement = document.getElementById('avgAccuracy');

        if (totalScoreElement) totalScoreElement.textContent = `${avgScore} points`;
        if (studyStreakElement) studyStreakElement.textContent = `${studyStreak} days`;
        if (totalStudyTimeElement) totalStudyTimeElement.textContent = `${studyHours} hours`;
        if (avgAccuracyElement) avgAccuracyElement.textContent = `${avgAccuracy}%`;
    }

    calculateStudyStreak() {
        // Simple streak calculation based on quiz activity
        const today = new Date();
        const oneDay = 24 * 60 * 60 * 1000;
        let streak = 0;
        let currentDate = new Date(today);

        while (true) {
            const hasActivity = this.progressData.quizResults.some(result => {
                const resultDate = result.timestamp?.toDate() || new Date();
                return resultDate.toDateString() === currentDate.toDateString();
            });

            if (hasActivity) {
                streak++;
                currentDate = new Date(currentDate.getTime() - oneDay);
            } else {
                break;
            }
        }

        return streak;
    }

    renderSubjectProgress() {
        const subjectsGrid = document.getElementById('subjectsProgressGrid');
        if (!subjectsGrid) return;

        if (this.progressData.subjects.length === 0) {
            subjectsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-book"></i>
                    <h3>No subjects tracked yet</h3>
                    <p>Start studying to see your subject progress!</p>
                </div>
            `;
            return;
        }

        subjectsGrid.innerHTML = this.progressData.subjects.map(subject => {
            // Calculate subject-specific quiz results
            const subjectQuizzes = this.progressData.quizResults.filter(result => 
                result.subject?.toLowerCase() === subject.name.toLowerCase()
            );

            const avgScore = subjectQuizzes.length > 0 ? 
                Math.round(subjectQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / subjectQuizzes.length) : 0;

            return `
                <div class="subject-progress-card">
                    <div class="subject-header">
                        <h3>${subject.name}</h3>
                        <span class="difficulty-badge ${subject.difficulty}">${subject.difficulty}</span>
                    </div>
                    <div class="subject-stats">
                        <div class="stat-item">
                            <span class="stat-label">Average Score</span>
                            <span class="stat-value">${avgScore}%</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Quizzes Taken</span>
                            <span class="stat-value">${subjectQuizzes.length}</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Study Hours</span>
                            <span class="stat-value">${subject.studyHours || 0}h</span>
                        </div>
                    </div>
                    <div class="subject-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${subject.progress || 0}%"></div>
                        </div>
                        <span class="progress-text">${subject.progress || 0}% completed</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderRecentActivity() {
        const activityTimeline = document.getElementById('activityTimeline');
        if (!activityTimeline) return;

        const recentActivity = this.progressData.quizResults.slice(0, 10);

        if (recentActivity.length === 0) {
            activityTimeline.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-clock"></i>
                    <h3>No recent activity</h3>
                    <p>Take your first quiz to see activity here!</p>
                </div>
            `;
            return;
        }

        activityTimeline.innerHTML = recentActivity.map(result => {
            const date = result.timestamp?.toDate() || new Date();
            const timeAgo = this.getTimeAgo(date);

            return `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-quiz"></i>
                    </div>
                    <div class="activity-content">
                        <h4>${result.quizTitle}</h4>
                        <p>Scored ${result.score}% • ${result.correctAnswers}/${result.totalQuestions} correct</p>
                        <span class="activity-time">${timeAgo}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    getTimeAgo(date) {
        const now = new Date();
        const diffInMs = now - date;
        const diffInMinutes = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 0) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        if (diffInHours > 0) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        if (diffInMinutes > 0) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        return 'Just now';
    }

    calculateAchievements() {
        this.progressData.achievements = [];

        // Quiz achievements
        const totalQuizzes = this.progressData.quizResults.length;
        if (totalQuizzes >= 1) this.progressData.achievements.push({
            id: 'first-quiz',
            title: 'First Quiz',
            description: 'Completed your first quiz',
            icon: 'fas fa-star',
            unlocked: true
        });

        if (totalQuizzes >= 10) this.progressData.achievements.push({
            id: 'quiz-master',
            title: 'Quiz Master',
            description: 'Completed 10 quizzes',
            icon: 'fas fa-trophy',
            unlocked: true
        });

        // Score achievements
        const highScores = this.progressData.quizResults.filter(result => result.score >= 90);
        if (highScores.length >= 5) this.progressData.achievements.push({
            id: 'high-scorer',
            title: 'High Scorer',
            description: 'Scored 90%+ in 5 quizzes',
            icon: 'fas fa-medal',
            unlocked: true
        });

        // Streak achievements
        const streak = this.calculateStudyStreak();
        if (streak >= 7) this.progressData.achievements.push({
            id: 'week-warrior',
            title: 'Week Warrior',
            description: '7-day study streak',
            icon: 'fas fa-fire',
            unlocked: true
        });
    }

    renderAchievements() {
        const achievementsGrid = document.getElementById('achievementsGrid');
        if (!achievementsGrid) return;

        if (this.progressData.achievements.length === 0) {
            achievementsGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-trophy"></i>
                    <h3>No achievements yet</h3>
                    <p>Keep studying to unlock achievements!</p>
                </div>
            `;
            return;
        }

        achievementsGrid.innerHTML = this.progressData.achievements.map(achievement => `
            <div class="achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <div class="achievement-icon">
                    <i class="${achievement.icon}"></i>
                </div>
                <h4>${achievement.title}</h4>
                <p>${achievement.description}</p>
            </div>
        `).join('');
    }

    updateAnalytics() {
        // Best study time (simplified - just show a default)
        const bestStudyTimeElement = document.getElementById('bestStudyTime');
        if (bestStudyTimeElement) bestStudyTimeElement.textContent = '2:00 PM - 4:00 PM';

        // Most studied subject
        const subjectStats = {};
        this.progressData.quizResults.forEach(result => {
            const subject = result.subject;
            if (subject) {
                subjectStats[subject] = (subjectStats[subject] || 0) + 1;
            }
        });

        const mostStudiedSubject = Object.keys(subjectStats).length > 0 ? 
            Object.keys(subjectStats).reduce((a, b) => subjectStats[a] > subjectStats[b] ? a : b) : 'None';

        const mostStudiedSubjectElement = document.getElementById('mostStudiedSubject');
        if (mostStudiedSubjectElement) mostStudiedSubjectElement.textContent = mostStudiedSubject;

        // Longest session
        const longestSession = this.progressData.quizResults.reduce((max, result) => 
            Math.max(max, result.timeTaken || 0), 0);
        const hours = Math.floor(longestSession / 3600000);
        const minutes = Math.floor((longestSession % 3600000) / 60000);

        const longestSessionElement = document.getElementById('longestSession');
        if (longestSessionElement) longestSessionElement.textContent = `${hours}h ${minutes}m`;

        // Quiz success rate
        const totalCorrect = this.progressData.quizResults.reduce((sum, result) => sum + result.correctAnswers, 0);
        const totalQuestions = this.progressData.quizResults.reduce((sum, result) => sum + result.totalQuestions, 0);
        const successRate = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        const quizSuccessRateElement = document.getElementById('quizSuccessRate');
        if (quizSuccessRateElement) quizSuccessRateElement.textContent = `${successRate}%`;
    }

    async generateRecommendations() {
        const recommendationsList = document.getElementById('recommendationsList');
        if (!recommendationsList) return;

        try {
            const userData = await firestore.collection('users').doc(this.currentUser.uid).get();
            const userInfo = userData.data();

            const prompt = `Based on the following student data, provide 3 personalized study recommendations:
            - Class: ${userInfo.class}th grade
            - Board: ${userInfo.board}
            - Goal: ${userInfo.goal}
            - Recent quiz scores: ${this.progressData.quizResults.slice(0, 5).map(r => r.score).join(', ')}
            - Subjects: ${this.progressData.subjects.map(s => s.name).join(', ')}
            
            Provide specific, actionable recommendations for improvement.`;

            const response = await window.geminiAPI.generateTextResponse(prompt);
            
            recommendationsList.innerHTML = `
                <div class="recommendation-item">
                    <i class="fas fa-lightbulb"></i>
                    <div class="recommendation-content">
                        <h4>AI Recommendation</h4>
                        <p>${response}</p>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('Error generating recommendations:', error);
            recommendationsList.innerHTML = `
                <div class="recommendation-item">
                    <i class="fas fa-lightbulb"></i>
                    <div class="recommendation-content">
                        <h4>Study Tip</h4>
                        <p>Practice regularly with quizzes to improve your understanding and retention of concepts.</p>
                    </div>
                </div>
            `;
        }
    }

    updateChart(period) {
        const chartArea = document.getElementById('performanceChart');
        if (!chartArea) return;

        // Simple chart visualization
        const data = this.getChartData(period);
        
        chartArea.innerHTML = `
            <div class="chart-placeholder">
                <i class="fas fa-chart-line"></i>
                <h3>Performance Chart</h3>
                <p>Showing ${period} data</p>
                <div class="chart-stats">
                    <div class="stat">
                        <span class="stat-value">${data.avgScore}%</span>
                        <span class="stat-label">Average Score</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${data.totalQuizzes}</span>
                        <span class="stat-label">Quizzes Taken</span>
                    </div>
                </div>
            </div>
        `;
    }

    getChartData(period) {
        const now = new Date();
        let filteredResults = this.progressData.quizResults;

        if (period === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredResults = this.progressData.quizResults.filter(result => 
                result.timestamp?.toDate() >= weekAgo
            );
        } else if (period === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filteredResults = this.progressData.quizResults.filter(result => 
                result.timestamp?.toDate() >= monthAgo
            );
        }

        const avgScore = filteredResults.length > 0 ? 
            Math.round(filteredResults.reduce((sum, result) => sum + result.score, 0) / filteredResults.length) : 0;

        return {
            avgScore: avgScore,
            totalQuizzes: filteredResults.length
        };
    }

    exportPDF() {
        showMessage('PDF export feature coming soon!', 'info');
    }

    exportCSV() {
        const csvData = this.progressData.quizResults.map(result => 
            `${result.quizTitle},${result.subject},${result.score},${result.correctAnswers},${result.totalQuestions},${result.timestamp?.toDate()}`
        ).join('\n');

        const csvContent = 'Quiz Title,Subject,Score,Correct Answers,Total Questions,Date\n' + csvData;
        const blob = new Blob([csvContent], { type: 'text/csv' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'progress-data.csv';
        link.click();

        showMessage('Progress data exported successfully!', 'success');
    }

    shareProgress() {
        const avgScore = this.progressData.quizResults.length > 0 ? 
            Math.round(this.progressData.quizResults.reduce((sum, result) => sum + result.score, 0) / this.progressData.quizResults.length) : 0;

        const shareText = `I'm making great progress in MindMate! My average score is ${avgScore}% across ${this.progressData.quizResults.length} quizzes! 🧠✨`;

        if (navigator.share) {
            navigator.share({
                title: 'My Learning Progress',
                text: shareText,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                showMessage('Progress copied to clipboard!', 'success');
            });
        }
    }
}

// Initialize Progress Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.progressManager = new ProgressManager();
}); 