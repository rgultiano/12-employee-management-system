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
                {value: 'add;department', name: 'Add department'},
                {value: 'add;role', name: 'Add role'},
                {value: 'add;employee', name: 'Add employee'},
                {value: 'End', name: 'Exit'},
            ],
        }]);
        
        if(response.choice === 'End'){
                finish = true;
        } else if(response.choice.split(';')[0] === 'view'){
            switch(response.choice.split(';')[1]){
                case 'department':
                    printTable(`SELECT * FROM department`);
                    await sleep(500);
                    break;
                case 'role':
                    printTable(`SELECT role.id, role.title, role.salary, department.name as department FROM role left outer join department on role.department_id = department.id`);
                    await sleep(500);
                    break;
                case 'employee':
                    printTable(`SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, concat(manager.first_name, ' ',  manager.last_name) as manager FROM employee left outer join role on employee.role_id = role.id left outer join department on role.department_id = department.id left outer join employee manager on employee.manager_id = manager.id`);
                    await sleep(500);
                    break;
            }
            // wait a bit to give time for console.table to print before next prompt
            await sleep(500);
        } else if(response.choice.split(';')[0] === 'add'){
            switch(response.choice.split(';')[1]){
                case 'department':
                    await addTable('department', [{name: 'name'}]);
                    await sleep(500);
                    break;
                case 'role':
                    await addTable('role', [{name: 'title'}, {name: 'salary', type: 'number'}, {name: 'department_id'}]);
                    await sleep(500);
                    break;
                case 'employee':
                    await addTable('employee', [{name: 'first_name'}, {name: 'last_name'}, {name: 'role_id'}, {name: 'manager_id'}]);
                    await sleep(500);
                    break;
            }
        }
    }
}

function printTable(sql){
    db.query(sql, function (err, results) {
        console.table(results);
        });
}

async function addTable(table_name, columns){
    // inquire about each column value
    const questions = []
    columns.forEach(column=>{
        questions.push(    
            {
            type: column.type || 'input',
            message: `${column.name}:`,
            name: column.name,
            }
        );
    });
    response = await inquirer.prompt(questions);

    let sql = `INSERT INTO ${table_name} (`;
    sql_val = '';
    const vals = [];
    let first = true;
    for(key in response){
        if(!first){
            sql += ', ';
            sql_val += ', ';
        }
        first = false;

        sql +=  `${key}`
        sql_val += '?';
        vals.push(response[key])
    }
    sql += `) VALUES (${sql_val})`
    
    console.log(response);

    db.query(sql, vals, function (err, results) {
        if(err){
            console.log(err);
        }
        console.log(results);
    });
    
}