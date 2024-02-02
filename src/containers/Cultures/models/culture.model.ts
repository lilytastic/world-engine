export type TopicId = number;
export type OpinionId = number;


export interface ICulture {
  name: string;
  languages: number[]; // reference ids.
  symbols: any; // associations between different objects/concepts/whatever.
  precepts: {[topics: TopicId]: OpinionId};
  subcultures: Partial<ICulture> & { name: string }[];
}

export interface ITopic {
  id: TopicId;
  topic: string;
  potentialOpinions: {[id: OpinionId]: IOpinion};
}

export interface IOpinion {
  id: OpinionId;
  label: string;
  importance: number; // Will make it more resistant to change. Affects character's reactions -- how much they like or dislike another's actions, for example.
}
