export interface TextData {
  title: string;
  content: string;
  format: string;
  expiresUnit: string;
  expiresValue: number;
}

export interface TextResponse {
  text: {
    id: number;
    title: string;
    content: string;
    format: string;
    expires: string;
    slug: string;
    likes_count: number;
    comments: Comment[];
  };
}

export interface UserProfile {
  id: number;
  created_at: string;
  name: string;
  email: string;
  activated: boolean;
  texts: TextResponse[];
  comments: Comment[];
}

export interface Comment {
  id: number;
  user_id: number;
  text_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommentResponse {
  comment: Comment;
}

export interface UserProfileResponse {
  user: UserProfile;
}
