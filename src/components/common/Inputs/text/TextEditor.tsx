import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useState } from "react";

const TextEditor = ({
  className,
  onChange,
  value,
  name
}: {
  className: string;
  onChange: (value: string) => void;
  value: string;
  name: string;
}): JSX.Element => {
  // Track if component has mounted to avoid hydration issues
  const [isMounted, setIsMounted] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[120px] p-3"
      }
    }
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Show nothing until client-side hydration is complete
  if (!isMounted) {
    return <div className={`h-40 border rounded-md bg-muted/20 ${className}`}></div>;
  }

  if (!editor) {
    return <div className={`h-40 border rounded-md bg-muted/20 ${className}`}></div>;
  }

  return (
    <div id={name} className={`${className} border rounded-md`}>
      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive("bold") ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive("italic") ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive("heading", { level: 1 })
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive("heading", { level: 2 })
              ? "bg-primary text-primary-foreground"
              : "bg-muted"
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 text-sm rounded ${
            editor.isActive("bulletList") ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          List
        </button>
      </div>

      {/* Editor Content */}
      <div className="p-0">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default TextEditor;
