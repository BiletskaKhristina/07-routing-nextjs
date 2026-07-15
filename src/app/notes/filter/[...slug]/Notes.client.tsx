'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';

import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

type Props = {
  initialData: any;
  tag: string;
};

export default function NotesClient({ initialData, tag }: Props) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['notes', tag, debouncedQuery, page], // 👈 ДОДАЛИ tag
    queryFn: () => fetchNotes(debouncedQuery, page, tag), // 👈 ДОДАЛИ tag
    initialData, // 👈 щоб не було "мигання"
    placeholderData: (prev) => prev,
  });

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <main>
      <button onClick={() => setIsOpen(true)}>Create note</button>

      <SearchBox onSearch={handleSearch} />

      <NoteList notes={data?.notes || []} />

      {data && data.totalPages > 1 && (
        <Pagination
          pageCount={data.totalPages}
          currentPage={page}
          onPageChange={setPage}
        />
      )}

      {isOpen && (
        <Modal onClose={() => setIsOpen(false)}>
          <NoteForm onClose={() => setIsOpen(false)} />
        </Modal>
      )}
    </main>
  );
}