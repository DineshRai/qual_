import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getValidToken } from '@/lib/auth';

const ProjectCreationForm: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const token = await getValidToken();
    if (!token) {
      setError('Failed to get a valid authentication token. Please log in again.');
      console.log('token', token);
      router.push('/login');
      return;
    }

    try {
      console.log('Sending project creation request...');
      const response = await fetch('http://localhost:8000/projects/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Project creation failed:', errorData);
        throw new Error(errorData.detail || 'Failed to create project');
      }

      const project = await response.json();
      console.log('Project created successfully:', project);
      router.push(`/projects/${project.id}`);
    } catch (err) {
      console.error('Error in project creation:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      if (err instanceof Error && err.message.includes('authentication')) {
        router.push('/login');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Project Name</label>
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
      <Button type="submit">Create Project</Button>
    </form>
  );
};

export default ProjectCreationForm;