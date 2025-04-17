
'use client';

import {useState} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {generateCsv} from '@/ai/flows/csv-generator';
import {Download, Upload} from 'lucide-react';
import {toast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';

export default function Home() {
  const [content, setContent] = useState('');
  const [instructions, setInstructions] = useState('');
  const [csvData, setCsvData] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerateCsv = async () => {
    try {
      const result = await generateCsv({content, instructions});
      setCsvData(result.csvData);
      toast({
        title: 'CSV generated!',
        description: 'Click download to save the file.',
      });
      router.refresh();
    } catch (error: any) {
      console.error('Error generating CSV:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to generate CSV.',
      });
    }
  };

  const handleDownloadCsv = () => {
    if (!csvData) {
      toast({
        variant: 'destructive',
        title: 'No CSV data!',
        description: 'Please generate CSV data first.',
      });
      return;
    }

    const blob = new Blob([csvData], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Structurize.me</h1>

      {/* Content Input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="text-sm font-medium">
          Content:
        </label>
        <Textarea
          id="content"
          placeholder="Paste or type your content here..."
          value={content}
          onChange={e => setContent(e.target.value)}
        />
      </div>

      {/* Instruction Input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="instructions" className="text-sm font-medium">
          Instructions:
        </label>
        <Input
          id="instructions"
          placeholder="Enter instructions for structuring the content..."
          value={instructions}
          onChange={e => setInstructions(e.target.value)}
        />
      </div>

      {/* Generate CSV Button */}
      <Button onClick={handleGenerateCsv} className="bg-teal hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
        <Upload className="mr-2 h-4 w-4" />
        Generate CSV
      </Button>

      {/* Download CSV Button */}
      {csvData && (
        <Button onClick={handleDownloadCsv} className="bg-teal hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      )}
    </div>
  );
}
