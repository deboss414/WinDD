import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  ScrollView,
} from 'react-native';
import { getColors } from '../../constants/colors';
import { SubTask } from './SubTask';
import { SubTask as SubTaskType } from '../../types/task';

interface SubTaskListProps {
  subtasks: SubTaskType[];
  onProgressChange: (subtaskId: string, progress: number) => void;
  onAddComment: (subtaskId: string, text: string, parentCommentId?: string) => void;
  onEditComment: (subtaskId: string, commentId: string, text: string) => void;
  onDeleteComment: (subtaskId: string, commentId: string) => void;
  onUpdateSubTask: (subtaskId: string, data: Partial<SubTaskType>) => void;
  participants: string[];
}

export const SubTaskList: React.FC<SubTaskListProps> = ({
  subtasks,
  onProgressChange,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onUpdateSubTask,
  participants,
}) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Subtasks</Text>
        <Text style={[styles.count, { color: colors.secondaryText }]}>
          {subtasks.length} {subtasks.length === 1 ? 'subtask' : 'subtasks'}
        </Text>
      </View>

      <ScrollView style={styles.list}>
        {subtasks.map((subtask) => (
          <SubTask
            key={subtask.id}
            subtask={subtask}
            onProgressChange={(progress) => onProgressChange(subtask.id, progress)}
            onAddComment={(text, parentCommentId) => onAddComment(subtask.id, text, parentCommentId)}
            onEditComment={(commentId, text) => onEditComment(subtask.id, commentId, text)}
            onDeleteComment={(commentId) => onDeleteComment(subtask.id, commentId)}
            onUpdateSubTask={(data) => onUpdateSubTask(subtask.id, data)}
            participants={participants}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  count: {
    fontSize: 14,
  },
  list: {
    flex: 1,
  },
}); 