import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

const PRIMARY_COLOR = '#2A9D8F';
const SCREEN_HEIGHT = Dimensions.get('window').height;

type ParticipantType = {
  id: string;
  name: string;
  email: string;
};

type ScheduleType = 'meeting' | 'event' | 'task';

export default function ScheduleTask() {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date(date as string));
  const [startTime, setStartTime] = useState(() => {
    const now = new Date();
    // Set to the next hour
    now.setHours(now.getHours() + 1, 0, 0, 0);
    return now;
  });
  const [endTime, setEndTime] = useState(() => {
    const end = new Date(startTime);
    // Set to one hour after start time
    end.setHours(end.getHours() + 1);
    return end;
  });
  const [scheduleType, setScheduleType] = useState<ScheduleType>('meeting');
  const [participants, setParticipants] = useState<ParticipantType[]>([]);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newParticipant, setNewParticipant] = useState({ name: '', email: '' });
  const [timePickerPosition, setTimePickerPosition] = useState({ x: 0, y: 0 });
  const datePickerAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  const handleAddParticipant = () => {
    if (newParticipant.name && newParticipant.email) {
      setParticipants([
        ...participants,
        { ...newParticipant, id: Date.now().toString() },
      ]);
      setNewParticipant({ name: '', email: '' });
    }
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id));
  };

  const handleScheduleTypeSelect = (type: ScheduleType) => {
    setScheduleType(type);
  };

  const handleSave = () => {
    // Here you would typically save the schedule to your backend
    // For now, we'll just go back to the calendar
    router.back();
  };

  const handleStartTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
      // Update end time to be one hour after new start time
      const newEndTime = new Date(selectedTime);
      newEndTime.setHours(newEndTime.getHours() + 1);
      setEndTime(newEndTime);
    }
  };

  const handleEndTimeChange = (event: any, selectedTime: Date | undefined) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      // Ensure end time is not before start time
      if (selectedTime > startTime) {
        setEndTime(selectedTime);
      } else {
        // If selected end time is before start time, set it to one hour after start time
        const newEndTime = new Date(startTime);
        newEndTime.setHours(newEndTime.getHours() + 1);
        setEndTime(newEndTime);
      }
    }
  };

  const handleTimePress = (isStart: boolean, event: any) => {
    // Get the position of the touch
    const { pageY } = event.nativeEvent;
    setTimePickerPosition({ x: 0, y: pageY - 100 }); // Offset to show above the finger
    
    if (isStart) {
      setShowStartTimePicker(true);
    } else {
      setShowEndTimePicker(true);
    }
  };

  const handleDatePress = (event: any) => {
    setShowDatePicker(true);
    Animated.spring(datePickerAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 8,
    }).start();
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Keep the original time when changing date
      const newDate = new Date(selectedDate);
      newDate.setHours(startTime.getHours(), startTime.getMinutes());
      setSelectedDate(newDate);
      
      // Update start and end times to maintain the same time on the new date
      const newStartTime = new Date(newDate);
      newStartTime.setHours(startTime.getHours(), startTime.getMinutes());
      setStartTime(newStartTime);
      
      const newEndTime = new Date(newDate);
      newEndTime.setHours(endTime.getHours(), endTime.getMinutes());
      setEndTime(newEndTime);
    }

    // Animate the picker down
    Animated.spring(datePickerAnim, {
      toValue: SCREEN_HEIGHT,
      useNativeDriver: true,
      bounciness: 8,
    }).start(() => {
      setShowDatePicker(false);
    });
  };

  const handleCloseDatePicker = () => {
    Animated.spring(datePickerAnim, {
      toValue: SCREEN_HEIGHT,
      useNativeDriver: true,
      bounciness: 8,
    }).start(() => {
      setShowDatePicker(false);
    });
  };

  const renderTimePicker = () => {
    if (Platform.OS === 'android') {
      return (
        <>
          {showStartTimePicker && (
            <View style={[styles.timePickerContainer, { top: timePickerPosition.y }]}>
              <DateTimePicker
                value={startTime}
                mode="time"
                is24Hour={false}
                onChange={handleStartTimeChange}
                display="spinner"
              />
            </View>
          )}
          {showEndTimePicker && (
            <View style={[styles.timePickerContainer, { top: timePickerPosition.y }]}>
              <DateTimePicker
                value={endTime}
                mode="time"
                is24Hour={false}
                onChange={handleEndTimeChange}
                display="spinner"
              />
            </View>
          )}
        </>
      );
    }

    // iOS modal picker
    return (
      <>
        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            is24Hour={false}
            onChange={handleStartTimeChange}
            display="spinner"
          />
        )}
        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            is24Hour={false}
            onChange={handleEndTimeChange}
            display="spinner"
          />
        )}
      </>
    );
  };

  const renderDatePicker = () => {
    if (Platform.OS === 'android') {
      return showDatePicker && (
        <Animated.View 
          style={[
            styles.datePickerContainer,
            {
              transform: [{ translateY: datePickerAnim }],
            },
          ]}
        >
          <View style={styles.datePickerHeader}>
            <Text style={styles.datePickerTitle}>Select Date</Text>
            <TouchableOpacity
              onPress={handleCloseDatePicker}
              style={styles.datePickerCloseButton}
            >
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            onChange={handleDateChange}
            display="calendar"
          />
        </Animated.View>
      );
    }

    // iOS modal picker
    return showDatePicker && (
      <Animated.View 
        style={[
          styles.datePickerContainer,
          {
            transform: [{ translateY: datePickerAnim }],
          },
        ]}
      >
        <View style={styles.datePickerHeader}>
          <Text style={styles.datePickerTitle}>Select Date</Text>
          <TouchableOpacity
            onPress={handleCloseDatePicker}
            style={styles.datePickerCloseButton}
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <DateTimePicker
          value={selectedDate}
          mode="date"
          onChange={handleDateChange}
          display="inline"
        />
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Schedule</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.typeSelector}>
          {(['meeting', 'event'] as ScheduleType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.typeButton,
                scheduleType === type && styles.selectedTypeButton,
              ]}
              onPress={() => handleScheduleTypeSelect(type)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  scheduleType === type && styles.selectedTypeButtonText,
                ]}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#666"
        />

        <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          placeholderTextColor="#666"
        />

        <View style={styles.dateTimeSection}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={handleDatePress}
          >
            <Text style={styles.dateText}>
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </Text>
            <Ionicons name="calendar-outline" size={20} color="#666" />
          </TouchableOpacity>
          
          <View style={styles.timeInputs}>
            <TouchableOpacity
              style={styles.timeInput}
              onPress={(event) => handleTimePress(true, event)}
            >
              <Text style={styles.timeInputLabel}>Start Time</Text>
              <Text style={styles.timeText}>
                {format(startTime, 'h:mm a')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.timeInput}
              onPress={(event) => handleTimePress(false, event)}
            >
              <Text style={styles.timeInputLabel}>End Time</Text>
              <Text style={styles.timeText}>
                {format(endTime, 'h:mm a')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.participantsSection}>
          <Text style={styles.sectionTitle}>Participants</Text>
          
          <View style={styles.addParticipantForm}>
            <TextInput
              style={[styles.input, styles.participantInput]}
              placeholder="Name"
              value={newParticipant.name}
              onChangeText={(text) => setNewParticipant({ ...newParticipant, name: text })}
              placeholderTextColor="#666"
            />
            <TextInput
              style={[styles.input, styles.participantInput]}
              placeholder="Email"
              value={newParticipant.email}
              onChangeText={(text) => setNewParticipant({ ...newParticipant, email: text })}
              keyboardType="email-address"
              placeholderTextColor="#666"
            />
            <TouchableOpacity
              style={styles.addParticipantButton}
              onPress={handleAddParticipant}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {participants.map((participant) => (
            <View key={participant.id} style={styles.participantItem}>
              <View>
                <Text style={styles.participantName}>{participant.name}</Text>
                <Text style={styles.participantEmail}>{participant.email}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveParticipant(participant.id)}
              >
                <Ionicons name="close-circle" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {renderDatePicker()}
      {renderTimePicker()}
    </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    color: PRIMARY_COLOR,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: PRIMARY_COLOR,
  },
  typeButtonText: {
    color: '#444',
    fontSize: 14,
    fontWeight: '600',
  },
  selectedTypeButtonText: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dateText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  timeInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  timeInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeInputLabel: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 16,
    fontWeight: '500',
  },
  participantsSection: {
    marginBottom: 24,
  },
  addParticipantForm: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  participantInput: {
    flex: 1,
    marginBottom: 0,
  },
  addParticipantButton: {
    width: 48,
    height: 48,
    backgroundColor: PRIMARY_COLOR,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  participantName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  participantEmail: {
    fontSize: 14,
    color: '#444',
    fontWeight: '500',
  },
  timePickerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  datePickerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  datePickerCloseButton: {
    padding: 8,
  },
}); 