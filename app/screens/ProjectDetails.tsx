import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

interface ProjectDetailsProps {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  progress: number;
  priority: string;
  status: string;
}

export default function ProjectDetails() {
  const params = useLocalSearchParams<ProjectDetailsProps>();
  const [projectDetails, setProjectDetails] = useState({
    id: params.id,
    title: params.title,
    description: params.description,
    dueDate: new Date(params.dueDate),
    progress: Number(params.progress),
    priority: params.priority,
    status: params.status
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{projectDetails.title}</Text>
        <Text style={styles.date}>
          Due: {projectDetails.dueDate.toLocaleDateString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{projectDetails.description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status</Text>
        <Text style={styles.status}>{projectDetails.status}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Priority</Text>
        <Text style={styles.priority}>{projectDetails.priority}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress</Text>
        <Text style={styles.progress}>{projectDetails.progress}%</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  status: {
    fontSize: 16,
    color: '#2A9D8F',
    fontWeight: '500',
  },
  priority: {
    fontSize: 16,
    color: '#E76F51',
    fontWeight: '500',
  },
  progress: {
    fontSize: 16,
    color: '#333',
  },
}); 