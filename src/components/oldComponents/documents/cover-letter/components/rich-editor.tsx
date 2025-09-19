"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link2,
  ImageIcon,
  Palette,
  Underline,
  Quote,
  ChevronDown,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading2 from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import UnderlineExtension from "@tiptap/extension-underline";

// Types
interface ColorOption {
  name: string;
  value: string;
}

interface HeadingOption {
  name: string;
  level: 1 | 2 | 3 | 4 | 5 | 6 | 0; // 0 represents normal text/paragraph
}

// Constants
const colorOptions: ColorOption[] = [
  { name: "Black", value: "#000000" },
  { name: "Gray", value: "#718096" },
  { name: "Red", value: "#E53E3E" },
  { name: "Orange", value: "#DD6B20" },
  { name: "Yellow", value: "#D69E2E" },
  { name: "Green", value: "#38A169" },
  { name: "Blue", value: "#3182CE" },
  { name: "Purple", value: "#805AD5" },
];

const headingOptions: HeadingOption[] = [
  { name: "Normal Text", level: 0 },
  { name: "Heading 1", level: 1 },
  { name: "Heading 2", level: 2 },
  { name: "Heading 3", level: 3 },
  { name: "Heading 4", level: 4 },
  { name: "Heading 5", level: 5 },
  { name: "Heading 6", level: 6 },
];

const DEFAULT_KEYWORDS = [
  "experience",
  "skills",
  "project",
  "management",
  "team",
  "support",
  "mission",
  "opportunity",
  "background",
  "references",
];

// Components
function MenuBar({ editor }: { editor: Editor | null }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!editor) {
    return null;
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (readerEvent) => {
        const imageUrl = readerEvent.target?.result as string;
        editor.chain().focus().setImage({ src: imageUrl }).run();
      };

      reader.readAsDataURL(file);
    }
  };

  const setTextColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
  };

  const getCurrentHeadingLevel = (): 0 | 1 | 2 | 3 | 4 | 5 | 6 => {
    for (let i = 1; i <= 6; i++) {
      if (editor.isActive("heading", { level: i })) {
        return i as 1 | 2 | 3 | 4 | 5 | 6;
      }
    }
    return 0;
  };

  const getHeadingLabel = () => {
    const level = getCurrentHeadingLevel();
    return headingOptions.find((h) => h.level === level)?.name ?? "Normal Text";
  };

  const applyHeading = (level: 0 | 1 | 2 | 3 | 4 | 5 | 6) => {
    if (level === 0) {
      editor.chain().focus().setParagraph().run();
    } else {
      editor.chain().focus().toggleHeading({ level }).run();
    }
  };

  return (
    <div className="flex items-center space-x-2 border-b pb-2 mb-4 flex-wrap">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1 h-8 px-3">
            <Type className="h-4 w-4 mr-1" />
            <span className="max-w-[100px] truncate">{getHeadingLabel()}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {headingOptions.map((option) => (
            <DropdownMenuItem
              key={option.level}
              onClick={() => applyHeading(option.level)}
              className={
                editor.isActive("heading", { level: option.level }) ||
                (option.level === 0 && getCurrentHeadingLevel() === 0)
                  ? "bg-slate-100"
                  : ""
              }
            >
              {option.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenuSeparator className="h-6 w-px bg-gray-200 mx-1" />

      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "bg-slate-200" : ""}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "bg-slate-200" : ""}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "bg-slate-200" : ""}
      >
        <Underline className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "bg-slate-200" : ""}
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "bg-slate-200" : ""}
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "bg-slate-200" : ""}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          const url = window.prompt("Enter link URL");
          if (url) {
            if (editor.state.selection.empty) {
              const linkText = window.prompt("Enter link text") || url;
              editor
                .chain()
                .focus()
                .insertContent(
                  `<a href="${url}" class="text-blue-600 underline">${linkText}</a>`
                )
                .run();
            } else {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }
        }}
        className={editor.isActive("link") ? "bg-slate-200" : ""}
      >
        <Link2 className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon className="h-4 w-4" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Palette className="h-4 w-4" />
            <span
              className="absolute bottom-1 right-1 w-2 h-2 rounded-full"
              style={{
                backgroundColor:
                  editor.getAttributes("textStyle").color ?? "#000000",
                border: "1px solid #e2e8f0",
              }}
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {colorOptions.map((color) => (
            <DropdownMenuItem
              key={color.value}
              onClick={() => setTextColor(color.value)}
              className="flex items-center gap-2"
            >
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color.value }}
              />
              {color.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageUpload}
      />
    </div>
  );
}

function CoverLetterEditor({
  editor,
  userName,
  onUpload,
}: {
  editor: Editor | null;
  userName: string;
  onUpload: () => void;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-medium">{userName}</h2>
        </div>
        <div className="text-sm text-gray-500">Cover letter/(Editor)</div>
      </div>

      {editor && <MenuBar editor={editor} />}
      <EditorContent editor={editor} className="prose max-w-none" />
      <Button
        variant="ghost"
        className="mt-4 bg-blue-600 text-white hover:bg-blue-700"
        onClick={onUpload}
      >
        Upload
      </Button>
    </Card>
  );
}

function CoverLetterPreview({
  userName,
  content,
  matchedKeywords,
}: {
  userName: string;
  content: string;
  matchedKeywords: string[];
}) {
  const DEFAULT_CONTENT = "";

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-bold text-blue-700">KOCHA AI</div>
        <div className="text-sm">
          <span className="font-bold text-blue-700">
            {matchedKeywords.length} of {DEFAULT_KEYWORDS.length} Keywords
          </span>
          <div className="text-gray-500">Are present in your cover letter</div>
        </div>
      </div>

      <div className="p-6 bg-white border rounded-md">
        <h2 className="text-center font-bold text-xl mb-4">
          {userName.toUpperCase()}
        </h2>
        <div
          className="space-y-4 text-sm preview-content"
          dangerouslySetInnerHTML={{
            __html: content || DEFAULT_CONTENT,
          }}
        />
      </div>
    </Card>
  );
}

export default function RichEditor() {
  const [userName] = useState("Olivia Rhye");
  const [previewContent, setPreviewContent] = useState("");
  const [matchedKeywords, setMatchedKeywords] = useState<string[]>([]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Heading2.configure({
        levels: [1, 2, 3, 4, 5, 6],
      }),
      BulletList,
      OrderedList,
      ListItem,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-600 underline",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing...",
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextStyle,
      Color,
      UnderlineExtension,
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setPreviewContent(content);
      analyzeKeywords(editor.getText());
    },
  });

  const analyzeKeywords = (text: string) => {
    const lowerText = text.toLowerCase();
    const found = DEFAULT_KEYWORDS.filter((keyword) =>
      lowerText.includes(keyword.toLowerCase())
    );
    setMatchedKeywords(found);
  };

  const handleUpload = () => {
    if (editor) {
      const content = editor.getHTML();
      setPreviewContent(content);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <CoverLetterEditor
        editor={editor}
        userName={userName}
        onUpload={handleUpload}
      />
      <CoverLetterPreview
        userName={userName}
        content={previewContent}
        matchedKeywords={matchedKeywords}
      />
    </div>
  );
}
