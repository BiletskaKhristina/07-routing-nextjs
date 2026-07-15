import NotePreviewClient from './NotePreview.client';
import { fetchNoteById } from '@/lib/api';

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const note = await fetchNoteById(id);

  return <NotePreviewClient note={note} />;
}