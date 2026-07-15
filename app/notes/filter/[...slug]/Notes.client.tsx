"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { fetchNotes } from "@/lib/api";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import NoteList from "@/components/NoteList/NoteList";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";


interface Props {
  tag?: string;
}


export default function NotesClient({ tag }: Props) {
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);


    return () => clearTimeout(timer);
  }, [search]);


  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };


  const {
    data,
    isLoading,
    isError,
  } = useQuery({

    queryKey: [
      "notes",
      tag,
      debouncedSearch,
      page,
    ],


    queryFn: () =>
      fetchNotes({
        page,
        search: debouncedSearch,
        tag,
      }),


    refetchOnMount: false,
  });



  if (isLoading) {
    return <p>Loading...</p>;
  }


  if (isError || !data) {
    return <p>Something went wrong</p>;
  }



  return (
    <>
      <SearchBox onSearch={handleSearch} />


      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
      >
        Create note
      </button>


      {data.notes.length > 0 && (
        <NoteList notes={data.notes} />
      )}



      {typeof data.totalPages === "number" &&
        data.totalPages > 0 && (
          <Pagination
            pageCount={data.totalPages}
            currentPage={Math.min(page, data.totalPages)}
            onPageChange={(p) =>
              setPage(
                Math.max(
                  1,
                  Math.min(p, data.totalPages)
                )
              )
            }
          />
        )}



      {isModalOpen && (
  <Modal onClose={() => setIsModalOpen(false)}>
    <NoteForm onClose={() => setIsModalOpen(false)} />
  </Modal>
)}

    </>
  );
}