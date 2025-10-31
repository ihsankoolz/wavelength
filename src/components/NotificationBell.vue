<template>
  <div class="notification-dropdown">
    <!-- Bell Icon with Badge -->
    <button class="notification-bell" @click="toggleDropdown" :class="{ active: showDropdown }">
      <i class="bi bi-bell-fill"></i>
      <span v-if="unreadCount > 0" class="badge">{{ unreadCount }}</span>
    </button>

    <!-- Dropdown Menu -->
    <div v-if="showDropdown" class="dropdown-menu" @click.stop>
      <!-- Header -->
      <div class="dropdown-header">
        <h6 class="mb-0">Notifications</h6>
        <button v-if="unreadCount > 0" @click="handleMarkAllRead" class="btn-mark-all">
          Mark all read
        </button>
      </div>

      <!-- Notifications List -->
      <div class="notifications-list">
        <!-- Loading State -->
        <div v-if="isLoading" class="text-center py-4">
          <div class="spinner-border spinner-border-sm" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="notifications.length === 0" class="empty-state">
          <i class="bi bi-bell-slash"></i>
          <p>No notifications yet</p>
        </div>

        <!-- Notification Items -->
        <div
          v-else
          v-for="notification in notifications"
          :key="notification.id"
          class="notification-item"
          :class="{ unread: !notification.read }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-icon" :class="`bg-${getColor(notification.type)}`">
            <i :class="getIcon(notification.type)"></i>
          </div>
          <div class="notification-content">
            <p class="notification-title">{{ notification.title }}</p>
            <p class="notification-message">{{ notification.message }}</p>
            <span class="notification-time">{{ formatTime(notification.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  getNotificationIcon,
  getNotificationColor,
} from '@/utils/notifications'
import { auth } from '@/services/firebase'

export default {
  name: 'NotificationBell',
  data() {
    return {
      showDropdown: false,
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      pollInterval: null,
    }
  },
  async mounted() {
    await this.loadNotifications()
    await this.updateUnreadCount()

    // Poll for new notifications every 30 seconds
    this.pollInterval = setInterval(() => {
      this.updateUnreadCount()
    }, 30000)

    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval)
    }
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    async toggleDropdown() {
      this.showDropdown = !this.showDropdown
      if (this.showDropdown) {
        await this.loadNotifications()
        // Mark all as read when dropdown opens
        await this.markAllNotificationsAsRead()
      }
    },

    async loadNotifications() {
      const user = auth.currentUser
      if (!user) return

      this.isLoading = true
      try {
        this.notifications = await getUserNotifications(user.uid, 10)
      } catch (error) {
        console.error('Error loading notifications:', error)
      } finally {
        this.isLoading = false
      }
    },

    async markAllNotificationsAsRead() {
      const user = auth.currentUser
      if (!user || this.unreadCount === 0) return

      try {
        // Mark all as read in Firestore
        await markAllAsRead(user.uid)

        // Update local state
        this.notifications.forEach((n) => (n.read = true))
        this.unreadCount = 0
      } catch (error) {
        console.error('Error marking notifications as read:', error)
      }
    },

    async updateUnreadCount() {
      const user = auth.currentUser
      if (!user) return

      try {
        this.unreadCount = await getUnreadCount(user.uid)
      } catch (error) {
        console.error('Error updating unread count:', error)
      }
    },

    async handleNotificationClick(notification) {
      console.log('🔔 Notification clicked:', notification)
      console.log('🔔 Notification link:', notification.link)
      console.log('🔔 Notification metadata:', notification.metadata)

      // Mark as read
      if (!notification.read) {
        await markAsRead(notification.id)
        notification.read = true
        this.unreadCount = Math.max(0, this.unreadCount - 1)
      }

      // Navigate to link
      if (notification.link) {
        console.log('🔔 Navigating to:', notification.link)
        this.$router.push(notification.link)
        this.showDropdown = false
      }
    },

    async handleMarkAllRead() {
      // This is now redundant but kept for explicit user action
      await this.markAllNotificationsAsRead()
    },

    handleClickOutside(event) {
      const dropdown = this.$el
      if (dropdown && !dropdown.contains(event.target)) {
        this.showDropdown = false
      }
    },

    getIcon(type) {
      return getNotificationIcon(type)
    },

    getColor(type) {
      return getNotificationColor(type)
    },

    formatTime(date) {
      if (!date) return ''

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
    },
  },
}
</script>

<style scoped>
.notification-dropdown {
  position: relative;
}

.notification-bell {
  position: relative;
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6c757d;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s;
}

.notification-bell:hover,
.notification-bell.active {
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.notification-bell .badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #dc3545;
  color: white;
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.15rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 380px;
  max-height: 500px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.dropdown-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-header h6 {
  font-weight: 600;
  color: #212529;
}

.btn-mark-all {
  background: none;
  border: none;
  color: #667eea;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
}

.btn-mark-all:hover {
  text-decoration: underline;
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #6c757d;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid #f8f9fa;
  cursor: pointer;
  transition: background 0.2s;
}

.notification-item:hover {
  background: #f8f9fa;
}

.notification-item.unread {
  background: #f0f4ff;
}

.notification-item.unread:hover {
  background: #e6edff;
}

.notification-icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
}

.notification-icon.bg-primary {
  background: #667eea;
}
.notification-icon.bg-info {
  background: #17a2b8;
}
.notification-icon.bg-success {
  background: #28a745;
}
.notification-icon.bg-danger {
  background: #dc3545;
}
.notification-icon.bg-warning {
  background: #ffc107;
  color: #212529;
}
.notification-icon.bg-secondary {
  background: #6c757d;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  font-size: 0.875rem;
  color: #212529;
  margin-bottom: 0.25rem;
}

.notification-message {
  font-size: 0.8125rem;
  color: #6c757d;
  margin-bottom: 0.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-time {
  font-size: 0.75rem;
  color: #adb5bd;
}

.dropdown-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid #e9ecef;
  text-align: center;
}

.view-all-link {
  color: #667eea;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
}

.view-all-link:hover {
  text-decoration: underline;
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .dropdown-menu {
    width: 90vw;
    right: -50px;
  }
}
</style>
