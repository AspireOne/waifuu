import { Image, Spacer } from "@nextui-org/react";
import { Spinner } from "@nextui-org/spinner";
import { apiPostImage } from "@services/imageService";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { MdImage } from "react-icons/md";
import { twMerge } from "tailwind-merge";

type FileUploadRawProps = {
  onUpload: (id: string) => void;
  label: string;
  description?: string;
  required?: boolean;
};

export const FileUploadRaw = ({
  onUpload,
  label,
  description,
  required,
}: FileUploadRawProps) => {
  const [uploading, setUploading] = useState(false);
  const [responseSuccessful, setResponseSuccessful] = useState<boolean | undefined>(undefined);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // The state "showLoadingOverlay" is not used elsewhere, so it can be derived directly from "uploading".
    // No need to have a separate state for it.
  }, [uploading]);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];

    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setUploading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);
        const { message } = await apiPostImage(formData);

        setResponseSuccessful(true);
        onUpload(message[0]?.id ?? "");
      } catch (error) {
        setResponseSuccessful(false);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onKeyUp={() => inputRef.current?.click()}
      className="max-w-36 w-36 cursor-pointer"
    >
      <Label
        description={description}
        required={required}
        responseSuccessful={responseSuccessful}
        label={label}
      />
      <Spacer y={1} />
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg, image/png"
        className="hidden"
        onChange={handleFileChange}
        id={`fileInput_${label}`}
      />
      {imageUrl ? (
        <ImagePreview
          imageUrl={imageUrl}
          isUploading={uploading}
          responseSuccessful={responseSuccessful}
        />
      ) : (
        <Placeholder />
      )}
      <p className="text-[12px] text-foreground-400">{description}</p>
    </div>
  );
};

const LoadingOverlay = () => (
  <div
    className={twMerge(
      "absolute inset-0 z-50 flex items-center justify-center bg-gray-700/70 rounded-lg",
    )}
  >
    <Spinner />
  </div>
);

const ImagePreview = (props: {
  imageUrl: string;
  isUploading: boolean;
  responseSuccessful: boolean | undefined;
}) => (
  <div
    className={twMerge(
      "w-36 h-36 max-w-36 max-h-36 bg-gray-700/20",
      "border-[1.5px] rounded-lg items-center justify-center flex",
      props.responseSuccessful
        ? "border-green-500"
        : props.responseSuccessful === false
          ? "border-red-500"
          : "border-gray-700",
    )}
  >
    <div className="relative group">
      {props.isUploading && <LoadingOverlay />}
      <Image
        className="aspect-square z-0 rounded-lg h-full w-full object-contain"
        src={props.imageUrl}
        alt="Uploaded"
      />
    </div>
  </div>
);

const Placeholder = () => (
  <div
    className={twMerge(
      "w-36 h-36 max-w-36 max-h-36 bg-gray-700/20 border-[1.5px]",
      "rounded-lg items-center justify-center flex border-gray-700",
    )}
  >
    <MdImage className="w-20 h-20 text-gray-700" />
  </div>
);

const Label = (props: {
  required?: boolean;
  responseSuccessful: boolean | undefined;
  label: string;
  description?: string; // Optional description prop
}) => (
  <div className="">
    <p
      className={`font-base text-center ${
        props.responseSuccessful
          ? "text-green-500"
          : props.responseSuccessful === false
            ? "text-red-500"
            : "text-foreground-400"
      }`}
    >
      {props.required && <span className="text-danger-500 mr-1">*</span>}
      {props.label}
    </p>
  </div>
);
