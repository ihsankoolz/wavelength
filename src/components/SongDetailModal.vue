<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <!-- Close Button -->
          <button @click="closeModal" class="close-button">
            <i class="bi bi-x-lg"></i>
          </button>

          <!-- Song Details Section -->
          <div class="song-details-section">
            <!-- Artist Header -->
            <div class="artist-header">
              <img
                :src="song?.artistPhoto || '/default-avatar.png'"
                :alt="song?.artistName"
                class="artist-photo"
              />
              <div class="artist-info">
                <h2 class="song-title">{{ song?.title || 'Song Title' }}</h2>
                <p class="artist-name">{{ song?.artistName || 'Artist Name' }}</p>
              </div>
              <!-- Genre Tags moved to the right -->
              <div class="genre-tags" v-if="song?.genres && song.genres.length > 0">
                <span v-for="genre in song.genres.slice(0, 2)" :key="genre" class="genre-tag">
                  {{ genre }}
                </span>
              </div>
            </div>

            <!-- Spotify Embed -->
            <div class="embed-container">
              <!-- Spotify Embed -->
              <iframe
                v-if="song?.platform === 'spotify' && song?.embedUrl"
                :src="song.embedUrl"
                width="100%"
                height="152"
                frameborder="0"
                allowtransparency="true"
                allow="encrypted-media"
                loading="lazy"
              ></iframe>

              <!-- YouTube Embed -->
              <iframe
                v-else-if="song?.platform === 'youtube' && song?.embedUrl"
                width="100%"
                height="200"
                :src="song.embedUrl"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                loading="lazy"
              ></iframe>

              <!-- SoundCloud Embed (legacy support) -->
              <iframe
                v-else-if="song?.platform === 'soundcloud' && song?.url"
                width="100%"
                height="166"
                scrolling="no"
                frameborder="no"
                allow="autoplay"
                :src="`https://w.soundcloud.com/player/?url=${encodeURIComponent(
                  song.url,
                )}&color=%23ff5500&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false`"
                loading="lazy"
              ></iframe>

              <!-- Fallback Link -->
              <a
                v-else-if="song?.url"
                :href="song.url"
                target="_blank"
                rel="noopener noreferrer"
                class="song-link"
              >
                🎵 Open on {{ song.platform }} →
              </a>
            </div>
          </div>

          <!-- Comments Section -->
          <div class="comments-section-wrapper">
            <h3 class="comments-header">
              <i class="bi bi-chat-left-text"></i>
              Comments
            </h3>

            <!-- Add Comment -->
            <div class="add-comment-section">
              <textarea
                v-model="newComment"
                placeholder="Add a comment..."
                class="comment-input"
                rows="3"
                @keydown.enter.ctrl="submitComment"
              ></textarea>
              <button
                @click="submitComment"
                :disabled="!newComment.trim() || submitting"
                class="comment-button"
              >
                {{ submitting ? 'Posting...' : 'COMMENT' }}
              </button>
            </div>

            <!-- Comments List -->
            <div class="comments-list-container">
              <div v-if="loading" class="text-center py-4">
                <span class="spinner-border spinner-border-sm"></span>
                Loading comments...
              </div>

              <div v-else-if="comments.length === 0" class="no-comments">
                <i class="bi bi-chat-left-text"></i>
                <p>No comments yet. Be the first to comment!</p>
              </div>

              <div v-else class="comments-list">
                <div v-for="comment in comments" :key="comment.id" class="comment-wrapper">
                  <div class="comment-item">
                    <div class="comment-avatar">
                      <i class="bi bi-person-circle"></i>
                    </div>
                    <div class="comment-content">
                      <div class="comment-header">
                        <span class="comment-author">{{ comment.userName }}</span>
                        <span class="comment-time">{{ formatTime(comment.createdAt) }}</span>
                      </div>
                      <p class="comment-text">{{ comment.text }}</p>

                      <!-- Comment Actions -->
                      <div class="comment-actions">
                        <button
                          @click="toggleCommentLike(comment)"
                          class="action-btn"
                          :class="{ liked: isCommentLiked(comment) }"
                        >
                          <i class="bi bi-heart-fill" v-if="isCommentLiked(comment)"></i>
                          <i class="bi bi-heart" v-else></i>
                          <span>{{ comment.likes || 0 }}</span>
                        </button>

                        <button @click="startReply(comment)" class="action-btn">
                          <i class="bi bi-reply-fill"></i>
                          <span>Reply</span>
                        </button>

                        <button
                          v-if="canDeleteComment(comment)"
                          @click="deleteComment(comment)"
                          class="action-btn delete"
                        >
                          <i class="bi bi-trash-fill"></i>
                          <span>Delete</span>
                        </button>
                      </div>

                      <!-- Replies -->
                      <div
                        v-if="comment.replies && comment.replies.length > 0"
                        class="replies-list"
                      >
                        <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                          <div class="comment-avatar small">
                            <i class="bi bi-person-circle"></i>
                          </div>
                          <div class="comment-content">
                            <div class="comment-header">
                              <span class="comment-author">{{ reply.userName }}</span>
                              <span class="comment-time">{{ formatTime(reply.createdAt) }}</span>
                            </div>
                            <p class="comment-text">{{ reply.text }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Reply Input -->
                      <div v-if="replyingTo === comment.id" class="reply-input-section">
                        <textarea
                          v-model="replyText"
                          :placeholder="`Reply to ${comment.userName}...`"
                          class="reply-input"
                          rows="2"
                          @keydown.esc="cancelReply"
                        ></textarea>
                        <div class="reply-buttons">
                          <button @click="cancelReply" class="btn-cancel">Cancel</button>
                          <button
                            @click="submitReply(comment)"
                            :disabled="!replyText.trim() || submittingReply"
                            class="btn-submit"
                          >
                            {{ submittingReply ? 'Posting...' : 'Reply' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { auth } from '@/services/firebase'
import {
  postSongComment,
  deleteSongComment,
  toggleCommentLike as toggleCommentLikeAPI,
  postCommentReply,
} from '@/utils/musicInteractions'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/services/firebase'

export default {
  name: 'SongDetailModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    song: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'comment-posted'],
  data() {
    return {
      comments: [],
      newComment: '',
      replyText: '',
      replyingTo: null,
      loading: false,
      submitting: false,
      submittingReply: false,
      unsubscribe: null,
    }
  },
  watch: {
    show(newVal) {
      console.log('🔄 Modal show changed:', newVal)
      if (newVal && this.song) {
        console.log(
          '🎵 Song data:',
          this.song.title,
          'Artist ID:',
          this.song.artistId,
          'Song ID:',
          this.song.id,
        )
        this.loadComments()
      } else {
        this.cleanup()
      }
    },
    song(newVal) {
      console.log('🔄 Song changed:', newVal?.title)
      if (newVal && this.show) {
        this.loadComments()
      }
    },
  },
  methods: {
    closeModal() {
      this.$emit('close')
    },
    cleanup() {
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }
      this.comments = []
      this.newComment = ''
      this.replyText = ''
      this.replyingTo = null
    },
    loadComments() {
      if (!this.song?.artistId || !this.song?.id) {
        console.log('❌ No song data to load comments')
        return
      }

      console.log('📥 Loading comments for:', this.song.title, 'Song ID:', this.song.id)
      this.loading = true

      // Clean up previous listener if it exists
      if (this.unsubscribe) {
        this.unsubscribe()
        this.unsubscribe = null
      }

      // Listen to the artist document to get comments from musicLinks array
      const artistRef = doc(db, 'artists', this.song.artistId)

      this.unsubscribe = onSnapshot(
        artistRef,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const artistData = docSnapshot.data()
            const musicLinks = artistData.musicLinks || []

            // Find the specific song in musicLinks array
            const song = musicLinks.find((s) => s.id === this.song.id)

            if (song) {
              this.comments = song.comments || []
              console.log('✅ Loaded', this.comments.length, 'comments from musicLinks array')
            } else {
              this.comments = []
              console.log('⚠️ Song not found in musicLinks array')
            }
          } else {
            this.comments = []
            console.log('⚠️ Artist document not found')
          }
          this.loading = false
        },
        (error) => {
          console.error('Error loading comments:', error)
          this.loading = false
        },
      )
    },
    async submitComment() {
      if (!this.newComment.trim() || this.submitting) return

      const user = auth.currentUser
      if (!user) {
        alert('Please log in to comment')
        return
      }

      this.submitting = true
      try {
        const result = await postSongComment(
          this.song.artistId,
          this.song.id,
          this.newComment.trim(),
        )

        if (result.success) {
          this.newComment = ''
          this.$emit('comment-posted')
        } else {
          alert('Failed to post comment. Please try again.')
        }
      } catch (error) {
        console.error('Error posting comment:', error)
        alert('An error occurred while posting your comment.')
      } finally {
        this.submitting = false
      }
    },
    async deleteComment(comment) {
      if (!confirm('Are you sure you want to delete this comment?')) return

      try {
        const result = await deleteSongComment(this.song.artistId, this.song.id, comment.id)

        if (!result.success) {
          alert('Failed to delete comment. Please try again.')
        }
      } catch (error) {
        console.error('Error deleting comment:', error)
        alert('An error occurred while deleting the comment.')
      }
    },
    async toggleCommentLike(comment) {
      try {
        await toggleCommentLikeAPI(this.song.artistId, this.song.id, comment.id)
      } catch (error) {
        console.error('Error toggling comment like:', error)
      }
    },
    isCommentLiked(comment) {
      const user = auth.currentUser
      if (!user || !comment.likedBy) return false
      return comment.likedBy.includes(user.uid)
    },
    canDeleteComment(comment) {
      const user = auth.currentUser
      if (!user) return false
      return comment.userId === user.uid
    },
    startReply(comment) {
      this.replyingTo = comment.id
      this.replyText = ''
    },
    cancelReply() {
      this.replyingTo = null
      this.replyText = ''
    },
    async submitReply(comment) {
      if (!this.replyText.trim() || this.submittingReply) return

      const user = auth.currentUser
      if (!user) {
        alert('Please log in to reply')
        return
      }

      this.submittingReply = true
      try {
        const result = await postCommentReply(
          this.song.artistId,
          this.song.id,
          comment.id,
          this.replyText.trim(),
        )

        if (result.success) {
          this.replyText = ''
          this.replyingTo = null
        } else {
          alert('Failed to post reply. Please try again.')
        }
      } catch (error) {
        console.error('Error posting reply:', error)
        alert('An error occurred while posting your reply.')
      } finally {
        this.submittingReply = false
      }
    },
    formatTime(timestamp) {
      if (!timestamp) return ''

      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const now = new Date()
      const diffInSeconds = Math.floor((now - date) / 1000)

      if (diffInSeconds < 60) return 'Just now'
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
      if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

      return date.toLocaleDateString()
    },
  },
  beforeUnmount() {
    this.cleanup()
  },
}
</script>

<style scoped>
/* Custom Scrollbar Styling */
.modal-container::-webkit-scrollbar,
.comments-section-wrapper::-webkit-scrollbar {
  width: 8px;
}

.modal-container::-webkit-scrollbar-track,
.comments-section-wrapper::-webkit-scrollbar-track {
  background: #2a2a2a;
  border-radius: 4px;
}

.modal-container::-webkit-scrollbar-thumb,
.comments-section-wrapper::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #bb1814 0%, #8b1410 100%);
  border-radius: 4px;
  border: 1px solid #333;
}

.modal-container::-webkit-scrollbar-thumb:hover,
.comments-section-wrapper::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(135deg, #d41e1e 0%, #9f1612 100%);
}

/* Firefox Scrollbar */
.modal-container,
.comments-section-wrapper {
  scrollbar-width: thin;
  scrollbar-color: #bb1814 #2a2a2a;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 0;
  overflow-y: auto;
  font-family: 'Poppins', sans-serif;
}

.modal-container {
  background: #191717;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  color: white;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(187, 24, 20, 0.8);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  transition: background 0.2s;
}

.close-button:hover {
  background: #bb1814;
}

/* Song Details Section */
.song-details-section {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
  padding: 50px 20px 16px;
  flex-shrink: 0;
  border-bottom: 1px solid #333;
}

.artist-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.artist-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #bb1814;
  flex-shrink: 0;
}

.artist-info {
  flex: 1;
  min-width: 0;
}

.song-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 2px 0;
  color: white;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.artist-name {
  font-size: 0.9rem;
  color: #ccc;
  margin: 0;
  font-family: 'Poppins', sans-serif;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  justify-content: flex-end;
  align-items: center;
  flex-shrink: 0;
  max-width: 120px;
}

.genre-tag {
  background: linear-gradient(135deg, #bb1814 0%, #8b1410 100%);
  color: white;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
  white-space: nowrap;
}

.embed-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.song-link {
  display: block;
  padding: 30px;
  text-align: center;
  background: linear-gradient(135deg, #bb1814 0%, #8b1410 100%);
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  transition: opacity 0.3s;
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
}

.song-link:hover {
  opacity: 0.9;
}

/* Comments Section */
.comments-section-wrapper {
  flex: 1;
  background: #191717;
  padding: 20px;
  overflow-y: auto;
  min-height: 0;
}

.comments-header {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
}

.comments-header i {
  color: #bb1814;
}

.add-comment-section {
  background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #333;
}

.comment-input {
  width: 100%;
  border: 1px solid #444;
  background: #2a2a2a;
  color: white;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  resize: vertical;
  margin-bottom: 12px;
  font-family: 'Poppins', sans-serif;
  min-height: 60px;
  max-height: 100px;
}

.comment-input:focus {
  outline: none;
  border-color: #bb1814;
  box-shadow: 0 0 0 2px rgba(187, 24, 20, 0.2);
}

.comment-input::placeholder {
  color: #888;
}

.comment-button {
  background: linear-gradient(135deg, #bb1814 0%, #8b1410 100%);
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  width: 100%;
  font-family: 'Poppins', sans-serif;
  text-transform: uppercase;
}

.comment-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(187, 24, 20, 0.3);
}

.comment-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.comments-list-container {
  max-height: none;
}

.no-comments {
  text-align: center;
  padding: 60px 20px;
  color: #888;
}

.no-comments i {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.3;
  color: #bb1814;
}

.no-comments p {
  font-size: 1rem;
  margin: 0;
  font-family: 'Poppins', sans-serif;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-wrapper {
  background: linear-gradient(135deg, #2a2a2a 0%, #1e1e1e 100%);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #333;
}

.comment-item {
  display: flex;
  gap: 12px;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-avatar i {
  font-size: 2.5rem;
  color: #bb1814;
}

.comment-avatar.small i {
  font-size: 2rem;
}

.comment-content {
  flex: 1;
  min-width: 0;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.comment-author {
  font-weight: 700;
  color: white;
  font-size: 0.95rem;
  font-family: 'Poppins', sans-serif;
}

.comment-time {
  color: #888;
  font-size: 0.85rem;
  font-family: 'Poppins', sans-serif;
}

.comment-text {
  color: #ccc;
  margin: 0 0 12px 0;
  line-height: 1.5;
  word-wrap: break-word;
  font-family: 'Poppins', sans-serif;
}

.comment-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.action-btn {
  background: none;
  border: none;
  color: #888;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
  font-family: 'Poppins', sans-serif;
}

.action-btn:hover {
  background: rgba(187, 24, 20, 0.1);
  color: #bb1814;
}

.action-btn.liked {
  color: #bb1814;
}

.action-btn.delete {
  color: #bb1814;
}

.action-btn.delete:hover {
  background: rgba(187, 24, 20, 0.2);
}

.replies-list {
  margin-top: 16px;
  padding-left: 16px;
  border-left: 3px solid #bb1814;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reply-item {
  display: flex;
  gap: 10px;
}

.reply-input-section {
  margin-top: 12px;
  padding: 12px;
  background: rgba(42, 42, 42, 0.5);
  border-radius: 8px;
  border: 1px solid #444;
}

.reply-input {
  width: 100%;
  border: 1px solid #444;
  background: #2a2a2a;
  color: white;
  border-radius: 6px;
  padding: 10px;
  font-size: 0.9rem;
  resize: vertical;
  margin-bottom: 8px;
  font-family: 'Poppins', sans-serif;
}

.reply-input:focus {
  outline: none;
  border-color: #bb1814;
}

.reply-input::placeholder {
  color: #888;
}

.reply-buttons {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Poppins', sans-serif;
}

.btn-cancel {
  background: #444;
  color: #ccc;
}

.btn-cancel:hover {
  background: #555;
}

.btn-submit {
  background: #bb1814;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #a01511;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: translateY(50px);
}

/* Responsive */
@media (min-width: 768px) {
  .modal-container {
    max-width: 600px;
    max-height: 90vh;
    border-radius: 16px;
    margin: 20px;
    border: 1px solid #333;
  }

  .close-button {
    top: 16px;
    right: 16px;
  }

  .song-details-section {
    padding: 60px 28px 20px;
  }

  .artist-header {
    margin-bottom: 18px;
  }

  .artist-photo {
    width: 56px;
    height: 56px;
  }

  .song-title {
    font-size: 1.25rem;
  }

  .artist-name {
    font-size: 0.95rem;
  }

  .genre-tags {
    max-width: 140px;
  }

  .genre-tag {
    padding: 4px 10px;
    font-size: 0.75rem;
  }

  .comments-section-wrapper {
    padding: 24px;
  }

  .comments-header {
    font-size: 1.15rem;
  }

  .comment-input {
    min-height: 80px;
    max-height: 120px;
  }
}

@media (min-width: 1024px) {
  .modal-container {
    max-width: 700px;
  }

  .genre-tags {
    max-width: 160px;
  }
}
</style>
