import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ChatRoom {
  id: string;
  projectTitle: string;
  lastMessage: {
    content: string;
    senderName: string;
    timestamp: Date;
  };
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
}

// Mock data for project conversations
const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    projectTitle: 'NFT Mobile App Design',
    lastMessage: {
      content: 'The latest mockups for the NFT gallery look great!',
      senderName: 'Jane Smith',
      timestamp: new Date(Date.now() - 1800000), // 30 mins ago
    },
    participants: [
      { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
  },
  {
    id: '2',
    projectTitle: 'E-commerce Dashboard',
    lastMessage: {
      content: 'Updated the sales analytics component with new charts',
      senderName: 'Alex Wilson',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    },
    participants: [
      { id: '4', name: 'Alex Wilson', avatar: 'https://i.pravatar.cc/150?img=4' },
      { id: '5', name: 'Sarah Brown', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
    ],
  },
  {
    id: '3',
    projectTitle: 'Social Media Integration',
    lastMessage: {
      content: 'API integration for Twitter posts is now complete',
      senderName: 'Sarah Brown',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    },
    participants: [
      { id: '5', name: 'Sarah Brown', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: '6', name: 'David Lee', avatar: 'https://i.pravatar.cc/150?img=6' },
      { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
    ],
  },
];

export default function ChatRooms() {
  const handleChatRoomPress = (chatRoom: ChatRoom) => {
    router.push({
      pathname: '/chat-room/[id]',
      params: { 
        id: chatRoom.id,
        projectTitle: chatRoom.projectTitle,
        participants: JSON.stringify(chatRoom.participants)
      }
    });
  };

  const renderChatRoom = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity
      style={styles.chatRoomCard}
      onPress={() => handleChatRoomPress(item)}
    >
      <View style={styles.chatRoomContent}>
        <View style={styles.chatRoomHeader}>
          <Text style={styles.projectTitle}>{item.projectTitle}</Text>
          <Text style={styles.timestamp}>
            {formatTimestamp(item.lastMessage.timestamp)}
          </Text>
        </View>

        <View style={styles.lastMessageContainer}>
          <Text style={styles.senderName}>{item.lastMessage.senderName}: </Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage.content}
          </Text>
        </View>

        <View style={styles.participantsContainer}>
          {item.participants.map((participant, index) => (
            <Image
              key={participant.id}
              source={{ uri: participant.avatar }}
              style={[
                styles.participantAvatar,
                index > 0 && { marginLeft: -12 }
              ]}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Project Conversations</Text>
      </View>
      <FlatList
        data={mockChatRooms}
        renderItem={renderChatRoom}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  listContent: {
    padding: 16,
  },
  chatRoomCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chatRoomContent: {
    gap: 8,
  },
  chatRoomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  lastMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  senderName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  participantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#fff',
  },
}); 