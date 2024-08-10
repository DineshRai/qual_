import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { File, Trash2 } from 'lucide-react';

interface FileItem {
  id: number;
  filename: string;
  upload_date: string;
}

interface FileListProps {
  projectId: number;
}

const FileList: React.FC<FileListProps> = ({ projectId }) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`http://localhost:8000/projects/${projectId}/files`, {
          credentials: 'include',
        });
        if (!response.ok) {
          throw new Error('Failed to fetch files');
        }
        const data = await response.json();
        setFiles(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [projectId]);

  const handleDelete = async (fileId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/projects/${projectId}/files/${fileId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete file');
      }
      setFiles(files.filter(file => file.id !== fileId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during deletion');
    }
  };

  if (loading) return <div>Loading files...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ul className="space-y-4">
      {files.map((file) => (
        <li key={file.id} className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm">
          <File className="h-8 w-8 text-blue-500" />
          <div className="flex-grow">
            <p className="font-medium text-gray-900">{file.filename}</p>
            <p className="text-sm text-gray-500">{file.upload_date}</p>
          </div>
          <div className="flex space-x-2">
            <Button asChild variant="outline" size="sm">
              <a href={`http://localhost:8000/projects/${projectId}/files/${file.id}/download`} download>Download</a>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleDelete(file.id)}
              className="text-red-600 hover:text-red-800 hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default FileList;