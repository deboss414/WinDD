import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { ChatRoom } from '../components/ChatRoom';

// Mock data - replace with your actual data source
const mockChatRoom = {
  id: '1',
  taskId: '1',
  participants: [
    { id: '1', name: 'John Doe', isAdmin: true },
    { id: '2', name: 'Jane Smith', isAdmin: false },
  ],
};

export default function ChatRoomScreen() {
  const { id, projectTitle, participants } = useLocalSearchParams<{ 
    id: string;
    projectTitle: string;
    participants: string;
  }>();
  
  // Mock current user - replace with your actual user management
  const currentUserId = '1';

  // Parse the participants JSON string back to an array
  const parsedParticipants = JSON.parse(participants || '[]');

  return (
    <View style={styles.container}>
      <ChatRoom
        projectTitle={projectTitle || ''}
        participants={parsedParticipants}
        currentUserId={currentUserId}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 