import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createNote, type CreateNoteDTO } from '../../services/noteService';
import type { NoteTag } from '../../types/note';

interface NoteFormProps {
  onClose: () => void;
}

interface FormValues {
  title: string;
  content: string;
  tag: NoteTag;
}

const schema = Yup.object({
  title: Yup.string()
    .min(3, 'Min 3 characters')
    .max(50, 'Max 50 characters')
    .required('Title is required'),

  content: Yup.string()
    .max(500, 'Max 500 characters'),

  tag: Yup.mixed<NoteTag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required('Tag is required'),
});

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation<unknown, unknown, CreateNoteDTO>({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
    },
  });

  return (
    <Formik<FormValues>
      initialValues={{
        title: '',
        content: '',
        tag: 'Todo',
      }}
      validationSchema={schema}
      onSubmit={(values) => {
        const payload: CreateNoteDTO = {
          title: values.title,
          content: values.content,
          tag: values.tag,
        };

        mutation.mutate(payload);
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" />
            <ErrorMessage name="title" />
          </div>

          <div>
            <label htmlFor="content">Content</label>
            <Field id="content" name="content" as="textarea" />
            <ErrorMessage name="content" />
          </div>

          <div>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" />
          </div>

          <div>
            <button type="button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" disabled={isSubmitting}>
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}