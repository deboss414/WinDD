import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';

// Types
interface ProjectData {
  id: string;
  title: string;
  progress: number;
  subtasks: {
    id: string;
    status: string;
    progress: number;
  }[];
}

export default function Statistics() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [projectData, setProjectData] = useState<ProjectData[]>([]);
  const [taskStats, setTaskStats] = useState({
    inProgress: 0,
    completed: 0,
    expired: 0
  });
  const [weeklyProgress, setWeeklyProgress] = useState<number[]>([]);
  const [monthlyProgress, setMonthlyProgress] = useState<number[]>([]);

  // Calculate statistics from project data
  const calculateStats = (projects: ProjectData[]) => {
    const stats = {
      inProgress: 0,
      completed: 0,
      expired: 0
    };

    projects.forEach(project => {
      project.subtasks.forEach(subtask => {
        if (subtask.status === 'completed') {
          stats.completed++;
        } else if (subtask.status === 'expired') {
          stats.expired++;
        } else {
          stats.inProgress++;
        }
      });
    });

    setTaskStats(stats);
  };

  // Mock data for charts (in a real app, this would come from your backend)
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: weeklyProgress.length > 0 ? weeklyProgress : [4, 3, 5, 2, 3, 1, 0],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const monthlyData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: monthlyProgress.length > 0 ? monthlyProgress : [12, 10, 8, 5],
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const taskStatusData = [
    {
      name: 'In Progress',
      population: taskStats.inProgress,
      color: '#007AFF',
      legendFontColor: '#7F7F7F',
    },
    {
      name: 'Completed',
      population: taskStats.completed,
      color: '#34C759',
      legendFontColor: '#7F7F7F',
    },
    {
      name: 'Expired',
      population: taskStats.expired,
      color: '#FF3B30',
      legendFontColor: '#7F7F7F',
    },
  ];

  const screenWidth = Dimensions.get('window').width;

  const chartConfig = {
    backgroundColor: isDark ? '#1c1c1e' : '#ffffff',
    backgroundGradientFrom: isDark ? '#1c1c1e' : '#ffffff',
    backgroundGradientTo: isDark ? '#1c1c1e' : '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={isDark ? '#ffffff' : '#000000'} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>
          Statistics
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: isDark ? '#2c2c2e' : '#ffffff' }]}>
            <View style={styles.statIcon}>
              <Ionicons name="time-outline" size={24} color="#007AFF" />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#000000' }]}>
                {taskStats.inProgress}
              </Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: isDark ? '#2c2c2e' : '#ffffff' }]}>
            <View style={styles.statIcon}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#34C759" />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#000000' }]}>
                {taskStats.completed}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>

          <View style={[styles.statCard, { backgroundColor: isDark ? '#2c2c2e' : '#ffffff' }]}>
            <View style={styles.statIcon}>
              <Ionicons name="alert-circle-outline" size={24} color="#FF3B30" />
            </View>
            <View style={styles.statContent}>
              <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#000000' }]}>
                {taskStats.expired}
              </Text>
              <Text style={styles.statLabel}>Expired</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
            Weekly Progress
          </Text>
          <LineChart
            data={weeklyData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
            Monthly Overview
          </Text>
          <LineChart
            data={monthlyData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartSection}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
            Task Distribution
          </Text>
          <PieChart
            data={taskStatusData}
            width={screenWidth - 32}
            height={220}
            chartConfig={chartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  backButton: {
    marginRight: 16,
  },
  scrollView: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e5ea',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statContent: {
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#8e8e93',
  },
  chartSection: {
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
}); 