import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const tag = slug?.[0] || 'all';

 
  const initialData = await fetchNotes('', 1, tag);


  return <NotesClient initialData={initialData} tag={tag} />;
}