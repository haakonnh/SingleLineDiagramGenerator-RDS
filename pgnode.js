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

//await client.query('DELETE FROM tree;');

await client.query("INSERT INTO tree (path) VALUES ('Top.JE3');");
await client.query("INSERT INTO tree (path) VALUES ('Top.KL2');");

let resp = await client.query('SELECT path FROM tree;');

//await client.query("INSERT INTO tree (path) VALUES ('Top');");
//await client.query("INSERT INTO tree (path) VALUES ('Top.JE1');");

//await client.query('DELETE FROM noderelationship;');

//await client.query("INSERT INTO noderelationship (node_id_1, node_id_2) VALUES (1, 2);");

let relresp = await client.query('SELECT * FROM noderelationship;');

console.log(relresp.rows);

resp.rows.forEach(row => {
      console.log(row)
});

fs.writeFileSync('./p5/RDS/test.json', JSON.stringify(resp.rows));


await client.end();