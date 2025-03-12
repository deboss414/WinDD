import React from 'react';
import { View, ScrollView, StyleSheet, Dimensions, SafeAreaView, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { BarChart, PieChart } from 'react-native-chart-kit';
import { useRouter } from 'expo-router';

// Mock data - replace with real data later
const taskData = {
  totalTasks: 24,
  completedTasks: 15,
  inProgressTasks: 6,
  overdueTasks: 3,
  tasksByPriority: {
    high: 8,
    medium: 10,
    low: 6,
  },
  weeklyProgress: [12, 15, 18, 20, 22, 24, 24],
};

export default function StatsScreen() {
  const router = useRouter();
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 64; // Increased padding for better layout

  const pieChartData = [
    {
      name: 'Completed',
      population: taskData.completedTasks,
      color: '#2A9D8F',
      legendFontColor: '#000000', // Improved contrast
    },
    {
      name: 'In Progress',
      population: taskData.inProgressTasks,
      color: '#F4A261',  // Adjusted for better contrast
      legendFontColor: '#000000',
    },
    {
      name: 'Overdue',
      population: taskData.overdueTasks,
      color: '#E76F51',
      legendFontColor: '#000000',
    },
  ];

  const weeklyData = {
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    datasets: [
      {
        data: taskData.weeklyProgress,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(42, 157, 143, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Improved contrast
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#2A9D8F',
    },
    propsForLabels: {
      fontSize: 12, // Increased font size
      fontWeight: '600',
    },
    barPercentage: 0.7,
    formatTopBarValue: (value: number) => `${value}`,
  };

  const handleTotalTasksPress = () => {
    router.push('/tasks');
  };

  const handleOverdueTasksPress = () => {
    router.push('/tasks?filter=overdue');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.headerCard}>
            <ThemedText style={styles.header}>Task Statistics</ThemedText>
          </View>
          
          {/* Summary Cards */}
          <View style={styles.summaryContainer}>
            <TouchableOpacity 
              style={[styles.summaryCard, styles.clickableCard]}
              onPress={handleTotalTasksPress}
              activeOpacity={0.7}
            >
              <ThemedText style={styles.summaryNumber}>{taskData.totalTasks}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Total Tasks</ThemedText>
            </TouchableOpacity>
            <View style={styles.summaryCard}>
              <ThemedText style={styles.summaryNumber}>
                {Math.round((taskData.completedTasks / taskData.totalTasks) * 100)}%
              </ThemedText>
              <ThemedText style={styles.summaryLabel}>Completion Rate</ThemedText>
            </View>
            <TouchableOpacity 
              style={[styles.summaryCard, styles.clickableCard]}
              onPress={handleOverdueTasksPress}
              activeOpacity={0.7}
            >
              <ThemedText style={[styles.summaryNumber, styles.overdueNumber]}>{taskData.overdueTasks}</ThemedText>
              <ThemedText style={styles.summaryLabel}>Overdue</ThemedText>
            </TouchableOpacity>
          </View>

          {/* Task Status Distribution */}
          <View style={styles.chartContainer}>
            <ThemedText style={styles.chartTitle}>Task Status Distribution</ThemedText>
            <View style={styles.pieChartContainer}>
              <PieChart
                data={pieChartData}
                width={chartWidth}
                height={200}
                chartConfig={chartConfig}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 0]}
                absolute
              />
            </View>
          </View>

          {/* Weekly Progress */}
          <View style={styles.chartContainer}>
            <ThemedText style={styles.chartTitle}>Weekly Task Progress</ThemedText>
            <View style={styles.barChartContainer}>
              <BarChart
                style={styles.barChart}
                data={weeklyData}
                width={chartWidth}
                height={200}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={chartConfig}
                verticalLabelRotation={0}
                showValuesOnTopOfBars={true}
                fromZero={true}
                withInnerLines={false}
              />
            </View>
          </View>

          {/* Priority Distribution */}
          <View style={styles.priorityContainer}>
            <ThemedText style={styles.chartTitle}>Tasks by Priority</ThemedText>
            <View style={styles.priorityRow}>
              <View style={styles.priorityLabelContainer}>
                <View style={[styles.priorityIndicator, { backgroundColor: '#E76F51' }]} />
                <ThemedText style={styles.priorityText}>High</ThemedText>
              </View>
              <View style={styles.priorityBarContainer}>
                <View 
                  style={[
                    styles.priorityBar, 
                    { 
                      width: `${(taskData.tasksByPriority.high / taskData.totalTasks) * 100}%`,
                      backgroundColor: '#E76F51' 
                    }
                  ]} 
                />
                <ThemedText style={styles.priorityCount}>{taskData.tasksByPriority.high}</ThemedText>
              </View>
            </View>
            <View style={styles.priorityRow}>
              <View style={styles.priorityLabelContainer}>
                <View style={[styles.priorityIndicator, { backgroundColor: '#F4A261' }]} />
                <ThemedText style={styles.priorityText}>Medium</ThemedText>
              </View>
              <View style={styles.priorityBarContainer}>
                <View 
                  style={[
                    styles.priorityBar, 
                    { 
                      width: `${(taskData.tasksByPriority.medium / taskData.totalTasks) * 100}%`,
                      backgroundColor: '#F4A261' 
                    }
                  ]} 
                />
                <ThemedText style={styles.priorityCount}>{taskData.tasksByPriority.medium}</ThemedText>
              </View>
            </View>
            <View style={styles.priorityRow}>
              <View style={styles.priorityLabelContainer}>
                <View style={[styles.priorityIndicator, { backgroundColor: '#2A9D8F' }]} />
                <ThemedText style={styles.priorityText}>Low</ThemedText>
              </View>
              <View style={styles.priorityBarContainer}>
                <View 
                  style={[
                    styles.priorityBar, 
                    { 
                      width: `${(taskData.tasksByPriority.low / taskData.totalTasks) * 100}%`,
                      backgroundColor: '#2A9D8F' 
                    }
                  ]} 
                />
                <ThemedText style={styles.priorityCount}>{taskData.tasksByPriority.low}</ThemedText>
              </View>
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    marginTop: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2A9D8F',
  },
  summaryLabel: {
    fontSize: 13,
    marginTop: 8,
    textAlign: 'center',
    color: '#000000',
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000000',
  },
  pieChartContainer: {
    alignItems: 'center',
    marginHorizontal: -16,
  },
  barChartContainer: {
    alignItems: 'center',
    marginHorizontal: -16,
  },
  barChart: {
    marginVertical: 8,
  },
  priorityContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  priorityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  priorityLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 100,
    gap: 8,
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  priorityBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityBar: {
    height: 20,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  priorityCount: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '600',
    minWidth: 24,
  },
  clickableCard: {
    transform: [{ scale: 1 }], // Base scale for the card
  },
  overdueNumber: {
    color: '#E76F51', // Using the same color as overdue tasks in pie chart
  },
}); 