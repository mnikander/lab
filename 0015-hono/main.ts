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

app.post('/data', async (c) => {
  const entry = await c.req.json();
  if ("year" in entry
    && "month" in entry
    && "day" in entry
    && "total" in entry
    && typeof entry.year === "number"
    && typeof entry.month === "number"
    && typeof entry.day === "number"
    && typeof entry.total === "number"
    && entry.year > 2000
    && entry.year <= 2030
    && entry.month > 0
    && entry.month <= 12
    && entry.day > 0
    && entry.day <= 31
    && entry.total > 0
) {
        const data = await load(file);
        data.push(entry);
        await save(data, file);
        return c.json({ success: true });
    }
    else {
        return c.json({ error: "invalid data" }, 400);
    }
});

Deno.serve(app.fetch);
