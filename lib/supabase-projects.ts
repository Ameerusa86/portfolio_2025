import { supabase } from "@/lib/supabase";
import type { Project } from "@/types/project";

// Insert a new project (for admin dashboard)
export async function addProject(
  project: Omit<Project, "id" | "created_at" | "updated_at"> // id, created_at, updated_at are auto-generated
): Promise<Project> {
  const { data, error } = await supabase
    .from("projects")
    .insert([project])
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

// Fetch all projects (for admin or public)
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("order", { ascending: true });
  if (error) throw error;
  return data as Project[];
}
