const mysql = require("mysql")
require("dotenv").config()

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME,
})

connection.connect()

// connection.query(sql, callback)
connection.queryPromise = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

// test to see if the connection was made
connection.query("select now()", (err, rows) => {
  if (err) {
    console.log("Connection Unsuccessful: ", err)
  } else {
    console.log("Connection successful: ", rows)
  }
})

connection.querySync = async (sql, params) => {
  let promise = new Promise((resolve, reject) => {
    console.log("Executing query", sql)
    connection.query(sql, params, (err, rows) => {
      if (err) {
        console.log("Rejecting")
        return reject(err)
      } else {
        console.log("Resolving")
        return resolve(rows)
      }
    })
  })
  
  let rows = await promise.then((rows) => {
    console.log("Rows: ", rows)
    return rows
  }).catch ((err) => {
    throw err
  })
  return rows
}

module.exports = connection

// class Connection {
//   constructor() {
//     if (!this.pool) {
//       console.log("creating connection...")
//       this.pool = mysql.createPool({
//         connectionLimit: 100,
// host: process.env.DB_HOST,
// user: process.env.DB_USER,
// password: process.env.DB_PWD,
// database: process.env.DB_NAME
//       })

//       return this.pool
//     }

//     return this.pool
//   }
// }

// const instance = new Connection()

// module.exports = instance
