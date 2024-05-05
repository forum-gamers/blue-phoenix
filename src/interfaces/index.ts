export interface FileInput {
  contentType: string;
  url: string;
  fileId: string;
}

export interface BasePaginationInput {
  page: number;
  limit: number;
}

export type AccountType = 'Admin' | 'Coach' | 'Professional';
