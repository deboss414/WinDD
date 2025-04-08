import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'in-progress' | 'completed' | 'expired';
  date: string;
  projectId: string;
}

interface TaskListProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onTaskPress?: (task: Task) => void;
}

export default function TaskList({ title, tasks, status, onTaskPress }: TaskListProps) {
  const colorScheme = useColorScheme();

  const getStatusIcon = () => {
    switch (status) {
      case 'in-progress':
        return <Ionicons name="time-outline" size={20} color="#007AFF" />;
      case 'completed':
        return <Ionicons name="checkmark-circle-outline" size={20} color="#34C759" />;
      case 'expired':
        return <Ionicons name="alert-circle-outline" size={20} color="#FF3B30" />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colorScheme === 'dark' ? '#8e8e93' : '#8e8e93' }]}>
        {title}
      </Text>

      {tasks.length === 0 ? (
        <Text style={[styles.emptyText, { color: colorScheme === 'dark' ? '#8e8e93' : '#8e8e93' }]}>
          No tasks
        </Text>
      ) : (
        <View style={styles.taskList}>
          {tasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={[
                styles.taskItem,
                {
                  backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#ffffff',
                  borderColor: colorScheme === 'dark' ? '#3a3a3c' : '#e5e5ea',
                },
              ]}
              onPress={() => onTaskPress?.(task)}
            >
              <View style={styles.taskIcon}>{getStatusIcon()}</View>
              <View style={styles.taskContent}>
                <Text
                  style={[
                    styles.taskTitle,
                    { color: colorScheme === 'dark' ? '#ffffff' : '#000000' },
                  ]}
                  numberOfLines={1}
                >
                  {task.title}
                </Text>
                <Text
                  style={[styles.taskDate, { color: colorScheme === 'dark' ? '#8e8e93' : '#8e8e93' }]}
                >
                  {task.date}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
  taskList: {
    gap: 8,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  taskIcon: {
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 12,
  },
}); 