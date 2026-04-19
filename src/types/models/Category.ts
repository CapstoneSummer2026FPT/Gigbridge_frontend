/**
 * Category & Skill Models - CATEGORIES & SKILLS tables
 */

export interface Category {
  id: string;
  name: string;
  name_vi: string;
  slug: string;
  description: string | null;
  parent_category_id: string | null;
  is_active: boolean;
}

export interface Skill {
  id: string;
  category_id: string;
  name: string;
  name_vi: string;
  is_active: boolean;
}
