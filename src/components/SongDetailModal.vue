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
            </div>

            <!-- Genre Tags -->
            <div class="genre-tags" v-if="song?.genres && song.genres.length > 0">
              <span v-for="genre in song.genres.slice(0, 2)" :key="genre" class="genre-tag">
                {{ genre }}
              </span>
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
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 0;
  overflow-y: auto;
}

.modal-container {
  background: white;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  max-height: 100vh;
  position: relative;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(0, 0, 0, 0.5);
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
  background: rgba(0, 0, 0, 0.7);
}

/* Song Details Section */
.song-details-section {
  background: white;
  padding: 50px 20px 16px;
  flex-shrink: 0;
}

.artist-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.artist-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.artist-info {
  flex: 1;
}

.song-title {
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 2px 0;
  color: #1a1a1a;
}

.artist-name {
  font-size: 0.9rem;
  color: #666;
  margin: 0;
}

.genre-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.genre-tag {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.75rem;
  font-weight: 600;
}

.embed-container {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.song-link {
  display: block;
  padding: 30px;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  transition: opacity 0.3s;
}

.song-link:hover {
  opacity: 0.9;
}

/* Comments Section */
.comments-section-wrapper {
  flex: 1;
  background: #f8f9fa;
  padding: 20px;
  overflow-y: auto;
  min-height: 0;
}

.comments-header {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: #1a1a1a;
  display: flex;
  align-items: center;
  gap: 8px;
}

.add-comment-section {
  background: white;
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.comment-input {
  width: 100%;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 12px;
  font-size: 0.95rem;
  resize: vertical;
  margin-bottom: 12px;
  font-family: inherit;
}

.comment-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.comment-button {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
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
}

.comment-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
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
  color: #6c757d;
}

.no-comments i {
  font-size: 3rem;
  margin-bottom: 16px;
  opacity: 0.3;
}

.no-comments p {
  font-size: 1rem;
  margin: 0;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-wrapper {
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  color: #667eea;
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
  color: #1a1a1a;
  font-size: 0.95rem;
}

.comment-time {
  color: #6c757d;
  font-size: 0.85rem;
}

.comment-text {
  color: #333;
  margin: 0 0 12px 0;
  line-height: 1.5;
  word-wrap: break-word;
}

.comment-actions {
  display: flex;
  gap: 16px;
  margin-top: 8px;
}

.action-btn {
  background: none;
  border: none;
  color: #6c757d;
  cursor: pointer;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f8f9fa;
  color: #495057;
}

.action-btn.liked {
  color: #dc3545;
}

.action-btn.delete {
  color: #dc3545;
}

.action-btn.delete:hover {
  background: #ffe6e6;
}

.replies-list {
  margin-top: 16px;
  padding-left: 16px;
  border-left: 3px solid #e9ecef;
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
  background: #f8f9fa;
  border-radius: 8px;
}

.reply-input {
  width: 100%;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 10px;
  font-size: 0.9rem;
  resize: vertical;
  margin-bottom: 8px;
  font-family: inherit;
}

.reply-input:focus {
  outline: none;
  border-color: #667eea;
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
}

.btn-cancel {
  background: #e9ecef;
  color: #495057;
}

.btn-cancel:hover {
  background: #dee2e6;
}

.btn-submit {
  background: #667eea;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #5568d3;
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
  }

  .close-button {
    top: 16px;
    right: 16px;
  }

  .song-details-section {
    padding: 60px 28px 20px;
  }

  .artist-header {
    margin-bottom: 14px;
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

  .comments-section-wrapper {
    padding: 24px;
  }

  .comments-header {
    font-size: 1.15rem;
  }
}

@media (min-width: 1024px) {
  .modal-container {
    max-width: 700px;
  }
}
</style>
