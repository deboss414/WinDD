import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'document';
  fileUrl?: string;
  fileName?: string;
  likes: string[];  // Array of user IDs who liked the message
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  };
  deleted?: boolean;
}

interface ChatRoomProps {
  projectTitle: string;
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
  }>;
  currentUserId: string;
}

interface MentionData {
  id: string;
  name: string;
  position: number;
}

// Mock messages based on project context
const getMockMessages = (projectTitle: string, participants: ChatRoomProps['participants']): Message[] => {
  switch (projectTitle) {
    case 'NFT Mobile App Design':
      return [
        {
          id: '1',
          senderId: '2',
          senderName: 'Jane Smith',
          content: "I've updated the design mockups for the NFT gallery section",
          timestamp: new Date(Date.now() - 3600000),
          type: 'text',
          likes: [],
        },
        {
          id: '2',
          senderId: '1',
          senderName: 'John Doe',
          content: 'Great work! The color scheme looks much better now',
          timestamp: new Date(Date.now() - 3500000),
          type: 'text',
          likes: [],
        },
        {
          id: '3',
          senderId: '3',
          senderName: 'Mike Johnson',
          content: 'Can we discuss the user flow for minting NFTs?',
          timestamp: new Date(Date.now() - 3400000),
          type: 'text',
          likes: [],
        }
      ];
    case 'E-commerce Dashboard':
      return [
        {
          id: '1',
          senderId: '4',
          senderName: 'Alex Wilson',
          content: 'Updated the sales analytics component with new charts',
          timestamp: new Date(Date.now() - 3600000),
          type: 'text',
          likes: [],
        },
        {
          id: '2',
          senderId: '5',
          senderName: 'Sarah Brown',
          content: 'The dashboard looks great! Can we add more filtering options?',
          timestamp: new Date(Date.now() - 3500000),
          type: 'text',
          likes: [],
        }
      ];
    case 'Social Media Integration':
      return [
        {
          id: '1',
          senderId: '5',
          senderName: 'Sarah Brown',
          content: 'API integration for Twitter posts is now complete',
          timestamp: new Date(Date.now() - 7200000),
          type: 'text',
          likes: [],
        },
        {
          id: '2',
          senderId: '6',
          senderName: 'David Lee',
          content: "Great! Let's test the Instagram integration next",
          timestamp: new Date(Date.now() - 7100000),
          type: 'text',
          likes: [],
        }
      ];
    default:
      return [];
  }
};

export function ChatRoom({ projectTitle, participants, currentUserId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(() => getMockMessages(projectTitle, participants));
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [mentions, setMentions] = useState<MentionData[]>([]);

  const handleTextChange = (text: string) => {
    setNewMessage(text);
    
    // Check for @ symbol
    const lastAtSymbol = text.lastIndexOf('@');
    if (lastAtSymbol !== -1) {
      const query = text.slice(lastAtSymbol + 1);
      setMentionQuery(query);
      setMentionPosition(lastAtSymbol);
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
  };

  const handleMentionSelect = (participant: typeof participants[0]) => {
    const beforeMention = newMessage.slice(0, mentionPosition);
    const afterMention = newMessage.slice(mentionPosition + mentionQuery.length + 1);
    const newText = `${beforeMention}@${participant.name} ${afterMention}`;
    
    setNewMessage(newText);
    setShowMentions(false);
    setMentions([...mentions, {
      id: participant.id,
      name: participant.name,
      position: mentionPosition
    }]);
  };

  const filteredParticipants = participants.filter(p => 
    p.name.toLowerCase().includes(mentionQuery.toLowerCase()) &&
    p.id !== currentUserId
  );

  const renderMentionItem = ({ item }: { item: typeof participants[0] }) => (
    <TouchableOpacity 
      style={styles.mentionItem}
      onPress={() => handleMentionSelect(item)}
    >
      <Image 
        source={{ uri: item.avatar }} 
        style={styles.mentionAvatar} 
      />
      <Text style={styles.mentionName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: participants.find(p => p.id === currentUserId)?.name || 'Unknown',
      content: newMessage,
      timestamp: new Date(),
      type: 'text',
      likes: [],
      ...(replyingTo && {
        replyTo: {
          id: replyingTo.id,
          content: replyingTo.content,
          senderName: replyingTo.senderName,
        },
      }),
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage('');
    setReplyingTo(null);
  };

  const handleLikeMessage = (messageId: string) => {
    setMessages(prev => prev.map(message => {
      if (message.id === messageId) {
        const likes = message.likes || [];
        const userLikedIndex = likes.indexOf(currentUserId);
        
        if (userLikedIndex === -1) {
          return { ...message, likes: [...likes, currentUserId] };
        } else {
          return { 
            ...message, 
            likes: likes.filter(id => id !== currentUserId) 
          };
        }
      }
      return message;
    }));
  };

  const handleReplyMessage = (message: Message) => {
    setReplyingTo(message);
  };

  const handleDeleteMessage = (messageId: string) => {
    Alert.alert(
      'Delete Message',
      'Are you sure you want to delete this message?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMessages(prev => prev.map(message => 
              message.id === messageId 
                ? { ...message, deleted: true, content: 'Message was deleted' }
                : message
            ));
          },
        },
      ],
    );
  };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photo library to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: currentUserId,
        senderName: participants.find(p => p.id === currentUserId)?.name || 'Unknown',
        content: 'Sent an image',
        timestamp: new Date(),
        type: 'image',
        fileUrl: result.assets[0].uri,
        likes: [],
      };

      setMessages(prev => [message, ...prev]);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === currentUserId;
    const sender = participants.find(p => p.id === item.senderId);
    const isLiked = item.likes?.includes(currentUserId);

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        {!isOwnMessage && (
          <View style={styles.senderInfo}>
            <Image 
              source={{ uri: sender?.avatar }} 
              style={styles.senderAvatar} 
            />
            <Text style={styles.senderName}>{sender?.name}</Text>
          </View>
        )}

        {item.replyTo && (
          <View style={styles.replyContainer}>
            <Text style={styles.replyText}>
              Replied to: {item.replyTo.senderName}
            </Text>
            <Text style={styles.replyContent} numberOfLines={1}>
              {item.replyTo.content}
            </Text>
          </View>
        )}
        
        {item.type === 'text' && (
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText,
            item.deleted && (isOwnMessage ? styles.deletedMessageTextOwn : styles.deletedMessageText)
          ]}>
            {item.content}
          </Text>
        )}

        {item.type === 'image' && item.fileUrl && !item.deleted && (
          <Image 
            source={{ uri: item.fileUrl }} 
            style={styles.messageImage} 
            resizeMode="cover"
          />
        )}

        <View style={styles.messageFooter}>
          <Text style={[
            styles.timestamp,
            isOwnMessage && { color: 'rgba(255, 255, 255, 0.9)' }
          ]}>
            {item.timestamp.toLocaleTimeString()}
          </Text>
          
          {!item.deleted && (
            <View style={styles.messageActions}>
              <TouchableOpacity 
                onPress={() => handleLikeMessage(item.id)}
                style={styles.actionIcon}
              >
                <Ionicons 
                  name={isLiked ? "heart" : "heart-outline"} 
                  size={18} 
                  color={isLiked ? "#e91e63" : "#2A9D8F"} 
                />
                {item.likes?.length > 0 && (
                  <Text style={styles.likeCount}>{item.likes.length}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => handleReplyMessage(item)}
                style={styles.actionIcon}
              >
                <Ionicons 
                  name="return-up-back" 
                  size={18} 
                  color="#2A9D8F" 
                />
              </TouchableOpacity>

              {isOwnMessage && (
                <TouchableOpacity 
                  onPress={() => handleDeleteMessage(item.id)}
                  style={styles.actionIcon}
                >
                  <Ionicons 
                    name="trash-outline" 
                    size={18} 
                    color="#ff6b6b" 
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Task Chatroom</Text>
        <Text style={styles.projectTitle}>{projectTitle}</Text>
      </View>
      
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        inverted
        contentContainerStyle={styles.messagesList}
      />
      
      {replyingTo && (
        <View style={styles.replyBar}>
          <View style={styles.replyInfo}>
            <Text style={styles.replyLabel}>
              Replied to: {replyingTo.senderName}
            </Text>
            <Text style={styles.replyPreview} numberOfLines={1}>
              {replyingTo.content}
            </Text>
          </View>
          <TouchableOpacity 
            onPress={() => setReplyingTo(null)}
            style={styles.cancelReply}
          >
            <Ionicons name="close" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <View style={styles.inputActions}>
          <TouchableOpacity onPress={handleImageUpload} style={styles.actionButton}>
            <Ionicons name="image" size={24} color="#2A9D8F" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.inputWrapper}>
          <TextInput
            value={newMessage}
            onChangeText={handleTextChange}
            placeholder="Type a message... Use @ to mention"
            style={styles.input}
            multiline
          />
          
          {showMentions && filteredParticipants.length > 0 && (
            <View style={styles.mentionsContainer}>
              <FlatList
                data={filteredParticipants}
                renderItem={renderMentionItem}
                keyExtractor={item => item.id}
                style={styles.mentionsList}
                keyboardShouldPersistTaps="always"
              />
            </View>
          )}
        </View>
        
        <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  projectTitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 8,
    padding: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2A9D8F',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
  },
  senderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  senderName: {
    fontSize: 12,
    color: '#666',
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#000',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginVertical: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#444',
    marginTop: 4,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  inputActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginRight: 8,
  },
  inputWrapper: {
    flex: 1,
    position: 'relative',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 20,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#2A9D8F',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  messageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  likeCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#444',
  },
  replyContainer: {
    backgroundColor: '#E8F5F4',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#2A9D8F',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  replyText: {
    fontSize: 13,
    color: '#2A9D8F',
    fontWeight: '700',
  },
  replyContent: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
    fontWeight: '500',
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#E8F5F4',
    borderTopWidth: 1,
    borderTopColor: '#2A9D8F',
  },
  replyInfo: {
    flex: 1,
  },
  replyLabel: {
    fontSize: 13,
    color: '#2A9D8F',
    fontWeight: '700',
  },
  replyPreview: {
    fontSize: 13,
    color: '#333',
    marginTop: 2,
    fontWeight: '500',
  },
  cancelReply: {
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 20,
  },
  deletedMessageText: {
    fontStyle: 'italic',
    color: '#666',
    fontWeight: '500',
  },
  deletedMessageTextOwn: {
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '500',
  },
  mentionsContainer: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 12,
    maxHeight: 200,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  mentionsList: {
    padding: 8,
  },
  mentionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f8f8',
    marginBottom: 4,
  },
  mentionAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  mentionName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2A9D8F',
  },
}); 