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

enum ActivityType {
  "check-out",
  "check-in",
}
export interface BookActivity {
  type: ActivityType;
  createdAt: string;
}