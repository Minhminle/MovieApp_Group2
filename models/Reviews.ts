export interface ListReview{
  results:Reviews[];
}

export interface Reviews {
  author: String;
  avatar_path: String;
  content: String;
  id: number;
  updated_at:String;
}