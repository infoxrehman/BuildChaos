// export type User = {
//     id: string;
//     username: string;
//     name: string;
//     avatar_url: string;
//     bio: string;
// }

// export type Post = {
//     id: string;
//     created_at: string;
//     content: string;
    
//     user_id: string;
//     user: User;

//     parent_id?: string | null;
//     parent ?: Post | null; 
    
//     replies: Post[];
// }

export type SectionItem = {
  id: string;
  title: string;
  description?: string;
  image?: string;
  date?: string;
  location?: string;
};

export type SectionProps = {
  title: string;
  items: SectionItem[];
  onPressItem?: (item: SectionItem) => void;
};