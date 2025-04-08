import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  useColorScheme,
  Modal,
  TextInput,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getColors } from '../../constants/colors';
import TaskService from '../../services/TaskService';
import { SubTask } from '../../components/task/SubTask';
import { SubTaskFormModal } from '../../components/task/SubTaskFormModal';
import UserService from '../../services/UserService';
import { TaskStatus, Task } from '../../types/task';
import { StackNavigationProp } from '@react-navigation/stack';
import { chatApi } from '../../api/chatApi';
import { TaskHeader } from '../../components/task/TaskHeader';
import { TaskInfo } from '../../components/task/TaskInfo';
import { TaskSubtasks } from '../../components/task/TaskSubtasks';
import { Comment } from './components/Comment';
import { ChatStackParamList } from '../../navigation/ChatNavigator';

type RootStackParamList = {
  TaskDetail: { taskId: string };
  Chatroom: {
    conversationId: string;
    taskId: string;
    taskTitle: string;
    taskStatus: string;
    isFirstLoad: boolean;
  };
};

type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;
type TaskDetailScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface Props {
  route: TaskDetailScreenRouteProp;
}

export const TaskDetailScreen: React.FC<Props> = ({ route }) => {
  const { taskId } = route.params;
  const navigation = useNavigation<TaskDetailScreenNavigationProp>();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme || 'light');
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showParticipantModal, setShowParticipantModal] = useState(false);
  const [newParticipantEmail, setNewParticipantEmail] = useState('');
  const [isSubTaskModalVisible, setIsSubTaskModalVisible] = useState(false);
  const [isCreatingSubTask, setIsCreatingSubTask] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const isDark = colorScheme === 'dark';
  const [participantEmail, setParticipantEmail] = useState('');
  const [participantError, setParticipantError] = useState<string | null>(null);
  const [isAddingParticipant, setIsAddingParticipant] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showSubTaskModal, setShowSubTaskModal] = useState(false);
  const [editingSubTask, setEditingSubTask] = useState<SubTask | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    dueDate: new Date(),
    status: 'In progress' as TaskStatus,
  });

  // Add navigation options
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
      header: () => null,
    });
  }, [navigation]);

  const loadTaskDetails = async () => {
    try {
      setLoading(true);
      const taskService = TaskService.getInstance();
      const response = await taskService.getTask(taskId);
      setTask(response.task);
    } catch (err) {
      setError('Failed to load task details');
      Alert.alert('Error', 'Failed to load task details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTaskDetails();
  }, [taskId]);

  const calculateTaskProgress = (subtasks: SubTask[] | undefined): number => {
    const validSubtasks = subtasks ?? [];
    if (validSubtasks.length === 0) return 0;
    const totalProgress = validSubtasks.reduce((sum, subtask) => sum + (subtask.progress || 0), 0);
    return Math.round(totalProgress / validSubtasks.length);
  };

  const handleSubTaskProgressChange = async (subtaskId: string, progress: number) => {
    try {
      const taskService = TaskService.getInstance();
      const response = await taskService.updateTask(taskId, { 
        subtasks: task?.subtasks?.map(st => 
          st.id === subtaskId ? { ...st, progress, lastUpdated: new Date().toISOString() } : st
        ) ?? []
      });
      const updatedSubTask = response.task.subtasks?.find(st => st.id === subtaskId);

      if (updatedSubTask) {
         setTask(prev => prev ? { ...prev, subtasks: prev.subtasks?.map(st => st.id === subtaskId ? updatedSubTask : st) } : null);
      }

    } catch (err) {
      Alert.alert('Error', 'Failed to update subtask progress. Please try again.');
    }
  };

  const handleUpdateSubTask = async (subtaskId: string, data: Partial<SubTask>) => {
    try {
      const taskService = TaskService.getInstance();
      const response = await taskService.updateTask(taskId, {
        subtasks: task?.subtasks?.map(st => 
          st.id === subtaskId ? { ...st, ...data, lastUpdated: new Date().toISOString() } : st
        ) ?? []
      });
      const updatedSubTask = response.task.subtasks?.find(st => st.id === subtaskId);
      if (updatedSubTask) {
         setTask(prev => prev ? { ...prev, subtasks: prev.subtasks?.map(st => st.id === subtaskId ? updatedSubTask : st) } : null);
      }
    } catch (error) {
      console.error('Error updating subtask:', error);
      Alert.alert('Error', 'Failed to update subtask');
    }
  };

  const handleSubTaskSubmit = async (data: Omit<SubTask, 'id' | 'createdAt' | 'lastUpdated' | 'comments' | 'createdBy'>) => {
    try {
      setIsCreatingSubTask(true);
      const taskService = TaskService.getInstance();
      const newSubtask: SubTask = {
        ...data,
        id: `${taskId}-${task?.subtasks?.length ?? 0 + 1}`,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        createdBy: 'Mock User',
        comments: [],
        assignee: [],
        progress: data.progress || 0,
        title: data.title || 'Untitled Subtask'
      };
      const response = await taskService.updateTask(taskId, {
        subtasks: [...(task?.subtasks ?? []), newSubtask]
      });
      setTask(response.task);
      setIsSubTaskModalVisible(false);
    } catch (error) {
      console.error('Error creating subtask:', error);
      Alert.alert('Error', 'Failed to create subtask');
    } finally {
      setIsCreatingSubTask(false);
    }
  };

  const handleAddComment = async (subtaskId: string, text: string, parentCommentId?: string) => {
    if (!task) return;
    console.warn('Add comment mock not implemented yet in TaskService/MockService');
  };

  const handleEditComment = async (subtaskId: string, commentId: string, text: string) => {
     if (!task) return;
     console.warn('Edit comment mock not implemented yet in TaskService/MockService');
  };

  const handleDeleteComment = async (subtaskId: string, commentId: string) => {
    if (!task) return;
    console.warn('Delete comment mock not implemented yet in TaskService/MockService');
  };

  const handleEditTask = () => {
    setShowMenu(false);
    setIsEditing(true);
  };

  const handleDeleteTask = async () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const taskService = TaskService.getInstance();
              await taskService.deleteTask(taskId);
              navigation.goBack();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
    setShowMenu(false);
  };

  const handleUpdateTask = async (updatedTaskData: Partial<Task>) => {
    try {
      const taskService = TaskService.getInstance();
      const response = await taskService.updateTask(taskId, updatedTaskData);
      setTask(response.task);
    } catch (error) {
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      const day = date.getDate().toString().padStart(2, '0');
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate && task) {
      selectedDate.setHours(0, 0, 0, 0);
      setSelectedDate(selectedDate);
      setTask({
        ...task,
        dueDate: selectedDate.toISOString(),
      });
    }
  };

  const handleGoToChat = async () => {
    if (!task) return;
    
    try {
      setShowMenu(false);
      const conversationId = `chat-${taskId}`;
      
      navigation.navigate('Chatroom', {
        conversationId,
        taskId: taskId,
        taskTitle: task.title,
        taskStatus: task.status,
        isFirstLoad: true,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to create chatroom. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </SafeAreaView>
    );
  }

  if (error || !task) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.error }]}>{error || 'Task not found'}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TaskHeader
          task={task}
          onUpdate={handleUpdateTask}
          onDelete={handleDeleteTask}
          onGoToChat={handleGoToChat}
        />
        
        <ScrollView style={styles.content}>
          <TaskInfo
            task={task}
            onUpdate={handleUpdateTask}
          />

          <TaskSubtasks
            taskId={taskId}
            subtasks={task.subtasks ?? []}
            onProgressChange={handleSubTaskProgressChange}
            onUpdateSubTask={handleUpdateSubTask}
            onSubtaskCreate={handleSubTaskSubmit}
            onAddComment={handleAddComment}
            onEditComment={handleEditComment}
            onDeleteComment={handleDeleteComment}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
}); 