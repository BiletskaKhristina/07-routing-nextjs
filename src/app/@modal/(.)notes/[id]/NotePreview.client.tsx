'use client';

import Modal from '@/components/Modal/Modal';
import css from './NotePreview.module.css';

export default function NotePreviewClient({ note }: any) {
  return (
    <Modal>
      <div className={css.container}>
        <h2>{note.title}</h2>
        <p>{note.content}</p>
      </div>
    </Modal>
  );
}