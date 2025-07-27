export type SectionName =
  | 'Technology'
  | 'Travel'
  | 'Food'
  | 'Sports'
  | 'Politics'
  | 'Education'
  | 'Religion'
  | 'Romance'
  | 'Jobs'
  | 'News'
  | 'Entertainment'
  | 'Celebrity';

export interface Section {
  id: string;
  name: SectionName;
  description?: string;
  ch?: string;
}
