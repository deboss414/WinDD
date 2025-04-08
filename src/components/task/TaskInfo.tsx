import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getColors } from '../../constants/colors';
import { Task } from '../../types/task';

interface TaskInfoProps {
  task: Task;
  onUpdate: (updatedTask: Partial<Task>) => void;
}

export const TaskInfo: React.FC<TaskInfoProps> = ({ 
  task, 
  onUpdate,
}) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isParticipantsExpanded, setIsParticipantsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsDescriptionExpanded(!isDescriptionExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDisplayName = (displayName: string) => {
    const names = displayName.split(' ');
    if (names.length >= 2) {
      return `${names[0]} ${names[names.length - 1]}`;
    }
    return displayName;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#F44336', '#E91E63', '#9C27B0', '#673AB7', 
      '#3F51B5', '#2196F3', '#03A9F4', '#00BCD4',
      '#009688', '#4CAF50', '#8BC34A', '#CDDC39',
      '#FFC107', '#FF9800', '#FF5722'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    return colors[hash % colors.length];
  };

  const renderParticipantAvatars = () => {
    // Option 1: If participants are fetched/managed elsewhere, get them from props/context
    // Option 2: If participants are on task.assignedTo, use that array
    // Placeholder type - adjust as needed
    type ParticipantPlaceholder = { email: string; displayName: string }; 
    const participants: ParticipantPlaceholder[] = []; // Placeholder: Replace with actual participant data source
    const maxVisible = 5;
    const visibleParticipants = participants.slice(0, maxVisible);
    const remainingCount = participants.length - maxVisible;

    return (
      <View style={styles.avatarContainer}>
        {visibleParticipants.map((participant, index) => (
          <View
            key={participant.email}
            style={[
              styles.avatar,
              { 
                backgroundColor: getAvatarColor(participant.displayName),
                marginLeft: index > 0 ? -15 : 0,
                zIndex: visibleParticipants.length - index,
              }
            ]}
          >
            <Text style={styles.avatarText}>
              {getInitials(participant.displayName)}
            </Text>
          </View>
        ))}
        {remainingCount > 0 && (
          <View style={[styles.avatar, { 
            backgroundColor: colors.divider,
            marginLeft: -15,
            zIndex: 0
          }]}>
            <Text style={styles.avatarText}>+{remainingCount}</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.expandButton, { backgroundColor: colors.cardBackground }]}
          onPress={() => setIsParticipantsExpanded(!isParticipantsExpanded)}
        >
          <MaterialIcons
            name={isParticipantsExpanded ? 'expand-less' : 'expand-more'}
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Description Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Description</Text>
        <View style={styles.descriptionContainer}>
          <Text 
            style={[styles.description, { color: colors.text }]}
            numberOfLines={isDescriptionExpanded ? undefined : 3}
          >
            {task.description || 'No description provided'}
          </Text>
          {task.description && task.description.split('\n').length > 3 && (
            <TouchableOpacity
              style={styles.expandButton}
              onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            >
              <Text style={[styles.expandButtonText, { color: colors.primary }]}>
                {isDescriptionExpanded ? 'Show less' : 'Show more'}
              </Text>
              <MaterialIcons
                name={isDescriptionExpanded ? 'expand-less' : 'expand-more'}
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Due Date and Created Section */}
      <View style={styles.section}>
        <View style={styles.dateInfoContainer}>
          <View style={styles.dateInfo}>
            <MaterialIcons name="calendar-today" size={16} color={colors.text} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {formatDate(task.dueDate)}
            </Text>
          </View>
          <View style={styles.dateInfo}>
            <MaterialIcons name="schedule" size={16} color={colors.text} />
            <Text style={[styles.dateText, { color: colors.text }]}>
              {formatDate(task.createdAt)}
            </Text>
          </View>
        </View>
        <Text style={[styles.creatorText, { color: colors.secondaryText }]}>
          by {formatDisplayName(task.createdBy)}
        </Text>
      </View>

      {/* Participants Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Participants</Text>
        </View>

        {renderParticipantAvatars()}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginTop: 8,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  dateInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    marginLeft: 8,
  },
  creatorText: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});
