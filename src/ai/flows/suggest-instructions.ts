'use server';
/**
 * @fileOverview Suggests relevant instructions based on the content input to help the user structure the data effectively.
 *
 * - suggestInstructions - A function that handles the instruction suggestion process.
 * - SuggestInstructionsInput - The input type for the suggestInstructions function.
 * - SuggestInstructionsOutput - The return type for the suggestInstructions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestInstructionsInputSchema = z.object({
  content: z.string().describe('The content to base the instruction suggestions on.'),
});
export type SuggestInstructionsInput = z.infer<typeof SuggestInstructionsInputSchema>;

const SuggestInstructionsOutputSchema = z.object({
  instructions: z.array(z.string()).describe('Suggested instructions based on the content.'),
});
export type SuggestInstructionsOutput = z.infer<typeof SuggestInstructionsOutputSchema>;

export async function suggestInstructions(input: SuggestInstructionsInput): Promise<SuggestInstructionsOutput> {
  return suggestInstructionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInstructionsPrompt',
  input: {
    schema: z.object({
      content: z.string().describe('The content to base the instruction suggestions on.'),
    }),
  },
  output: {
    schema: z.object({
      instructions: z.array(z.string()).describe('Suggested instructions based on the content.'),
    }),
  },
  prompt: `You are an AI assistant designed to suggest instructions for structuring data.

  Based on the following content, suggest a few instructions that a user could use to structure the data effectively for CSV export.

  Content:
  {{content}}

  Instructions:`, // Keep as a single line
});

const suggestInstructionsFlow = ai.defineFlow<
  typeof SuggestInstructionsInputSchema,
  typeof SuggestInstructionsOutputSchema
>({
  name: 'suggestInstructionsFlow',
  inputSchema: SuggestInstructionsInputSchema,
  outputSchema: SuggestInstructionsOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
