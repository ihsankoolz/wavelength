<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="modal-overlay" @click="closeModal">
        <div class="modal-container" @click.stop>
          <!-- Header -->
          <div class="modal-header">
            <div class="song-info">
              <h3>{{ song?.title || 'Comments' }}</h3>
              <p class="artist-name">{{ song?.artistName }}</p>
            </div>
            <button @click="closeModal" class="close-button">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Comments List -->
          <div class="comments-section">
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
                    <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
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

          <!-- Comment Input -->
          <div class="comment-input-section">
            <textarea
              v-model="newComment"
              placeholder="Write a comment..."
              @keydown.enter.ctrl="submitComment"
              class="comment-input"
              rows="3"
            ></textarea>
            <button
              @click="submitComment"
              :disabled="!newComment.trim() || submitting"
              class="submit-button"
            >
              <span v-if="submitting">
                <span class="spinner-border spinner-border-sm me-2"></span>
                Posting...
              </span>
              <span v-else>
                <i class="bi bi-send-fill me-2"></i>
                Post Comment
              </span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { ref, watch, computed } from 'vue'
import {
  postSongComment,
  deleteSongComment,
  toggleCommentLike as toggleCommentLikeAPI,
  postCommentReply,
} from '@/utils/musicInteractions'
import { getDoc, doc } from 'firebase/firestore'
import { db, auth } from '@/services/firebase'

export default {
  name: 'CommentModal',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    song: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'comment-posted'],
  setup(props, { emit }) {
    const comments = ref([])
    const newComment = ref('')
    const loading = ref(false)
    const submitting = ref(false)

    // Reply state
    const replyingTo = ref(null)
    const replyText = ref('')
    const submittingReply = ref(false)

    const currentUserId = computed(() => auth.currentUser?.uid)

    const loadComments = async () => {
      if (!props.song) return

      loading.value = true
      try {
        const artistDoc = await getDoc(doc(db, 'artists', props.song.artistId))
        if (artistDoc.exists()) {
          const artistData = artistDoc.data()
          const musicLinks = artistData.musicLinks || []
          const currentSong = musicLinks.find((s) => s.id === props.song.id)
          comments.value = currentSong?.comments || []
        }
      } catch (error) {
        console.error('Error loading comments:', error)
      } finally {
        loading.value = false
      }
    }

    const submitComment = async () => {
      if (!newComment.value.trim() || submitting.value) return

      submitting.value = true
      try {
        const result = await postSongComment(props.song.artistId, props.song.id, newComment.value)

        if (result.success) {
          // Add comment to local list
          comments.value.push(result.comment)
          newComment.value = ''

          // Notify parent to update comment count
          emit('comment-posted', {
            artistId: props.song.artistId,
            songId: props.song.id,
            newCommentCount: comments.value.length,
          })
        }
      } catch (error) {
        console.error('Error posting comment:', error)
        alert('Failed to post comment. Please try again.')
      } finally {
        submitting.value = false
      }
    }

    const deleteComment = async (comment) => {
      if (!confirm('Are you sure you want to delete this comment?')) return

      try {
        const result = await deleteSongComment(props.song.artistId, props.song.id, comment.id)

        if (result.success) {
          // Remove from local list
          comments.value = comments.value.filter((c) => c.id !== comment.id)

          // Update parent
          emit('comment-posted', {
            artistId: props.song.artistId,
            songId: props.song.id,
            newCommentCount: comments.value.length,
          })
        }
      } catch (error) {
        console.error('Error deleting comment:', error)
        alert('Failed to delete comment. Please try again.')
      }
    }

    const toggleCommentLike = async (comment) => {
      const isLiked = isCommentLiked(comment)

      try {
        const result = await toggleCommentLikeAPI(
          props.song.artistId,
          props.song.id,
          comment.id,
          isLiked,
        )

        if (result.success) {
          // Update local state
          const localComment = comments.value.find((c) => c.id === comment.id)
          if (localComment) {
            const likedBy = localComment.likedBy || []

            if (isLiked) {
              localComment.likedBy = likedBy.filter((id) => id !== currentUserId.value)
              localComment.likes = Math.max(0, (localComment.likes || 0) - 1)
            } else {
              localComment.likedBy = [...likedBy, currentUserId.value]
              localComment.likes = (localComment.likes || 0) + 1
            }
          }
        }
      } catch (error) {
        console.error('Error toggling comment like:', error)
      }
    }

    const isCommentLiked = (comment) => {
      const likedBy = comment.likedBy || []
      return likedBy.includes(currentUserId.value)
    }

    const canDeleteComment = (comment) => {
      return comment.userId === currentUserId.value
    }

    const startReply = (comment) => {
      replyingTo.value = comment.id
      replyText.value = ''
    }

    const cancelReply = () => {
      replyingTo.value = null
      replyText.value = ''
    }

    const submitReply = async (comment) => {
      if (!replyText.value.trim() || submittingReply.value) return

      submittingReply.value = true
      try {
        const result = await postCommentReply(
          props.song.artistId,
          props.song.id,
          comment.id,
          replyText.value,
        )

        if (result.success) {
          // Add reply to local comment
          const localComment = comments.value.find((c) => c.id === comment.id)
          if (localComment) {
            if (!localComment.replies) {
              localComment.replies = []
            }
            localComment.replies.push(result.reply)
          }

          cancelReply()
        }
      } catch (error) {
        console.error('Error posting reply:', error)
        alert('Failed to post reply. Please try again.')
      } finally {
        submittingReply.value = false
      }
    }

    const closeModal = () => {
      emit('close')
    }

    const formatTime = (timestamp) => {
      if (!timestamp) return ''
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      if (days < 7) return `${days}d ago`
      return date.toLocaleDateString()
    }

    // Load comments when modal opens
    watch(
      () => props.show,
      (newVal) => {
        if (newVal) {
          loadComments()
        } else {
          newComment.value = ''
          cancelReply()
        }
      },
    )

    return {
      comments,
      newComment,
      loading,
      submitting,
      replyingTo,
      replyText,
      submittingReply,
      submitComment,
      deleteComment,
      toggleCommentLike,
      isCommentLiked,
      canDeleteComment,
      startReply,
      cancelReply,
      submitReply,
      closeModal,
      formatTime,
    }
  },
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.song-info h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #212529;
}

.artist-name {
  margin: 0.25rem 0 0 0;
  font-size: 0.875rem;
  color: #6c757d;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-button:hover {
  background: #f8f9fa;
  color: #212529;
}

.comments-section {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  min-height: 200px;
}

.no-comments {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.no-comments i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
  opacity: 0.5;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.comment-item {
  display: flex;
  gap: 1rem;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-avatar i {
  font-size: 2.5rem;
  color: #667eea;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.comment-author {
  font-weight: 600;
  color: #212529;
  font-size: 0.95rem;
}

.comment-time {
  font-size: 0.8rem;
  color: #6c757d;
}

.comment-text {
  margin: 0;
  color: #495057;
  line-height: 1.5;
  white-space: pre-wrap;
}

/* Comment Actions */
.comment-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.4rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #6c757d;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f8f9fa;
  color: #667eea;
}

.action-btn.liked {
  color: #e74c3c;
}

.action-btn.liked i {
  animation: heartBeat 0.3s ease;
}

.action-btn.delete:hover {
  color: #dc3545;
}

@keyframes heartBeat {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

/* Replies */
.replies-list {
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 2px solid #e9ecef;
}

.reply-item {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.75rem;
}

.comment-avatar.small i {
  font-size: 2rem;
}

/* Reply Input */
.reply-input-section {
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.reply-input {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.9rem;
  resize: vertical;
  margin-bottom: 0.5rem;
  font-family: inherit;
}

.reply-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
}

.reply-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background: #e9ecef;
  color: #495057;
}

.btn-cancel:hover {
  background: #dee2e6;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.comment-input-section {
  padding: 1.5rem;
  border-top: 1px solid #e9ecef;
  background: #f8f9fa;
  border-radius: 0 0 16px 16px;
}

.comment-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 0.95rem;
  resize: vertical;
  margin-bottom: 1rem;
  font-family: inherit;
}

.comment-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Transitions */
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
  transform: scale(0.9);
}
</style>
