import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnalysisCreationFormProps {
  projectId: number;
  onAnalysisCreated: () => void;
}

const AnalysisCreationForm: React.FC<AnalysisCreationFormProps> = ({ projectId, onAnalysisCreated }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/projects/${projectId}/analyses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to create analysis');
      }

      setName('');
      setDescription('');
      onAnalysisCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Analysis Name</label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit">Create Analysis</Button>
    </form>
  );
};

export default AnalysisCreationForm;