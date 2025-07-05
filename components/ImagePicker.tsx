"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  onChange: (file: File) => void;
  previewUrl?: string;
}

export default function ImagePicker({ onChange, previewUrl }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      // Create local preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setLocalPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const displayPreview = localPreview || previewUrl;

  return (
    <div>
      {displayPreview && (
        <img
          src={displayPreview}
          alt="Preview"
          className="w-full h-48 rounded-lg object-cover mb-2"
        />
      )}
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        className="w-full"
      >
        {displayPreview ? "Change Image" : "Select Image"}
      </Button>
      <input
        type="file"
        accept="image/*"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />
    </div>
  );
}
