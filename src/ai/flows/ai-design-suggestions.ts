// A Genkit Flow that suggests AI-powered design tools or assistance based on the user's description of the printing job.

'use server';

/**
 * @fileOverview An AI agent to suggest design tools or assistance based on user input.
 *
 * - suggestDesignTools - A function that suggests design tools.
 * - SuggestDesignToolsInput - The input type for the suggestDesignTools function.
 * - SuggestDesignToolsOutput - The return type for the suggestDesignTools function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDesignToolsInputSchema = z.object({
  jobDescription: z
    .string()
    .describe('The user provided description of the printing job.'),
});
export type SuggestDesignToolsInput = z.infer<typeof SuggestDesignToolsInputSchema>;

const SuggestDesignToolsOutputSchema = z.object({
  shouldShowDesignToolSuggestion: z
    .boolean()
    .describe(
      'Whether or not to show the AI powered design tool suggestion to the user.'
    ),
  suggestedToolDescription: z
    .string()
    .describe(
      'A description of the AI powered design tool suggestion to show to the user.'
    ),
});
export type SuggestDesignToolsOutput = z.infer<typeof SuggestDesignToolsOutputSchema>;

export async function suggestDesignTools(
  input: SuggestDesignToolsInput
): Promise<SuggestDesignToolsOutput> {
  return suggestDesignToolsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDesignToolsPrompt',
  input: {schema: SuggestDesignToolsInputSchema},
  output: {schema: SuggestDesignToolsOutputSchema},
  prompt: `You are an AI assistant that helps users find design tools for their printing jobs.

  Based on the user's description of the printing job, determine whether or not to show a design tool suggestion to the user.

  If you should show a design tool suggestion, provide a description of the design tool that would be helpful to the user.

  User's description: {{{jobDescription}}}`,
});

const suggestDesignToolsFlow = ai.defineFlow(
  {
    name: 'suggestDesignToolsFlow',
    inputSchema: SuggestDesignToolsInputSchema,
    outputSchema: SuggestDesignToolsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
