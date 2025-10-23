// Gemini API Integration
// Note: Store your API key securely in environment variables in production

class GeminiAPI {
  constructor() {
      // In production, use environment variables or server-side proxy
      this.API_KEY = "AIzaSyC61jvb6IsanXHjAmp5HrovG9t3NuLGARs";
      this.BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models";
      this.initialized = false;
      this.initialize();
  }

  async initialize() {
      try {
          // Test API connection
          await this.testConnection();
          this.initialized = true;
          console.log('Gemini API initialized successfully');
      } catch (error) {
          console.error('Failed to initialize Gemini API:', error);
          this.initialized = false;
      }
  }

  async testConnection() {
      if (!this.API_KEY || this.API_KEY === "YOUR_API_KEY_HERE") {
          throw new Error('API key not configured');
      }

      const url = `${this.BASE_URL}/gemini-pro:generateContent?key=${this.API_KEY}`;
      
      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                  contents: [{
                      parts: [{
                          text: "Hello, this is a test message."
                      }]
                  }]
              })
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(`API test failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
          }

          return true;
      } catch (error) {
          console.error('API test connection failed:', error);
          throw error;
      }
  }

  async generateTextResponse(prompt, options = {}) {
      if (!this.initialized) {
          throw new Error('Gemini API not initialized');
      }

      if (!prompt || typeof prompt !== 'string') {
          throw new Error('Invalid prompt provided');
      }

      const url = `${this.BASE_URL}/gemini-pro:generateContent?key=${this.API_KEY}`;
      
      const requestBody = {
          contents: [{
              parts: [{
                  text: this.enhancePrompt(prompt, options)
              }]
          }],
          generationConfig: {
              temperature: options.temperature || 0.7,
              topK: options.topK || 40,
              topP: options.topP || 0.95,
              maxOutputTokens: options.maxTokens || 2048,
          },
          safetySettings: [
              {
                  category: "HARM_CATEGORY_HARASSMENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                  category: "HARM_CATEGORY_HATE_SPEECH",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                  category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
              },
              {
                  category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                  threshold: "BLOCK_MEDIUM_AND_ABOVE"
              }
          ]
      };

      try {
          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
          }

          const data = await response.json();
          
          if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
              throw new Error('Invalid response format from API');
          }

          const text = data.candidates[0].content.parts[0].text;
          return text || 'No response generated';
      } catch (error) {
          console.error('Error generating text response:', error);
          throw error;
      }
  }

  async generateImageResponse(imageFile, prompt = null, options = {}) {
      if (!this.initialized) {
          throw new Error('Gemini API not initialized');
      }

      if (!imageFile || !(imageFile instanceof File)) {
          throw new Error('Invalid image file provided');
      }

      // Validate file size (max 5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
          throw new Error('Image file size must be less than 5MB');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(imageFile.type)) {
          throw new Error('Only JPEG, PNG, and WebP images are supported');
      }

      const url = `${this.BASE_URL}/gemini-pro-vision:generateContent?key=${this.API_KEY}`;
      
      try {
          const base64Image = await this.fileToBase64(imageFile);
          
          const requestBody = {
              contents: [{
                  parts: [
                      {
                          text: prompt || "Please analyze this image and provide a detailed explanation."
                      },
                      {
                          inlineData: {
                              mimeType: imageFile.type,
                              data: base64Image
                          }
                      }
                  ]
              }],
              generationConfig: {
                  temperature: options.temperature || 0.7,
                  topK: options.topK || 40,
                  topP: options.topP || 0.95,
                  maxOutputTokens: options.maxTokens || 2048,
              },
              safetySettings: [
                  {
                      category: "HARM_CATEGORY_HARASSMENT",
                      threshold: "BLOCK_MEDIUM_AND_ABOVE"
                  },
                  {
                      category: "HARM_CATEGORY_HATE_SPEECH",
                      threshold: "BLOCK_MEDIUM_AND_ABOVE"
                  },
                  {
                      category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                      threshold: "BLOCK_MEDIUM_AND_ABOVE"
                  },
                  {
                      category: "HARM_CATEGORY_DANGEROUS_CONTENT",
                      threshold: "BLOCK_MEDIUM_AND_ABOVE"
                  }
              ]
          };

          const response = await fetch(url, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody)
          });

          if (!response.ok) {
              const errorData = await response.json().catch(() => ({}));
              throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
          }

          const data = await response.json();
          
          if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
              throw new Error('Invalid response format from API');
          }

          const text = data.candidates[0].content.parts[0].text;
          return text || 'No response generated';
      } catch (error) {
          console.error('Error generating image response:', error);
          throw error;
      }
  }

  async fileToBase64(file) {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
              const base64 = reader.result.split(',')[1];
              resolve(base64);
          };
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
      });
  }

  enhancePrompt(originalPrompt, options = {}) {
      let enhancedPrompt = originalPrompt;

      // Add context based on options
      if (options.context) {
          enhancedPrompt = `Context: ${options.context}\n\nQuestion: ${enhancedPrompt}`;
      }

      // Add educational context for student questions
      if (options.isEducational) {
          enhancedPrompt = `You are a helpful educational assistant. Please provide a clear, step-by-step explanation that a student can easily understand. Use simple language and include examples when helpful.\n\nQuestion: ${enhancedPrompt}`;
      }

      // Add specific instructions for different types of questions
      if (options.questionType === 'math') {
          enhancedPrompt = `This is a mathematics question. Please provide a step-by-step solution with clear explanations for each step. Show your work and explain the reasoning behind each step.\n\nQuestion: ${enhancedPrompt}`;
      } else if (options.questionType === 'science') {
          enhancedPrompt = `This is a science question. Please provide a comprehensive explanation with relevant scientific concepts, examples, and real-world applications.\n\nQuestion: ${enhancedPrompt}`;
      } else if (options.questionType === 'history') {
          enhancedPrompt = `This is a history question. Please provide historical context, key events, and their significance. Include relevant dates and important figures.\n\nQuestion: ${enhancedPrompt}`;
      }

      // Add formatting instructions
      enhancedPrompt += '\n\nPlease format your response in a clear, organized manner with proper paragraphs and bullet points where appropriate.';

      return enhancedPrompt;
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
      return this.API_KEY && this.API_KEY !== "YOUR_API_KEY_HERE" && this.API_KEY.length > 0;
  }

  getUsageStats() {
      const stats = localStorage.getItem('gemini_api_usage') || '{}';
      return JSON.parse(stats);
  }

  incrementUsageStats(type) {
      const stats = this.getUsageStats();
      const today = new Date().toISOString().split('T')[0];
      
      if (!stats[today]) {
          stats[today] = { text: 0, image: 0 };
      }
      
      stats[today][type] = (stats[today][type] || 0) + 1;
      localStorage.setItem('gemini_api_usage', JSON.stringify(stats));
  }
}

// Initialize Gemini API
let geminiAPI;

document.addEventListener('DOMContentLoaded', function() {
    try {
        geminiAPI = new GeminiAPI();
        window.geminiAPI = geminiAPI;
        console.log('Gemini API instance created');
    } catch (error) {
        console.error('Failed to create Gemini API instance:', error);
        // Create fallback
        window.geminiAPI = {
            generateTextResponse: async () => {
                throw new Error('Gemini API not available');
            },
            generateImageResponse: async () => {
                throw new Error('Gemini API not available');
            }
        };
    }
});

// Global functions for easy access
window.askDoubt = async function(question, options = {}) {
    try {
        if (!window.geminiAPI) {
            throw new Error('Gemini API not available');
        }
        
        const response = await window.geminiAPI.generateTextResponse(question, {
            isEducational: true,
            ...options
        });
        
        window.geminiAPI.incrementUsageStats('text');
        return response;
    } catch (error) {
        console.error('Error asking doubt:', error);
        throw error;
    }
};

window.askDoubtWithImage = async function(imageFile, customPrompt = null, options = {}) {
    try {
        if (!window.geminiAPI) {
            throw new Error('Gemini API not available');
        }
        
        const response = await window.geminiAPI.generateImageResponse(imageFile, customPrompt, {
            isEducational: true,
            ...options
        });
        
        window.geminiAPI.incrementUsageStats('image');
        return response;
    } catch (error) {
        console.error('Error asking doubt with image:', error);
        throw error;
    }
};