import axios from "axios";
import type { Note } from "../types/note";

const BASE_URL = "https://notehub-public.goit.study/api";

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

axios.defaults.baseURL = BASE_URL;

axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;


export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}


export type CreateNoteDTO = {
  title: string;
  content: string;
  tag: Note["tag"];
};


interface FetchNotesParams {
  search?: string;
  page?: number;
  tag?: string;
}


export const fetchNotes = async ({
  search = "",
  page = 1,
  tag,
}: FetchNotesParams): Promise<FetchNotesResponse> => {


  const params: Record<string, string | number> = {
    page,
    perPage: 12,
  };


  if (search) {
    params.search = search;
  }



  if (tag && tag !== "all") {
    params.tag = tag;
  }


  const { data } = await axios.get<FetchNotesResponse>(
    "/notes",
    {
      params,
    }
  );


  return data;
};



export const createNote = async (
  note: CreateNoteDTO
) => {

  const { data } = await axios.post<Note>(
    "/notes",
    note
  );

  return data;
};



export const deleteNote = async (
  id: string
) => {

  const { data } = await axios.delete<Note>(
    `/notes/${id}`
  );

  return data;
};



export const fetchNoteById = async (
  id: string
) => {

  const { data } = await axios.get<Note>(
    `/notes/${id}`
  );

  return data;
};