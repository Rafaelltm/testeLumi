import React, { useState } from "react";
import "./styles.css";

interface FileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onFileChange: (file: File) => void;
  label: string;
}

const FileInput: React.FC<FileInputProps> = ({ onFileChange, label, ...props }) => {
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileChange(file);
      setSelectedFileName(file.name);
    }
  };

  return (
    <div className="file-upload-container">
      <label className="file-upload-label">
        {label}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="file-input"
          {...props}
        />
      </label>
      {selectedFileName && <p className="file-name">{selectedFileName}</p>}
    </div>
  );
};

export default FileInput;
