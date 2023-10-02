import { FilePond } from "react-filepond";

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
  onError: (data: unknown) => void;
};

export const FileUpload = ({
  structure,
  onSuccess,
  onError,
}: FileUploadProps) => {
  return (
    <FilePond
      {...(structure === "CIRCLE" && { stylePanelLayout: "compact circle" })}
      className="h-44 w-44"
      imagePreviewHeight={170}
      files={[]}
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
      onupdatefiles={() => {}}
      allowMultiple={false}
      stylePanelAspectRatio="1:1"
      name="files"
      labelIdle='Drag & Drop your character image or <span class="filepond--label-action">Browse</span>'
    />
  );
};
