export interface ListReview {
  results: Reviews[];
}

export interface Reviews {
  author: String;
  avatar_path: String;
  content: string;
  id: number;
  updated_at: String;
  author_details: AuthorDetails;
}
export interface AuthorDetails {
  avatar_path: String;
}
