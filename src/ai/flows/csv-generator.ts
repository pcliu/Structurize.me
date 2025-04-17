'use server';
/**
 * @fileOverview A flow for generating CSV files from unstructured content based on user instructions.
 *
 * - generateCsv - A function that takes content and instructions and returns a CSV string.
 * - GenerateCsvInput - The input type for the generateCsv function.
 * - GenerateCsvOutput - The return type for the generateCsv function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateCsvInputSchema = z.object({
  content: z.string().describe('The content to be structured into CSV format.'),
  instructions: z.string().describe('Instructions for structuring the content.'),
});
export type GenerateCsvInput = z.infer<typeof GenerateCsvInputSchema>;

const GenerateCsvOutputSchema = z.object({
  csvData: z.string().describe('The structured content in CSV format.'),
});
export type GenerateCsvOutput = z.infer<typeof GenerateCsvOutputSchema>;

export async function generateCsv(input: GenerateCsvInput): Promise<GenerateCsvOutput> {
  return generateCsvFlow(input);
}

const generateCsvPrompt = ai.definePrompt({
  name: 'generateCsvPrompt',
  input: {
    schema: z.object({
      content: z.string().describe('The content to be structured into CSV format.'),
      instructions: z.string().describe('Instructions for structuring the content.'),
    }),
  },
  output: {
    schema: z.object({
      csvData: z.string().describe('The structured content in CSV format.'),
    }),
  },
  prompt: `Given the following content and instructions, structure the content into a CSV format.

Content: {{{content}}}

Instructions: {{{instructions}}}

Ensure that the CSV data is properly formatted with headers and rows.

Output the CSV data:
`,
});

const generateCsvFlow = ai.defineFlow<
  typeof GenerateCsvInputSchema,
  typeof GenerateCsvOutputSchema
>(
  {
    name: 'generateCsvFlow',
    inputSchema: GenerateCsvInputSchema,
    outputSchema: GenerateCsvOutputSchema,
  },
  async input => {
    const {output} = await generateCsvPrompt(input);
    return output!;
  }
);
