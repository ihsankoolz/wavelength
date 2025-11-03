<template>
  <div class="ai-chatbot-container">
    <!-- Floating Chat Button -->
    <button
      v-if="!isOpen && isLoggedIn"
      class="chat-toggle-btn"
      @click="toggleChat"
      :title="'Chat with Pulse - AI Music Assistant'"
    >
      <i class="bi bi-robot"></i>
      <span class="pulse-ring"></span>
    </button>

    <!-- Chat Window -->
    <transition name="slide-up">
      <div v-if="isOpen" class="chat-window">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="header-content">
            <i class="bi bi-robot me-2"></i>
            <div>
              <h6 class="mb-0">Pulse - AI Music Assistant</h6>
              <small>Powered by Gemini</small>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn-header-action" @click="clearChat" title="Clear chat">
              <i class="bi bi-trash"></i>
            </button>
            <button class="btn-header-action" @click="toggleChat" title="Close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
        </div>

        <!-- Chat Messages -->
        <div class="chat-messages" ref="messagesContainer">
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="welcome-section">
            <div class="welcome-icon">
              <i class="bi bi-robot"></i>
            </div>
            <h5>Hey there! I'm Pulse 👋</h5>
            <p>Your AI music discovery assistant. Ask me anything about:</p>
            <ul>
              <li>🎵 Song & Artist recommendations</li>
              <li>🎪 Upcoming events</li>
              <li>🎸 Music discovery</li>
              <li>❓ How to use Wavelength</li>
            </ul>

            <!-- Starter Questions -->
            <div class="starter-questions">
              <p class="starter-label">Try asking:</p>
              <button
                v-for="(question, index) in starterQuestions"
                :key="index"
                class="starter-chip"
                @click="sendStarterQuestion(question)"
              >
                {{ question }}
              </button>
            </div>
          </div>

          <!-- Message List -->
          <div v-for="(msg, index) in messages" :key="index" class="message-wrapper">
            <!-- User Message -->
            <div v-if="msg.role === 'user'" class="message user-message">
              <div class="message-content">{{ msg.text }}</div>
              <div class="message-avatar">
                <i class="bi bi-person-fill"></i>
              </div>
            </div>

            <!-- AI Message -->
            <div v-else class="message ai-message">
              <div class="message-avatar">
                <i class="bi bi-robot"></i>
              </div>
              <div class="message-content">
                <div v-html="formatMessage(msg.text)"></div>

                <!-- Action Buttons (Clickable Recommendations) -->
                <div v-if="msg.actions && msg.actions.length > 0" class="action-buttons">
                  <button
                    v-for="action in msg.actions"
                    :key="action.type === 'song' ? `${action.artistId}_${action.id}` : action.id"
                    class="action-btn"
                    @click="navigateToAction(action)"
                  >
                    <i
                      class="bi"
                      :class="{
                        'bi-person-circle': action.type === 'artist',
                        'bi-calendar-event': action.type === 'event',
                        'bi-music-note-beamed': action.type === 'song',
                      }"
                    ></i>
                    <span v-if="action.type === 'song'">
                      Play "{{ action.name }}" by {{ action.artistName }}
                    </span>
                    <span v-else> View {{ action.name }} </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isTyping" class="message ai-message">
            <div class="message-avatar">
              <i class="bi bi-robot"></i>
            </div>
            <div class="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="error-message">
            <i class="bi bi-exclamation-triangle"></i>
            {{ error }}
          </div>
        </div>

        <!-- Chat Input -->
        <div class="chat-input-container">
          <input
            v-model="userInput"
            type="text"
            class="chat-input"
            placeholder="Ask me anything about music..."
            @keyup.enter="sendMessage"
            :disabled="isTyping"
          />
          <button class="btn-send" @click="sendMessage" :disabled="!userInput.trim() || isTyping">
            <i class="bi bi-send-fill"></i>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '@/services/firebase'
import { sendChatMessage, getStarterQuestions } from '@/services/aiService'

export default {
  name: 'AIChatbot',
  setup() {
    const router = useRouter()
    const isOpen = ref(false)
    const isLoggedIn = ref(false)
    const messages = ref([])
    const userInput = ref('')
    const isTyping = ref(false)
    const error = ref('')
    const messagesContainer = ref(null)
    const starterQuestions = ref([])

    // Check auth status
    onMounted(() => {
      auth.onAuthStateChanged((user) => {
        isLoggedIn.value = !!user
      })
      starterQuestions.value = getStarterQuestions()
    })

    const toggleChat = () => {
      isOpen.value = !isOpen.value
      if (isOpen.value) {
        nextTick(() => {
          scrollToBottom()
        })
      }
    }

    const sendMessage = async () => {
      const text = userInput.value.trim()
      if (!text || isTyping.value) return

      // Add user message
      messages.value.push({
        role: 'user',
        text: text,
      })

      userInput.value = ''
      error.value = ''
      isTyping.value = true

      nextTick(() => scrollToBottom())

      try {
        // Get user ID
        const userId = auth.currentUser?.uid || null

        // Send to AI
        const response = await sendChatMessage(text, userId)

        if (response.success) {
          messages.value.push({
            role: 'assistant',
            text: response.message,
            actions: response.actions || [],
          })
        } else {
          error.value = response.error
          setTimeout(() => {
            error.value = ''
          }, 5000)
        }
      } catch (err) {
        console.error('Chat error:', err)
        error.value = 'Something went wrong. Please try again.'
        setTimeout(() => {
          error.value = ''
        }, 5000)
      } finally {
        isTyping.value = false
        nextTick(() => scrollToBottom())
      }
    }

    const sendStarterQuestion = (question) => {
      userInput.value = question
      sendMessage()
    }

    const clearChat = () => {
      if (confirm('Clear chat history?')) {
        messages.value = []
        error.value = ''
      }
    }

    const scrollToBottom = () => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
      }
    }

    const formatMessage = (text) => {
      return text
        .replace(/\[([^\]]+)\]\((artist|song|event):([^\)]+)\)/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
    }

    const navigateToAction = (action) => {
      if (action.type === 'artist') {
        router.push(`/artist/${action.id}`)
        isOpen.value = false // Close chat after navigation
      } else if (action.type === 'event') {
        router.push(`/events/${action.id}`)
        isOpen.value = false
      } else if (action.type === 'song') {
        // Navigate to the artist's profile page where the song can be played
        router.push(`/artist/${action.artistId}`)
        isOpen.value = false
        // TODO: Future enhancement - scroll to specific song or auto-play
      }
    }

    return {
      isOpen,
      isLoggedIn,
      messages,
      userInput,
      isTyping,
      error,
      messagesContainer,
      starterQuestions,
      toggleChat,
      sendMessage,
      sendStarterQuestion,
      clearChat,
      formatMessage,
      navigateToAction,
    }
  },
}
</script>

<style scoped>
.ai-chatbot-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  font-family: 'Poppins', sans-serif;
}

/* Floating Button */
.chat-toggle-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #bb1814, #d32f2f);
  border: none;
  color: white;
  font-size: 1.8rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(187, 24, 20, 0.4);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-toggle-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 25px rgba(187, 24, 20, 0.6);
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 3px solid #bb1814;
  animation: pulse 2s infinite;
  opacity: 0;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

/* Chat Window */
.chat-window {
  width: 400px;
  height: 600px;
  background: rgba(25, 23, 23, 0.98);
  border: 2px solid #bb1814;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(15px);
  overflow: hidden;
}

/* Chat Header */
.chat-header {
  background: linear-gradient(135deg, #bb1814, #8b1410);
  padding: 1rem 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  color: white;
}

.header-content h6 {
  font-weight: 700;
  font-size: 1rem;
}

.header-content small {
  font-size: 0.7rem;
  opacity: 0.8;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-header-action {
  background: transparent;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-header-action:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Chat Messages */
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  background: rgba(35, 35, 38, 0.6);
}

.chat-messages::-webkit-scrollbar {
  width: 6px;
}

.chat-messages::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.chat-messages::-webkit-scrollbar-thumb {
  background: #bb1814;
  border-radius: 10px;
}

/* Welcome Section */
.welcome-section {
  text-align: center;
  padding: 1rem 0;
  color: white;
}

.welcome-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: linear-gradient(135deg, #bb1814, #d32f2f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.welcome-section h5 {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.welcome-section p {
  font-size: 0.9rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.welcome-section ul {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
  text-align: left;
  display: inline-block;
}

.welcome-section li {
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

/* Starter Questions */
.starter-questions {
  margin-top: 1.5rem;
}

.starter-label {
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.7;
  margin-bottom: 0.75rem;
}

.starter-chip {
  display: block;
  width: 100%;
  background: rgba(187, 24, 20, 0.2);
  border: 1px solid rgba(187, 24, 20, 0.4);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.starter-chip:hover {
  background: rgba(187, 24, 20, 0.3);
  border-color: #bb1814;
  transform: translateX(5px);
}

/* Messages */
.message-wrapper {
  margin-bottom: 1.25rem;
}

.message {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.user-message {
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1rem;
}

.user-message .message-avatar {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.ai-message .message-avatar {
  background: linear-gradient(135deg, #bb1814, #d32f2f);
  color: white;
}

.message-content {
  max-width: 75%;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.5;
}

.user-message .message-content {
  background: rgba(187, 24, 20, 0.3);
  border: 1px solid rgba(187, 24, 20, 0.5);
  color: white;
}

.ai-message .message-content {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
}

/* Action Buttons */
.action-buttons {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-btn {
  background: rgba(187, 24, 20, 0.3);
  border: 1px solid #bb1814;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.action-btn:hover {
  background: rgba(187, 24, 20, 0.5);
  transform: translateX(5px);
}

/* Typing Indicator */
.typing-indicator {
  display: flex;
  gap: 0.4rem;
  padding: 1rem !important;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Error Message */
.error-message {
  background: rgba(220, 53, 69, 0.2);
  border: 1px solid rgba(220, 53, 69, 0.5);
  color: white;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Chat Input */
.chat-input-container {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: rgba(25, 23, 23, 0.95);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.chat-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  outline: none;
  transition: all 0.3s ease;
}

.chat-input:focus {
  border-color: #bb1814;
  background: rgba(255, 255, 255, 0.15);
}

.chat-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.btn-send {
  width: 45px;
  height: 45px;
  background: linear-gradient(135deg, #bb1814, #d32f2f);
  border: none;
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-send:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(187, 24, 20, 0.4);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Slide Up Animation */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive */
@media (max-width: 480px) {
  .chat-window {
    width: calc(100vw - 20px);
    height: calc(100vh - 100px);
    right: 10px;
    bottom: 90px;
  }

  .ai-chatbot-container {
    right: 10px;
    bottom: 10px;
  }
}
</style>
