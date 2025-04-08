interface Colors {
  background: string;
  text: string;
  secondaryText: string;
  primary: string;
  cardBackground: string;
  divider: string;
  success: string;
  error: string;
  taskStatus: {
    'In Progress': string;
    completed: string;
    expired: string;
    closed: string;
  };
  warning: string;
  priorityLow: string;
  priorityMedium: string;
  priorityHigh: string;
  primaryTint: string;
}

export const getColors = (colorScheme: 'light' | 'dark'): Colors => {
  const isDark = colorScheme === 'dark';
  const primaryColor = '#2196F3';
  
  return {
    primary: primaryColor,
    primaryTint: isDark ? '#64B5F6' : '#E3F2FD',
    background: isDark ? '#121212' : '#FFFFFF',
    cardBackground: isDark ? '#1E1E1E' : '#F5F5F5',
    text: isDark ? '#FFFFFF' : '#000000',
    secondaryText: isDark ? '#B0B0B0' : '#757575',
    divider: isDark ? '#2C2C2C' : '#E0E0E0',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FFC107',
    taskStatus: {
      'In Progress': '#FFA726',
      completed: '#4CAF50',
      expired: '#F44336',
      closed: '#9E9E9E',
    },
    priorityLow: '#4CAF50',
    priorityMedium: '#FF9800',
    priorityHigh: '#F44336',
  };
};
