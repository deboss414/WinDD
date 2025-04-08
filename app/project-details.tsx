import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, TextInput, Modal, Animated, PanResponder, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Slider } from '@miblanchard/react-native-slider';
import DateTimePicker from '@react-native-community/datetimepicker';

// Types for our data
interface Participant {
  id: string;
  name: string;
  avatar: string;
}

interface Response {
  id: string;
  user: string;
  text: string;
  timestamp: string;
}

interface Comment {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  responses: Response[];
}

interface Subtask {
  id: string;
  title: string;
  status: 'completed' | 'in-progress' | 'expired';
  progress: number;
  comments: Comment[];
}

interface ProjectDetails {
  id: string;
  title: string;
  date: Date;
  dueDate: Date;
  progress: number;
  priority: string;
  description: string;
  participants: Participant[];
  subtasks: Subtask[];
}

// Mock data for project details
const initialProjectDetails = {
  id: '1',
  title: 'NFT Mobile App Design',
  date: new Date(2024, 7, 19),
  dueDate: new Date(2024, 8, 1),
  progress: 45,
  priority: 'High',
  description: 'Design and implement a modern NFT marketplace mobile app with user authentication, wallet integration, and trading features.',
  participants: [
    { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
    { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
  ],
  subtasks: [
    {
      id: '1',
      title: 'Design Home Screen',
      status: 'in-progress',
      progress: 60,
      comments: [
        { 
          id: '1', 
          user: 'John Doe', 
          text: 'Added new color scheme for better contrast', 
          timestamp: '2h ago',
          responses: [
            { id: '1-1', user: 'Jane Smith', text: 'The contrast looks good, but we should adjust the font size', timestamp: '1h ago' }
          ]
        },
        { 
          id: '2', 
          user: 'Jane Smith', 
          text: 'Please review the latest changes', 
          timestamp: '1h ago',
          responses: []
        },
      ]
    },
    {
      id: '2',
      title: 'Implement User Authentication',
      status: 'completed',
      progress: 100,
      comments: [
        { id: '3', user: 'Mike Johnson', text: 'Authentication flow completed', timestamp: '1d ago' },
      ]
    },
    {
      id: '3',
      title: 'Create NFT Gallery',
      status: 'in-progress',
      progress: 30,
      comments: [
        { id: '4', user: 'John Doe', text: 'Working on grid layout', timestamp: '3h ago' },
      ]
    }
  ]
};

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return '#F44336';
    case 'medium':
      return '#FF9800';
    case 'low':
      return '#4CAF50';
    default:
      return '#666';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed':
      return '#4CAF50';
    case 'in-progress':
      return '#2196F3';
    case 'expired':
      return '#F44336';
    default:
      return '#666';
  }
};

export default function ProjectDetails() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // Initialize project details from params
  const [projectDetails, setProjectDetails] = useState<ProjectDetails>(() => {
    const parsedParticipants = params.participants ? JSON.parse(params.participants as string) : [];
    
    return {
      id: params.id as string,
      title: params.title as string,
      date: new Date(),
      dueDate: params.dueDate ? new Date(params.dueDate as string) : new Date(),
      progress: Number(params.progress) || 0,
      priority: params.priority as string || 'High',
      description: params.description as string || '',
      participants: parsedParticipants,
      subtasks: []
    };
  });

  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(projectDetails.description);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(projectDetails.title);
  const [showPriorityModal, setShowPriorityModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [expandedComment, setExpandedComment] = useState<string | null>(null);
  const [newResponse, setNewResponse] = useState('');
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [showDeleteResponseConfirm, setShowDeleteResponseConfirm] = useState(false);
  const [responseToDelete, setResponseToDelete] = useState<{subtaskId: string, commentId: string, responseId: string} | null>(null);
  const [showAddSubtaskModal, setShowAddSubtaskModal] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [showEditSubtaskModal, setShowEditSubtaskModal] = useState(false);
  const [editingSubtask, setEditingSubtask] = useState<{id: string, title: string, progress: number} | null>(null);
  const [showDeleteSubtaskConfirm, setShowDeleteSubtaskConfirm] = useState(false);
  const [subtaskToDelete, setSubtaskToDelete] = useState<string | null>(null);
  const swipeAnimations = useRef<{ [key: string]: Animated.Value }>({});
  const [newComment, setNewComment] = useState('');
  const [showAddCommentModal, setShowAddCommentModal] = useState(false);
  const [commentingSubtaskId, setCommentingSubtaskId] = useState<string | null>(null);
  const [expandedSubtask, setExpandedSubtask] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const priorities = ['High', 'Medium', 'Low'];

  // Add function to calculate project progress
  const calculateProjectProgress = (subtasks: typeof projectDetails.subtasks) => {
    if (subtasks.length === 0) return 0;
    const totalProgress = subtasks.reduce((sum, subtask) => sum + subtask.progress, 0);
    return Math.round(totalProgress / subtasks.length);
  };

  // Update project progress whenever subtasks change
  const updateProjectProgress = (subtasks: typeof projectDetails.subtasks) => {
    setProjectDetails(prev => ({
      ...prev,
      progress: calculateProjectProgress(subtasks)
    }));
  };

  const handlePriorityChange = (priority: string) => {
    setProjectDetails(prev => ({ ...prev, priority }));
    setShowPriorityModal(false);
  };

  const handleDescriptionSave = () => {
    setProjectDetails(prev => ({ ...prev, description }));
    setIsEditingDescription(false);
  };

  const handleAddMember = () => {
    if (newMemberName.trim()) {
      const newMember = {
        id: String(projectDetails.participants.length + 1),
        name: newMemberName,
        avatar: `https://i.pravatar.cc/150?img=${projectDetails.participants.length + 1}`
      };
      setProjectDetails(prev => ({
        ...prev,
        participants: [...prev.participants, newMember]
      }));
      setNewMemberName('');
      setShowAddMemberModal(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setProjectDetails(prev => ({
      ...prev,
      participants: prev.participants.filter(member => member.id !== memberId)
    }));
  };

  const handleAddResponse = (subtaskId: string, commentId: string) => {
    if (newResponse.trim()) {
      setProjectDetails(prev => ({
        ...prev,
        subtasks: prev.subtasks.map(subtask => {
          if (subtask.id === subtaskId) {
            return {
              ...subtask,
              comments: subtask.comments.map(comment => {
                if (comment.id === commentId) {
                  return {
                    ...comment,
                    responses: [
                      ...(comment.responses || []),
                      {
                        id: `${commentId}-${(comment.responses || []).length + 1}`,
                        user: 'Current User', // Replace with actual user
                        text: newResponse,
                        timestamp: 'Just now'
                      }
                    ]
                  };
                }
                return comment;
              })
            };
          }
          return subtask;
        })
      }));
      setNewResponse('');
      setRespondingTo(null);
    }
  };

  const handleDeleteResponse = (subtaskId: string, commentId: string, responseId: string) => {
    setProjectDetails(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(subtask => {
        if (subtask.id === subtaskId) {
          return {
            ...subtask,
            comments: subtask.comments.map(comment => {
              if (comment.id === commentId) {
                return {
                  ...comment,
                  responses: comment.responses.filter(response => response.id !== responseId)
                };
              }
              return comment;
            })
          };
        }
        return subtask;
      })
    }));
    setShowDeleteResponseConfirm(false);
    setResponseToDelete(null);
  };

  const toggleCommentExpansion = (subtaskId: string, commentId: string) => {
    const commentKey = `${subtaskId}-${commentId}`;
    setExpandedComment(expandedComment === commentKey ? null : commentKey);
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      const newSubtask: Subtask = {
        id: String(projectDetails.subtasks.length + 1),
        title: newSubtaskTitle,
        status: 'in-progress',
        progress: 0,
        comments: []
      };
      setProjectDetails(prev => ({
        ...prev,
        subtasks: [...prev.subtasks, newSubtask]
      }));
      updateProjectProgress([...projectDetails.subtasks, newSubtask]);
      setNewSubtaskTitle('');
      setShowAddSubtaskModal(false);
    }
  };

  const handleEditSubtask = (subtaskId: string) => {
    const subtask = projectDetails.subtasks.find(s => s.id === subtaskId);
    if (subtask) {
      setEditingSubtask({
        id: subtask.id,
        title: subtask.title,
        progress: subtask.progress
      });
      setShowEditSubtaskModal(true);
    }
  };

  const handleSaveEdit = () => {
    if (editingSubtask) {
      const updatedSubtasks = projectDetails.subtasks.map(subtask => 
        subtask.id === editingSubtask.id
          ? { 
              ...subtask, 
              title: editingSubtask.title, 
              progress: Math.round(editingSubtask.progress / 10) * 10 
            }
          : subtask
      );
      setProjectDetails(prev => ({
        ...prev,
        subtasks: updatedSubtasks
      }));
      updateProjectProgress(updatedSubtasks);
      setShowEditSubtaskModal(false);
      setEditingSubtask(null);
    }
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updatedSubtasks = projectDetails.subtasks.filter(subtask => subtask.id !== subtaskId);
    setProjectDetails(prev => ({
      ...prev,
      subtasks: updatedSubtasks
    }));
    updateProjectProgress(updatedSubtasks);
    setShowDeleteSubtaskConfirm(false);
    setSubtaskToDelete(null);
  };

  const handleAddComment = () => {
    if (newComment.trim() && commentingSubtaskId) {
      setProjectDetails(prev => ({
        ...prev,
        subtasks: prev.subtasks.map(subtask => {
          if (subtask.id === commentingSubtaskId) {
            return {
              ...subtask,
              comments: [
                ...subtask.comments,
                {
                  id: String(subtask.comments.length + 1),
                  user: 'Current User',
                  text: newComment,
                  timestamp: 'Just now',
                  responses: []
                }
              ]
            };
          }
          return subtask;
        })
      }));
      setNewComment('');
      setShowAddCommentModal(false);
      setCommentingSubtaskId(null);
    }
  };

  const createPanResponder = (subtaskId: string) => {
    if (!swipeAnimations.current[subtaskId]) {
      swipeAnimations.current[subtaskId] = new Animated.Value(0);
    }

    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal movements
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (_, gestureState) => {
        // Allow sliding left only
        if (gestureState.dx < 0) {
          // Add resistance to the sliding
          const resistance = 0.7;
          swipeAnimations.current[subtaskId].setValue(gestureState.dx * resistance);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Threshold for revealing actions
        const threshold = -60;
        
        if (gestureState.dx < threshold) {
          // Snap to fully revealed state
          Animated.spring(swipeAnimations.current[subtaskId], {
            toValue: -120,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }).start();
        } else {
          // Snap back to original position
          Animated.spring(swipeAnimations.current[subtaskId], {
            toValue: 0,
            useNativeDriver: true,
            friction: 8,
            tension: 40,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        // Snap back to original position
        Animated.spring(swipeAnimations.current[subtaskId], {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
          tension: 40,
        }).start();
      },
      onPanResponderTerminationRequest: () => {
        // Allow termination of the gesture
        return true;
      },
    });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setProjectDetails(prev => ({ ...prev, dueDate: selectedDate }));
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Details</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Project Title and Priority */}
        <View style={styles.titleSection}>
          <View style={styles.titleContainer}>
            {isEditingTitle ? (
              <View style={styles.editTitleContainer}>
                <TextInput
                  style={styles.titleInput}
                  value={title}
                  onChangeText={setTitle}
                  onBlur={() => {
                    setProjectDetails(prev => ({ ...prev, title }));
                    setIsEditingTitle(false);
                  }}
                  autoFocus
                />
              </View>
            ) : (
              <TouchableOpacity 
                onPress={() => setIsEditingTitle(true)}
                style={styles.titleTouchable}
              >
                <Text style={styles.projectTitle}>{projectDetails.title}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              style={[styles.priorityBadge, { backgroundColor: getPriorityColor(projectDetails.priority) }]}
              onPress={() => setShowPriorityModal(true)}
            >
              <Text style={styles.priorityText}>{projectDetails.priority}</Text>
              <Ionicons name="chevron-down" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={styles.dueDateContainer}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={16} color="#2A9D8F" />
            <Text style={styles.dueDateText}>
              Due {projectDetails.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Progress</Text>
            <Text style={styles.progressPercentage}>{projectDetails.progress}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${projectDetails.progress}%` }]} />
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionSection}>
          <View style={styles.descriptionHeader}>
            <Text style={styles.sectionTitle}>Description</Text>
            {isEditingDescription ? (
              <TouchableOpacity onPress={handleDescriptionSave}>
                <Text style={styles.saveButton}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setIsEditingDescription(true)}>
                <Ionicons name="pencil" size={20} color="#2A9D8F" />
              </TouchableOpacity>
            )}
          </View>
          {isEditingDescription ? (
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          ) : (
            <Text style={styles.descriptionText}>{projectDetails.description}</Text>
          )}
        </View>

        {/* Participants */}
        <View style={styles.participantsSection}>
          <View style={styles.participantsHeader}>
            <Text style={styles.sectionTitle}>Team Members</Text>
            <TouchableOpacity 
              style={styles.addMemberButton}
              onPress={() => setShowAddMemberModal(true)}
            >
              <Ionicons name="add-circle" size={24} color="#2A9D8F" />
            </TouchableOpacity>
          </View>
          <View style={styles.participantsList}>
            {projectDetails.participants.map((participant) => (
              <View key={participant.id} style={styles.participantCard}>
                <Image source={{ uri: participant.avatar }} style={styles.participantAvatar} />
                <Text style={styles.participantName}>{participant.name}</Text>
                <TouchableOpacity 
                  style={styles.removeMemberButton}
                  onPress={() => handleRemoveMember(participant.id)}
                >
                  <Ionicons name="close-circle" size={20} color="#F44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        {/* Subtasks */}
        <View style={styles.subtasksSection}>
          <View style={styles.subtasksHeader}>
            <Text style={styles.sectionTitle}>Subtasks</Text>
            <TouchableOpacity 
              style={styles.addSubtaskButton}
              onPress={() => setShowAddSubtaskModal(true)}
            >
              <Ionicons name="add-circle" size={24} color="#2A9D8F" />
            </TouchableOpacity>
          </View>
          {projectDetails.subtasks.map((subtask) => {
            const panResponder = createPanResponder(subtask.id);
            const translateX = swipeAnimations.current[subtask.id] || new Animated.Value(0);
            
            return (
              <View key={subtask.id} style={styles.subtaskWrapper}>
                <View style={styles.subtaskActions}>
                  <TouchableOpacity 
                    style={[styles.subtaskActionButton, styles.editButton]}
                    onPress={() => handleEditSubtask(subtask.id)}
                  >
                    <Ionicons name="pencil" size={20} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.subtaskActionButton, styles.actionDeleteButton]}
                    onPress={() => {
                      setSubtaskToDelete(subtask.id);
                      setShowDeleteSubtaskConfirm(true);
                    }}
                  >
                    <Ionicons name="trash" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
                <Animated.View
                  style={[
                    styles.subtaskCard,
                    { transform: [{ translateX }] }
                  ]}
                  {...panResponder.panHandlers}
                >
                  <View style={styles.subtaskContent}>
                    <View style={styles.subtaskHeader}>
                      <View style={styles.subtaskTitleContainer}>
                        <View style={[styles.statusDot, { backgroundColor: getStatusColor(subtask.status) }]} />
                        <Text style={styles.subtaskTitle}>{subtask.title}</Text>
                      </View>
                      <Text style={styles.subtaskProgress}>{subtask.progress}%</Text>
                    </View>
                    
                    <View style={styles.subtaskProgressBar}>
                      <View style={[styles.subtaskProgressFill, { width: `${subtask.progress}%` }]} />
                    </View>

                    <View style={styles.subtaskParticipants}>
                      {/* Get unique participants from comments */}
                      {Array.from(new Set(subtask.comments.map(comment => comment.user))).map((user, index) => (
                        <Image 
                          key={`${user}-${index}`}
                          source={{ uri: `https://i.pravatar.cc/150?img=${user}` }} 
                          style={styles.participantAvatarSmall}
                        />
                      ))}
                    </View>

                    <TouchableOpacity 
                      style={styles.showCommentsButton}
                      onPress={() => setExpandedSubtask(expandedSubtask === subtask.id ? null : subtask.id)}
                    >
                      <Ionicons 
                        name={expandedSubtask === subtask.id ? "chevron-up" : "chevron-down"} 
                        size={16} 
                        color="#2A9D8F" 
                      />
                      <Text style={styles.showCommentsText}>
                        {expandedSubtask === subtask.id ? 'Hide Comments' : `Show Comments (${subtask.comments.length})`}
                      </Text>
                    </TouchableOpacity>

                    {expandedSubtask === subtask.id && (
                      <View style={styles.commentsSection}>
                        {subtask.comments.map((comment) => (
                          <View key={comment.id} style={styles.commentCard}>
                            <TouchableOpacity 
                              onPress={() => toggleCommentExpansion(subtask.id, comment.id)}
                              style={styles.commentHeader}
                            >
                              <View style={styles.commentUserInfo}>
                                <Image 
                                  source={{ uri: `https://i.pravatar.cc/150?img=${comment.user}` }} 
                                  style={styles.commentUserAvatar}
                                />
                                <Text style={styles.commentUser}>{comment.user}</Text>
                              </View>
                              <View style={styles.commentActions}>
                                <Text style={styles.commentTime}>{comment.timestamp}</Text>
                                <Ionicons 
                                  name={expandedComment === `${subtask.id}-${comment.id}` ? "chevron-up" : "chevron-down"} 
                                  size={16} 
                                  color="#666" 
                                />
                              </View>
                            </TouchableOpacity>
                            <Text style={styles.commentText}>{comment.text}</Text>
                            
                            {expandedComment === `${subtask.id}-${comment.id}` && (
                              <View style={styles.commentExpanded}>
                                {/* Responses */}
                                {(comment.responses || []).map((response) => (
                                  <View key={response.id} style={styles.responseCard}>
                                    <View style={styles.responseHeader}>
                                      <View style={styles.responseUserInfo}>
                                        <Image 
                                          source={{ uri: `https://i.pravatar.cc/150?img=${response.user}` }} 
                                          style={styles.responseUserAvatar}
                                        />
                                        <Text style={styles.responseUser}>{response.user}</Text>
                                      </View>
                                      <View style={styles.responseActions}>
                                        <Text style={styles.responseTime}>{response.timestamp}</Text>
                                        {response.user === 'Current User' && (
                                          <TouchableOpacity 
                                            style={styles.deleteResponseButton}
                                            onPress={() => {
                                              setResponseToDelete({ subtaskId: subtask.id, commentId: comment.id, responseId: response.id });
                                              setShowDeleteResponseConfirm(true);
                                            }}
                                          >
                                            <Ionicons name="trash-outline" size={16} color="#F44336" />
                                          </TouchableOpacity>
                                        )}
                                      </View>
                                    </View>
                                    <Text style={styles.responseText}>{response.text}</Text>
                                  </View>
                                ))}
                                
                                {/* Response Input */}
                                {respondingTo === comment.id ? (
                                  <View style={styles.responseInputContainer}>
                                    <TextInput
                                      style={styles.responseInput}
                                      placeholder="Write a response..."
                                      value={newResponse}
                                      onChangeText={setNewResponse}
                                      multiline
                                    />
                                    <View style={styles.responseInputActions}>
                                      <TouchableOpacity 
                                        style={styles.cancelResponseButton}
                                        onPress={() => {
                                          setRespondingTo(null);
                                          setNewResponse('');
                                        }}
                                      >
                                        <Text style={styles.cancelResponseText}>Cancel</Text>
                                      </TouchableOpacity>
                                      <TouchableOpacity 
                                        style={styles.sendResponseButton}
                                        onPress={() => handleAddResponse(subtask.id, comment.id)}
                                      >
                                        <Text style={styles.sendResponseText}>Send</Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                ) : (
                                  <TouchableOpacity 
                                    style={styles.addResponseButton}
                                    onPress={() => setRespondingTo(comment.id)}
                                  >
                                    <Ionicons name="chatbubble-outline" size={16} color="#2A9D8F" />
                                    <Text style={styles.addResponseText}>Add Response</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            )}
                          </View>
                        ))}
                      </View>
                    )}

                    <TouchableOpacity 
                      style={styles.addCommentButton}
                      onPress={() => {
                        setCommentingSubtaskId(subtask.id);
                        setShowAddCommentModal(true);
                      }}
                    >
                      <Ionicons name="chatbubble-outline" size={20} color="#2A9D8F" />
                      <Text style={styles.addCommentText}>Add Comment</Text>
                    </TouchableOpacity>
                  </View>
                </Animated.View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Priority Selection Modal */}
      <Modal
        visible={showPriorityModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPriorityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Priority</Text>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityOption,
                  projectDetails.priority === priority && styles.selectedPriority
                ]}
                onPress={() => handlePriorityChange(priority)}
              >
                <Text style={[
                  styles.priorityOptionText,
                  projectDetails.priority === priority && styles.selectedPriorityText
                ]}>
                  {priority}
                </Text>
                {projectDetails.priority === priority && (
                  <Ionicons name="checkmark" size={20} color="#2A9D8F" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        visible={showAddMemberModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddMemberModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Team Member</Text>
            <TextInput
              style={styles.memberInput}
              placeholder="Enter member name"
              value={newMemberName}
              onChangeText={setNewMemberName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowAddMemberModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddMember}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Response Confirmation Modal */}
      <Modal
        visible={showDeleteResponseConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteResponseConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Response</Text>
            <Text style={styles.deleteConfirmText}>
              Are you sure you want to delete this response? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowDeleteResponseConfirm(false);
                  setResponseToDelete(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => responseToDelete && handleDeleteResponse(responseToDelete.subtaskId, responseToDelete.commentId, responseToDelete.responseId)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Subtask Modal */}
      <Modal
        visible={showAddSubtaskModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddSubtaskModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Subtask</Text>
            <TextInput
              style={styles.subtaskInput}
              placeholder="Enter subtask title"
              value={newSubtaskTitle}
              onChangeText={setNewSubtaskTitle}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddSubtaskModal(false);
                  setNewSubtaskTitle('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddSubtask}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Subtask Modal */}
      <Modal
        visible={showEditSubtaskModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEditSubtaskModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Subtask</Text>
            <TextInput
              style={styles.subtaskInput}
              placeholder="Enter subtask title"
              value={editingSubtask?.title}
              onChangeText={(text) => setEditingSubtask(prev => prev ? { ...prev, title: text } : null)}
            />
            <View style={styles.progressInputContainer}>
              <Text style={styles.progressLabel}>Progress: {editingSubtask?.progress}%</Text>
              <Slider
                containerStyle={styles.progressSlider}
                minimumValue={0}
                maximumValue={100}
                step={10}
                value={editingSubtask?.progress || 0}
                onValueChange={(value) => setEditingSubtask(prev => prev ? { ...prev, progress: Math.round(value[0]) } : null)}
                minimumTrackTintColor="#2A9D8F"
                maximumTrackTintColor="#f5f5f5"
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowEditSubtaskModal(false);
                  setEditingSubtask(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.addButton]}
                onPress={handleSaveEdit}
              >
                <Text style={styles.addButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Subtask Confirmation Modal */}
      <Modal
        visible={showDeleteSubtaskConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteSubtaskConfirm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Delete Subtask</Text>
            <Text style={styles.deleteConfirmText}>
              Are you sure you want to delete this subtask? This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowDeleteSubtaskConfirm(false);
                  setSubtaskToDelete(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={() => subtaskToDelete && handleDeleteSubtask(subtaskToDelete)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Comment Modal */}
      <Modal
        visible={showAddCommentModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddCommentModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Comment</Text>
            <TextInput
              style={[styles.subtaskInput, { minHeight: 100 }]}
              placeholder="Write your comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowAddCommentModal(false);
                  setNewComment('');
                  setCommentingSubtaskId(null);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.addButton]}
                onPress={handleAddComment}
              >
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Date Picker */}
      {Platform.OS === 'ios' ? (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
        >
          <View style={styles.datePickerModalOverlay}>
            <View style={styles.datePickerModalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Text style={styles.modalDoneText}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={projectDetails.dueDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  if (date) {
                    setProjectDetails(prev => ({ ...prev, dueDate: date }));
                  }
                }}
                minimumDate={new Date()}
                textColor="#000000"
                style={styles.datePickerIOS}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showDatePicker && (
          <DateTimePicker
            value={projectDetails.dueDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  titleSection: {
    padding: 16,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 24,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
  },
  dueDateText: {
    fontSize: 14,
    color: '#2A9D8F',
    fontWeight: '500',
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  priorityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginRight: 4,
  },
  progressSection: {
    padding: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 16,
    color: '#2A9D8F',
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2A9D8F',
    borderRadius: 4,
  },
  descriptionSection: {
    padding: 16,
  },
  descriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    color: '#2A9D8F',
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionInput: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  participantsSection: {
    padding: 16,
  },
  participantsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addMemberButton: {
    padding: 4,
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  participantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 8,
    borderRadius: 20,
  },
  participantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  participantName: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  removeMemberButton: {
    padding: 4,
  },
  subtasksSection: {
    padding: 16,
  },
  subtasksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addSubtaskButton: {
    padding: 4,
  },
  subtaskInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 48,
  },
  subtaskWrapper: {
    marginBottom: 16,
    position: 'relative',
  },
  subtaskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  subtaskContent: {
    padding: 16,
  },
  subtaskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subtaskTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  subtaskTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  subtaskProgress: {
    fontSize: 14,
    color: '#2A9D8F',
    fontWeight: '600',
  },
  subtaskProgressBar: {
    height: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    marginBottom: 12,
    overflow: 'hidden',
  },
  subtaskProgressFill: {
    height: '100%',
    backgroundColor: '#2A9D8F',
    borderRadius: 2,
  },
  subtaskParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  participantAvatarSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 4,
    borderWidth: 2,
    borderColor: '#fff',
  },
  showCommentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  showCommentsText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#2A9D8F',
    fontWeight: '500',
  },
  commentsSection: {
    marginBottom: 12,
  },
  commentCard: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUserAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  commentUser: {
    fontSize: 14,
    fontWeight: '600',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentTime: {
    fontSize: 12,
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    color: '#666',
  },
  commentExpanded: {
    marginTop: 8,
  },
  responseCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  responseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  responseUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  responseUserAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  responseUser: {
    fontSize: 14,
    fontWeight: '600',
  },
  responseActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  responseInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  responseInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  responseInputActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 8,
  },
  cancelResponseButton: {
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  cancelResponseText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '600',
  },
  sendResponseButton: {
    padding: 8,
    backgroundColor: '#2A9D8F',
    borderRadius: 8,
  },
  sendResponseText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  addResponseButton: {
    padding: 4,
  },
  addResponseText: {
    color: '#2A9D8F',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteResponseButton: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalCancelText: {
    color: '#666666',
    fontSize: 16,
    fontWeight: '500',
  },
  modalDoneText: {
    color: '#2A9D8F',
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerIOS: {
    height: 200,
    width: '100%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  priorityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedPriority: {
    backgroundColor: '#E0F2F1',
  },
  priorityOptionText: {
    fontSize: 16,
    color: '#666',
  },
  selectedPriorityText: {
    color: '#2A9D8F',
    fontWeight: '600',
  },
  memberInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    minHeight: 48,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  addButton: {
    backgroundColor: '#2A9D8F',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteConfirmText: {
    color: '#666',
    fontSize: 16,
    marginBottom: 16,
  },
  subtaskActions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 120,
    zIndex: 1,
  },
  subtaskActionButton: {
    width: 60,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  editButton: {
    backgroundColor: '#2196F3',
  },
  actionDeleteButton: {
    backgroundColor: '#F44336',
  },
  progressInputContainer: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressSlider: {
    width: '100%',
    height: 40,
  },
  subtaskFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
    paddingTop: 8,
  },
  addCommentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  addCommentText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#2A9D8F',
    fontWeight: '500',
  },
  projectMetaContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  titleTouchable: {
    flex: 1,
    marginRight: 12,
  },
  editTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    padding: 0,
    color: '#000000',
  },
  responseTime: {
    fontSize: 12,
    color: '#666',
  },
  responseText: {
    fontSize: 14,
    color: '#666',
  },
  datePickerModalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerModalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
}); 