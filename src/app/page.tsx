'use client';

import {useState} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {generateCsv} from '@/ai/flows/csv-generator';
import {Download, Upload} from 'lucide-react';
import {toast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';

export default function Home({csvData: initialCsvData}: {csvData: string | null}) {
  const [content, setContent] = useState('');
  const [instructions, setInstructions] = useState('');
  const [csvData, setCsvData] = useState<string | null>(initialCsvData ?? null);
  const [isLoading, setIsLoading] = useState(false);

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
  
  const handleGenerateCsv = async () => {
    try {
      setIsLoading(true);
      const result = await generateCsv({content, instructions});
      setCsvData(result?.csvData ?? null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to generate CSV data.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto p-4 flex flex-col space-y-6 max-w-3xl">
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
          className="min-h-[120px]"
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
      
      <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-gray-200">
        <h2 className="text-sm font-medium">Actions:</h2>
        <div className="flex gap-4">
          <Button 
            onClick={handleGenerateCsv} 
            disabled={isLoading || !content} 
            className="bg-blue-500 hover:bg-blue-700 text-white">
            <Upload className="mr-2 h-4 w-4"/>
            {isLoading ? 'Generating...' : 'Generate CSV'}
          </Button>
          
          <Button 
            onClick={handleDownloadCsv} 
            disabled={!csvData} 
            variant="outline"
            className="border-green-500 text-green-500 hover:bg-green-50">
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </div>
        
        {/* 调试信息 */}
        <div className="mt-4 p-2 text-xs text-gray-500 bg-gray-50 rounded">
          <p>Content length: {content.length}</p>
          <p>Instructions length: {instructions.length}</p>
          <p>Button state: {isLoading ? 'Loading' : 'Ready'}{!content ? ' (Disabled: No content)' : ''}</p>
          <p>CSV data: {csvData ? `Available (${csvData.length} bytes)` : 'None'}</p>
        </div>
      </div>
    </div>
  );
}
