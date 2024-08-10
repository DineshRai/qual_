'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tag, Plus, Save } from 'lucide-react';

interface Analysis {
  id: number;
  name: string;
  description: string;
}

interface File {
  id: number;
  filename: string;
  content: string;
}

interface Code {
  id: number;
  name: string;
  color: string;
}

export default function AnalysisDetailPage() {
  const params = useParams();
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [codes, setCodes] = useState<Code[]>([]);
  const [newCode, setNewCode] = useState({ name: '', color: '#000000' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysisData = async () => {
      try {
        // Fetch analysis details
        const analysisResponse = await fetch(`http://localhost:8000/projects/${params.projectId}/analyses/${params.analysisId}`, {
          credentials: 'include',
        });
        if (!analysisResponse.ok) throw new Error('Failed to fetch analysis');
        const analysisData = await analysisResponse.json();
        setAnalysis(analysisData);

        // Fetch files associated with the project
        const filesResponse = await fetch(`http://localhost:8000/projects/${params.projectId}/files`, {
          credentials: 'include',
        });
        if (!filesResponse.ok) throw new Error('Failed to fetch files');
        const filesData = await filesResponse.json();
        setFiles(filesData);

        // Fetch codes associated with the analysis
        const codesResponse = await fetch(`http://localhost:8000/projects/${params.projectId}/analyses/${params.analysisId}/codes`, {
          credentials: 'include',
        });
        if (!codesResponse.ok) throw new Error('Failed to fetch codes');
        const codesData = await codesResponse.json();
        setCodes(codesData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [params.projectId, params.analysisId]);

  const handleFileSelect = async (fileId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/projects/${params.projectId}/files/${fileId}/content`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch file content');
      const fileContent = await response.text();
      setSelectedFile({ ...files.find(f => f.id === fileId)!, content: fileContent });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateCode = async () => {
    try {
      const response = await fetch(`http://localhost:8000/projects/${params.projectId}/analyses/${params.analysisId}/codes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCode),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to create code');
      const createdCode = await response.json();
      setCodes([...codes, createdCode]);
      setNewCode({ name: '', color: '#000000' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!analysis) return <div>Analysis not found</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{analysis.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{analysis.description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Files</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {files.map(file => (
                <li key={file.id}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => handleFileSelect(file.id)}
                  >
                    {file.filename}
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>File Content</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFile ? (
              <Textarea
                value={selectedFile.content}
                readOnly
                className="w-full h-64"
              />
            ) : (
              <p>Select a file to view its content</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Codes
            <Button onClick={handleCreateCode}>
              <Plus className="mr-2 h-4 w-4" /> Create Code
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Code name"
              value={newCode.name}
              onChange={(e) => setNewCode({ ...newCode, name: e.target.value })}
            />
            <Input
              type="color"
              value={newCode.color}
              onChange={(e) => setNewCode({ ...newCode, color: e.target.value })}
              className="w-20"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {codes.map(code => (
              <div
                key={code.id}
                className="flex items-center px-3 py-1 rounded-full text-sm"
                style={{ backgroundColor: code.color, color: 'white' }}
              >
                <Tag className="mr-2 h-4 w-4" />
                {code.name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}