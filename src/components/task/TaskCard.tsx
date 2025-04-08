import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getColors } from '../../constants/colors';
import { Task } from '../../types/task';

interface TaskCardProps {
  task: Task;
  onPress: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);

  const getStatusColor = (status: string) => {
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

  const getPriorityColor = (priority: string) => {
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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.cardBackground }]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {task.title}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(task.status)}20` }]}>
            <MaterialIcons
              name={task.status === 'completed' ? 'check-circle' : 'radio-button-unchecked'}
              size={16}
              color={getStatusColor(task.status)}
            />
            <Text style={[styles.statusText, { color: getStatusColor(task.status) }]}>
              {task.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.secondaryText }]} numberOfLines={2}>
          {task.description}
        </Text>

        <View style={styles.footer}>
          <View style={styles.dateContainer}>
            <MaterialIcons name="event" size={16} color={colors.secondaryText} />
            <Text style={[styles.dateText, { color: colors.secondaryText }]}>
              Due: {formatDate(task.dueDate)}
            </Text>
          </View>

          <View style={[styles.priorityBadge, { backgroundColor: `${getPriorityColor(task.priority)}20` }]}>
            <MaterialIcons
              name={
                task.priority === 'low' ? 'arrow-downward' :
                task.priority === 'medium' ? 'remove' :
                'arrow-upward'
              }
              size={16}
              color={getPriorityColor(task.priority)}
            />
            <Text style={[styles.priorityText, { color: getPriorityColor(task.priority) }]}>
              {task.priority}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  content: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    marginLeft: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 4,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
