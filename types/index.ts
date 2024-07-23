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
  };
}
