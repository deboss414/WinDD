import { TaskPriority } from '../types/task';
import { getColors } from '../constants/colors';
import { useColorScheme } from 'react-native';

export const getPriorityColor = (priority: TaskPriority) => {
  const colorScheme = useColorScheme() || 'light';
  const colors = getColors(colorScheme);
  
  switch (priority) {
    case 'low':
      return colors.priorityLow;
    case 'medium':
      return colors.priorityMedium;
    case 'high':
      return colors.priorityHigh;
    default:
      return colors.text;
  }
};

export const getPriorityIcon = (priority: TaskPriority) => {
  switch (priority) {
    case 'low':
      return 'arrow-downward';
    case 'medium':
      return 'remove';
    case 'high':
      return 'arrow-upward';
    default:
      return 'info';
  }
}; 