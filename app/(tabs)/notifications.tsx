import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Mock notification data with read status
const initialNotifications = {
  pendingTasks: [
    {
      id: '1',
      title: 'NFT Mobile App Design',
      sender: {
        name: 'Sarah Wilson',
        avatar: 'https://i.pravatar.cc/150?img=1'
      },
      timestamp: '2 hours ago',
      type: 'task_assignment',
      read: false
    },
    {
      id: '2',
      title: 'Website Redesign',
      sender: {
        name: 'Mike Johnson',
        avatar: 'https://i.pravatar.cc/150?img=2'
      },
      timestamp: '5 hours ago',
      type: 'task_assignment',
      read: false
    }
  ],
  comments: [
    {
      id: '3',
      taskTitle: 'Landing Page Design',
      sender: {
        name: 'Emily Brown',
        avatar: 'https://i.pravatar.cc/150?img=3'
      },
      comment: 'Can we schedule a quick call to discuss the color scheme?',
      timestamp: '1 hour ago',
      type: 'comment',
      read: false
    }
  ],
  closedTasks: [
    {
      id: '4',
      taskTitle: 'Mobile App Wireframes',
      sender: {
        name: 'David Lee',
        avatar: 'https://i.pravatar.cc/150?img=4'
      },
      timestamp: '3 hours ago',
      type: 'task_closed',
      read: false
    }
  ]
};

export default function Notifications() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = (notificationType: string, id: string) => {
    setNotifications(prev => ({
      ...prev,
      [notificationType]: prev[notificationType].map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    }));
  };

  const handleClearAll = () => {
    setNotifications(prev => ({
      pendingTasks: prev.pendingTasks.map(n => ({ ...n, read: true })),
      comments: prev.comments.map(n => ({ ...n, read: true })),
      closedTasks: prev.closedTasks.map(n => ({ ...n, read: true }))
    }));
  };

  const renderNotification = (notification: any, type: string) => {
    const getIcon = () => {
      switch (notification.type) {
        case 'task_assignment':
          return 'add-circle-outline';
        case 'comment':
          return 'chatbubble-outline';
        case 'task_closed':
          return 'checkmark-circle-outline';
        default:
          return 'notifications-outline';
      }
    };

    const getMessage = () => {
      switch (notification.type) {
        case 'task_assignment':
          return `assigned you to "${notification.title}"`;
        case 'comment':
          return `commented on "${notification.taskTitle}": ${notification.comment}`;
        case 'task_closed':
          return `completed "${notification.taskTitle}"`;
        default:
          return '';
      }
    };

    return (
      <TouchableOpacity 
        key={notification.id} 
        style={[
          styles.notificationCard,
          !notification.read && styles.unreadCard
        ]}
        onPress={() => {
          markAsRead(type, notification.id);
          router.push(`/task/${notification.id}`);
        }}
      >
        <View style={styles.notificationHeader}>
          <Image 
            source={{ uri: notification.sender.avatar }} 
            style={styles.avatar} 
          />
          <View style={styles.notificationContent}>
            <View style={styles.senderInfo}>
              <Text style={[
                styles.senderName,
                !notification.read && styles.unreadText
              ]}>{notification.sender.name}</Text>
              <Text style={styles.timestamp}>{notification.timestamp}</Text>
            </View>
            <Text style={[
              styles.message,
              !notification.read && styles.unreadText
            ]}>
              {getMessage()}
            </Text>
          </View>
          <View style={styles.iconContainer}>
            {!notification.read && <View style={styles.unreadDot} />}
            <Ionicons 
              name={getIcon()} 
              size={24} 
              color="#2A9D8F"
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={styles.clearAll}>Clear all</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {notifications.pendingTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pending Tasks</Text>
            {notifications.pendingTasks.map(n => renderNotification(n, 'pendingTasks'))}
          </View>
        )}

        {notifications.comments.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Comments</Text>
            {notifications.comments.map(n => renderNotification(n, 'comments'))}
          </View>
        )}

        {notifications.closedTasks.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Completed Tasks</Text>
            {notifications.closedTasks.map(n => renderNotification(n, 'closedTasks'))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  clearAll: {
    fontSize: 14,
    color: '#2A9D8F',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  notificationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    marginRight: 12,
  },
  senderInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  message: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  unreadCard: {
    backgroundColor: '#F8F9FA',
  },
  unreadText: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
    position: 'absolute',
    top: -4,
    right: -4,
  },
  iconContainer: {
    position: 'relative',
  },
}); 