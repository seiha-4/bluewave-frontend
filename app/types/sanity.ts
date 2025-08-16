import { PortableTextBlock } from "next-sanity";

export interface PagePayload {
  _id: string;
  status: 'published' | 'draft';
  title: string;
  slug: string | null;
  body: PortableTextBlock[] | null;
  date: string;
}

export interface Settings {
  title?: string;
  // Add other settings properties as needed
}
