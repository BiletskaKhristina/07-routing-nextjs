'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchNotes, type FetchNotesResponse } from '@/lib/api';

import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';

type Props = {
  initialData: FetchNotesResponse;
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

  const { data, isLoading, isError } =
    useQuery<FetchNotesResponse>({
      queryKey: ['notes', tag, debouncedQuery, page],
      queryFn: () => fetchNotes(debouncedQuery, page, tag),
      initialData,
      placeholderData: (previous) => previous,
      select: (data) => ({
        ...data,
        notes: data.notes
          .slice()
          .sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ),
      }),
    });

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  if (isLoading) {
    return <p>Loading, please wait...</p>;
  }

  if (isError) {
    return <p>Something went wrong.</p>;
  }

  return (
    <main>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Create note
      </button>

      <SearchBox onSearch={handleSearch} />

      <NoteList notes={data?.notes ?? []} />

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