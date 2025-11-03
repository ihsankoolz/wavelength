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
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.notification-bell:hover,
.notification-bell.active {
  background: rgba(187, 24, 20, 0.15);
  color: #bb1814;
  transform: scale(1.05);
}

.notification-bell .badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: linear-gradient(135deg, #bb1814 0%, #a30c0e 100%);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 12px;
  min-width: 18px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(187, 24, 20, 0.4);
  border: 2px solid #191717;
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 380px;
  max-height: 500px;
  background: rgba(25, 23, 23, 0.95);
  border: 1px solid rgba(187, 24, 20, 0.2);
  border-radius: 16px;
  backdrop-filter: blur(15px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(187, 24, 20, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.dropdown-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(187, 24, 20, 0.05);
}

.dropdown-header h6 {
  font-weight: 700;
  color: #fff;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  margin: 0;
}

.btn-mark-all {
  background: none;
  border: none;
  color: #bb1814;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.btn-mark-all:hover {
  background: rgba(187, 24, 20, 0.1);
  color: #a30c0e;
}

.notifications-list {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
}

.notifications-list::-webkit-scrollbar {
  width: 4px;
}

.notifications-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.notifications-list::-webkit-scrollbar-thumb {
  background: rgba(187, 24, 20, 0.3);
  border-radius: 2px;
}

.notifications-list::-webkit-scrollbar-thumb:hover {
  background: rgba(187, 24, 20, 0.5);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: rgba(255, 255, 255, 0.5);
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.4;
  color: rgba(255, 255, 255, 0.3);
}

.empty-state p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
}

.notification-item {
  display: flex;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.notification-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.notification-item.unread {
  background: rgba(187, 24, 20, 0.08);
  border-left: 3px solid #bb1814;
}

.notification-item.unread:hover {
  background: rgba(187, 24, 20, 0.12);
}

.notification-item.unread::before {
  content: '';
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 6px;
  background: #bb1814;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(187, 24, 20, 0.6);
}

.notification-icon {
  flex-shrink: 0;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.notification-icon.bg-primary {
  background: linear-gradient(135deg, #bb1814 0%, #a30c0e 100%);
}
.notification-icon.bg-info {
  background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
}
.notification-icon.bg-success {
  background: linear-gradient(135deg, #28a745 0%, #1e7e34 100%);
}
.notification-icon.bg-danger {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
}
.notification-icon.bg-warning {
  background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
  color: #212529;
}
.notification-icon.bg-secondary {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: #fff;
  margin-bottom: 0.4rem;
  line-height: 1.3;
}

.notification-message {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.4rem;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.notification-time {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.dropdown-footer {
  padding: 0.75rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
  background: rgba(187, 24, 20, 0.05);
}

.view-all-link {
  color: #bb1814;
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.view-all-link:hover {
  color: #a30c0e;
  text-decoration: underline;
}

/* Loading spinner for dark theme */
.spinner-border {
  color: #bb1814;
  border-color: rgba(187, 24, 20, 0.2);
  border-top-color: #bb1814;
}

/* Mobile Responsive */
@media (max-width: 480px) {
  .dropdown-menu {
    width: 90vw;
    right: -50px;
  }

  .notification-item {
    padding: 1rem;
  }

  .dropdown-header {
    padding: 1rem;
  }

  .notification-icon {
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }

  .notification-title {
    font-size: 0.9rem;
  }

  .notification-message {
    font-size: 0.8rem;
  }
}

/* Animation for dropdown */
.dropdown-menu {
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
