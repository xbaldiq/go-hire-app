require('dotenv').config();
const db = require('../Configs/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validation = require('../Helpers/validation');

module.exports = {
  loginUser: (body, params) => {
    return new Promise(async (resolve, reject) => {
      const user_type = params.user_type;
      const username = body.username;
      const password = body.password;
      let sql = '';
      if (user_type === 'engineer') {
        sql = `SELECT 
        user.id, 
        user.user_type, 
        user.username, 
        user.password, 
        engineer.name, 
        engineer.description, 
        engineer.about, 
        engineer.dateofbirth, 
        engineer.datecreated, 
        engineer.dateupdated 
        FROM USER 
        JOIN engineer
        ON engineer.id = user.id WHERE username = '${username}' AND user_type= '${user_type}'`;
      } else {
        sql = `SELECT 
        user.id, 
        user.user_type, 
        user.username, 
        user.password, 
        company.name
        FROM USER 
        JOIN company
        ON company.id = user.id
        WHERE username = '${username}' AND user_type= '${user_type}'`;
      }

      db.query(sql, (err, response) => {
        // console.log(response)
        if (!err) {
          if (response.length) {
            console.log(response);
            // Get password from query result
            const dbPassword = response[0].password;

            // Check password
            if (bcrypt.compareSync(password, dbPassword)) {
              console.log('Authentication Success');
              console.log(response[0].id);
              const payload = {
                id: response[0].id,
                name: username,
                user_type
              };

              // Get Token based on user_type
              // SecretKey generated with require('crypto').randomBytes(64).toString('hex')
              if (user_type == 'company') {
                const accessToken = jwt.sign(
                  payload,
                  process.env.ACCESS_TOKEN_COMPANY
                );
                console.log('accessToken: ', accessToken);
                response[0].token = accessToken;
              } else if (user_type == 'engineer') {
                const accessToken = jwt.sign(
                  payload,
                  process.env.ACCESS_TOKEN_ENGINEER
                );
                console.log('accessToken: ', accessToken);
                response[0].token = accessToken;
              }
              resolve(response);
            } else {
              response.invalidPassword = 'Invalid Password';
              resolve(response);
            }
          } else {
            response.invalidUsername = 'Username not registered';
            resolve(response);
          }
        } else {
          resolve(err);
        }
      });
    });
  }
};
