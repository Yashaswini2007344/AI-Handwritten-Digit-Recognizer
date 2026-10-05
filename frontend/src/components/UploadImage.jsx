import { useRef } from "react";
import { Upload, Trash2, Image as ImageIcon } from "lucide-react";

export default function UploadImage({
  file,
  onFileReady,
  onClear,
}) {
  const inputRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Please upload a PNG, JPG or JPEG image.");
      event.target.value = "";
      return;
    }

    onFileReady?.(selectedFile);
  };

  const clearImage = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onClear?.();
  };

  return (
    <div className="canvas-card">
      <div className="panel-head">
        <div>
          <span className="eyebrow">UPLOAD</span>
          <h3>Image Recognition</h3>
        </div>

        <ImageIcon size={21} />
      </div>

      <label className="upload-box">
        <Upload size={28} />

        <strong>
          {file
            ? file.name
            : "Choose handwriting image"}
        </strong>

        <span>
          PNG, JPG or JPEG
        </span>

        <input
          ref={inputRef}
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          onChange={handleFileChange}
        />
      </label>

      <div className="canvas-actions">
        <button
          type="button"
          className="btn ghost"
          disabled={!file}
          onClick={clearImage}
        >
          <Trash2 size={16} />
          Clear Image
        </button>
      </div>
    </div>
  );
}