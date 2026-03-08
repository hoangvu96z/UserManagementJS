const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: '::1',
      port: 3306,
      user: 'root',
      password: 'my_password'
    });
    console.log('Successfully connected to IPv6 localhost (::1)');
    connection.end();
  } catch (err) {
    console.error('Failed to connect to ::1 -', err.message);
  }
}

testConnection();
