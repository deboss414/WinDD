import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Dimensions,
  Platform,
  PanResponder,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Calendar } from 'react-native-calendars';
import { format } from 'date-fns';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const PANEL_HEIGHT = SCREEN_HEIGHT * 0.5;
const DRAG_THRESHOLD = 50;
const PRIMARY_COLOR = '#2A9D8F';

// Mock data
const tasks = [
  {
    id: '1',
    title: 'Design NFT Marketplace Homepage',
    time: { start: '09:00', end: '17:00' },
    date: new Date(2024, 7, 19), // Using due date from tasks list
    category: ['Design', 'NFT', 'Project'],
    participants: [
      { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
    ],
    status: 'in-progress',
    progress: 45,
  },
  {
    id: '2',
    title: 'Implement User Authentication',
    time: { start: '10:00', end: '16:00' },
    date: new Date(2024, 7, 18), // Using due date from tasks list
    category: ['Development', 'Authentication'],
    participants: [
      { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
    status: 'completed',
    progress: 100,
  },
  {
    id: '3',
    title: 'Create Product Listing Page',
    time: { start: '11:00', end: '15:00' },
    date: new Date(2024, 7, 25), // Using due date from tasks list
    category: ['Design', 'E-commerce'],
    participants: [
      { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
    status: 'in-progress',
    progress: 60,
  },
  {
    id: '4',
    title: 'Setup Payment Integration',
    time: { start: '14:00', end: '18:00' },
    date: new Date(2024, 7, 15), // Using due date from tasks list
    category: ['Development', 'Payment'],
    participants: [
      { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
    ],
    status: 'expired',
    progress: 30,
  },
];

export default function CalendarScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const slideAnim = useRef(new Animated.Value(PANEL_HEIGHT)).current;
  const [isExpanded, setIsExpanded] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;

  const resetPanY = () => {
    panY.setValue(0);
  };

  const slideUp = () => {
    setIsExpanded(true);
    resetPanY();
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const slideDown = () => {
    setIsExpanded(false);
    resetPanY();
    Animated.spring(slideAnim, {
      toValue: PANEL_HEIGHT,
      useNativeDriver: true,
      bounciness: 0,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        const { dy } = gestureState;
        return Math.abs(dy) > 10;
      },
      onPanResponderGrant: () => {
        panY.extractOffset();
      },
      onPanResponderMove: (_, gestureState) => {
        const { dy } = gestureState;
        // Only allow downward movement when expanded, and upward when collapsed
        if ((isExpanded && dy > 0) || (!isExpanded && dy < 0)) {
          panY.setValue(dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;

        // If panel is expanded
        if (isExpanded) {
          if (dy > DRAG_THRESHOLD || vy > 0.5) {
            slideDown();
          } else {
            slideUp();
          }
        }
        // If panel is collapsed
        else {
          if (dy < -DRAG_THRESHOLD || vy < -0.5) {
            slideUp();
          } else {
            slideDown();
          }
        }
      },
    })
  ).current;

  const markedDates = tasks.reduce((acc, task) => {
    const date = format(task.date, 'yyyy-MM-dd');
    acc[date] = {
      marked: true,
      dotColor: PRIMARY_COLOR,
    };
    return acc;
  }, {} as Record<string, { marked: boolean; dotColor: string }>);

  const handleDateSelect = (day: any) => {
    // Create date at noon to avoid timezone issues
    const selectedDate = new Date(day.year, day.month - 1, day.day, 12);
    setSelectedDate(selectedDate);
    slideUp();
  };

  const handleSchedule = () => {
    router.push({
      pathname: '/schedule-task',
      params: { date: format(selectedDate, 'yyyy-MM-dd') }
    });
  };

  const handleTaskPress = (task: any) => {
    router.push({
      pathname: '/project-details',
      params: {
        id: task.id,
        title: task.title,
        dueDate: task.date.toISOString(),
        progress: task.progress,
        status: task.status,
        priority: 'High', // Default priority for tasks
        description: `Task scheduled from ${task.time.start} to ${task.time.end}`,
        participants: JSON.stringify(task.participants)
      }
    });
  };

  const renderTaskList = () => {
    const dayTasks = tasks.filter(task => 
      format(task.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );

    return (
      <ScrollView style={styles.taskList} showsVerticalScrollIndicator={false}>
        {dayTasks.map(task => (
          <TouchableOpacity 
            key={task.id} 
            style={[styles.taskCard, { borderLeftWidth: 3, borderLeftColor: getStatusColor(task.status) }]}
            onPress={() => handleTaskPress(task)}
          >
            <View style={styles.taskHeader}>
              <Text style={styles.taskTime}>
                {task.time.start} - {task.time.end}
              </Text>
              <View style={styles.statusBadge}>
                <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Text>
              </View>
            </View>
            <Text style={styles.taskTitle}>{task.title}</Text>
            <View style={styles.categoryContainer}>
              {task.category.map((cat, index) => (
                <View key={index} style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{cat}</Text>
                </View>
              ))}
            </View>
            <View style={styles.participantsContainer}>
              {task.participants.map((participant, index) => (
                <View key={participant.id} style={[
                  styles.participantAvatar,
                  { marginLeft: index > 0 ? -12 : 0 }
                ]}>
                  <Image 
                    source={{ uri: participant.avatar }} 
                    style={styles.avatarImage}
                  />
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return '#2A9D8F';
      case 'completed':
        return '#2196F3';
      case 'expired':
        return '#F44336';
      default:
        return '#2A9D8F';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.scheduleButton}
            onPress={handleSchedule}
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text style={styles.scheduleButtonText}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-task')}
          >
            <Ionicons name="calendar-outline" size={24} color={PRIMARY_COLOR} />
          </TouchableOpacity>
        </View>
      </View>

      <Calendar
        current={format(selectedDate, 'yyyy-MM-dd')}
        onDayPress={handleDateSelect}
        markedDates={{
          ...markedDates,
          [format(selectedDate, 'yyyy-MM-dd')]: {
            ...markedDates[format(selectedDate, 'yyyy-MM-dd')],
            selected: true,
            selectedColor: PRIMARY_COLOR,
          },
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#666',
          selectedDayBackgroundColor: PRIMARY_COLOR,
          selectedDayTextColor: '#ffffff',
          todayTextColor: PRIMARY_COLOR,
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: PRIMARY_COLOR,
          monthTextColor: '#2d4150',
          arrowColor: PRIMARY_COLOR,
          textDayFontWeight: '500',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: '500',
        }}
      />

      <Animated.View
        style={[
          styles.panel,
          {
            transform: [
              {
                translateY: Animated.add(slideAnim, panY),
              },
            ],
          },
        ]}
      >
        <View {...panResponder.panHandlers}>
          <View style={styles.panelHeader}>
            <View style={styles.panelHandle} />
            <Text style={styles.panelTitle}>
              {format(selectedDate, 'EEEE, MMMM d')}
            </Text>
            <TouchableOpacity
              style={styles.addTaskButton}
              onPress={() => router.push('/add-task')}
            >
              <Ionicons name="add-circle-outline" size={24} color={PRIMARY_COLOR} />
            </TouchableOpacity>
          </View>
        </View>
        {renderTaskList()}
      </Animated.View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scheduleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PRIMARY_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  scheduleButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    padding: 8,
  },
  panel: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: PANEL_HEIGHT,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  panelHeader: {
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  panelHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 8,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  addTaskButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 8,
  },
  taskList: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTime: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  categoryBadge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    color: PRIMARY_COLOR,
    fontSize: 12,
    fontWeight: '500',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  participantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 