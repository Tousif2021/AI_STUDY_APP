import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Save, Bold, Italic, List, ListOrdered, Undo, Redo } from 'lucide-react';
import { Input } from '../ui/Input';

interface NoteEditorProps {
  initialContent?: string;
  initialTitle?: string;
  onSave?: (title: string, content: string) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ 
  initialContent = '', 
  initialTitle = '',
  onSave 
}) => {
  const [title, setTitle] = useState(initialTitle);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start taking notes...',
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px]',
      },
    },
  });

  const handleSave = () => {
    if (editor && onSave) {
      onSave(title, editor.getHTML());
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-lg">Course Notes</CardTitle>
          <Button
            size="sm"
            onClick={handleSave}
            leftIcon={<Save className="h-4 w-4" />}
            disabled={!title.trim()}
          >
            Save
          </Button>
        </div>
        
        <Input
          placeholder="Enter note title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mb-4"
        />
        
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive('bold') ? 'bg-gray-100 dark:bg-gray-800' : ''}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive('italic') ? 'bg-gray-100 dark:bg-gray-800' : ''}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? 'bg-gray-100 dark:bg-gray-800' : ''}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? 'bg-gray-100 dark:bg-gray-800' : ''}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <div className="border-l border-gray-200 dark:border-gray-700 h-6 mx-2" />
          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <EditorContent editor={editor} />
      </CardContent>
    </Card>
  );
};