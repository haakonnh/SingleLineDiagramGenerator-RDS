import dotenv from 'dotenv'
import pkg from 'pg'



const { Client } = pkg

const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'dabase',
      password: dotenv.config().parsed.HAAKON_PASSORD,
      port: 5432,
});


await client.connect();

//await client.query("INSERT INTO test VALUES ('Top.');");
//await client.query("INSERT INTO test VALUES ('Top.JE1');");

//await client.query('DELETE FROM test;');

let resp = await client.query('SELECT path FROM test;');

console.log(resp.rowCount);

resp.rows.forEach(row => {
      console.log(row)
});

await client.end();