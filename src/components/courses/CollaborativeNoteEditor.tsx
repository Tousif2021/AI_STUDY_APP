import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Save, Bold, Italic, List, ListOrdered, Undo, Redo, Users } from 'lucide-react';
import { Input } from '../ui/Input';
import { useAuthStore } from '../../store/useAuthStore';

interface CollaborativeNoteEditorProps {
  courseId: string;
  initialTitle?: string;
  onSave?: (title: string, content: string) => void;
}

export const CollaborativeNoteEditor: React.FC<CollaborativeNoteEditorProps> = ({
  courseId,
  initialTitle = '',
  onSave,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const { user } = useAuthStore();
  const [collaborators, setCollaborators] = useState<Array<{ name: string; color: string }>>([]);
  
  // Initialize Yjs document
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider('wss://your-websocket-server.com', `course-${courseId}`, ydoc);
  const ytext = ydoc.getText('content');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({
        provider,
        user: {
          name: user?.name || 'Anonymous',
          color: `#${Math.floor(Math.random()*16777215).toString(16)}`,
        },
      }),
    ],
    content: '',
  });

  useEffect(() => {
    const updateCollaborators = () => {
      const users = Array.from(provider.awareness.getStates().values())
        .filter((state: any) => state?.user?.name && state?.user?.color) // Add type checking
        .map((state: any) => ({
          name: state.user.name,
          color: state.user.color,
        }));
      setCollaborators(users);
    };

    provider.awareness.on('change', updateCollaborators);
    return () => {
      provider.awareness.off('change', updateCollaborators);
    };
  }, [provider]);

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
          <CardTitle className="text-lg">Collaborative Notes</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {collaborators.map((collaborator, index) => (
                <div
                  key={index}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-medium"
                  style={{ backgroundColor: collaborator.color }}
                  title={collaborator.name}
                >
                  {collaborator.name[0]}
                </div>
              ))}
            </div>
            <Button
              size="sm"
              onClick={handleSave}
              leftIcon={<Save className="h-4 w-4" />}
              disabled={!title.trim()}
            >
              Save
            </Button>
          </div>
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