import { createClientFromRequest } from 'npm:@base44/sdk';
import { failure, json } from './coordination.ts';
import { seedDemoWorkspace } from './demo-data.ts';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const input = await req.json();
    const result = await seedDemoWorkspace(base44, input);
    return json(result);
  } catch (error) {
    return failure(error);
  }
});
