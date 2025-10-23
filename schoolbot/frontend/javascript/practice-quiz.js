// Practice Quiz Management
class PracticeQuizManager {
    constructor() {
        this.currentQuiz = null;
        this.currentQuestion = 0;
        this.answers = [];
        this.startTime = null;
        this.currentUser = null;
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
            }
        });
    }

    setupEventListeners() {
        // Quiz category selection
        document.addEventListener('click', (e) => {
            const categoryCard = e.target.closest('.category-card');
            if (categoryCard) {
                const subject = categoryCard.dataset.subject;
                this.selectQuizCategory(subject);
            }
        });

        // Custom quiz generation
        const generateCustomQuizBtn = document.getElementById('generateCustomQuizBtn');
        if (generateCustomQuizBtn) {
            generateCustomQuizBtn.addEventListener('click', () => this.generateCustomQuiz());
        }

        // Quiz navigation
        const nextQuestionBtn = document.getElementById('nextQuestionBtn');
        if (nextQuestionBtn) {
            nextQuestionBtn.addEventListener('click', () => this.nextQuestion());
        }

        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }

        const submitQuizBtn = document.getElementById('submitQuizBtn');
        if (submitQuizBtn) {
            submitQuizBtn.addEventListener('click', () => this.submitQuiz());
        }

        // Flag question
        const flagQuestionBtn = document.getElementById('flagQuestionBtn');
        if (flagQuestionBtn) {
            flagQuestionBtn.addEventListener('click', () => this.flagQuestion());
        }

        // Results actions
        const retakeQuizBtn = document.getElementById('retakeQuizBtn');
        if (retakeQuizBtn) {
            retakeQuizBtn.addEventListener('click', () => this.retakeQuiz());
        }

        const shareResultsBtn = document.getElementById('shareResultsBtn');
        if (shareResultsBtn) {
            shareResultsBtn.addEventListener('click', () => this.shareResults());
        }

        const saveResultsBtn = document.getElementById('saveResultsBtn');
        if (saveResultsBtn) {
            saveResultsBtn.addEventListener('click', () => this.saveResults());
        }
    }

    async selectQuizCategory(subject) {
        showLoading('Generating quiz...');
        
        try {
            const quiz = await this.generateQuiz(subject, 'medium', 10);
            this.startQuiz(quiz);
        } catch (error) {
            console.error('Error generating quiz:', error);
            showMessage('Failed to generate quiz. Please try again.', 'error');
        } finally {
            hideLoading();
        }
    }

    async generateCustomQuiz() {
        const subject = document.getElementById('customSubject').value.trim();
        const topic = document.getElementById('customTopic').value.trim();
        const questionCount = parseInt(document.getElementById('questionCount').value);
        const difficulty = document.getElementById('difficultyLevel').value;

        if (!subject || !topic) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }

        showLoading('Generating custom quiz...');

        try {
            const quiz = await this.generateQuiz(subject, difficulty, questionCount, topic);
            this.startQuiz(quiz);
        } catch (error) {
            console.error('Error generating custom quiz:', error);
            showMessage('Failed to generate quiz. Please try again.', 'error');
        } finally {
            hideLoading();
        }
    }

    async generateQuiz(subject, difficulty, questionCount, topic = null) {
        const prompt = `Generate a ${difficulty} level quiz with ${questionCount} questions about ${subject}${topic ? ` focusing on ${topic}` : ''}. 
        Format the response as JSON with the following structure:
        {
            "title": "Quiz Title",
            "description": "Quiz description",
            "subject": "${subject}",
            "difficulty": "${difficulty}",
            "questions": [
                {
                    "question": "Question text",
                    "options": ["A", "B", "C", "D"],
                    "correctAnswer": 0,
                    "explanation": "Explanation of the correct answer"
                }
            ]
        }`;

        try {
            const response = await window.geminiAPI.generateTextResponse(prompt);
            return JSON.parse(response);
        } catch (error) {
            console.error('Error parsing quiz response:', error);
            // Return a fallback quiz
            return this.generateFallbackQuiz(subject, difficulty, questionCount);
        }
    }

    generateFallbackQuiz(subject, difficulty, questionCount) {
        const questions = [];
        for (let i = 1; i <= questionCount; i++) {
            questions.push({
                question: `Sample question ${i} about ${subject}`,
                options: ['Option A', 'Option B', 'Option C', 'Option D'],
                correctAnswer: Math.floor(Math.random() * 4),
                explanation: 'This is a sample explanation.'
            });
        }

        return {
            title: `${subject} Quiz`,
            description: `A ${difficulty} level quiz about ${subject}`,
            subject: subject,
            difficulty: difficulty,
            questions: questions
        };
    }

    startQuiz(quiz) {
        this.currentQuiz = quiz;
        this.currentQuestion = 0;
        this.answers = new Array(quiz.questions.length).fill(null);
        this.startTime = new Date();

        // Show quiz interface
        document.getElementById('quizSelection').style.display = 'none';
        document.getElementById('quizInterface').style.display = 'block';

        // Update quiz info
        document.getElementById('quizTitle').textContent = quiz.title;
        document.getElementById('quizDescription').textContent = quiz.description;

        this.displayQuestion();
        this.startTimer();
    }

    displayQuestion() {
        if (!this.currentQuiz) return;

        const question = this.currentQuiz.questions[this.currentQuestion];
        const questionText = document.getElementById('questionText');
        const optionsContainer = document.getElementById('optionsContainer');
        const progressText = document.getElementById('progressText');
        const progressFill = document.getElementById('progressFill');

        // Update question text
        questionText.textContent = question.question;

        // Generate options
        optionsContainer.innerHTML = question.options.map((option, index) => `
            <div class="option-item ${this.answers[this.currentQuestion] === index ? 'selected' : ''}" 
                 data-option="${index}">
                <span class="option-label">${String.fromCharCode(65 + index)}</span>
                <span class="option-text">${option}</span>
            </div>
        `).join('');

        // Add option click listeners
        optionsContainer.querySelectorAll('.option-item').forEach(option => {
            option.addEventListener('click', () => this.selectOption(parseInt(option.dataset.option)));
        });

        // Update progress
        const progress = ((this.currentQuestion + 1) / this.currentQuiz.questions.length) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.currentQuiz.questions.length}`;

        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitQuizBtn');

        if (prevBtn) prevBtn.disabled = this.currentQuestion === 0;
        if (nextBtn) nextBtn.disabled = this.currentQuestion === this.currentQuiz.questions.length - 1;
        if (submitBtn) submitBtn.style.display = this.currentQuestion === this.currentQuiz.questions.length - 1 ? 'block' : 'none';
    }

    selectOption(optionIndex) {
        this.answers[this.currentQuestion] = optionIndex;
        
        // Update visual selection
        document.querySelectorAll('.option-item').forEach((item, index) => {
            item.classList.toggle('selected', index === optionIndex);
        });
    }

    nextQuestion() {
        if (this.currentQuestion < this.currentQuiz.questions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
        }
    }

    flagQuestion() {
        const question = this.currentQuiz.questions[this.currentQuestion];
        const flagBtn = document.getElementById('flagQuestionBtn');
        
        if (flagBtn.classList.contains('flagged')) {
            flagBtn.classList.remove('flagged');
            flagBtn.innerHTML = '<i class="fas fa-flag"></i> Flag Question';
        } else {
            flagBtn.classList.add('flagged');
            flagBtn.innerHTML = '<i class="fas fa-flag"></i> Flagged';
        }
    }

    startTimer() {
        const timerDisplay = document.getElementById('timeLeft');
        const startTime = new Date();
        
        this.timerInterval = setInterval(() => {
            const elapsed = new Date() - startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    submitQuiz() {
        this.stopTimer();
        this.showResults();
    }

    showResults() {
        const endTime = new Date();
        const timeTaken = endTime - this.startTime;
        
        // Calculate results
        const totalQuestions = this.currentQuiz.questions.length;
        const correctAnswers = this.answers.filter((answer, index) => 
            answer === this.currentQuiz.questions[index].correctAnswer
        ).length;
        
        const score = Math.round((correctAnswers / totalQuestions) * 100);
        const minutes = Math.floor(timeTaken / 60000);
        const seconds = Math.floor((timeTaken % 60000) / 1000);

        // Update results display
        document.getElementById('scorePercentage').textContent = `${score}%`;
        document.getElementById('scoreText').textContent = `${correctAnswers} out of ${totalQuestions}`;
        document.getElementById('correctAnswers').textContent = correctAnswers;
        document.getElementById('incorrectAnswers').textContent = totalQuestions - correctAnswers;
        document.getElementById('timeTaken').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        document.getElementById('avgTime').textContent = `${Math.round(timeTaken / totalQuestions / 1000)}s`;

        // Generate review
        this.generateReview();

        // Show results
        document.getElementById('quizInterface').style.display = 'none';
        document.getElementById('quizResults').style.display = 'block';

        // Save results
        this.saveQuizResults(score, correctAnswers, totalQuestions, timeTaken);
    }

    generateReview() {
        const reviewList = document.getElementById('reviewList');
        if (!reviewList) return;

        reviewList.innerHTML = this.currentQuiz.questions.map((question, index) => {
            const userAnswer = this.answers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return `
                <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                    <div class="review-header">
                        <span class="question-number">Q${index + 1}</span>
                        <span class="result-badge ${isCorrect ? 'correct' : 'incorrect'}">
                            ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                        </span>
                    </div>
                    <p class="question-text">${question.question}</p>
                    <div class="answer-details">
                        <p><strong>Your Answer:</strong> ${userAnswer !== null ? question.options[userAnswer] : 'Not answered'}</p>
                        <p><strong>Correct Answer:</strong> ${question.options[question.correctAnswer]}</p>
                        <p><strong>Explanation:</strong> ${question.explanation}</p>
                    </div>
                </div>
            `;
        }).join('');
    }

    async saveQuizResults(score, correctAnswers, totalQuestions, timeTaken) {
        if (!this.currentUser) return;

        try {
            await firestore.collection('users').doc(this.currentUser.uid).collection('quizResults').add({
                quizTitle: this.currentQuiz.title,
                subject: this.currentQuiz.subject,
                difficulty: this.currentQuiz.difficulty,
                score: score,
                correctAnswers: correctAnswers,
                totalQuestions: totalQuestions,
                timeTaken: timeTaken,
                answers: this.answers,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('Quiz results saved successfully');
        } catch (error) {
            console.error('Error saving quiz results:', error);
        }
    }

    retakeQuiz() {
        // Reset and restart the same quiz
        this.startQuiz(this.currentQuiz);
    }

    shareResults() {
        const score = document.getElementById('scorePercentage').textContent;
        const subject = this.currentQuiz.subject;
        
        const shareText = `I scored ${score} on the ${subject} quiz in MindMate! 🧠✨`;
        
        if (navigator.share) {
            navigator.share({
                title: 'My Quiz Results',
                text: shareText,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareText).then(() => {
                showMessage('Results copied to clipboard!', 'success');
            });
        }
    }

    saveResults() {
        showMessage('Results saved to your progress!', 'success');
        // Additional logic to save to progress tracking
    }

    resetQuiz() {
        this.currentQuiz = null;
        this.currentQuestion = 0;
        this.answers = [];
        this.startTime = null;
        
        document.getElementById('quizResults').style.display = 'none';
        document.getElementById('quizSelection').style.display = 'block';
    }
}

// Initialize Practice Quiz Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.practiceQuizManager = new PracticeQuizManager();
}); 