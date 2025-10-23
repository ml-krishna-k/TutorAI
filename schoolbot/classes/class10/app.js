// Sample Data - Replace with API calls in production
const APP_DATA = {
    sampleNotes: [
        {"id":1, "subject":"Maths", "name":"Quadratic Equations.pdf", "size":"1.2 MB", "date":"2025-07-15"},
        {"id":2, "subject":"Science", "name":"Periodic Table.docx", "size":"900 KB", "date":"2025-07-10"},
        {"id":3, "subject":"Social Science", "name":"World War II Notes.pdf", "size":"2.1 MB", "date":"2025-07-12"},
        {"id":4, "subject":"English", "name":"Shakespeare Analysis.pdf", "size":"1.5 MB", "date":"2025-07-08"},
        {"id":5, "subject":"Hindi", "name":"Kabir Ke Dohe.docx", "size":"800 KB", "date":"2025-07-05"},
        {"id":6, "subject":"Maths", "name":"Trigonometry Formulas.pdf", "size":"950 KB", "date":"2025-07-13"},
        {"id":7, "subject":"Science", "name":"Human Body Systems.pdf", "size":"2.3 MB", "date":"2025-07-11"}
    ],
    subjectsTopics: {
        "Maths":["Algebra","Geometry","Trigonometry","Statistics","Probability"],
        "Science":["Physics","Chemistry","Biology","Environmental Science"],
        "Social Science":["History","Geography","Civics","Economics"],
        "English":["Grammar","Literature","Writing Skills","Reading Comprehension"],
        "Hindi":["Vyakaran","Sahitya","Kavita","Gadya"]
    },
    quizBank: {
        "Maths": {
            "Algebra": [
                {"q":"Solve: 2x + 7 = 19","options":["x = 3","x = 6","x = 12","x = 19"],"ans":1},
                {"q":"Factorise: x² - 9","options":["(x-3)(x+3)","(x-9)(x+1)","(x-3)²","(x+3)²"],"ans":0},
                {"q":"If 3x - 5 = 16, find x","options":["x = 5","x = 7","x = 11","x = 21"],"ans":1},
                {"q":"Expand: (a + b)²","options":["a² + b²","a² + 2ab + b²","a² - 2ab + b²","2a² + 2b²"],"ans":1},
                {"q":"Solve: x/4 + x/6 = 5","options":["x = 10","x = 12","x = 15","x = 20"],"ans":1}
            ],
            "Geometry": [
                {"q":"Sum of angles in a triangle is","options":["90°","180°","270°","360°"],"ans":1},
                {"q":"Area of a circle with radius r is","options":["πr","2πr","πr²","2πr²"],"ans":2},
                {"q":"In a right triangle, the longest side is called","options":["Adjacent","Opposite","Hypotenuse","Base"],"ans":2}
            ],
            "Trigonometry": [
                {"q":"sin²θ + cos²θ = ?","options":["0","1","2","sin θ cos θ"],"ans":1},
                {"q":"Value of sin 30° is","options":["1/2","√3/2","1","0"],"ans":0},
                {"q":"Value of cos 60° is","options":["1/2","√3/2","1","0"],"ans":0}
            ]
        },
        "Science": {
            "Physics": [
                {"q":"Unit of electric current is","options":["Volt","Coulomb","Ampere","Ohm"],"ans":2},
                {"q":"Speed of light in vacuum is approximately","options":["3 × 10⁸ m/s","3 × 10⁶ m/s","3 × 10¹⁰ m/s","3 × 10⁴ m/s"],"ans":0},
                {"q":"Newton's first law is also known as","options":["Law of momentum","Law of inertia","Law of acceleration","Law of gravity"],"ans":1},
                {"q":"SI unit of force is","options":["Joule","Watt","Newton","Pascal"],"ans":2}
            ],
            "Chemistry": [
                {"q":"Chemical formula of water is","options":["H₂O","HO₂","H₂O₂","OH₂"],"ans":0},
                {"q":"Atomic number of carbon is","options":["4","6","8","12"],"ans":1},
                {"q":"Which gas is most abundant in Earth's atmosphere?","options":["Oxygen","Carbon dioxide","Nitrogen","Hydrogen"],"ans":2},
                {"q":"pH of pure water is","options":["6","7","8","9"],"ans":1}
            ],
            "Biology": [
                {"q":"Smallest unit of life is","options":["Tissue","Organ","Cell","Organism"],"ans":2},
                {"q":"Process by which plants make food is called","options":["Respiration","Photosynthesis","Digestion","Excretion"],"ans":1},
                {"q":"Human heart has how many chambers?","options":["2","3","4","5"],"ans":2},
                {"q":"Which blood group is universal donor?","options":["A","B","AB","O"],"ans":3}
            ]
        },
        "Social Science": {
            "History": [
                {"q":"Who was the first Prime Minister of India?","options":["Mahatma Gandhi","Jawaharlal Nehru","Sardar Patel","Dr. Rajendra Prasad"],"ans":1},
                {"q":"When did India gain independence?","options":["1945","1946","1947","1948"],"ans":2},
                {"q":"The Mughal Empire was founded by","options":["Akbar","Babur","Humayun","Shah Jahan"],"ans":1}
            ],
            "Geography": [
                {"q":"Which is the longest river in India?","options":["Yamuna","Brahmaputra","Ganga","Godavari"],"ans":2},
                {"q":"India lies in which hemisphere?","options":["Northern","Southern","Eastern","Western"],"ans":0},
                {"q":"Which state has the longest coastline in India?","options":["Tamil Nadu","Kerala","Gujarat","Maharashtra"],"ans":2}
            ],
            "Civics": [
                {"q":"How many fundamental rights are there in Indian Constitution?","options":["5","6","7","8"],"ans":1},
                {"q":"Who is the head of the state government?","options":["Chief Minister","Governor","President","Prime Minister"],"ans":1},
                {"q":"At what age can an Indian citizen vote?","options":["16","18","21","25"],"ans":1}
            ]
        },
        "English": {
            "Grammar": [
                {"q":"Which is a proper noun?","options":["city","Delhi","book","student"],"ans":1},
                {"q":"'The' is which type of article?","options":["Indefinite","Definite","Possessive","Demonstrative"],"ans":1},
                {"q":"Past tense of 'go' is","options":["goes","going","went","gone"],"ans":2},
                {"q":"A group of words with complete meaning is called","options":["Phrase","Clause","Sentence","Paragraph"],"ans":2}
            ],
            "Literature": [
                {"q":"Who wrote 'Romeo and Juliet'?","options":["Charles Dickens","William Shakespeare","Mark Twain","Jane Austen"],"ans":1},
                {"q":"'To be or not to be' is a famous quote from","options":["Macbeth","Hamlet","Othello","King Lear"],"ans":1}
            ]
        },
        "Hindi": {
            "Vyakaran": [
                {"q":"'लड़का' में कौन सा लिंग है?","options":["पुल्लिंग","स्त्रीलिंग","नपुंसकलिंग","इनमें से कोई नहीं"],"ans":0},
                {"q":"'खुशी' का विलोम शब्द है","options":["दुःख","गम","चिंता","परेशानी"],"ans":0},
                {"q":"'सूर्य' का पर्यायवाची है","options":["चाँद","तारा","रवि","पृथ्वी"],"ans":2}
            ],
            "Sahitya": [
                {"q":"'गोदान' के लेखक कौन हैं?","options":["प्रेमचंद","जयशंकर प्रसाद","सूर्यकांत त्रिपाठी निराला","महादेवी वर्मा"],"ans":0},
                {"q":"'रामायण' के रचयिता हैं","options":["व्यास","वाल्मीकि","कालिदास","तुलसीदास"],"ans":1}
            ]
        }
    },
    quotes: [
        "Success is the sum of small efforts repeated day in and day out.",
        "Believe you can and you're halfway there.",
        "The expert in anything was once a beginner.",
        "Education is the most powerful weapon you can use to change the world.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "Don't watch the clock; do what it does. Keep going.",
        "Success is not final, failure is not fatal: it is the courage to continue that counts."
    ],
    videos: [
        "https://www.youtube.com/embed/IdTMDpizis8?start=0&end=30&autoplay=0",
        "https://www.youtube.com/embed/ZXsQAXx_ao0?start=0&end=30&autoplay=0",
        "https://www.youtube.com/embed/ji5_MqicxSo?start=0&end=30&autoplay=0", 
        "https://www.youtube.com/embed/cFoo6DEvGyw?start=0&end=30&autoplay=0"
    ]
};

// Main Application Module
const App = (() => {
    const init = () => {
        setupNavigation();
        setupMobileMenu();
        chatModule.init();
        notesModule.init();
        quizModule.init();
        motivationModule.init();
    };

    const setupNavigation = () => {
        const navLinks = document.querySelectorAll('.nav-link');
        const panels = document.querySelectorAll('.panel');

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPanel = link.getAttribute('data-panel');

                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // Switch panels
                panels.forEach(panel => {
                    panel.classList.remove('active');
                });
                document.getElementById(targetPanel).classList.add('active');

                // Lazy load motivation video when panel is active
                if (targetPanel === 'motivation-panel') {
                    motivationModule.loadVideo();
                }

                // Close mobile menu if open
                document.getElementById('nav-menu').classList.remove('active');
            });
        });
    };

    const setupMobileMenu = () => {
        const mobileMenu = document.getElementById('mobile-menu');
        const navMenu = document.getElementById('nav-menu');

        mobileMenu.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
            }
        });
    };

    return { init };
})();

// Chat Module for Ask a Doubt Panel
const chatModule = (() => {
    let uploadedFiles = [];

    const init = () => {
        setupChatForm();
        setupFileUploads();
        showWelcomeMessage();

        // Test API connection after a longer delay
        setTimeout(() => {
            testAPIConnection();
        }, 5000);
    };

    const showWelcomeMessage = () => {
        const welcomeMsg = "Hi! I'm your study assistant powered by Mistral AI. Ask me anything about your subjects or share your doubts. I'm here to help! 📚";
        addMessage(welcomeMsg, 'bot');
    };

    const setupChatForm = () => {
        const form = document.getElementById('doubtForm');
        const input = document.getElementById('questionInput');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const question = input.value.trim();
                if (question) {
                    handleUserMessage(question);
                    input.value = '';
                    // Reset textarea height
                    input.style.height = 'auto';
                }
            });
        }

        // Auto-resize textarea
        if (input) {
            input.addEventListener('input', (e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            });

            // Handle Enter key to send message
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const question = input.value.trim();
                    if (question) {
                        handleUserMessage(question);
                        input.value = '';
                        // Reset textarea height
                        input.style.height = 'auto';
                    }
                }
            });
        }
    };

    const setupFileUploads = () => {
        ['imageUpload', 'audioUpload', 'fileUpload'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', (e) => {
                    const type = id.includes('image') ? 'image' : id.includes('audio') ? 'audio' : 'file';
                    handleFileUpload(e, type);
                });
            } else {
                console.error(`File upload element with id '${id}' not found`);
            }
        });
    };

    const handleFileUpload = (event, type) => {
        const file = event.target.files[0];
        if (!file) {
            console.log('No file selected');
            return;
        }

        console.log('File uploaded:', file.name, 'Type:', file.type, 'Size:', file.size);

        // For images, inform user that Mistral doesn't support image analysis
        if (type === 'image') {
            addMessage(`⚠️ Image analysis is not supported by Mistral AI. Please describe your question in text format instead.`, 'bot error');
            return;
        }

        // Validate file size (max 10MB for images, 50MB for others)
        const maxSize = type === 'image' ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
        if (file.size > maxSize) {
            addMessage(`⚠️ File too large. Maximum size for ${type} files is ${maxSize / (1024 * 1024)}MB.`, 'bot error');
            return;
        }

        // Validate file type
        const allowedTypes = {
            image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
            audio: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
            file: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
        };

        if (!allowedTypes[type].includes(file.type)) {
            addMessage(`⚠️ Invalid file type. Allowed types for ${type}: ${allowedTypes[type].join(', ')}`, 'bot error');
            return;
        }

        const fileData = {
            name: file.name,
            size: formatFileSize(file.size),
            type: type,
            file: file
        };

        uploadedFiles.push(fileData);
        displayFilePreview(fileData);

        // Show success message
        addMessage(`✅ File "${file.name}" uploaded successfully! Note: Only text-based questions are supported.`, 'bot');
    };

    const displayFilePreview = (fileData) => {
        const previewBox = document.getElementById('previewBox');
        previewBox.classList.remove('hidden');

        const previewItem = document.createElement('div');
        previewItem.className = 'preview-item';

        let thumbnailElem;
        if (fileData.type === 'image') {
            thumbnailElem = document.createElement('img');
            thumbnailElem.className = 'preview-thumbnail';
            const reader = new FileReader();
            reader.onload = (e) => {
                thumbnailElem.src = e.target.result;
            };
            reader.readAsDataURL(fileData.file);
        } else {
            thumbnailElem = document.createElement('div');
            thumbnailElem.className = 'preview-thumbnail';
            thumbnailElem.style.display = 'flex';
            thumbnailElem.style.alignItems = 'center';
            thumbnailElem.style.justifyContent = 'center';
            thumbnailElem.style.background = fileData.type === 'audio' ? 'var(--color-bg-2)' : 'var(--color-bg-4)';
            thumbnailElem.textContent = fileData.type === 'audio' ? '🎵' : '📄';
        }

        const infoDiv = document.createElement('div');
        infoDiv.className = 'preview-info';
        infoDiv.innerHTML = `
            <div class="preview-name">${fileData.name}</div>
            <div class="preview-size">${fileData.size}</div>
        `;

        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-preview';
        removeBtn.textContent = 'Remove';
        removeBtn.onclick = () => {
            previewItem.remove();
            uploadedFiles = uploadedFiles.filter(f => f.name !== fileData.name);
            if (uploadedFiles.length === 0) {
                previewBox.classList.add('hidden');
            }
        };

        previewItem.appendChild(thumbnailElem);
        previewItem.appendChild(infoDiv);
        previewItem.appendChild(removeBtn);
        previewBox.appendChild(previewItem);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUserMessage = async (message) => {
        // Add user message to chat
        addMessage(message, 'user');

        // Show thinking indicator
        const thinkingId = 'thinking-' + Date.now();
        addMessage('Thinking<span class="thinking-dots"></span>', 'bot thinking', thinkingId);

        try {
            // Call Mistral API instead of Gemini
            const response = await askClass10Doubt(message);

            // Remove thinking indicator
            removeMessage(thinkingId);

            // Add bot response
            addMessage(response, 'bot');

        } catch (error) {
            console.error('Error getting response:', error);

            // Remove thinking indicator
            removeMessage(thinkingId);

            // Show error message
            let errorMsg = 'Sorry, I encountered an error. ';
            if (error.message.includes('API key')) {
                errorMsg += 'Please make sure your Mistral API key is configured correctly.';
            } else if (error.message.includes('quota') || error.message.includes('limit')) {
                errorMsg += 'API quota exceeded. Please try again later.';
            } else {
                errorMsg += 'Please try again or rephrase your question.';
            }

            addMessage(errorMsg, 'bot error');
        }
    };

    const addMessage = (message, type, id = null) => {
        const chat = document.getElementById('chat');
        const messageDiv = document.createElement('div');
        messageDiv.className = `bubble ${type}`;
        if (id) messageDiv.id = id;
        messageDiv.innerHTML = message;
        chat.appendChild(messageDiv);
        chat.scrollTop = chat.scrollHeight;
    };

    const removeMessage = (id) => {
        const message = document.getElementById(id);
        if (message) {
            message.remove();
        }
    };

    const testAPIConnection = async () => {
        try {
            if (window.class10MistralAPI && window.class10MistralAPI.initialized) {
                console.log('✅ Mistral API connection successful');
            } else {
                console.log('⚠️ Mistral API not initialized yet');
            }
        } catch (error) {
            console.error('❌ Mistral API connection failed:', error);
        }
    };

    return { init };
})();

// Notes Module
const notesModule = (() => {
    let currentSubject = 'All';

    const init = () => {
        setupSubjectTabs();
        setupNotesUpload();
        displayNotes();
    };

    const setupSubjectTabs = () => {
        const tabs = document.querySelectorAll('.subject-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update current subject
                currentSubject = tab.getAttribute('data-subject');

                // Display filtered notes
                displayNotes();
            });
        });
    };

    const setupNotesUpload = () => {
        const uploadArea = document.getElementById('notesUploadArea');
        const fileInput = document.getElementById('notesFileInput');

        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });

            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.classList.add('drag-over');
            });

            uploadArea.addEventListener('dragleave', () => {
                uploadArea.classList.remove('drag-over');
            });

            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.classList.remove('drag-over');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    handleNotesUpload(files[0]);
                }
            });

            fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    handleNotesUpload(e.target.files[0]);
                }
            });
        }
    };

    const handleNotesUpload = (file) => {
        console.log('Uploading note:', file.name);
        // In a real application, you would upload to server
        // For now, just show success message
        alert(`Note "${file.name}" uploaded successfully!`);
    };

    const displayNotes = () => {
        const notesGrid = document.getElementById('notesGrid');
        if (!notesGrid) return;

        let filteredNotes = APP_DATA.sampleNotes;
        if (currentSubject !== 'All') {
            filteredNotes = APP_DATA.sampleNotes.filter(note => note.subject === currentSubject);
        }

        if (filteredNotes.length === 0) {
            notesGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No notes found for ${currentSubject}</h3>
                    <p>Upload your first note to get started!</p>
                </div>
            `;
            return;
        }

        notesGrid.innerHTML = filteredNotes.map(note => `
            <div class="note-card">
                <div class="note-icon">📄</div>
                <h4 class="note-title">${note.name}</h4>
                <div class="note-meta">
                    <span class="note-subject">${note.subject}</span>
                    <span class="note-date">${note.date}</span>
                </div>
                <div class="note-size">${note.size}</div>
                <button class="download-btn" onclick="downloadNote(${note.id})">
                    Download
                </button>
            </div>
        `).join('');
    };

    return { init };
})();

// Quiz Module
const quizModule = (() => {
    let currentQuiz = null;
    let currentQuestionIndex = 0;
    let userAnswers = [];
    let quizTimer = null;
    let timeRemaining = 0;

    const init = () => {
        setupQuizForm();
    };

    const setupQuizForm = () => {
        const form = document.getElementById('quizSetupForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                startQuiz();
            });
        }

        // Update question count display
        const slider = document.getElementById('questionCount');
        const display = document.getElementById('questionCountDisplay');
        if (slider && display) {
            slider.addEventListener('input', (e) => {
                display.textContent = e.target.value;
            });
        }
    };

    const startQuiz = () => {
        const subject = document.getElementById('quizSubject').value;
        const topic = document.getElementById('quizTopic').value;
        const questionCount = parseInt(document.getElementById('questionCount').value);
        const timeLimit = parseInt(document.getElementById('timeLimit').value);

        // Get questions for the selected subject and topic
        let questions = [];
        if (APP_DATA.quizBank[subject] && APP_DATA.quizBank[subject][topic]) {
            questions = [...APP_DATA.quizBank[subject][topic]];
        }

        if (questions.length === 0) {
            alert('No questions available for this topic');
            return;
        }

        // Shuffle and limit questions
        questions = shuffleArray(questions).slice(0, Math.min(questionCount, questions.length));

        currentQuiz = {
            subject,
            topic,
            questions,
            timeLimit: timeLimit * 60 // Convert to seconds
        };

        currentQuestionIndex = 0;
        userAnswers = [];
        timeRemaining = currentQuiz.timeLimit;

        // Hide setup and show quiz
        document.getElementById('quiz-setup').classList.add('hidden');
        document.getElementById('quiz-container').classList.remove('hidden');

        displayQuestion();
        startTimer();
    };

    const displayQuestion = () => {
        const question = currentQuiz.questions[currentQuestionIndex];
        const container = document.getElementById('questionContainer');
        const counter = document.getElementById('questionCounter');

        counter.textContent = `Question ${currentQuestionIndex + 1} of ${currentQuiz.questions.length}`;

        container.innerHTML = `
            <h3>${question.q}</h3>
            <ul class="options-list">
                ${question.options.map((option, index) => `
                    <li class="option-item">
                        <input type="radio" name="answer" value="${index}" id="option${index}" class="option-radio">
                        <label for="option${index}" class="option-label">${option}</label>
                    </li>
                `).join('')}
            </ul>
        `;

        // Update navigation buttons
        const prevBtn = document.getElementById('prevQuestion');
        const nextBtn = document.getElementById('nextQuestion');
        const submitBtn = document.getElementById('submitQuiz');

        prevBtn.style.display = currentQuestionIndex === 0 ? 'none' : 'block';
        nextBtn.style.display = currentQuestionIndex === currentQuiz.questions.length - 1 ? 'none' : 'block';
        submitBtn.style.display = currentQuestionIndex === currentQuiz.questions.length - 1 ? 'block' : 'none';
    };

    const startTimer = () => {
        const timerDisplay = document.getElementById('quizTimer');

        quizTimer = setInterval(() => {
            timeRemaining--;

            const minutes = Math.floor(timeRemaining / 60);
            const seconds = timeRemaining % 60;
            timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            if (timeRemaining <= 0) {
                clearInterval(quizTimer);
                submitQuiz();
            }
        }, 1000);
    };

    const nextQuestion = () => {
        saveCurrentAnswer();
        if (currentQuestionIndex < currentQuiz.questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        }
    };

    const prevQuestion = () => {
        saveCurrentAnswer();
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    };

    const saveCurrentAnswer = () => {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            userAnswers[currentQuestionIndex] = parseInt(selectedOption.value);
        }
    };

    const submitQuiz = () => {
        saveCurrentAnswer();
        clearInterval(quizTimer);

        // Calculate results
        let correctAnswers = 0;
        const results = currentQuiz.questions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.ans;
            if (isCorrect) correctAnswers++;

            return {
                question: question.q,
                userAnswer: userAnswers[index] !== undefined ? question.options[userAnswers[index]] : 'Not answered',
                correctAnswer: question.options[question.ans],
                isCorrect
            };
        });

        const score = Math.round((correctAnswers / currentQuiz.questions.length) * 100);

        displayResults(score, correctAnswers, results);
    };

    const displayResults = (score, correctAnswers, results) => {
        // Hide quiz and show results
        document.getElementById('quiz-container').classList.add('hidden');
        document.getElementById('quiz-results').classList.remove('hidden');

        // Update results display
        document.getElementById('finalScore').textContent = `${correctAnswers}/${currentQuiz.questions.length}`;
        document.getElementById('finalPercentage').textContent = `(${score}%)`;

        const reviewContainer = document.getElementById('answerReview');
        reviewContainer.innerHTML = results.map((result, index) => `
            <div class="review-item ${result.isCorrect ? 'correct' : 'incorrect'}">
                <div class="review-question">${index + 1}. ${result.question}</div>
                <div class="review-answers">
                    <div class="your-answer">Your answer: ${result.userAnswer}</div>
                    <div class="correct-answer">Correct answer: ${result.correctAnswer}</div>
                </div>
            </div>
        `).join('');
    };

    const restartQuiz = () => {
        document.getElementById('quiz-results').classList.add('hidden');
        document.getElementById('quiz-setup').classList.remove('hidden');
        currentQuiz = null;
    };

    const shuffleArray = (array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };

    // Expose functions globally for button onclick handlers
    window.nextQuestion = nextQuestion;
    window.prevQuestion = prevQuestion;
    window.submitQuiz = submitQuiz;
    window.restartQuiz = restartQuiz;

    return { init };
})();

// Motivation Module
const motivationModule = (() => {
    let currentQuoteIndex = 0;
    let videoLoaded = false;

    const init = () => {
        displayRandomQuote();
        setupQuoteRotation();
    };

    const displayRandomQuote = () => {
        const quoteElement = document.getElementById('motivationalQuote');
        if (quoteElement && APP_DATA.quotes.length > 0) {
            currentQuoteIndex = Math.floor(Math.random() * APP_DATA.quotes.length);
            quoteElement.textContent = APP_DATA.quotes[currentQuoteIndex];
        }
    };

    const setupQuoteRotation = () => {
        // Change quote every 10 seconds
        setInterval(() => {
            displayRandomQuote();
        }, 10000);
    };

    const loadVideo = () => {
        if (!videoLoaded && APP_DATA.videos.length > 0) {
            const videoContainer = document.getElementById('videoContainer');
            if (videoContainer) {
                const randomVideo = APP_DATA.videos[Math.floor(Math.random() * APP_DATA.videos.length)];
                videoContainer.innerHTML = `
                    <iframe src="${randomVideo}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                `;
                videoLoaded = true;
            }
        }
    };

    return { init, loadVideo };
})();

// Global helper functions
window.downloadNote = (noteId) => {
    const note = APP_DATA.sampleNotes.find(n => n.id === noteId);
    if (note) {
        alert(`Downloading ${note.name}...`);
        // In a real app, this would trigger file download
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});