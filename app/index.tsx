import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Image, NativeSyntheticEvent, NativeScrollEvent, Animated } from 'react-native';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Svg, { Circle } from 'react-native-svg';

const projects = [
  {
    id: '1',
    title: 'NFT Mobile App Design',
    date: new Date(2024, 7, 19),
    progress: 45,
    participants: [
      { id: '1', avatar: 'https://i.pravatar.cc/150?img=1' },
      { id: '2', avatar: 'https://i.pravatar.cc/150?img=2' },
      { id: '3', avatar: 'https://i.pravatar.cc/150?img=3' },
    ],
    tasksCompleted: 9,
    totalTasks: 20,
    icon: '🎯'
  },
  {
    id: '2',
    title: 'Ecommerce Landing Page',
    date: new Date(2024, 7, 25),
    progress: 60,
    participants: [
      { id: '4', avatar: 'https://i.pravatar.cc/150?img=4' },
      { id: '5', avatar: 'https://i.pravatar.cc/150?img=5' },
      { id: '6', avatar: 'https://i.pravatar.cc/150?img=6' },
    ],
    tasksCompleted: 12,
    totalTasks: 20,
    icon: '🎯'
  }
];

const tasks = [
  {
    id: '1',
    title: 'Design Home Screen',
    project: 'NFT Mobile App Design',
    status: 'in-progress',
    progress: 45,
    dueDate: new Date(2024, 7, 19)
  },
  {
    id: '2',
    title: 'Implement Authentication',
    project: 'NFT Mobile App Design',
    status: 'in-progress',
    progress: 60,
    dueDate: new Date(2024, 7, 20)
  },
  {
    id: '3',
    title: 'Create Landing Page',
    project: 'Ecommerce Landing Page',
    status: 'in-progress',
    progress: 75,
    dueDate: new Date(2024, 7, 25)
  },
  {
    id: '4',
    title: 'User Profile Design',
    project: 'NFT Mobile App Design',
    status: 'completed',
    progress: 100,
    dueDate: new Date(2024, 7, 15)
  },
  {
    id: '5',
    title: 'Payment Integration',
    project: 'Ecommerce Landing Page',
    status: 'completed',
    progress: 100,
    dueDate: new Date(2024, 7, 18)
  },
  {
    id: '6',
    title: 'Mobile Responsive Design',
    project: 'Ecommerce Landing Page',
    status: 'expired',
    progress: 30,
    dueDate: new Date(2024, 7, 10)
  }
];

const CircularProgress = ({ progress }: { progress: number }) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const radius = 20;
  const strokeWidth = 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={48} height={48}>
        <Circle
          cx={24}
          cy={24}
          r={radius}
          stroke="#E0F2F1"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={24}
          cy={24}
          r={radius}
          stroke="#2A9D8F"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 24 24)`}
        />
      </Svg>
      <Text style={{ position: 'absolute', fontSize: 12, fontWeight: '600', color: '#2A9D8F' }}>
        {`${Math.round(progress)}%`}
      </Text>
    </View>
  );
};

export default function Home() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [showFilter, setShowFilter] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const scrollViewRef = useRef(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    const cardWidth = Dimensions.get('window').width * 0.75 + 16; // card width + margin
    const index = Math.round(scrollX / cardWidth);
    setActiveProjectIndex(Math.min(Math.max(0, index), projects.length - 1));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase();
  };

  const handleStatsPress = () => {
    router.push('/(tabs)/stats');
  };

  const handleCalendarPress = () => {
    router.push('/(tabs)/calendar');
  };

  const handleSettingsPress = () => {
    router.push('/(tabs)/settings');
  };

  const handleAddPress = () => {
    router.push('/add-task');
  };

  const renderFilterDropdown = () => {
    if (!showFilter) return null;

    const filters = [
      { id: 'category', label: 'Category', icon: 'grid-outline' as const },
      { id: 'in-progress', label: 'In Progress', icon: 'time-outline' as const },
      { id: 'completed', label: 'Completed', icon: 'checkmark-circle-outline' as const },
      { id: 'overdue', label: 'Overdue', icon: 'alert-circle-outline' as const }
    ];

    return (
      <View style={styles.filterDropdown}>
        <View style={styles.filterArrow} />
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterOption,
              activeFilter === filter.id && styles.activeFilterOption
            ]}
            onPress={() => {
              setActiveFilter(filter.id);
              setShowFilter(false);
            }}
          >
            <Ionicons 
              name={filter.icon}
              size={20} 
              color={activeFilter === filter.id ? '#2A9D8F' : '#666'} 
            />
            <Text style={[
              styles.filterText,
              activeFilter === filter.id && styles.activeFilterText
            ]}>
              {filter.label}
            </Text>
            {activeFilter === filter.id && (
              <Ionicons name="checkmark" size={20} color="#2A9D8F" style={styles.checkmark} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
      
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome! Pherson</Text>
            <Text style={styles.taskCount}>You have 4 tasks due Today</Text>
          </View>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => router.push('/(tabs)/chat-rooms')}
            >
              <Ionicons name="chatbubbles-outline" size={24} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.notificationButton}
              onPress={() => {
                setHasUnreadNotifications(false);
                router.push('/(tabs)/notifications');
              }}
            >
              <Ionicons name="notifications-outline" size={24} color="#000" />
              {hasUnreadNotifications && <View style={styles.notificationBadge} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search-outline" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#666"
            />
          </View>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              showFilter && styles.activeFilterButton
            ]}
            onPress={() => setShowFilter(!showFilter)}
          >
            <Ionicons name="options-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        {renderFilterDropdown()}

        {/* Today's Date */}
        <View style={styles.dateHeader}>
          <Text style={styles.todayText}>Due Date</Text>
          <Text style={styles.dateText}>{formatDate(projects[activeProjectIndex].date)}</Text>
        </View>

        {/* Projects */}
        <ScrollView 
          ref={scrollViewRef}
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.projectsContainer}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          pagingEnabled
          snapToInterval={Dimensions.get('window').width * 0.75 + 16}
          decelerationRate="fast"
        >
          {projects.map((project) => (
            <TouchableOpacity 
              key={project.id} 
              style={[
                styles.projectCard,
                project.id === projects[activeProjectIndex].id && styles.activeProjectCard
              ]}
              onPress={() => router.push({ pathname: '/project-details', params: { id: project.id }})}
            >
              <View style={styles.projectHeader}>
                <Text style={styles.projectIcon}>{project.icon}</Text>
                <Text style={styles.projectLabel}>Project</Text>
              </View>
              <Text style={styles.projectTitle}>{project.title}</Text>
              <Text style={styles.projectDate}>{formatDate(project.date)}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${project.progress}%` }]} />
              </View>
              <View style={styles.projectFooter}>
                <View style={styles.avatarGroup}>
                  {project.participants.map((participant, index) => (
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
                <Text style={styles.taskProgress}>{project.tasksCompleted}/{project.totalTasks} Finished</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* All Tasks Section */}
        <View style={styles.allTasksSection}>
          <View style={styles.allTasksHeader}>
            <Text style={styles.allTasksTitle}>All Task</Text>
            <TouchableOpacity onPress={() => router.push('/tasks')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity 
            style={styles.taskTypeCard}
            onPress={() => router.push({ pathname: '/tasks', params: { filter: 'in-progress' }})}
          >
            <View style={styles.taskTypeIcon}>
              <CircularProgress progress={60} />
            </View>
            <View style={styles.taskTypeContent}>
              <Text style={styles.taskTypeTitle}>In Progress</Text>
              <Text style={styles.taskTypeCount}>
                {tasks.filter(task => task.status === 'in-progress').length} Tasks
              </Text>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>Average Progress</Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(
                    tasks
                      .filter(task => task.status === 'in-progress')
                      .reduce((sum, task) => sum + task.progress, 0) / 
                    tasks.filter(task => task.status === 'in-progress').length
                  )}%
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.taskTypeCard, { marginTop: 12 }]}
            onPress={() => router.push({ pathname: '/tasks', params: { filter: 'completed' }})}
          >
            <View style={[styles.taskTypeIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#2196F3" />
            </View>
            <View style={styles.taskTypeContent}>
              <Text style={styles.taskTypeTitle}>Completed</Text>
              <Text style={styles.taskTypeCount}>
                {tasks.filter(task => task.status === 'completed').length} Tasks
              </Text>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>All Tasks Completed</Text>
                <Text style={styles.progressPercentage}>100%</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.taskTypeCard, { marginTop: 12 }]}
            onPress={() => router.push({ pathname: '/tasks', params: { filter: 'expired' }})}
          >
            <View style={[styles.taskTypeIcon, { backgroundColor: '#FFEBEE' }]}>
              <Ionicons name="alert-circle-outline" size={24} color="#F44336" />
            </View>
            <View style={styles.taskTypeContent}>
              <Text style={styles.taskTypeTitle}>Expired</Text>
              <Text style={styles.taskTypeCount}>
                {tasks.filter(task => task.status === 'expired').length} Tasks
              </Text>
              <View style={styles.progressInfo}>
                <Text style={styles.progressText}>Average Progress</Text>
                <Text style={styles.progressPercentage}>
                  {Math.round(
                    tasks
                      .filter(task => task.status === 'expired')
                      .reduce((sum, task) => sum + task.progress, 0) / 
                    tasks.filter(task => task.status === 'expired').length
                  )}%
                </Text>
              </View>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#2A9D8F" />
          <View style={styles.activeIndicator} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={handleStatsPress}
        >
          <Ionicons name="stats-chart-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.navItem, styles.addButton]}
          onPress={handleAddPress}
        >
          <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={handleCalendarPress}
        >
          <Ionicons name="calendar-outline" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={handleSettingsPress}
        >
          <Ionicons name="settings-outline" size={24} color="#666" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingTop: 60,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskCount: {
    fontSize: 14,
    color: '#666',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  searchInputContainer: {
    flex: 1,
    height: 48,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#2A9D8F',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  todayText: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
  projectsContainer: {
    paddingHorizontal: 16,
    gap: 16,
  },
  projectCard: {
    width: Dimensions.get('window').width * 0.75,
    height: Dimensions.get('window').width * 0.75,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    marginVertical: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  projectIcon: {
    fontSize: 26,
    marginRight: 10,
  },
  projectLabel: {
    fontSize: 14,
    color: '#666',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  projectTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 10,
  },
  projectDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f5f5f5',
    borderRadius: 3,
    marginBottom: 32,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2A9D8F',
    borderRadius: 3,
  },
  projectFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
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
    fontSize: 14,
    color: '#666',
  },
  allTasksSection: {
    padding: 16,
  },
  allTasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  allTasksTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAllText: {
    fontSize: 14,
    color: '#666',
  },
  taskTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E0F2F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  taskTypeContent: {
    flex: 1,
  },
  taskTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskTypeCount: {
    fontSize: 14,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 90,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingBottom: 30,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 8,
  },
  addButton: {
    width: 56,
    height: 56,
    backgroundColor: '#2A9D8F',
    borderRadius: 28,
    marginTop: -28,
    marginBottom: 8,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2A9D8F',
    marginTop: 4,
    marginBottom: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
    borderWidth: 1,
    borderColor: '#fff',
  },
  activeProjectCard: {
    transform: [{ scale: 1.01 }],
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  filterDropdown: {
    position: 'absolute',
    top: 140, // Positioned below the filter button
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
    width: 200,
  },
  filterArrow: {
    position: 'absolute',
    top: -8,
    right: 20,
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
    shadowColor: '#000',
    shadowOffset: { width: -1, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 5,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  activeFilterOption: {
    backgroundColor: '#E0F2F1',
  },
  filterText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  activeFilterText: {
    color: '#2A9D8F',
    fontWeight: '600',
  },
  checkmark: {
    marginLeft: 8,
  },
  activeFilterButton: {
    backgroundColor: '#1D6F66', // Darker shade when active
  },
  progressInfo: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#2A9D8F',
    fontWeight: '600',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
}); 