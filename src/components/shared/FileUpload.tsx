import { FilePond, registerPlugin } from "react-filepond";

import FilepondImagePreviewPlugin from "filepond-plugin-image-preview";
import FilepondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilepondPluginImageCrop from "filepond-plugin-image-crop";
import FilepondPluginValidateFileType from "filepond-plugin-file-validate-size";
import FilepondPluginValidateFileSize from "filepond-plugin-file-validate-size";

type Response = {
  status: string;
  message: {
    id: string;
    fileName: string;
  }[];
};
type FileUploadProps = {
  structure: "CIRCLE" | "SQUARE";
  onSuccess: (data: Response) => void;
  onFileRemove: () => void;
  onError: (data: unknown) => void;
};

registerPlugin(
  FilepondPluginValidateFileType,
  FilepondImagePreviewPlugin,
  FilepondPluginImageCrop,
  FilepondPluginImageExifOrientation,
  FilepondPluginValidateFileSize,
);

export const FileUpload = ({
  structure,
  onFileRemove,
  onSuccess,
  onError,
}: FileUploadProps) => {
  return (
    <FilePond
      {...(structure === "CIRCLE" && { stylePanelLayout: "compact circle" })}
      className="h-44 w-44"
      acceptedFileTypes={["image/jpg", "image/jpeg", "image/png"]}
      allowFileSizeValidation
      maxFileSize="5MB"
      imagePreviewHeight={170}
      allowDrop
      allowReplace={false}
      allowPaste
      files={[]}
      imageCropAspectRatio="1:1"
      server={{
        process: {
          url: "/api/images/upload",
          onload(data) {
            onSuccess(JSON.parse(data));
            return -1;
          },
          onerror(err) {
            onError(JSON.parse(err));
          },
        },
      }}
      onremovefile={onFileRemove}
      allowMultiple={false}
      stylePanelAspectRatio="1:1"
      name="files"
      labelIdle='Drag & Drop your character image or <span class="filepond--label-action">Browse</span>'
    />
  );
};
