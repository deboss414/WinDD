import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  useColorScheme,
  Alert,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getColors } from '../../constants/colors';
import { Task, TaskStatus, TaskPriority } from '../../types/task';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAvoidingView } from 'react-native';

interface TaskFormProps {
  onSubmit: (data: Task) => void;
  initialData?: Task;
  mode?: 'create' | 'edit';
}

export const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialData,
  mode = 'create',
}) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [status, setStatus] = useState<TaskStatus>('In Progress');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setDueDate(new Date(initialData.dueDate));
      setStatus(initialData.status);
      setPriority(initialData.priority);
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(new Date());
    setStatus('In Progress');
    setPriority('medium');
    setShowDatePicker(false);
    setShowStatusDropdown(false);
    setShowPriorityDropdown(false);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      const selectedDate = new Date(dueDate);
      selectedDate.setHours(0, 0, 0, 0);
      
      const taskData: Task = {
        id: initialData?.id || '',
        title: title.trim(),
        description: description.trim(),
        dueDate: selectedDate.toISOString(),
        status,
        priority,
        createdBy: initialData?.createdBy || '',
        createdAt: initialData?.createdAt || new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        participants: initialData?.participants || [],
        subtasks: initialData?.subtasks || [],
      };

      await onSubmit(taskData);
      resetForm();
    } catch (error) {
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
    >
      <ScrollView 
        style={styles.form} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.formContent}
      >
        {/* Title */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.cardBackground,
                color: colors.text,
                borderColor: colors.divider,
              },
            ]}
            placeholder="Enter task title"
            placeholderTextColor={colors.secondaryText}
            value={title}
            onChangeText={setTitle}
            maxLength={50}
          />
          <Text style={[styles.characterCount, { color: colors.secondaryText }]}>
            {title.length}/50 characters
          </Text>
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Description</Text>
          <TextInput
            style={[
              styles.textArea,
              {
                backgroundColor: colors.cardBackground,
                color: colors.text,
                borderColor: colors.divider,
              },
            ]}
            placeholder="Enter task description"
            placeholderTextColor={colors.secondaryText}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Due Date */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Due Date *</Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.divider,
              },
            ]}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.dateInputContent}>
              <Text
                style={[
                  styles.inputText,
                  { color: dueDate ? colors.text : colors.secondaryText },
                ]}
              >
                {dueDate.toLocaleDateString()}
              </Text>
              <MaterialIcons name="calendar-today" size={22} color={colors.text} />
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <View
              style={[
                styles.datePickerContainer,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.divider,
                },
              ]}
            >
              <DateTimePicker
                value={dueDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'calendar'}
                onChange={handleDateChange}
                minimumDate={new Date()}
                textColor={colors.text}
                style={styles.datePicker}
                themeVariant={colorScheme}
              />
            </View>
          )}
        </View>

        {/* Status */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Status *</Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.divider,
              },
            ]}
            onPress={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <View style={styles.statusInputContent}>
              <Text style={[styles.inputText, { color: colors.text }]}>
                {status}
              </Text>
              <MaterialIcons
                name={showStatusDropdown ? 'expand-less' : 'expand-more'}
                size={24}
                color={colors.text}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Priority */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Priority *</Text>
          <TouchableOpacity
            style={[
              styles.input,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.divider,
              },
            ]}
            onPress={() => setShowPriorityDropdown(!showPriorityDropdown)}
          >
            <View style={styles.statusInputContent}>
              <Text style={[styles.inputText, { color: colors.text }]}>
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Text>
              <MaterialIcons
                name={showPriorityDropdown ? 'expand-less' : 'expand-more'}
                size={24}
                color={colors.text}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={[
            styles.submitButton,
            { backgroundColor: colors.primary },
          ]}
        >
          <Text style={[styles.submitButtonText, { color: '#fff' }]}>
            {mode === 'create' ? 'Create' : 'Update'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Status Dropdown */}
      {showStatusDropdown && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.divider,
            },
          ]}
        >
          {['In Progress', 'completed', 'expired', 'closed'].map((statusOption) => (
            <TouchableOpacity
              key={statusOption}
              style={styles.dropdownItem}
              onPress={() => {
                setStatus(statusOption as TaskStatus);
                setShowStatusDropdown(false);
              }}
            >
              <Text style={[styles.dropdownItemText, { color: colors.text }]}>
                {statusOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Priority Dropdown */}
      {showPriorityDropdown && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.divider,
            },
          ]}
        >
          {['low', 'medium', 'high'].map((priorityOption) => (
            <TouchableOpacity
              key={priorityOption}
              style={styles.dropdownItem}
              onPress={() => {
                setPriority(priorityOption as TaskPriority);
                setShowPriorityDropdown(false);
              }}
            >
              <Text style={[styles.dropdownItemText, { color: colors.text }]}>
                {priorityOption.charAt(0).toUpperCase() + priorityOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flex: 1,
  },
  formContent: {
    padding: 16,
    paddingBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  inputText: {
    fontSize: 16,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  submitButton: {
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  datePickerContainer: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    padding: Platform.OS === 'ios' ? 10 : 0,
  },
  datePicker: {
    width: '100%',
    height: Platform.OS === 'ios' ? 200 : undefined,
  },
  statusInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
  },
  dropdown: {
    position: 'absolute',
    top: 200,
    left: 24,
    right: 24,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  characterCount: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
});
