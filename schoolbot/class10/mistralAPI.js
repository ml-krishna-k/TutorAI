// Mistral API Integration for Class 10
// Educational AI Assistant for Class 10 Students

class MistralAPI {
    constructor() {
        // Replace with your actual Mistral API key
        this.API_KEY = "bm6mLT7YDTbCZGGWWmE0cOPFhHD4Wqms";
        this.BASE_URL = "https://api.mistral.ai/v1/chat/completions";
        this.initialized = false;
        this.initialize();
    }

    async initialize() {
        try {
            // Test API connection
            await this.testConnection();
            this.initialized = true;
            console.log('Class 10 Mistral API initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Class 10 Mistral API:', error);
            this.initialized = false;
        }
    }

    async testConnection() {
        if (!this.API_KEY || this.API_KEY === "YOUR_MISTRAL_API_KEY_HERE") {
            throw new Error('API key not configured. Please add your Mistral API key.');
        }

        console.log('Testing API connection with key:', this.API_KEY.substring(0, 10) + '...');

        try {
            const response = await fetch(this.BASE_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    model: "mistral-medium",
                    messages: [
                        {
                            role: "user",
                            content: "Hello, this is a test message for Class 10."
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API test failed:', response.status, response.statusText, errorData);
                throw new Error(`API test failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
            }

            console.log('API connection test successful');
            return true;
        } catch (error) {
            console.error('API test connection failed:', error);
            throw error;
        }
    }

    async generateTextResponse(prompt, options = {}) {
        if (!this.initialized) {
            throw new Error('Mistral API not initialized');
        }

        if (!prompt || typeof prompt !== 'string') {
            throw new Error('Invalid prompt provided');
        }

        const requestBody = {
            model: options.model || "mistral-medium",
            messages: [
                {
                    role: "user",
                    content: this.enhancePrompt(prompt, options)
                }
            ],
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 2048,
            top_p: options.topP || 0.95
        };

        try {
            const response = await fetch(this.BASE_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error('API request failed:', response.status, response.statusText, errorData);
                throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
            }

            const data = await response.json();

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid response format from API');
            }

            const text = data.choices[0].message.content;
            return text || 'No response generated';
        } catch (error) {
            console.error('Error generating text response:', error);
            throw error;
        }
    }

    // Note: Mistral doesn't support image analysis in the same way as Gemini
    // This is a placeholder that will inform users about the limitation
    async generateImageResponse(imageFile, prompt = null, options = {}) {
        throw new Error('Image analysis is not supported by Mistral API. Please ask your question in text format instead.');
    }

    enhancePrompt(originalPrompt, options = {}) {
        let enhancedPrompt = originalPrompt;

        // Add Class 10 educational context
        enhancedPrompt = `You are a helpful educational assistant for Class 10 students. Please provide clear, step-by-step explanations that a Class 10 student can easily understand. Use simple language, include examples when helpful, and focus on CBSE/ICSE curriculum topics.

Key subjects for Class 10:
- Mathematics: Algebra, Geometry, Trigonometry, Statistics
- Science: Physics, Chemistry, Biology
- Social Science: History, Geography, Civics, Economics
- English: Literature, Grammar, Writing
- Hindi: Vyakaran, Sahitya

Please format your response in a clear, organized manner with proper paragraphs and bullet points where appropriate.

Question: ${enhancedPrompt}`;

        // Add specific instructions for different types of questions
        if (options.questionType === 'math') {
            enhancedPrompt = `This is a Class 10 mathematics question. Please provide a step-by-step solution with clear explanations for each step. Show your work and explain the reasoning behind each step. Include relevant formulas and concepts from the Class 10 curriculum.

Question: ${enhancedPrompt}`;
        } else if (options.questionType === 'science') {
            enhancedPrompt = `This is a Class 10 science question. Please provide a comprehensive explanation with relevant scientific concepts, examples, and real-world applications suitable for Class 10 students.

Question: ${enhancedPrompt}`;
        } else if (options.questionType === 'history') {
            enhancedPrompt = `This is a Class 10 history question. Please provide historical context, key events, and their significance. Include relevant dates and important figures from the Class 10 curriculum.

Question: ${enhancedPrompt}`;
        }

        return enhancedPrompt;
    }

    detectQuestionType(question) {
        const mathKeywords = ['solve', 'calculate', 'equation', 'formula', 'math', 'mathematics', 'algebra', 'geometry', 'trigonometry', 'calculus', 'quadratic', 'polynomial'];
        const scienceKeywords = ['science', 'physics', 'chemistry', 'biology', 'experiment', 'molecule', 'atom', 'reaction', 'photosynthesis', 'respiration'];
        const historyKeywords = ['history', 'historical', 'war', 'battle', 'king', 'queen', 'empire', 'ancient', 'medieval', 'independence'];

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

    async withRetry(apiCall, maxRetries = 3, baseDelay = 1000) {
        let lastError;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await apiCall();
            } catch (error) {
                lastError = error;

                // Don't retry on certain errors
                if (error.message.includes('API key') || error.message.includes('quota')) {
                    throw error;
                }

                if (attempt < maxRetries) {
                    const delay = baseDelay * Math.pow(2, attempt - 1);
                    console.log(`API call failed, retrying in ${delay}ms... (attempt ${attempt}/${maxRetries})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }

        throw lastError;
    }

    validateApiKey() {
        return this.API_KEY && this.API_KEY !== "YOUR_MISTRAL_API_KEY_HERE" && this.API_KEY.length > 0;
    }

    getUsageStats() {
        const stats = localStorage.getItem('class10_mistral_api_usage') || '{}';
        return JSON.parse(stats);
    }

    incrementUsageStats(type) {
        const stats = this.getUsageStats();
        const today = new Date().toISOString().split('T')[0];

        if (!stats[today]) {
            stats[today] = { text: 0, image: 0 };
        }

        stats[today][type] = (stats[today][type] || 0) + 1;
        localStorage.setItem('class10_mistral_api_usage', JSON.stringify(stats));
    }
}

// Initialize Mistral API for Class 10
let class10MistralAPI;

document.addEventListener('DOMContentLoaded', function() {
    try {
        class10MistralAPI = new MistralAPI();
        window.class10MistralAPI = class10MistralAPI;
        console.log('Class 10 Mistral API instance created');

        // Wait for initialization to complete
        setTimeout(() => {
            if (window.class10MistralAPI && window.class10MistralAPI.initialized) {
                console.log('✅ Class 10 Mistral API initialized successfully');
            } else {
                console.error('❌ Class 10 Mistral API failed to initialize');
            }
        }, 3000);
    } catch (error) {
        console.error('Failed to create Class 10 Mistral API instance:', error);

        // Create fallback
        window.class10MistralAPI = {
            initialized: false,
            generateTextResponse: async () => {
                throw new Error('Class 10 Mistral API not available. Please add your API key.');
            },
            generateImageResponse: async () => {
                throw new Error('Class 10 Mistral API not available. Please add your API key.');
            }
        };
    }
});

// Global functions for Class 10 doubt resolution
window.askClass10Doubt = async function(question, options = {}) {
    try {
        if (!window.class10MistralAPI) {
            throw new Error('Class 10 Mistral API not available');
        }

        const response = await window.class10MistralAPI.generateTextResponse(question, {
            isEducational: true,
            questionType: window.class10MistralAPI.detectQuestionType(question),
            ...options
        });

        window.class10MistralAPI.incrementUsageStats('text');
        return response;
    } catch (error) {
        console.error('Error asking Class 10 doubt:', error);
        throw error;
    }
};

window.askClass10DoubtWithImage = async function(imageFile, customPrompt = null, options = {}) {
    try {
        if (!window.class10MistralAPI) {
            throw new Error('Class 10 Mistral API not available');
        }

        // Since Mistral doesn't support images, we'll inform the user
        throw new Error('Image analysis is not supported by Mistral API. Please describe your question in text format instead.');
    } catch (error) {
        console.error('Error asking Class 10 doubt with image:', error);
        throw error;
    }
};