export interface Video {
  name: string;
  key: string;
  size: number;
  type: string;
  official: boolean;
}

export interface VideoList {
  results: Video[];
}
