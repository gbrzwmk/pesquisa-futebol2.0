import { createPool } from '@vercel/postgres';

// Esta função usa as variáveis de ambiente POSTGRES_...
// que a Vercel vai te dar.
export const db = createPool();