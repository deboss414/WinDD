import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ProgressCircle from './progress-circle';

interface Participant {
  id: string;
  avatar: string;
}

interface Project {
  id: string;
  title: string;
  date: string;
  progress: number;
  participants: Participant[];
  tasksCompleted: number;
  totalTasks: number;
  icon: string;
}

interface ProjectCardProps {
  project: Project;
  onPress?: (project: Project) => void;
}

export default function ProjectCard({ project, onPress }: ProjectCardProps) {
  const colorScheme = useColorScheme();
  const { title, date, progress, participants, tasksCompleted, totalTasks, icon } = project;

  const handlePress = () => {
    if (onPress) {
      onPress(project);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colorScheme === 'dark' ? '#2c2c2e' : '#ffffff',
          borderColor: colorScheme === 'dark' ? '#3a3a3c' : '#e5e5ea',
        },
      ]}
      onPress={handlePress}
    >
      <View style={styles.header}>
        <Text style={[styles.icon, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
          {icon}
        </Text>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
          Project
        </Text>
      </View>
      <Text style={[styles.title, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
        {title}
      </Text>
      <Text style={[styles.date, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
        {date}
      </Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
      <View style={styles.footer}>
        <View style={styles.avatarGroup}>
          {participants.map((participant, index) => (
            <View
              key={participant.id}
              style={[
                styles.avatar,
                { marginLeft: index > 0 ? -10 : 0 }
              ]}
            >
              <Image source={{ uri: participant.avatar }} style={styles.avatarImage} />
            </View>
          ))}
        </View>
        <Text style={[styles.taskProgress, { color: colorScheme === 'dark' ? '#ffffff' : '#000000' }]}>
          {tasksCompleted}/{totalTasks} Finished
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  label: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#fff',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  taskProgress: {
    fontSize: 12,
    color: '#666',
  },
}); 