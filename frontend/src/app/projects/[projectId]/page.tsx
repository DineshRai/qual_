'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Folder, FileText, BarChart2 } from 'lucide-react';
import Link from 'next/link';

interface Project {
  id: number;
  name: string;
  description: string;
}

export default function ProjectDetail() {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`http://localhost:8000/projects/${params.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch project');
        }
        const data = await response.json();
        setProject(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  if (loading) return <div>Loading project...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Folder className="mr-2 h-6 w-6" />
            {project.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">{project.description}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>No files uploaded yet.</p>
            <Button asChild className="mt-4">
              <Link href={`/projects/${project.id}/upload`}>Upload Files</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart2 className="mr-2 h-5 w-5" />
              Analyses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>No analyses created yet.</p>
            <Button asChild className="mt-4">
              <Link href={`/projects/${project.id}/analyses/new`}>Create Analysis</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}