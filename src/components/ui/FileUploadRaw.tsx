import React, { ChangeEvent, useState } from "react";
import { apiPostImage } from "@/services/apiImages";

type FileUploadRawProps = {
  onUpload: (id: string) => void;
  label: string;
};

export const FileUploadRaw = ({ onUpload, label }: FileUploadRawProps) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [uploading, setUploading] = useState(false);
  const [responseSuccessful, setResponseSuccessful] = useState<
    boolean | undefined
  >(undefined);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    setSelectedFile(file);

    if (file) {
      setUploading(true);

      // TODO: I converted this to axios without testing, TEST IT.
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await apiPostImage(formData);
        setResponseSuccessful(true);
        onUpload(response.message[0]?.id ?? "");
      } catch (error) {
        console.error("File upload error:", error);
        setResponseSuccessful(false);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div>
      <label className="block text-white text-sm font-bold mb-2">{label}</label>

      <div
        className={`mb-10 relative rounded-md border-dashed border-2 ${
          responseSuccessful ? "border-green-500" : "border-gray-700"
        } p-4 cursor-pointer`}
      >
        <input
          type="file"
          accept="image/jpeg, image/png"
          className="hidden"
          onChange={handleFileChange}
          id={`fileInput_${label}`}
        />

        <label
          htmlFor={`fileInput_${label}`}
          className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center text-gray-600"
        >
          {uploading ? (
            <span className="text-2xl text-gray-600">Uploading...</span>
          ) : (
            <span
              className={`text-2xl ${
                selectedFile?.name &&
                "text-sm w-3/4 overflow-hidden text-center"
              }`}
            >
              {selectedFile?.name ?? "Browse"}
            </span>
          )}
        </label>
      </div>
    </div>
  );
};
