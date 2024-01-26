export interface CreditSection {
  cast: Cast[];
  crew: Crew[];
}

export interface Credit {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  credit_id: string;
}

export interface Cast extends Credit {
  cast_id: number;
  character: string;
  order: number;
}

export interface Crew extends Credit {
  department: string;
  job: string;
}
