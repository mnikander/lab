import { Hono } from 'hono'

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/data', async (c) => {
  const text = await Deno.readTextFile("./data.json");
  const data = JSON.parse(text);
  return c.json(data);
});

Deno.serve(app.fetch);
