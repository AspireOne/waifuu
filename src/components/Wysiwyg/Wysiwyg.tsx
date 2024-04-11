import dynamic from "next/dynamic";
import React, { useMemo, useState } from "react";

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
];

interface WysiwygProps {
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const Wysiwyg: React.FC<WysiwygProps> = ({ defaultValue, value, onChange }) => {
  const QuillNoSSRWrapper = useMemo(
    () =>
      dynamic(import("react-quill"), {
        ssr: false,
        loading: () => <p>Loading...</p>,
      }),
    [],
  );

  const [content, setContent] = useState(defaultValue || "");

  const handleChange = (newValue: string) => {
    setContent(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <QuillNoSSRWrapper
      modules={modules}
      formats={formats}
      theme="snow"
      value={value || content}
      onChange={handleChange}
    />
  );
};
