export interface CategoryEntity {
  slug: string;
  name: string;
  description?: string;
  createdDate: Date;
  active: boolean;
}
