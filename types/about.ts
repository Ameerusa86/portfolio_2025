export interface AboutData {
  id: string;
  title: string;
  subtitle: string;
  hero_description: string;
  story_title: string;
  story_content: string[];
  skills_title: string;
  skills: string[];
  cta_title: string;
  cta_description: string;
  profile_image?: string;
  updated_at: string;
  created_at: string;
}

export interface CreateAboutData {
  title: string;
  subtitle: string;
  hero_description: string;
  story_title: string;
  story_content: string[];
  skills_title: string;
  skills: string[];
  cta_title: string;
  cta_description: string;
  profile_image?: string;
}

export interface UpdateAboutData extends Partial<CreateAboutData> {
  id: string;
}
