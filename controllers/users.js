const mysql = require("mysql")
const pool = require("../sql/connection")

const getAllUsers = (req, res) => {
  let sql = "select * from users u "
  sql += "join usersAddress ua on u.id = ua.user_id "
  sql += "join usersContact uc on u.id = uc.user_id"

  pool.query(sql, (err, results) => {
    if (err) {
      console.log("ERROR DESCRIPTION", err)
      res.sendStatus(500)
    } else {
      res.json(results)
    }
  })
}

const getUserById = (req, res) => {
  let id = req.params.id
  let params = [req.params.id]

  let sql = "select * from users u "
  sql += "join  usersAddress ua on u.id = ua.user_id "
  sql += "join usersContact uc on u.id = uc.user_id "
  sql += "and u.id = ?"

  pool.query(sql, params, (err, results) => {
    if (err) {
      console.log("getUserById query failed ", err)
      res.sendStatus(400)
    } else {
      res.json(results)
    }
  })
}

const createUserCallbackHell = (req, res) => {
  let sql = "insert into users(first_name, last_name) values (?, ?)"

  let first = req.body.first_name
  let last = req.body.last_name

  let params = [first, last]

  pool.query(sql, params, (err, results) => {
    if (err) {
      console.log("createUser query failed ", err)
      res.sendStatus(500)
    } else {
      sql =
        "select max(id) as id from users where first_name = ? and last_name = ?"
      pool.query(sql, params, (err, results) => {
        if (err) {
          console.log("createUser query failed ", err)
          res.sendStatus(500)
        } else {
          // res.json(results)
          let id = results[0].id
          let address = req.body.address
          let city = req.body.city
          let county = req.body.county
          let state = req.body.state
          let zip = req.body.zip

          params = [id, address, city, county, state, zip]

          sql =
            "insert into usersAddress (user_id, address, city, county, state, zip) values (?, ?, ?, ?, ?, ?)"
          pool.query(sql, params, (err, results) => {
            if (err) {
              console.log("createUser query failed ", err)
              res.sendStatus(500)
            } else {
              // res.json(results)
              let phone1 = req.body.phone1
              let phone2 = req.body.phone2
              let email = req.body.email

              params = [id, phone1, phone2, email]
              sql =
                "insert into usersContact (user_id, phone1, phone2, email) values (?, ?, ?, ?)"

              pool.query(sql, params, (err, results) => {
                if (err) {
                  console.log("createUser query failed ", err)
                  res.sendStatus(500)
                } else {
                  res.sendStatus(200)
                }
              })
            }
          })
        }
      })
    }
  })
}

const createUser = async (req, res) => {
  let first = req.body.first_name
  let last = req.body.last_name

  let params = [first, last]
  let sql = "insert into users(first_name, last_name) values (?, ?)"

  let results

  try {
    results = await pool.querySync(sql, params)
  } catch (err) {
    console.log("createUsers query failed ", err)
    res.sendStatus(500)
    return
  }

  let id = results.insertId
  let address = req.body.address
  let city = req.body.city
  let county = req.body.county
  let state = req.body.state
  let zip = req.body.zip

  params = [id, address, city, county, state, zip]
  sql =
    "insert into usersAddress (user_id, address, city, county, state, zip) values (?, ?, ?, ?, ?, ?)"

  try {
    results = await pool.querySync(sql, params)
  } catch (err) {
    console.log("createUsers query failed ", err)
    res.sendStatus(500)
    return
  }

  let phone1 = req.body.phone1
  let phone2 = req.body.phone2
  let email = req.body.email

  params = [id, phone1, phone2, email]
  sql =
    "insert into usersContact (user_id, phone1, phone2, email) values (?, ?, ?, ?)"
  try {
    results = await pool.querySync(sql, params)
  } catch (err) {
    console.log("createUsers query failed ", err)
    res.sendStatus(500)
    return
  }
}

const updateUserById = (req, res) => {
  let id = req.params.id
  let first = req.body.first_name
  let last = req.body.last_name

  let params = [first, last, id]
  let sql = "update users set first_name = ?, set last_name = ? where id = ?"

  if (!id) {
    res.sendStatus(400)
    return
  }
  pool.query(sql, params, (err, results) => {
    if (err) {
      console.log("getAllUsers query failed ", err)
      res.sendStatus(400)
    } else {
      res.json(results)
    }
  })
}

const deleteUserByFirstName = (req, res) => {
  let first = req.params.first_name
  let params = [first]

  let sql = "delete from users where first_name = ?"

  pool.query(sql, params, (err, results) => {
    if (err) {
      console.log("deleteUserByFirstName query failed ", err)
      res.sendStatus(400)
    } else {
      res.json({ message: `Deleted ${results.affectedResults} user(s)` })
    }
  })
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserByFirstName,
}
