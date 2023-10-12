import React, { ChangeEvent, useRef, useState } from "react";

type FileUploadRawProps = {
    onUpload: (id: string) => void;
    label: string;
}

type ApiResponseData = {
    message: {
        id: string;
        fileName: string;
    }[]
}

export const FileUploadRaw = ({ onUpload, label }: FileUploadRawProps) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const formRef = useRef(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    setSelectedFile(file);

    if (file) {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/images/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setResponse(data.id);
          onUpload(data.id);
        } else {
          console.error("File upload failed");
        }
      } catch (error) {
        console.error("File upload error:", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <label className="block text-white text-sm font-bold mb-2">
        {label}
      </label>

      <div className="mb-10 relative rounded-md border-dashed border-2 border-gray-700 p-4 cursor-pointer">
        <form ref={formRef} encType="multipart/form-data" action="/images/upload">
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            id="fileInput"
          />
        </form>

        <label
          htmlFor="fileInput"
          className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-gray-600"
        >
          {uploading ? (
            <span className="text-2xl text-gray-600">Uploading...</span>
          ) : (
            <span className={`text-2xl ${selectedFile?.name && "text-sm w-3/4 overflow-hidden"} text-gray-600`}>
              {selectedFile?.name ?? "Browse"}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};
