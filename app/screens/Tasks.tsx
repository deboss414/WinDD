import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Todo' | 'In Progress' | 'Done';
  progress: number;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design Review',
    description: 'Review new app design with the team',
    dueDate: new Date('2024-03-20'),
    priority: 'High',
    status: 'In Progress',
    progress: 60
  },
  {
    id: '2',
    title: 'Bug Fixes',
    description: 'Fix reported bugs in the latest release',
    dueDate: new Date('2024-03-25'),
    priority: 'Medium',
    status: 'Todo',
    progress: 0
  }
];

export function Tasks() {
  const [tasks] = useState<Task[]>(mockTasks);

  const renderTask = ({ item }: { item: Task }) => (
    <TouchableOpacity style={styles.taskCard}>
      <Text style={styles.taskTitle}>{item.title}</Text>
      {item.description && (
        <Text style={styles.taskDescription}>{item.description}</Text>
      )}
      <View style={styles.taskFooter}>
        <Text style={styles.taskDate}>
          Due: {item.dueDate.toLocaleDateString()}
        </Text>
        <Text style={styles.taskStatus}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContent: {
    padding: 16,
  },
  taskCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDate: {
    fontSize: 12,
    color: '#666',
  },
  taskStatus: {
    fontSize: 12,
    color: '#2A9D8F',
    fontWeight: '500',
  },
}); 