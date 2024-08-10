import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Upload } from 'lucide-react';

interface FileUploadProps {
  projectId: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ projectId }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setProgress(0);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`http://localhost:8000/projects/${projectId}/upload`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setSuccess(true);
      // You might want to trigger a refresh of the file list here
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input type="file" onChange={handleFileChange} />
      <Button onClick={handleUpload} disabled={!file || uploading}>
        <Upload className="mr-2 h-4 w-4" /> Upload File
      </Button>
      {uploading && <Progress value={progress} className="w-full" />}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {success && (
        <Alert>
          <AlertDescription>File uploaded successfully!</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default FileUpload;