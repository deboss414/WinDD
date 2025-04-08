import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useColorScheme,
  Animated,
  Dimensions,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getColors } from '../../constants/colors';
import { Comment } from '../../screens/TaskDetailsScreen/components/Comment';
import { Comment as CommentType } from '../../types/comment';
import { CircularProgress } from '../common/CircularProgress';
import { SubTaskFormModal } from './SubTaskFormModal';
import Slider from '@react-native-community/slider';
import { SubTask as SubTaskType } from '../../types/task';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface SubTask {
  id: string;
  title: string;
  description?: string;
  assignee?: string[];
  progress: number;
  dueDate?: string;
  createdBy: string;
  createdAt: string;
  lastUpdated: string;
  comments?: CommentType[];
}

interface SubTaskProps {
  subtask: SubTaskType;
  onProgressChange: (progress: number) => void;
  onAddComment: (text: string, parentCommentId?: string) => void;
  onEditComment: (commentId: string, text: string) => void;
  onDeleteComment: (commentId: string) => void;
  onUpdateSubTask: (data: Partial<SubTaskType>) => void;
  participants: string[];
}

export const SubTask: React.FC<SubTaskProps> = ({
  subtask,
  onProgressChange,
  onAddComment,
  onEditComment,
  onDeleteComment,
  onUpdateSubTask,
  participants,
}) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  const [showComments, setShowComments] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [newProgress, setNewProgress] = useState(subtask.progress.toString());

  const handleProgressChange = (newProgress: number) => {
    onProgressChange(newProgress);
    setShowProgressModal(false);
  };

  const handleAddComment = (text: string, parentCommentId?: string) => {
    onAddComment(text, parentCommentId);
  };

  const handleEditComment = (commentId: string, text: string) => {
    onEditComment(commentId, text);
  };

  const handleDeleteComment = (commentId: string) => {
    onDeleteComment(commentId);
  };

  const handleUpdateSubTask = (data: Partial<SubTaskType>) => {
    onUpdateSubTask(data);
    setShowEditModal(false);
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return colors.taskStatus.completed;
    if (progress >= 67) return '#34C759';
    if (progress >= 34) return '#FFD60A';
    return colors.taskStatus.expired;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {subtask.title}
          </Text>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <MaterialIcons name="edit" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={[styles.description, { color: colors.secondaryText }]} numberOfLines={2}>
          {subtask.description}
        </Text>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.progressContainer}
            onPress={() => setShowProgressModal(true)}
          >
            <CircularProgress
              size={40}
              progress={subtask.progress}
              progressColor={getProgressColor(subtask.progress)}
              backgroundColor={`${getProgressColor(subtask.progress)}30`}
              textColor={getProgressColor(subtask.progress)}
            />
            <Text style={[styles.progressText, { color: colors.text }]}>
              {subtask.progress}%
            </Text>
          </TouchableOpacity>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setShowComments(!showComments)}
            >
              <MaterialIcons
                name={showComments ? 'expand-less' : 'expand-more'}
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {showComments && (
        <View style={styles.commentsSection}>
          <Text style={[styles.commentsTitle, { color: colors.text }]}>Comments</Text>
          {subtask.comments?.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              onReply={handleAddComment}
            />
          ))}
        </View>
      )}

      <Modal
        visible={showEditModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Subtask</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.modalLabel, { color: colors.text }]}>Title</Text>
              <TextInput
                style={[styles.modalInput, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.divider
                }]}
                value={subtask.title}
                onChangeText={(text) => handleUpdateSubTask({ title: text })}
                placeholder="Enter subtask title"
                placeholderTextColor={colors.secondaryText}
              />
              <Text style={[styles.modalLabel, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[styles.modalTextArea, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.divider
                }]}
                value={subtask.description}
                onChangeText={(text) => handleUpdateSubTask({ description: text })}
                placeholder="Enter subtask description"
                placeholderTextColor={colors.secondaryText}
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showProgressModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProgressModal(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.cardBackground }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Update Progress</Text>
              <TouchableOpacity onPress={() => setShowProgressModal(false)}>
                <MaterialIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={[styles.modalLabel, { color: colors.text }]}>Progress (%)</Text>
              <TextInput
                style={[styles.modalInput, { 
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.divider
                }]}
                value={newProgress}
                onChangeText={setNewProgress}
                placeholder="Enter progress (0-100)"
                placeholderTextColor={colors.secondaryText}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.updateButton, { backgroundColor: colors.primary }]}
                onPress={() => {
                  const progress = parseInt(newProgress);
                  if (progress >= 0 && progress <= 100) {
                    handleProgressChange(progress);
                  }
                }}
              >
                <Text style={styles.updateButtonText}>Update Progress</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  editButton: {
    padding: 4,
  },
  content: {
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
  },
  commentsSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  commentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalBody: {
    gap: 8,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  modalInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  modalTextArea: {
    height: 120,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  updateButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 