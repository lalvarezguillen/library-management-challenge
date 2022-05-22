export interface BookWritable {
  isbn: string;
  title: string;
  description: string;
  author: string;
}

export interface Book extends BookWritable {
  pk: number;
  // TODO: ideally this would be sent camel-cased
  // from the backend, to allow the frontend's code
  // to have consistent casing.
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
