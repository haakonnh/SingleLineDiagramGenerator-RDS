import dotenv from 'dotenv'
import pkg from 'pg'

import fs from 'fs'

const { Client } = pkg

const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'dabase',
      password: dotenv.config().parsed.HAAKON_PASSORD,
      port: 5432,
});


await client.connect();

await client.query('DELETE FROM tree;');

await client.query("INSERT INTO tree VALUES ('Top');");
await client.query("INSERT INTO tree VALUES ('Top.JE1');");

let resp = await client.query('SELECT path FROM tree;');

console.log(resp.rowCount);

resp.rows.forEach(row => {
      console.log(row)
});

fs.writeFileSync('./p5/RDS/test.json', JSON.stringify(resp.rows));

await client.query('DELETE FROM tree;');



await client.end();