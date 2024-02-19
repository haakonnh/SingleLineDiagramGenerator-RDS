import pkg from 'pg'

const { Client } = pkg

const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'dabase',
      password: 'Busten111',
      port: 5432,
});

await client.connect()

console.log(await client.query('SELECT * FROM test;'))

await client.end()