import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  TextInput,
  Modal,
  Alert,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getColors } from '../../constants/colors';
import { Conversation } from '../../types/chat';
import { chatApi } from '../../api/chatApi';

type RootStackParamList = {
  Chatroom: { conversationId: string; taskId: string; taskTitle: string };
};

type ConversationsListScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Participant {
  id: string;
  name: string;
  avatar?: string;
}

export const ConversationsListScreen: React.FC = () => {
  const navigation = useNavigation<ConversationsListScreenNavigationProp>();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const conversationsData = await chatApi.getConversations();
      setConversations(conversationsData);
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleConversationPress = async (conversation: Conversation) => {
    try {
      const participantsData = await chatApi.getParticipants(conversation.id);
      setParticipants(participantsData);
      setSelectedConversation(conversation);
      setShowParticipantsModal(true);
    } catch (err) {
      setError('Failed to load participants');
    }
  };

  const handleStartChat = () => {
    if (!selectedConversation) return;
    navigation.navigate('Chatroom', {
      conversationId: selectedConversation.id,
      taskId: selectedConversation.taskId,
      taskTitle: selectedConversation.taskTitle,
    });
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.taskTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversation = ({ item }: { item: Conversation }) => (
    <TouchableOpacity
      style={[styles.conversationItem, { backgroundColor: colors.cardBackground }]}
      onPress={() => handleConversationPress(item)}
    >
      <View style={styles.conversationContent}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
          <Text style={styles.avatarText}>
            {item.taskTitle.charAt(0).toUpperCase()}
          </Text>
        </View>
        <View style={styles.conversationInfo}>
          <Text style={[styles.taskTitle, { color: colors.text }]} numberOfLines={1}>
            {item.taskTitle}
          </Text>
          <Text style={[styles.lastMessage, { color: colors.secondaryText }]} numberOfLines={1}>
            {item.lastMessage || 'No messages yet'}
          </Text>
        </View>
        <View style={styles.conversationMeta}>
          <Text style={[styles.timestamp, { color: colors.secondaryText }]}>
            {new Date(item.lastMessageTimestamp).toLocaleDateString()}
          </Text>
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.errorText, { color: colors.secondaryText }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={loadConversations}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Conversations</Text>
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <MaterialIcons name="search" size={20} color={colors.secondaryText} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search conversations..."
            placeholderTextColor={colors.secondaryText}
          />
        </View>
      </View>

      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.conversationsList}
        showsVerticalScrollIndicator={false}
      />

      {/* Participants Modal */}
      <Modal
        visible={showParticipantsModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowParticipantsModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowParticipantsModal(false)}
        >
          <View style={[styles.participantsModal, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedConversation?.taskTitle}
              </Text>
              <TouchableOpacity onPress={() => setShowParticipantsModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.participantsList}>
              {participants.map((participant) => (
                <View key={participant.id} style={styles.participantItem}>
                  {participant.avatar ? (
                    <Image
                      source={{ uri: participant.avatar }}
                      style={styles.participantAvatar}
                    />
                  ) : (
                    <View style={[styles.participantAvatar, { backgroundColor: colors.primary }]}>
                      <Text style={styles.participantAvatarText}>
                        {participant.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  <Text style={[styles.participantName, { color: colors.text }]}>
                    {participant.name}
                  </Text>
                </View>
              ))}
            </View>
            <TouchableOpacity
              style={[styles.startChatButton, { backgroundColor: colors.primary }]}
              onPress={handleStartChat}
            >
              <Text style={styles.startChatButtonText}>Start Chat</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 16,
    paddingTop: 64,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  conversationsList: {
    padding: 16,
  },
  conversationItem: {
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  conversationContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  conversationInfo: {
    flex: 1,
    marginRight: 8,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    opacity: 0.7,
  },
  conversationMeta: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.6,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 15,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    opacity: 0.9,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  participantsModal: {
    width: '80%',
    maxHeight: '80%',
    borderRadius: 16,
    padding: 16,
    marginTop: '10%',
    alignSelf: 'center',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  participantsList: {
    maxHeight: '70%',
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  participantAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participantAvatarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  participantName: {
    fontSize: 16,
    fontWeight: '500',
  },
  startChatButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  startChatButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
