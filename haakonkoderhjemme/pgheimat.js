import dotenv from 'dotenv'
import pkg from 'pg'

const { Client } = pkg

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'dabase',
  password: dotenv.config().parsed.HAAKON_PASSORD,
  port: 5432,
})

const nodes = ['Top', 'Top.JE1', 'Top.JE2', 'Top.JE3', 'Top.JE1.WBC1']

await client.connect()

//await client.query("INSERT INTO Tree VALUES ('Top');")
//await client.query("INSERT INTO test VALUES ('Top.JE1');");

try {
  nodes.forEach(async (node) => {
    await client.query(`INSERT INTO tree VALUES ('${node}');`)
  })
  const resp = await client.query('SELECT * FROM tree;')
  resp.rows.forEach((row) => {
    console.log(row)
  })

  console.log(resp.rowCount)
} catch (e) {
  console.log(e)
}
await client.query('DELETE FROM tree;')

await client.end()
