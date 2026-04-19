/**
 * Profile Models - CLIENT_PROFILES & FREELANCER_PROFILES tables
 */

export enum CompanySize {
  Solo = 0,
  Small = 1,
  Medium = 2,
  Large = 3,
}

export enum ExperienceLevel {
  Entry = 0,
  Intermediate = 1,
  Expert = 2,
}

export enum Availability {
  Available = 0,
  Busy = 1,
  NotAvailable = 2,
}

export interface ClientProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_website: string | null;
  company_size: CompanySize;
  industry: string;
  company_description: string | null;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface FreelancerProfile {
  id: string;
  user_id: string;
  title: string;
  bio: string;
  hourly_rate: number;
  experience_level: ExperienceLevel;
  availability: Availability;
  location: string;
  profile_completion_score: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  id: string;
  freelancer_id: string;
  company_name: string;
  title: string;
  start_date: string;
  end_date: string | null;
  is_current_job: boolean;
}

export interface Education {
  id: string;
  freelancer_id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
}

export interface Certification {
  id: string;
  freelancer_id: string;
  name: string;
  issuing_organization: string;
  issue_date: string;
  expiration_date: string | null;
}

export interface PortfolioItem {
  id: string;
  freelancer_id: string;
  title: string;
  description: string;
  project_url: string | null;
  image_urls: string;
}

export enum ProficiencyLevel {
  Beginner = 0,
  Intermediate = 1,
  Expert = 2,
}

export interface FreelancerSkill {
  id: string;
  freelancer_id: string;
  skill_id: string;
  years_of_experience: number;
  proficiency_level: ProficiencyLevel;
}
