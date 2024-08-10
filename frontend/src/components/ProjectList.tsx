import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, Plus } from 'lucide-react';

interface Project {
  id: number;
  name: string;
  description: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('http://localhost:8000/projects', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) return <div>Loading projects...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Projects</h2>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" /> New Project
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Folder className="mr-2 h-5 w-5" />
                {project.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{project.description}</p>
              <Button asChild className="mt-4" variant="outline">
                <Link href={`/projects/${project.id}`}>View Project</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;