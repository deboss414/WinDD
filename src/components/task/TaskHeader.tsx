import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  Alert,
  Modal,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getColors } from '../../constants/colors';
import { Task, TaskStatus, TaskPriority, SubTask } from '../../types/task';
import { TaskFormModal } from './TaskFormModal';
import { useNavigation } from '@react-navigation/native';

interface TaskHeaderProps {
  task: Task;
  onUpdate: (updatedTask: Task) => void;
  onDelete: (taskId: string) => void;
  onGoToChat: () => void;
}

export const TaskHeader: React.FC<TaskHeaderProps> = ({
  task,
  onUpdate,
  onDelete,
  onGoToChat,
}) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const calculateTaskProgress = (subtasks: SubTask[]): number => {
    if (!subtasks || subtasks.length === 0) return 0;
    const totalProgress = subtasks.reduce((sum, subtask) => sum + (subtask.progress || 0), 0);
    return Math.round(totalProgress / subtasks.length);
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      const updatedTask = {
        ...task,
        status: newStatus,
        lastUpdated: new Date().toISOString(),
      };
      await onUpdate(updatedTask);
    } catch (error) {
      Alert.alert('Error', 'Failed to update task status');
    }
  };

  const handleEditTask = () => {
    setShowMenu(false);
    setShowEditModal(true);
  };

  const handleDeleteTask = () => {
    setShowMenu(false);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await onDelete(task.id);
      setShowDeleteConfirm(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete task');
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return colors.taskStatus.completed;
      case 'expired':
        return colors.taskStatus.expired;
      case 'closed':
        return colors.taskStatus.closed;
      case 'In Progress':
        return colors.taskStatus['In Progress'];
      default:
        return colors.primary;
    }
  };

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return colors.priorityLow;
      case 'medium':
        return colors.priorityMedium;
      case 'high':
        return colors.priorityHigh;
      default:
        return colors.text;
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case 'low':
        return 'arrow-downward';
      case 'medium':
        return 'remove';
      case 'high':
        return 'arrow-upward';
      default:
        return 'info';
    }
  };

  const progress = calculateTaskProgress(task.subtasks);

  return (
    <View style={[styles.container, { 
      backgroundColor: colors.background,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowMenu(!showMenu)}
          >
            <MaterialIcons name="more-vert" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <View style={styles.statusBadges}>
          <TouchableOpacity
            style={[
              styles.statusBadge,
              { backgroundColor: `${getStatusColor(task.status)}20` },
            ]}
            onPress={() => {
              const statuses: TaskStatus[] = ['In Progress', 'completed', 'expired', 'closed'];
              const currentIndex = statuses.indexOf(task.status);
              const nextStatus = statuses[(currentIndex + 1) % statuses.length];
              handleStatusChange(nextStatus);
            }}
          >
            <MaterialIcons 
              name={task.status === 'completed' ? 'check-circle' : 'radio-button-unchecked'} 
              size={16} 
              color={getStatusColor(task.status)} 
            />
            <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
              {task.status}
            </Text>
          </TouchableOpacity>

          <View style={[
            styles.priorityBadge,
            { backgroundColor: `${getPriorityColor(task.priority)}20` }
          ]}>
            <MaterialIcons 
              name={getPriorityIcon(task.priority)} 
              size={16} 
              color={getPriorityColor(task.priority)} 
            />
            <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
              {task.priority}
            </Text>
          </View>

          <View style={[styles.progressBadge, { backgroundColor: `${colors.primary}20` }]}>
            <MaterialIcons name="pie-chart" size={16} color={colors.primary} />
            <Text style={[styles.progressText, { color: colors.primary }]}>
              {progress}%
            </Text>
          </View>
        </View>
      </View>

      {showMenu && (
        <View style={[styles.menu, { backgroundColor: colors.cardBackground }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleEditTask}
          >
            <MaterialIcons name="edit" size={20} color={colors.text} />
            <Text style={[styles.menuItemText, { color: colors.text }]}>Edit Task</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={handleDeleteTask}
          >
            <MaterialIcons name="delete" size={20} color={colors.error} />
            <Text style={[styles.menuItemText, { color: colors.error }]}>Delete Task</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.background }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Delete Task</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>
              Are you sure you want to delete this task? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.error }]}
                onPress={confirmDelete}
              >
                <Text style={styles.modalButtonText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={() => setShowDeleteConfirm(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TaskFormModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={onUpdate}
        mode="edit"
        initialData={task}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginBottom: 8,
  },
  header: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
    marginRight: 16,
  },
  menuButton: {
    padding: 8,
  },
  statusContainer: {
    marginBottom: 16,
  },
  statusBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
    textTransform: 'capitalize',
  },
  progressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  progressText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  menu: {
    position: 'absolute',
    top: 60,
    right: 16,
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  menuItemText: {
    marginLeft: 12,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 12,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

