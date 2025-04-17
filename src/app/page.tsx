'use client';

import {useState} from 'react';
import {Textarea} from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {generateCsv} from '@/ai/flows/csv-generator';
import {Download, Upload} from 'lucide-react';
import {toast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';
import {generateCsv as generateCsvAction} from '@/ai/flows/csv-generator';
import {useActionState} from 'react';
export default function Home({csvData: initialCsvData}: {csvData: string | null}) {
  const [content, setContent] = useState('');
  const [instructions, setInstructions] = useState('');


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
  const [csvData, setCsvData] = useState<string | null>(initialCsvData ?? null);
  const [isLoading, formAction] = useActionState(async (state, data: FormData) => {
    const result = await generateCsvAction({content: data.get('content') as string, instructions: data.get('instructions') as string});
    setCsvData(result?.csvData ?? null);
    return false;
  });
  return (
    <div className="mx-auto p-4 gap-4">
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
      
      <form action={formAction}>
        <Button type='submit' disabled={isLoading} className="bg-teal hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
          <Upload className="mr-2 h-4 w-4"/>
          {isLoading ? 'Generating...' : 'Generate CSV'}
        </Button>
        <input type="hidden" name="content" value={content}/>
        <input type="hidden" name="instructions" value={instructions}/>
     </form>

      
      <Button onClick={handleDownloadCsv} disabled={!csvData} className="bg-teal hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
          <Download className="mr-2 h-4 w-4" />
          Download CSV
      </Button>
    </div>
  );
