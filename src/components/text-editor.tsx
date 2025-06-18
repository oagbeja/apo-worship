import React, { useEffect, useRef } from "react";

import { useQuill } from "react-quilljs";
import Quill from "quill";
// or const { useQuill } = require('react-quilljs');

import "quill/dist/quill.snow.css"; // Add css for snow theme
// import "quill/dist/quill.bubble.css"; // Add css for bubble theme

interface ITextEditor {
  setValue: (x: string) => void;
  value: string;
}
const TextEditor = ({ setValue, value }: ITextEditor) => {
  const quillRef = useRef<HTMLDivElement | null>(null);
  const quillInstanceRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (quillRef.current && !quillInstanceRef.current) {
      quillInstanceRef.current = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [["bold", "italic", "underline"]],
        },
        placeholder: "Compose a text...",
        formats: ["bold", "italic", "underline"],
      });

      quillInstanceRef.current.clipboard.dangerouslyPasteHTML(value);

      quillInstanceRef.current.on("text-change", () => {
        setValue(quillInstanceRef.current!.root.innerHTML);
      });
    }
  }, [quillRef]);

  return (
    <div className='w-full h-full'>
      <div ref={quillRef} />
    </div>
  );
};

export default TextEditor;
