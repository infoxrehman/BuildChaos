import { supabase } from "@/lib/supabase";
import {TablesInsert} from "@/types/database.types";

type ShowcaseInput = TablesInsert<"showcase">;

export const fetchShowcase = async () => {
  const { data } = await supabase
    .from("showcase")
    .select("*")
    .order('created_at', {ascending:false})
    .throwOnError();

  return data;
};

export const createShowcase = async (newProject: ShowcaseInput) => {
  const { data } = await supabase
    .from("showcase")
    .insert(newProject)
    .select("*")
    .throwOnError();

  return data;
};

export const getPostById = async (id: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, user:profiles(*), replies:posts(count)")
    .eq("id", id)
    .single()
    .throwOnError();

  return data;
};

export const getPostsByUserId = async (id: string) => {
  const { data, error } = await supabase
    .from("posts")
    .select("*, user:profiles(*), replies:posts(count)")
    .eq("user_id", id)
    .order("created_at", {ascending:false})
    .throwOnError();

  return data;
};

export const getPostReplies = async (id: string) => {
  const { data } = await supabase
    .from("posts")
    .select("*, user:profiles(*), replies:posts(count)")
    .eq("parent_id", id)
    .throwOnError();

  return data;
};