export interface TextData {
  title: string;
  content: string;
  format: string;
  expiresUnit: string;
  expiresValue: number;
}

export interface TextResponse {
  text: {
    title: string;
    content: string;
    format: string;
    expires: string;
    slug: string;
  };
}
