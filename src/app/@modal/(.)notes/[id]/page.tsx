import NotePreviewClient from './NotePreview.client';
import { fetchNoteById } from '@/lib/api';

export default async function Page({
  params,
}: {
  params: { id: string };
}) {
  const note = await fetchNoteById(params.id);

  return <NotePreviewClient note={note} />;
}