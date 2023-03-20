const Sequelize = require('sequelize');

exports.sequelize = new Sequelize(
    "crmSql",
    "root",
    "Priyanka1",
    {
        host:"localhost",
        dialect:"mysql"
    })








