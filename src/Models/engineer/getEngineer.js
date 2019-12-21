const db = require('../../Configs/db');

module.exports = {
  getAllEngineer: (params, query) => {
    let filterKey = 1;
    let filterVal = '';

    const sort = query.sort || 'id';
    const order = query.order || 'asc';
    const limit = query.limit || 50;
    const page = query.page || 1;

    let offset = limit * page - limit;
    
    // const filterName = 'name';
    // const filterNameVal = query.name || '';
    // const filterLocVal = query.location || '';
    // const filterSkillVal = query.skill || '';

    let keyFilter = 0;
    let queryString = ''
    let testing_query = "WHERE 1"
    // console.log('query : ', query)
    if (query.name) {
      filter1 = 'name';
      // filter1Val = query.name;
      queryString = `WHERE name LIKE '%${query.name}%'`
    }
    if (query.skill) {
      if(query.name){
        queryString += `AND skill_item LIKE '%${query.skill}%'`
      }
      else{
        queryString = `WHERE skill_item LIKE '%${query.skill}%'`
      }
    }
    // if (query.skill) {
    //   keyFilter++
    //   filterSkill = 'skill_item';
    //   filterSkillVal = query.skill;
    // }

    return new Promise((resolve, reject) => {
      let sql = `
          SELECT 
              engineer.id, 
              engineer.name, 
              GROUP_CONCAT(DISTINCT skill.skill_item SEPARATOR ', ') AS skills, 
              GROUP_CONCAT(DISTINCT showcase.showcase_item SEPARATOR ', ') AS showcase
          FROM engineer
          LEFT JOIN skill
              ON engineer.id = skill.id
          LEFT JOIN showcase
              ON engineer.id = showcase.id
              ${queryString}
          GROUP BY id
          ORDER BY ${sort} ${order}
          LIMIT ${limit}
          OFFSET ${offset}
          `;

      // console.log('query sql: ', sql);

      db.query(sql, (err, response) => {
        if (!err) {
          // console.log('mendapatkan response')
          // console.log(response)
          resolve(response);
        } else {
          reject(err);
        }
      });
    });
  },
  getOneEngineer: params => {
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT *
        FROM engineer
        WHERE id=${params.id}
        `;
      db.query(sql, (err, response) => {
        if (!err) {
          resolve(response);
        } else {
          reject(err);
        }
      });
    });
  }
};
