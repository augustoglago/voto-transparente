export interface Candidate {
  id: string;
  name: string;
  votes: number;
}

export interface Position {
  id: string;
  name: string;
  candidates: Candidate[];
}
