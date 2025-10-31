import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';
import { analystInputSchema, analystOutputSchema } from '../tools/analyst-tool.ts'
import { stripFirstFence } from '../../utils.ts';

const analysePropertySteps = createStep({
    id: 'analyze-property-details',
    description: 'Get property details and insights from url, title and content',
    inputSchema: analystInputSchema,
    outputSchema: analystOutputSchema,
    execute: async ({ mastra, inputData }) => {

        try {
            const agent = mastra.getAgent('propertyAnalyst');

            const { title, url, content } = inputData
            const response = await agent.generate(`Analyze the property:${title} ,${url} , with the details: ${content}`, {
                memory: {
                    resource: 'propa-analyst',
                    thread: 'property-analyst',
                },
            });
            const res = response.text.trim();
            const jsonStr = stripFirstFence(res);
            const parsed = JSON.parse(jsonStr!);
            const validated = analystOutputSchema.parse(parsed);
            return validated;
        } catch (error) {
            throw new Error("Error parsing result", { cause: error })
        }
    },
})
const addPropertyDetailToCRMSteps = createStep({
    id: 'add-property-details-to-crm',
    description: 'Add property details and insights in CRM',
    inputSchema: analystOutputSchema,
    resumeSchema: z.object({
        userMessage: z.string(),
    }),
    suspendSchema: z.object({
        suspendResponse: z.string(),
    }),
    outputSchema: analystOutputSchema,
    execute: async ({ mastra, inputData, resumeData, suspend }) => {
        const { userMessage } = resumeData ?? {};

        if (!userMessage) {
      return await suspend({
        suspendResponse: "I'm thinking of a famous person. Ask me yes/no questions to figure out who it is!",
      });
    }

        const agent = mastra.getAgent('klavis_agent');

        const response = await agent.generate(`Add the property details and insights in CRM: ${JSON.stringify(inputData)}`, {
            memory: {
                resource: 'propa-analyst',
                thread: 'property-analyst',
            },
        });
        const res = response.toolResults[0]
        return inputData;
    },
})
// const addPropertyDetailToAirtableSteps = createStep({
//     id: 'get-property-details',
//     description: 'Get property details and insights from url, title and content',
//     inputSchema: analystInputSchema,
//     outputSchema: analystOutputSchema,
//     execute: async (inputData) => {
//         if (!inputData) {
//             throw new Error('Input data not found');
//         }
//         return inputData;
//     }
// })

const propaWorkflow = createWorkflow({
    id: 'propa-workflow',
    description: 'Get property data, details and give insights',
    inputSchema: analystInputSchema,
    outputSchema: analystOutputSchema,
}).then(analysePropertySteps)
    .then(addPropertyDetailToCRMSteps)


propaWorkflow.commit()

export { propaWorkflow }