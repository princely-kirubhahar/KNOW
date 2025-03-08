const sqlite = require('better-sqlite3');
const path = require('path');
// TODO: get the path dynamically while executing.
const db = new sqlite(path.resolve('users.db'), { fileMustExist: true });

function query(sql, params) {
  try {
    return db.prepare(sql).all(params);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

function run(sql, params) {
  try {
    return db.prepare(sql).run(params);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  query,
  run
}