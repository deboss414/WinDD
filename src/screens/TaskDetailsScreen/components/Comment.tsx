import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getColors } from '../../../constants/colors';
import { useColorScheme } from 'react-native';

interface CommentProps {
  comment: {
    id: string;
    text: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    updatedAt?: string;
    parentCommentId?: string;
    isEdited: boolean;
    subtaskId: string;
    replies?: Comment[];
  };
  onEdit: (commentId: string, text: string) => void;
  onDelete: (commentId: string) => void;
  onReply: (text: string, parentCommentId?: string) => void;
}

export const Comment: React.FC<CommentProps> = ({
  comment,
  onEdit,
  onDelete,
  onReply,
}) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(comment.text);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const handleEdit = () => {
    if (editedText.trim() !== comment.text) {
      onEdit(comment.id, editedText);
    }
    setIsEditing(false);
  };

  const handleReply = () => {
    if (replyText.trim()) {
      onReply(replyText, comment.id);
      setReplyText('');
      setShowReplyInput(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBackground }]}>
      <View style={styles.header}>
        <View style={styles.authorInfo}>
          <Text style={[styles.authorName, { color: colors.text }]}>
            {comment.authorName}
          </Text>
          <Text style={[styles.date, { color: colors.secondaryText }]}>
            {formatDate(comment.createdAt)}
            {comment.isEdited && ' (edited)'}
          </Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setIsEditing(true)}
          >
            <MaterialIcons name="edit" size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onDelete(comment.id)}
          >
            <MaterialIcons name="delete" size={20} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      {isEditing ? (
        <View style={styles.editContainer}>
          <TextInput
            style={[
              styles.editInput,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.divider,
              },
            ]}
            value={editedText}
            onChangeText={setEditedText}
            multiline
            numberOfLines={4}
            placeholder="Edit your comment..."
            placeholderTextColor={colors.secondaryText}
          />
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: colors.error }]}
              onPress={() => {
                setIsEditing(false);
                setEditedText(comment.text);
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleEdit}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <Text style={[styles.commentText, { color: colors.text }]}>
          {comment.text}
        </Text>
      )}

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.replyButton}
          onPress={() => setShowReplyInput(!showReplyInput)}
        >
          <MaterialIcons
            name={showReplyInput ? 'expand-less' : 'expand-more'}
            size={20}
            color={colors.primary}
          />
          <Text style={[styles.replyButtonText, { color: colors.primary }]}>
            {showReplyInput ? 'Cancel Reply' : 'Reply'}
          </Text>
        </TouchableOpacity>

        {comment.replies && comment.replies.length > 0 && (
          <TouchableOpacity
            style={styles.repliesButton}
            onPress={() => setShowReplies(!showReplies)}
          >
            <MaterialIcons
              name={showReplies ? 'expand-less' : 'expand-more'}
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.repliesButtonText, { color: colors.primary }]}>
              {showReplies
                ? 'Hide Replies'
                : `${comment.replies.length} ${
                    comment.replies.length === 1 ? 'Reply' : 'Replies'
                  }`}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {showReplyInput && (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.replyInputContainer}
        >
          <TextInput
            style={[
              styles.replyInput,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.divider,
              },
            ]}
            value={replyText}
            onChangeText={setReplyText}
            placeholder="Write a reply..."
            placeholderTextColor={colors.secondaryText}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { backgroundColor: colors.primary },
            ]}
            onPress={handleReply}
            disabled={!replyText.trim()}
          >
            <MaterialIcons
              name="send"
              size={20}
              color={replyText.trim() ? '#fff' : colors.secondaryText}
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      )}

      {showReplies && comment.replies && (
        <View style={styles.repliesContainer}>
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              onEdit={onEdit}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  editContainer: {
    marginTop: 8,
  },
  editInput: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    marginBottom: 8,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  commentText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  replyButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  repliesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  repliesButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  replyInputContainer: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
  },
  replyInput: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  repliesContainer: {
    marginTop: 12,
    marginLeft: 16,
  },
}); 