import { defineConfig } from 'drizzle-kit';
import { envConfigs } from './src/config/envConfig';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: envConfigs.database_url,
  },
});