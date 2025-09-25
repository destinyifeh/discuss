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
  | 'Celebrity'
  | 'Health'
  | 'Properties'
  | 'Family'
  | 'Autos'
  | 'Business'
  | 'Science'
  | 'Finance'
  | 'Culture';

export interface Section {
  id: string;
  name: SectionName;
  description?: string;
  slug?: string;
}
