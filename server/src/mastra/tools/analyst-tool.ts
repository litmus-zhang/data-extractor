import { createTool } from '@mastra/core/tools';
import { z } from 'zod';


export const analystOutputSchema = z.object({
  Summary: z.string().describe('Summary of the property'),
  Insights: z.record(z.string(), z.string()).describe('Insights about the property'),
  Pros: z.record(z.string(), z.string()).describe('Pros of the property'),
  Cons: z.record(z.string(), z.string()).describe('Cons of the property details'),
  longlat: z.record(z.string(), z.string()).describe('Longitude and latitude of the property details'),
  location: z.string(),
  investment_potential: z.record(z.string(), z.string()).describe('Investment potential of the property'),
  rental_yield_estimates: z.record(z.string(), z.string()).describe('Rental yield estimates of the property'),
  price_analytics: z.record(z.string(), z.string()).describe('Price analytics of the property'),
})
export const analystTool = createTool({
  id: 'get-property',
  description: 'Get property data, details and give insights',
  inputSchema: z.object({
    content: z.record(z.string(), z.string()).describe('Property details'),
    title: z.string().describe('City name'),
    url: z.string().describe("Property URL")
  }),
  outputSchema: analystOutputSchema,
});
