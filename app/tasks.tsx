import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const tasks = [
  {
    id: '1',
    title: 'Design NFT Marketplace Homepage',
    project: 'NFT Mobile App Design',
    status: 'in-progress',
    dueDate: new Date(2024, 7, 19),
    progress: 45,
  },
  {
    id: '2',
    title: 'Implement User Authentication',
    project: 'NFT Mobile App Design',
    status: 'completed',
    dueDate: new Date(2024, 7, 18),
    progress: 100,
  },
  {
    id: '3',
    title: 'Create Product Listing Page',
    project: 'Ecommerce Landing Page',
    status: 'in-progress',
    dueDate: new Date(2024, 7, 25),
    progress: 60,
  },
  {
    id: '4',
    title: 'Setup Payment Integration',
    project: 'Ecommerce Landing Page',
    status: 'expired',
    dueDate: new Date(2024, 7, 15),
    progress: 30,
  },
];

const CircularProgress = ({ progress }: { progress: number }) => {
  const size = 40;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View style={{ width: size, height: size }}>
      <View style={[styles.circularProgress, { width: size, height: size }]}>
        <View style={styles.circularProgressBackground} />
        <Animated.View
          style={[
            styles.circularProgressFill,
            {
              transform: [{ rotate: '-90deg' }],
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              width: size,
              height: size,
              borderColor: '#2A9D8F',
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              opacity: progress > 50 ? 1 : 0,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.circularProgressFill,
            {
              transform: [{ rotate: progress > 50 ? '90deg' : `${(progress / 100) * 360 - 90}deg` }],
              borderRadius: size / 2,
              borderWidth: strokeWidth,
              width: size,
              height: size,
              borderColor: '#2A9D8F',
              borderTopColor: 'transparent',
              borderRightColor: 'transparent',
              opacity: 1,
            },
          ]}
        />
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    </View>
  );
};

export default function Tasks() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');

  const handleTaskPress = (task: any) => {
    router.push({
      pathname: '/project-details',
      params: {
        id: task.id,
        title: task.title,
        dueDate: task.dueDate.toISOString(),
        progress: task.progress,
        status: task.status,
        priority: 'High', // Default priority for tasks
        description: `Task from ${task.project}`,
        participants: JSON.stringify([
          { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
          { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
          { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
        ])
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-progress':
        return { bg: '#E0F2F1', text: '#2A9D8F', icon: 'time-outline' };
      case 'completed':
        return { bg: '#E3F2FD', text: '#2196F3', icon: 'checkmark-circle-outline' };
      case 'expired':
        return { bg: '#FFEBEE', text: '#F44336', icon: 'alert-circle-outline' };
      default:
        return { bg: '#E0F2F1', text: '#2A9D8F', icon: 'time-outline' };
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredTasks = tasks.filter(task => 
    activeFilter === 'all' || task.status === activeFilter
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Tasks</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'all' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterText, activeFilter === 'all' && styles.activeFilterText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'in-progress' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('in-progress')}
        >
          <Text style={[styles.filterText, activeFilter === 'in-progress' && styles.activeFilterText]}>In Progress</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'completed' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('completed')}
        >
          <Text style={[styles.filterText, activeFilter === 'completed' && styles.activeFilterText]}>Completed</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, activeFilter === 'expired' && styles.activeFilterButton]}
          onPress={() => setActiveFilter('expired')}
        >
          <Text style={[styles.filterText, activeFilter === 'expired' && styles.activeFilterText]}>Expired</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {filteredTasks.map((task) => {
          const statusStyle = getStatusColor(task.status);
          return (
            <TouchableOpacity 
              key={task.id} 
              style={styles.taskCard}
              onPress={() => handleTaskPress(task)}
            >
              <View style={[styles.statusIndicator, { backgroundColor: statusStyle.bg }]}>
                {task.status === 'in-progress' ? (
                  <CircularProgress progress={task.progress} />
                ) : (
                  <Ionicons name={statusStyle.icon as any} size={20} color={statusStyle.text} />
                )}
              </View>
              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>{task.title}</Text>
                <Text style={styles.projectName}>{task.project}</Text>
                <View style={styles.taskFooter}>
                  <Text style={[styles.statusText, { color: statusStyle.text }]}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </Text>
                  <Text style={styles.dueDate}>Due {formatDate(task.dueDate)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  activeFilterButton: {
    backgroundColor: '#E0F2F1',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  activeFilterText: {
    color: '#2A9D8F',
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  taskCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  projectName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  dueDate: {
    fontSize: 14,
    color: '#666',
  },
  circularProgress: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circularProgressBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 4,
    borderColor: '#E0F2F1',
  },
  circularProgressFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2A9D8F',
  },
}); 