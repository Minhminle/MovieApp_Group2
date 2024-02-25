export interface Video {
  id: number;
  name: string;
  key: string;
  size: number;
  type: string;
  official: boolean;
}

export interface VideoList {
  results: Video[];
}
