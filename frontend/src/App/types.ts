export interface BookWritable {
  isbn: string;
  title: string;
  description: string;
  author: string;
}

export interface Book extends BookWritable {
  pk: number;
  // TODO: camelcase
  on_site: boolean;
}

export interface ResultsPage {
  next?: string;
  previous?: string;
  count: number;
}

export interface BooksPage extends ResultsPage {
  results: Book[];
}

enum ActivityType {
  "check-out",
  "check-in",
}
export interface BookActivity {
  type: ActivityType;
  createdAt: string;
}

export interface ActivityPage extends ResultsPage {
  results: BookActivity[];
}
