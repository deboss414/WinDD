export interface Comment {
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
}
