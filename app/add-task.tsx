import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  Image,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Picker } from '@react-native-picker/picker';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'In Progress' | 'Done';
  progress: number;
  hasChatRoom: boolean;
}

// Mock data for team members
const teamMembers = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: '4', name: 'Sarah Wilson', avatar: 'https://i.pravatar.cc/150?img=4' },
];

const priorities = [
  { id: 'high', label: 'High Priority', color: '#F44336', icon: 'alert-circle' },
  { id: 'medium', label: 'Medium Priority', color: '#FB8C00', icon: 'alert' },
  { id: 'low', label: 'Low Priority', color: '#2A9D8F', icon: 'information-circle' },
];

export default function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState<Task['priority']>('Medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [includeChatRoom, setIncludeChatRoom] = useState(false);

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      dueDate,
      priority,
      status: 'Todo',
      progress: 0,
      hasChatRoom: includeChatRoom,
    };

    // Here you would typically save the task to your state management solution
    console.log('New task:', newTask);
    
    router.back();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const toggleMemberSelection = (memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectedPriority = priorities.find(p => p.id === priority);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Task</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Task Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Enter task title"
              placeholderTextColor="#8e8e93"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter task description"
              placeholderTextColor="#8e8e93"
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority Level</Text>
            <TouchableOpacity
              style={styles.priorityButton}
              onPress={() => setShowMembersModal(true)}
            >
              {priority ? (
                <View style={styles.selectedPriority}>
                  <Ionicons 
                    name={selectedPriority?.icon as any} 
                    size={24} 
                    color={selectedPriority?.color} 
                  />
                  <Text style={[styles.priorityText, { color: selectedPriority?.color }]}>
                    {selectedPriority?.label}
                  </Text>
                </View>
              ) : (
                <Text style={styles.placeholderText}>Select priority level</Text>
              )}
              <Ionicons name="chevron-down" size={24} color="#8e8e93" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {format(dueDate, 'EEEE, MMMM d, yyyy')}
              </Text>
              <Ionicons name="calendar" size={24} color="#2A9D8F" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Assign To</Text>
            <TouchableOpacity
              style={styles.teamButton}
              onPress={() => setShowMembersModal(true)}
            >
              {selectedMembers.length > 0 ? (
                <View style={styles.selectedMembers}>
                  {selectedMembers.map((memberId, index) => {
                    const member = teamMembers.find(m => m.id === memberId);
                    if (!member) return null;
                    return (
                      <View key={member.id} style={[
                        styles.memberAvatar,
                        index > 0 && { marginLeft: -15 }
                      ]}>
                        <Image source={{ uri: member.avatar }} style={styles.avatarImage} />
                      </View>
                    );
                  })}
                  <Text style={styles.selectedCount}>
                    {selectedMembers.length} member{selectedMembers.length !== 1 ? 's' : ''} selected
                  </Text>
                </View>
              ) : (
                <Text style={styles.placeholderText}>Select team members</Text>
              )}
              <Ionicons name="chevron-down" size={24} color="#8e8e93" />
            </TouchableOpacity>
          </View>

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Include Chat Room</Text>
            <Switch
              value={includeChatRoom}
              onValueChange={setIncludeChatRoom}
              trackColor={{ false: '#767577', true: '#2A9D8F' }}
              thumbColor={includeChatRoom ? '#fff' : '#f4f3f4'}
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
          >
            <Text style={styles.submitButtonText}>Create Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Priority Selection Modal */}
      <Modal
        visible={showMembersModal}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Team Members</Text>
              <TouchableOpacity onPress={() => setShowMembersModal(false)}>
                <Ionicons name="close" size={24} color="#000000" />
              </TouchableOpacity>
            </View>
            {teamMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={[
                  styles.memberOption,
                  selectedMembers.includes(member.id) && styles.selectedMemberOption
                ]}
                onPress={() => toggleMemberSelection(member.id)}
              >
                <View style={styles.memberOptionContent}>
                  <Image source={{ uri: member.avatar }} style={styles.memberOptionAvatar} />
                  <Text style={styles.memberOptionText}>{member.name}</Text>
                </View>
                {selectedMembers.includes(member.id) && (
                  <Ionicons name="checkmark" size={24} color="#2A9D8F" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Date Picker Modal */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="spinner"
                onChange={onDateChange}
                minimumDate={new Date()}
                textColor="#000000"
                style={styles.datePickerIOS}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={dueDate}
            mode="date"
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    paddingTop: 60,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000000',
  },
  form: {
    padding: 16,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  priorityButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedPriority: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityText: {
    fontSize: 16,
    fontWeight: '500',
  },
  placeholderText: {
    fontSize: 16,
    color: '#8e8e93',
  },
  teamButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedMembers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  selectedCount: {
    marginLeft: 12,
    fontSize: 16,
    color: '#000000',
  },
  submitButton: {
    backgroundColor: '#2A9D8F',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  modalCancelText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  modalDoneText: {
    color: '#2A9D8F',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerIOS: {
    height: 200,
    width: '100%',
  },
  memberOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  memberOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  memberOptionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  memberOptionText: {
    fontSize: 16,
    color: '#000000',
  },
  selectedMemberOption: {
    backgroundColor: '#f8f8f8',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    marginBottom: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
});