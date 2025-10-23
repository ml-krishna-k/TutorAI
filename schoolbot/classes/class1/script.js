// Game State Management
let gameState = {
    currentScreen: 'welcome',
    currentZone: null,
    currentGame: null,
    totalStars: 0,
    progress: {
        math: 0,
        english: 0,
        evs: 0
    },
    gameTimer: null,
    gameScore: 0,
    musicPlaying: false
};

// Audio Context
let audioContext;
let backgroundMusicNode;

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    initializeGame();
});

function initializeGame() {
    // Set up initial screen
    showScreen('welcomeScreen');
    
    // Initialize audio context
    initializeAudio();
    
    // Load saved progress
    loadGameProgress();
    
    // Update UI
    updateProgressBar();
    updateStarsCount();
    
    // Start emotion detection for Class 1 after a delay
    setTimeout(() => {
        if (window.emotionDetection) {
            window.emotionDetection.startEmotionDetection(1);
        }
    }, 3000);
}

// Screen Management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    gameState.currentScreen = screenId;
}

function showWelcome() {
    showScreen('welcomeScreen');
    playSound('welcome');
}

function showWorldMap() {
    showScreen('worldMapScreen');
    updateZoneProgress();
    playSound('map');
}

function showParentZone() {
    showScreen('parentScreen');
    updateParentDashboard();
}

// Zone Navigation
function enterZone(zoneName) {
    gameState.currentZone = zoneName;
    
    switch(zoneName) {
        case 'math':
            showScreen('mathScreen');
            updateSpeechBubble('mathSpeech', 'Ready to explore numbers with me?');
            break;
        case 'english':
            showScreen('englishScreen');
            updateSpeechBubble('englishSpeech', 'Let\'s discover amazing words together!');
            break;
        case 'evs':
            showScreen('evsScreen');
            updateSpeechBubble('evsSpeech', 'Time to learn about our wonderful world!');
            break;
    }
    
    playSound('zone-enter');
}

function goBackToZone() {
    if (gameState.currentZone) {
        enterZone(gameState.currentZone);
    } else {
        showWorldMap();
    }
}

// Game Launch Functions
function playMathGame(gameType) {
    gameState.currentGame = gameType;
    showScreen('gameScreen');
    
    switch(gameType) {
        case 'numbers':
            startNumberTrainGame();
            break;
        case 'shapes':
            startShapeHuntGame();
            break;
        case 'addition':
            startAdditionRaceGame();
            break;
        case 'money':
            startCoinCounterGame();
            break;
    }
}

function playEnglishGame(gameType) {
    gameState.currentGame = gameType;
    showScreen('gameScreen');
    
    switch(gameType) {
        case 'alphabet':
            startAlphabetCatchGame();
            break;
        case 'phonics':
            startPhonicBubblesGame();
            break;
        case 'words':
            startWordBuilderGame();
            break;
        case 'story':
            startStoryTimeGame();
            break;
    }
}

function playEVSGame(gameType) {
    gameState.currentGame = gameType;
    showScreen('gameScreen');
    
    switch(gameType) {
        case 'family':
            startFamilyTreeGame();
            break;
        case 'habits':
            startGoodHabitsGame();
            break;
        case 'safety':
            startSafetyGame();
            break;
        case 'seasons':
            startSeasonsGame();
            break;
    }
}

// Math Games Implementation
function startNumberTrainGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <h3>🚂 Number Train Adventure</h3>
        <p>Help arrange the train cars in the correct order!</p>
        <div class="number-train" id="numberTrain"></div>
        <div class="train-target" id="trainTarget">Drop numbers here in order: 1, 2, 3, 4, 5</div>
    `;
    
    const numbers = [3, 1, 5, 2, 4];
    const trainContainer = document.getElementById('numberTrain');
    
    numbers.forEach(num => {
        const trainCar = document.createElement('div');
        trainCar.className = 'train-car';
        trainCar.textContent = num;
        trainCar.draggable = true;
        trainCar.onclick = () => checkNumberOrder(num);
        trainContainer.appendChild(trainCar);
    });
    
    startGameTimer(60);
}

function startShapeHuntGame() {
    const gameArea = document.getElementById('gameArea');
    const shapes = ['🔴', '🔵', '🟡', '🔺', '⬜', '🟢', '🟤', '🟣'];
    const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    gameArea.innerHTML = `
        <h3>🔍 Shape Hunt Adventure</h3>
        <p>Find all the <span style="font-size: 2rem;">${targetShape}</span> shapes!</p>
        <div class="shape-hunt-area" id="shapeArea"></div>
        <div class="score-display">Found: <span id="shapesFound">0</span>/3</div>
    `;
    
    const shapeArea = document.getElementById('shapeArea');
    const allShapes = [];
    
    // Add target shapes
    for(let i = 0; i < 3; i++) {
        allShapes.push(targetShape);
    }
    
    // Add random shapes
    for(let i = 0; i < 13; i++) {
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
        allShapes.push(randomShape);
    }
    
    // Shuffle array
    allShapes.sort(() => Math.random() - 0.5);
    
    allShapes.forEach(shape => {
        const shapeItem = document.createElement('div');
        shapeItem.className = 'shape-item';
        shapeItem.textContent = shape;
        shapeItem.onclick = () => checkShape(shape, targetShape, shapeItem);
        shapeArea.appendChild(shapeItem);
    });
    
    gameState.shapesFound = 0;
    startGameTimer(90);
}

function startAdditionRaceGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <h3>🏃‍♂️ Addition Race</h3>
        <p>Solve the addition problems to help Benny win the race!</p>
        <div class="addition-problem" id="problemArea">
            <div class="problem-display" id="problemDisplay"></div>
            <div class="answer-options" id="answerOptions"></div>
        </div>
        <div class="race-track">
            <div class="runner" id="player">🐰</div>
            <div class="runner" id="opponent">🐢</div>
        </div>
    `;
    
    generateAdditionProblem();
    startGameTimer(120);
}

function startCoinCounterGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <h3>🪙 Coin Counter Challenge</h3>
        <p>Count the coins and match the total value!</p>
        <div class="coin-display" id="coinDisplay"></div>
        <div class="value-options" id="valueOptions"></div>
    `;
    
    generateCoinProblem();
    startGameTimer(90);
}

// English Games Implementation
function startAlphabetCatchGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <h3>🔤 Alphabet Catch</h3>
        <p>Catch the letters to spell "CAT"!</p>
        <div class="catch-area" id="catchArea"></div>
        <div class="word-progress">Word: <span id="wordProgress">___</span></div>
        <div class="basket" id="basket">🧺</div>
    `;
    
    const letters = ['C', 'A', 'T', 'X', 'Y', 'Z', 'B', 'D'];
    gameState.wordTarget = ['C', 'A', 'T'];
    gameState.caughtLetters = [];
    
    startFallingLetters(letters);
    startGameTimer(60);
}

function startPhonicBubblesGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <h3>🫧 Phonic Bubbles</h3>
        <p>Pop bubbles that start with the sound "B"!</p>
        <div class="bubble-area" id="bubbleArea"></div>
        <div class="score-display">Correct: <span id="bubblesPopped">0</span>/5</div>
    `;
    
    const bWords = ['BAT', 'BUS', 'BOX', 'BEE', 'BOY'];
    const otherWords = ['CAT', 'DOG', 'SUN', 'HAT', 'PEN'];
    const allWords = [...bWords, ...otherWords].sort(() => Math.random() - 0.5);
    
    gameState.bubblesPopped = 0;
    createFloatingBubbles(allWords, 'B');
    startGameTimer(90);
}

function startWordBuilderGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <h3>🧩 Word Builder</h3>
        <p>Build the word "DOG" using the letters below!</p>
        <div class="word-builder">
            <div class="word-area" id="wordArea"></div>
            <div class="letter-pool" id="letterPool"></div>
        </div>
    `;
    
    const letters = ['D', 'O', 'G', 'A', 'B', 'C', 'X'];
    const letterPool = document.getElementById('letterPool');
    
    letters.forEach(letter => {
        const letterTile = document.createElement('div');
        letterTile.className = 'letter-tile';
        letterTile.textContent = letter;
        letterTile.onclick = () => addLetterToWord(letter, letterTile);
        letterPool.appendChild(letterTile);
    });
    
    gameState.currentWord = [];
    gameState.targetWord = ['D', 'O', 'G'];
    startGameTimer(60);
}

function startStoryTimeGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <h3>📚 Story Time</h3>
        <div class="story-content">
            <div class="story-image">🐰🌳</div>
            <div class="story-text" id="storyText">
                Once upon a time, there was a little bunny named Benny...
            </div>
            <button class="story-btn" onclick="continueStory()">Continue Story</button>
        </div>
        <div class="story-questions" id="storyQuestions" style="display: none;">
            <h4>What did you learn?</h4>
            <div class="question-options">
                <button onclick="answerStoryQuestion(true)">Benny was a bunny</button>
                <button onclick="answerStoryQuestion(false)">Benny was a cat</button>
            </div>
        </div>
    `;
    
    startGameTimer(120);
}

// EVS Games Implementation
function startFamilyTreeGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <h3>👨‍👩‍👧‍👦 My Family Tree</h3>
        <p>Build your family tree by placing family members!</p>
        <div class="family-tree" id="familyTree">
            <div class="tree-level" id="grandparents">
                <div class="drop-zone">Grandpa</div>
                <div class="drop-zone">Grandma</div>
            </div>
            <div class="tree-level" id="parents">
                <div class="drop-zone">Dad</div>
                <div class="drop-zone">Mom</div>
            </div>
            <div class="tree-level" id="children">
                <div class="drop-zone">Me</div>
                <div class="drop-zone">Sister/Brother</div>
            </div>
        </div>
        <div class="family-members" id="familyMembers">
            <div class="family-member" onclick="placeFamilyMember(this, 'dad')">👨 Dad</div>
            <div class="family-member" onclick="placeFamilyMember(this, 'mom')">👩 Mom</div>
            <div class="family-member" onclick="placeFamilyMember(this, 'me')">🧒 Me</div>
            <div class="family-member" onclick="placeFamilyMember(this, 'grandpa')">👴 Grandpa</div>
        </div>
    `;
    
    startGameTimer(90);
}

function startGoodHabitsGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <h3>⭐ Good Habits Wheel</h3>
        <p>Spin the wheel to learn about good habits!</p>
        <div class="habits-wheel" id="habitsWheel" onclick="spinWheel()">
            <div class="wheel-center">🎯</div>
            <div class="wheel-pointer">👆</div>
        </div>
        <div class="habit-display" id="habitDisplay">Click the wheel to spin!</div>
    `;
    
    gameState.habits = [
        'Brush your teeth twice daily! 🦷',
        'Wash your hands before eating! 🧼',
        'Say please and thank you! 🙏',
        'Help others when they need it! 🤝',
        'Keep your room clean and tidy! 🧹',
        'Exercise and play outside! 🏃‍♂️'
    ];
    
    startGameTimer(60);
}

function startSafetyGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <h3>🚦 Safety First Game</h3>
        <p>Choose the SAFE action in each situation!</p>
        <div class="safety-scenario" id="safetyScenario">
            <div class="scenario-image">🚦</div>
            <div class="scenario-text" id="scenarioText"></div>
            <div class="safety-options" id="safetyOptions"></div>
        </div>
        <div class="safety-score">Safe Choices: <span id="safeChoices">0</span>/5</div>
    `;
    
    gameState.safetyScenarios = [
        {
            text: "You want to cross the road. What should you do?",
            options: ["Run across quickly", "Look both ways and use crosswalk"],
            correct: 1
        },
        {
            text: "A stranger offers you candy. What should you do?",
            options: ["Take the candy", "Say no and tell a trusted adult"],
            correct: 1
        }
    ];
    
    gameState.currentScenario = 0;
    gameState.safeChoices = 0;
    showSafetyScenario();
    startGameTimer(120);
}

function startSeasonsGame() {
    const gameArea = document.getElementById('gameArea');
    gameArea.innerHTML = `
        <h3>🌦️ Seasons Dress-Up</h3>
        <p>Help Benny dress for different seasons!</p>
        <div class="seasons-game">
            <div class="season-display" id="seasonDisplay">
                <div class="season-icon" id="seasonIcon">☀️</div>
                <div class="season-name" id="seasonName">Summer</div>
            </div>
            <div class="character-dress" id="characterDress">🐰</div>
            <div class="clothing-options" id="clothingOptions">
                <div class="clothing-item" onclick="dressCharacter('summer-clothes')">👕 T-shirt</div>
                <div class="clothing-item" onclick="dressCharacter('winter-clothes')">🧥 Jacket</div>
                <div class="clothing-item" onclick="dressCharacter('rain-clothes')">☂️ Umbrella</div>
            </div>
        </div>
    `;
    
    gameState.currentSeason = 'summer';
    gameState.seasonsCompleted = 0;
    startGameTimer(90);
}

// Game Logic Functions
function checkNumberOrder(number) {
    playSound('click');
    // Implementation for number ordering logic
    if (number === gameState.expectedNumber || 1) {
        gameState.gameScore += 10;
        updateGameScore();
        
        // Check if game is complete
        if (gameState.gameScore >= 50) {
            endGame(true);
        }
    }
}

function checkShape(clickedShape, targetShape, element) {
    if (clickedShape === targetShape) {
        gameState.shapesFound++;
        element.style.background = '#2ECC71';
        element.style.transform = 'scale(1.2)';
        document.getElementById('shapesFound').textContent = gameState.shapesFound;
        playSound('correct');
        
        if (gameState.shapesFound >= 3) {
            endGame(true);
        }
    } else {
        element.style.background = '#E74C3C';
        setTimeout(() => {
            element.style.background = 'rgba(255,255,255,0.8)';
        }, 500);
        playSound('incorrect');
    }
}

function generateAdditionProblem() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const correctAnswer = num1 + num2;
    
    document.getElementById('problemDisplay').innerHTML = `
        <div class="math-problem">${num1} + ${num2} = ?</div>
    `;
    
    const options = [correctAnswer];
    while (options.length < 4) {
        const wrongAnswer = Math.floor(Math.random() * 20) + 1;
        if (!options.includes(wrongAnswer)) {
            options.push(wrongAnswer);
        }
    }
    
    // Shuffle options
    options.sort(() => Math.random() - 0.5);
    
    const optionsContainer = document.getElementById('answerOptions');
    optionsContainer.innerHTML = '';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'answer-option';
        button.textContent = option;
        button.onclick = () => checkAdditionAnswer(option, correctAnswer);
        optionsContainer.appendChild(button);
    });
    
    gameState.currentProblem = { num1, num2, correctAnswer };
}

function checkAdditionAnswer(selected, correct) {
    if (selected === correct) {
        gameState.gameScore += 10;
        updateGameScore();
        playSound('correct');
        
        // Move player forward
        const player = document.getElementById('player');
        const currentLeft = parseInt(player.style.left) || 0;
        player.style.left = (currentLeft + 50) + 'px';
        
        if (gameState.gameScore >= 50) {
            endGame(true);
        } else {
            setTimeout(generateAdditionProblem, 1000);
        }
    } else {
        playSound('incorrect');
        // Move opponent forward
        const opponent = document.getElementById('opponent');
        const currentLeft = parseInt(opponent.style.left) || 0;
        opponent.style.left = (currentLeft + 25) + 'px';
    }
}

function generateCoinProblem() {
    const coins = [
        { value: 1, symbol: '🪙', name: '1 Rupee' },
        { value: 2, symbol: '🪙', name: '2 Rupee' },
        { value: 5, symbol: '🪙', name: '5 Rupee' }
    ];
    
    const selectedCoins = [];
    const numCoins = Math.floor(Math.random() * 4) + 2;
    let totalValue = 0;
    
    for (let i = 0; i < numCoins; i++) {
        const coin = coins[Math.floor(Math.random() * coins.length)];
        selectedCoins.push(coin);
        totalValue += coin.value;
    }
    
    const coinDisplay = document.getElementById('coinDisplay');
    coinDisplay.innerHTML = selectedCoins.map(coin => 
        `<div class="coin">${coin.symbol}</div>`
    ).join('');
    
    const options = [totalValue];
    while (options.length < 4) {
        const wrongValue = Math.floor(Math.random() * 20) + 1;
        if (!options.includes(wrongValue)) {
            options.push(wrongValue);
        }
    }
    
    options.sort(() => Math.random() - 0.5);
    
    const optionsContainer = document.getElementById('valueOptions');
    optionsContainer.innerHTML = '';
    
    options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'value-option';
        button.textContent = `₹${option}`;
        button.onclick = () => checkCoinAnswer(option, totalValue);
        optionsContainer.appendChild(button);
    });
}

function checkCoinAnswer(selected, correct) {
    if (selected === correct) {
        gameState.gameScore += 15;
        updateGameScore();
        playSound('correct');
        
        if (gameState.gameScore >= 60) {
            endGame(true);
        } else {
            setTimeout(generateCoinProblem, 1500);
        }
    } else {
        playSound('incorrect');
    }
}

function startFallingLetters(letters) {
    const catchArea = document.getElementById('catchArea');
    
    setInterval(() => {
        if (gameState.currentScreen === 'gameScreen') {
            const letter = letters[Math.floor(Math.random() * letters.length)];
            const fallingLetter = document.createElement('div');
            fallingLetter.className = 'falling-letter';
            fallingLetter.textContent = letter;
            fallingLetter.style.left = Math.random() * 80 + '%';
            fallingLetter.onclick = () => catchLetter(letter, fallingLetter);
            
            catchArea.appendChild(fallingLetter);
            
            // Remove letter after animation
            setTimeout(() => {
                if (fallingLetter.parentNode) {
                    fallingLetter.parentNode.removeChild(fallingLetter);
                }
            }, 3000);
        }
    }, 2000);
}

function catchLetter(letter, element) {
    if (gameState.wordTarget.includes(letter) && !gameState.caughtLetters.includes(letter)) {
        gameState.caughtLetters.push(letter);
        element.remove();
        updateWordProgress();
        playSound('correct');
        
        if (gameState.caughtLetters.length === gameState.wordTarget.length) {
            endGame(true);
        }
    }
}

function updateWordProgress() {
    const progress = gameState.wordTarget.map(letter => 
        gameState.caughtLetters.includes(letter) ? letter : '_'
    ).join('');
    document.getElementById('wordProgress').textContent = progress;
}

function createFloatingBubbles(words, targetSound) {
    const bubbleArea = document.getElementById('bubbleArea');
    
    words.forEach((word, index) => {
        setTimeout(() => {
            const bubble = document.createElement('div');
            bubble.className = 'bubble';
            bubble.textContent = word;
            bubble.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
            bubble.style.left = Math.random() * 80 + '%';
            bubble.style.top = Math.random() * 70 + '%';
            bubble.onclick = () => popBubble(word, targetSound, bubble);
            
            bubbleArea.appendChild(bubble);
        }, index * 1000);
    });
}

function popBubble(word, targetSound, element) {
    if (word.startsWith(targetSound)) {
        gameState.bubblesPopped++;
        document.getElementById('bubblesPopped').textContent = gameState.bubblesPopped;
        element.style.transform = 'scale(1.5)';
        element.style.opacity = '0';
        playSound('correct');
        
        setTimeout(() => element.remove(), 500);
        
        if (gameState.bubblesPopped >= 5) {
            endGame(true);
        }
    } else {
        element.style.background = '#E74C3C';
        playSound('incorrect');
        setTimeout(() => {
            element.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
        }, 500);
    }
}

function addLetterToWord(letter, element) {
    if (gameState.currentWord.length < gameState.targetWord.length) {
        gameState.currentWord.push(letter);
        element.style.opacity = '0.5';
        element.onclick = null;
        
        const wordArea = document.getElementById('wordArea');
        const letterDiv = document.createElement('div');
        letterDiv.className = 'letter-tile';
        letterDiv.textContent = letter;
        wordArea.appendChild(letterDiv);
        
        playSound('click');
        
        if (gameState.currentWord.length === gameState.targetWord.length) {
            checkWordCompletion();
        }
    }
}

function checkWordCompletion() {
    const isCorrect = gameState.currentWord.every((letter, index) => 
        letter === gameState.targetWord[index]
    );
    
    if (isCorrect) {
        endGame(true);
    } else {
        // Reset word
        setTimeout(() => {
            gameState.currentWord = [];
            document.getElementById('wordArea').innerHTML = '';
            // Restore letter tiles
            document.querySelectorAll('.letter-tile').forEach(tile => {
                tile.style.opacity = '1';
                tile.onclick = () => addLetterToWord(tile.textContent, tile);
            });
        }, 1000);
        playSound('incorrect');
    }
}

function continueStory() {
    const storyText = document.getElementById('storyText');
    const storyQuestions = document.getElementById('storyQuestions');
    
    storyText.textContent = "Benny loved to hop around the forest and make new friends. He learned to share his carrots with other animals.";
    
    setTimeout(() => {
        storyQuestions.style.display = 'block';
    }, 2000);
}

function answerStoryQuestion(isCorrect) {
    if (isCorrect) {
        playSound('correct');
        endGame(true);
    } else {
        playSound('incorrect');
        // Show correct answer
        setTimeout(() => {
            alert("That's okay! Benny was indeed a bunny. Great try!");
            endGame(true);
        }, 500);
    }
}

function placeFamilyMember(element, memberType) {
    element.style.opacity = '0.5';
    element.onclick = null;
    gameState.gameScore += 10;
    updateGameScore();
    playSound('correct');
    
    if (gameState.gameScore >= 40) {
        endGame(true);
    }
}

function spinWheel() {
    const wheel = document.getElementById('habitsWheel');
    const habitDisplay = document.getElementById('habitDisplay');
    
    wheel.style.transform = `rotate(${Math.random() * 360 + 720}deg)`;
    wheel.style.transition = 'transform 2s ease-out';
    
    setTimeout(() => {
        const randomHabit = gameState.habits[Math.floor(Math.random() * gameState.habits.length)];
        habitDisplay.textContent = randomHabit;
        gameState.gameScore += 10;
        updateGameScore();
        playSound('correct');
        
        if (gameState.gameScore >= 60) {
            endGame(true);
        }
    }, 2000);
}

function showSafetyScenario() {
    const scenario = gameState.safetyScenarios[gameState.currentScenario];
    if (!scenario) {
        endGame(true);
        return;
    }
    
    document.getElementById('scenarioText').textContent = scenario.text;
    
    const optionsContainer = document.getElementById('safetyOptions');
    optionsContainer.innerHTML = '';
    
    scenario.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'safety-option';
        button.textContent = option;
        button.onclick = () => checkSafetyAnswer(index, scenario.correct);
        optionsContainer.appendChild(button);
    });
}

function checkSafetyAnswer(selected, correct) {
    if (selected === correct) {
        gameState.safeChoices++;
        document.getElementById('safeChoices').textContent = gameState.safeChoices;
        playSound('correct');
    } else {
        playSound('incorrect');
    }
    
    gameState.currentScenario++;
    setTimeout(showSafetyScenario, 1500);
}

function dressCharacter(clothingType) {
    const isCorrect = (gameState.currentSeason === 'summer' && clothingType === 'summer-clothes') ||
                      (gameState.currentSeason === 'winter' && clothingType === 'winter-clothes') ||
                      (gameState.currentSeason === 'rain' && clothingType === 'rain-clothes');
    
    if (isCorrect) {
        gameState.seasonsCompleted++;
        gameState.gameScore += 15;
        updateGameScore();
        playSound('correct');
        
        if (gameState.seasonsCompleted >= 3) {
            endGame(true);
        } else {
            // Change season
            const seasons = ['summer', 'winter', 'rain'];
            gameState.currentSeason = seasons[gameState.seasonsCompleted];
            updateSeasonDisplay();
        }
    } else {
        playSound('incorrect');
    }
}

function updateSeasonDisplay() {
    const seasonIcons = { summer: '☀️', winter: '❄️', rain: '🌧️' };
    const seasonNames = { summer: 'Summer', winter: 'Winter', rain: 'Rainy' };
    
    document.getElementById('seasonIcon').textContent = seasonIcons[gameState.currentSeason];
    document.getElementById('seasonName').textContent = seasonNames[gameState.currentSeason];
}

// Game Timer Functions
function startGameTimer(seconds) {
    gameState.gameScore = 0;
    updateGameScore();
    
    let timeLeft = seconds;
    document.getElementById('gameTimer').textContent = `⏰ ${timeLeft}`;
    
    gameState.gameTimer = setInterval(() => {
        timeLeft--;
        document.getElementById('gameTimer').textContent = `⏰ ${timeLeft}`;
        
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);
}

function updateGameScore() {
    document.getElementById('gameScore').textContent = `Score: ${gameState.gameScore}`;
}

function endGame(success) {
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    
    const stars = success ? Math.min(3, Math.floor(gameState.gameScore / 20) + 1) : 0;
    gameState.totalStars += stars;
    
    // Update progress
    if (success) {
        if (gameState.currentZone) {
            gameState.progress[gameState.currentZone] += 10;
            gameState.progress[gameState.currentZone] = Math.min(100, gameState.progress[gameState.currentZone]);
        }
    }
    
    showSuccessScreen(stars, success);
    updateProgressBar();
    updateStarsCount();
    saveGameProgress();
}

function showSuccessScreen(stars, success) {
    const successScreen = document.getElementById('successScreen');
    const starsEarned = document.getElementById('starsEarned');
    const successMessage = document.getElementById('successMessage');
    
    if (success) {
        starsEarned.innerHTML = '⭐'.repeat(stars);
        successMessage.textContent = `Fantastic! You earned ${stars} star${stars !== 1 ? 's' : ''}!`;
        playSound('success');
    } else {
        starsEarned.innerHTML = '😊';
        successMessage.textContent = "Good try! Practice makes perfect!";
        playSound('try-again');
    }
    
    showScreen('successScreen');
}

function playAgain() {
    if (gameState.currentGame && gameState.currentZone) {
        if (gameState.currentZone === 'math') {
            playMathGame(gameState.currentGame);
        } else if (gameState.currentZone === 'english') {
            playEnglishGame(gameState.currentGame);
        } else if (gameState.currentZone === 'evs') {
            playEVSGame(gameState.currentGame);
        }
    }
}

// UI Update Functions
function updateProgressBar() {
    const totalProgress = (gameState.progress.math + gameState.progress.english + gameState.progress.evs) / 3;
    document.getElementById('progressFill').style.width = totalProgress + '%';
}

function updateStarsCount() {
    document.getElementById('starsCount').textContent = gameState.totalStars;
}

function updateZoneProgress() {
    // Update progress dots for each zone
    const zones = ['math', 'english', 'evs'];
    zones.forEach(zone => {
        const progress = gameState.progress[zone];
        const dots = document.querySelectorAll(`.${zone}-zone .dot`);
        dots.forEach((dot, index) => {
            if (progress > index * 33) {
                dot.classList.add('completed');
            }
        });
    });
}

function updateSpeechBubble(bubbleId, message) {
    document.getElementById(bubbleId).textContent = message;
}

function updateParentDashboard() {
    const zones = ['math', 'english', 'evs'];
    zones.forEach(zone => {
        const progress = gameState.progress[zone];
        const fillElement = document.querySelector(`.stat-card:nth-child(${zones.indexOf(zone) + 1}) .stat-fill`);
        const textElement = document.querySelector(`.stat-card:nth-child(${zones.indexOf(zone) + 1}) .stat-text`);
        
        if (fillElement && textElement) {
            fillElement.style.width = progress + '%';
            textElement.textContent = `${progress}% Complete`;
        }
    });
}

// Audio Functions
function initializeAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
        console.log('Audio not supported');
    }
}

function playSound(soundType) {
    if (!audioContext) return;
    
    const frequency = {
        'welcome': 440,
        'map': 523,
        'zone-enter': 659,
        'click': 800,
        'correct': 880,
        'incorrect': 220,
        'success': 1000,
        'try-again': 330,
        'bunny': 500,
        'owl': 600,
        'fox': 700
    };
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency[soundType] || 440, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
}

function toggleMusic() {
    const musicToggle = document.querySelector('.music-toggle');
    
    if (gameState.musicPlaying) {
        musicToggle.style.opacity = '0.5';
        gameState.musicPlaying = false;
    } else {
        musicToggle.style.opacity = '1';
        gameState.musicPlaying = true;
    }
}

// Save/Load Functions
function saveGameProgress() {
    const saveData = {
        totalStars: gameState.totalStars,
        progress: gameState.progress,
        timestamp: Date.now()
    };
    
    // In a real implementation, this would save to a backend
    // For now, we'll use a simple in-memory storage
    window.gameData = saveData;
}

function loadGameProgress() {
    // In a real implementation, this would load from a backend
    if (window.gameData) {
        gameState.totalStars = window.gameData.totalStars || 0;
        gameState.progress = window.gameData.progress || { math: 0, english: 0, evs: 0 };
    }
}

// Initialize game when page loads
window.addEventListener('load', initializeGame);
// ...existing code...

// --- Enhanced Music Toggle ---
function toggleMusic() {
    const music = document.getElementById('backgroundMusic');
    const toggle = document.getElementById('musicToggle');
    if (!music) return;

    if (music.paused) {
        music.play();
        gameState.musicPlaying = true;
        toggle.textContent = '🔊';
        toggle.title = 'Mute background music';
        toggle.setAttribute('aria-label', 'Mute background music');
        toggle.style.opacity = '1';
    } else {
        music.pause();
        gameState.musicPlaying = false;
        toggle.textContent = '🔇';
        toggle.title = 'Unmute background music';
        toggle.setAttribute('aria-label', 'Unmute background music');
        toggle.style.opacity = '0.5';
    }
}

// --- Keyboard Accessibility for Music Toggle ---
document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('musicToggle');
    if (toggle) {
        toggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleMusic();
            }
        });
    }
});

// --- Prevent Multiple Falling Letter Timers ---
let fallingLettersInterval = null;
function startFallingLetters(letters) {
    const catchArea = document.getElementById('catchArea');
    if (fallingLettersInterval) clearInterval(fallingLettersInterval);

    fallingLettersInterval = setInterval(() => {
        if (gameState.currentScreen === 'gameScreen') {
            const letter = letters[Math.floor(Math.random() * letters.length)];
            const fallingLetter = document.createElement('div');
            fallingLetter.className = 'falling-letter';
            fallingLetter.textContent = letter;
            fallingLetter.style.left = Math.random() * 80 + '%';
            fallingLetter.onclick = () => catchLetter(letter, fallingLetter);
            fallingLetter.tabIndex = 0;
            fallingLetter.setAttribute('role', 'button');
            fallingLetter.setAttribute('aria-label', `Catch letter ${letter}`);
            fallingLetter.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    catchLetter(letter, fallingLetter);
                }
            });

            catchArea.appendChild(fallingLetter);

            setTimeout(() => {
                if (fallingLetter.parentNode) {
                    fallingLetter.parentNode.removeChild(fallingLetter);
                }
            }, 3000);
        }
    }, 2000);
}

// --- Reset Progress Dots on Map ---
function updateZoneProgress() {
    // Update progress dots for each zone
    const zones = ['math', 'english', 'evs'];
    zones.forEach(zone => {
        const progress = gameState.progress[zone];
        const dots = document.querySelectorAll(`.${zone}-zone .dot`);
        dots.forEach((dot, index) => {
            if (progress > index * 33) {
                dot.classList.add('completed');
            } else {
                dot.classList.remove('completed');
            }
        });
    });
}

// ...existing code...