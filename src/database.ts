import { Pool } from 'pg';

const pool = new Pool();

export async function query(text: string, params: any[]) {
  return pool.query(text, params);
}

export async function getClient() {
  return pool.connect();
}
