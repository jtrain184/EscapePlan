var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
      host            : 'localhost',
      user            : 'bugschc',
      password        : 'buttface',
      database        : 'mydb',
      port            : '3306'
});

module.exports.pool = pool;




