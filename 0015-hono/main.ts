import { Hono } from 'hono'

type Entry = { year: number, month: number, day: number, total: number};

const file = "./data.json";

async function load(filename: string) {
  try {
    const text = await Deno.readTextFile(filename);
    return JSON.parse(text);
  }
  catch {
    return [];
  }
}

async function save(data: Entry[], filename: string) {
  const text = JSON.stringify(data, null, 2);
  await Deno.writeTextFile(filename, text);
}

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/data', async (c) => {
  return c.json(await load(file));
});

Deno.serve(app.fetch);
