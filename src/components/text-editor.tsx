import React, { useEffect } from "react";

import { useQuill } from "react-quilljs";
// or const { useQuill } = require('react-quilljs');

import "quill/dist/quill.snow.css"; // Add css for snow theme
// import "quill/dist/quill.bubble.css"; // Add css for bubble theme

interface ITextEditor {
  setValue: (x: string) => void;
  value: string;
}
const TextEditor = ({ setValue, value }: ITextEditor) => {
  // const { quill, quillRef } = useQuill();
  const theme = "snow";
  // const theme = "bubble";

  const modules = {
    toolbar: [["bold", "italic", "underline"]],
  };

  const placeholder = "Compose an text...";

  const formats = ["bold", "italic", "underline"];

  const { quill, quillRef } = useQuill({
    theme,
    modules,
    formats,
    placeholder,
  });

  // // const theme = 'bubble';
  // console.log({ quill }); // undefined > Quill Object
  // console.log({ quillRef }); // { current: undefined } > { current: Quill Editor Reference }

  useEffect(() => {
    if (quill) {
      // quill.clipboard.dangerouslyPasteHTML("<h1>React Hook for Quill!</h1>");
      quill.clipboard.dangerouslyPasteHTML(value);
      quill.on("text-change", (delta, oldDelta, source) => {
        // console.log("Text change!");
        // console.log(quill.getText()); // Get text only
        // console.log(quill.getContents()); // Get delta contents
        // console.log(quill.root.innerHTML); // Get innerHTML using quill use this
        // console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef or this
        setValue(quill.root.innerHTML);
      });
    }
  }, [quill]);

  return (
    <div className='w-full h-full'>
      <div ref={quillRef} />
    </div>
  );
};

export default TextEditor;
