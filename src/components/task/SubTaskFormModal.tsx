import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getColors } from '../../constants/colors';
import { SubTask } from './SubTask';

interface SubTaskFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<SubTask, 'id' | 'createdAt' | 'lastUpdated' | 'createdBy' | 'comments'>) => void;
  participants: string[];
  mode: 'create' | 'edit';
  initialData?: SubTask;
  isSubmitting?: boolean;
}

export const SubTaskFormModal: React.FC<SubTaskFormModalProps> = ({
  visible,
  onClose,
  onSubmit,
  participants,
  mode,
  initialData,
}) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [assignee, setAssignee] = useState(initialData?.assignee || []);

  const handleSubmit = () => {
    onSubmit({
      title,
      description,
      assignee,
      progress: initialData?.progress || 0,
      dueDate: initialData?.dueDate || new Date().toISOString(),
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={[styles.modalOverlay, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {mode === 'create' ? 'Create Subtask' : 'Edit Subtask'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Title</Text>
              <TextInput
                style={[styles.input, { 
                  backgroundColor: colors.cardBackground,
                  color: colors.text,
                }]}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter subtask title"
                placeholderTextColor={colors.secondaryText}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[styles.textArea, { 
                  backgroundColor: colors.cardBackground,
                  color: colors.text,
                }]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter subtask description"
                placeholderTextColor={colors.secondaryText}
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitButtonText}>
                {mode === 'create' ? 'Create' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingTop: 12,
    fontSize: 16,
    minHeight: 100,
  },
  submitButton: {
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
