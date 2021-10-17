require('dotenv').config();
const mysql = require('mysql2');
const inquirer = require('inquirer');

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

// Connect to database
const db = mysql.createConnection(
    {
      host: process.env.MS_HOST,
      // MySQL Username
      user: process.env.MS_USER,
      // TODO: Add MySQL Password
      password: process.env.MS_PASSWORD,
      database:  process.env.MS_DB
    },
    console.log(`Connected to the ${process.env.MS_DB} database.`)
  );

  init();

async function init(){

    // loop through and request Employee Details
    let finish = false;
    while(!finish){
        let response = await inquirer.prompt([{
            type: 'list',
            message: 'Choose an action:',
            name: 'choice',
            choices: [
                {value: 'view;department', name: 'View all departments'},
                {value: 'view;role', name: 'View all roles'},
                {value: 'view;employee', name: 'View all employees'},
                {value: 'End', name: 'Exit'},
            ],
        }]);
        
        if(response.choice === 'End'){
                finish = true;
        } else if(response.choice.split(';')[0] === 'view'){
            printTable(response.choice.split(';')[1]);
            // wait a bit to give time for console.table to print before next prompt
            await sleep(500);
        }
    }
}

 function printTable(table_name){
    db.query(`SELECT * FROM ${table_name}`, function (err, results) {
        console.table(results);
      });
  }