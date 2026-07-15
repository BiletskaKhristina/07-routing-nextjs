import NotesClient from './Notes.client';
import { fetchNotes } from '@/lib/api';

export default async function Page({
  params,
}: {
  params: { slug: string[] };
}) {
  // 👇 беремо тег з URL
  const tag = params.slug?.[0] || 'all';

  // 👇 отримуємо дані з сервера
  const initialData = await fetchNotes('', 1, tag);

  // 👇 передаємо в клієнт
  return <NotesClient initialData={initialData} tag={tag} />;
}