import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Trash2 } from 'lucide-react';

interface Analysis {
  id: number;
  name: string;
  description: string;
}

interface AnalysisListProps {
  projectId: number;
}

const AnalysisList: React.FC<AnalysisListProps> = ({ projectId }) => {
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalyses = async () => {
    try {
      const response = await fetch(`http://localhost:8000/projects/${projectId}/analyses`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch analyses');
      }
      const data = await response.json();
      setAnalyses(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyses();
  }, [projectId]);

  const handleDelete = async (analysisId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/projects/${projectId}/analyses/${analysisId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete analysis');
      }
      setAnalyses(analyses.filter(analysis => analysis.id !== analysisId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during deletion');
    }
  };

  if (loading) return <div>Loading analyses...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-4">
      {analyses.map((analysis) => (
        <Card key={analysis.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <BarChart2 className="mr-2 h-5 w-5" />
                {analysis.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(analysis.id)}
                className="text-red-600 hover:text-red-800 hover:bg-red-100"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-2">{analysis.description}</p>
            <Button asChild variant="outline" size="sm">
              <Link href={`/projects/${projectId}/analyses/${analysis.id}`}>
                View Analysis
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AnalysisList;