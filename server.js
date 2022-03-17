// imports
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

require("dotenv").config();

// connection to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "employee_db",
});

// main menu prompt
const promptUser = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "choices",
        message: "What would you like to do?",
        choices: [
          "View all departments",
          "View all roles",
          "View all employees",
          "Add a department",
          "Add a role",
          "Add an employee",
          "Update an employee role",
          "No Action",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;

      if (choices === "View all departments") {
        logDepartments();
      }

      if (choices === "View all roles") {
        logRoles();
      }

      if (choices === "View all employees") {
        logEmployees();
      }

      if (choices === "Add a department") {
        newDepartment();
      }

      if (choices === "Add a role") {
        newRole();
      }

      if (choices === "Add an employee") {
        newEmployee();
      }

      if (choices === "Update an employee role") {
        updateEmployee();
      }

      if (choices === "No Action") {
        db.end();
      }
    });
};

promptUser();

// log functions
logDepartments = () => {
  const sql = `SELECT department.id AS id, department.name AS department FROM department`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

logRoles = () => {
  const sql = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

logEmployees = () => {
  const sql = `SELECT employee.id, 
      employee.first_name, 
      employee.last_name, 
      role.title, 
      department.name AS department,
      role.salary, 
      CONCAT (manager.first_name, " ", manager.last_name) AS manager
      FROM employee
      LEFT JOIN role ON employee.role_id = role.id
      LEFT JOIN department ON role.department_id = department.id
      LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};
// /log functions

// new functions

newDepartment = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newDepartment",
        message: "Name of new department?",
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO department (name) VALUES (?)`;
      db.query(sql, answer.newDepartment, (err, result) => {
        if (err) throw err;

        logDepartments();
      });
    });
};
newRole = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "newRole",
        message: "Name of new Role?",
      },
      {
        type: "input",
        name: "salary",
        message: "Salary of new Role?",
      },
    ])
    .then((answer) => {
      const params = [answer.newRole, answer.salary];

      // grab dept from department table
      const roleSql = `SELECT name, id FROM department`;

      db.query(roleSql, (err, data) => {
        if (err) throw err;
        const dept = data.map(({ name, id }) => ({ name: name, value: id }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "dept",
              message: "Deparment of Role?",
              choices: dept,
            },
          ])
          .then((deptChoice) => {
            const sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
            const dept = deptChoice.dept;
            params.push(dept);
            console.log(sql);
            db.query(sql, params, (err, result) => {
              if (err) throw err;
              logRoles();
            });
          });
      });
    });
};

newEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fistName",
        message: "First name of new Employee?",
      },
      {
        type: "input",
        name: "lastName",
        message: "Last name of new Employee?",
      },
    ])
    .then((answer) => {
      const params = [answer.fistName, answer.lastName];

      const role = `SELECT role.id, role.title FROM role`;

      db.query(role, (err, data) => {
        if (err) throw err;

        const roles = data.map(({ id, title }) => ({ name: title, value: id }));

        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "Role?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            params.push(role);

            const managerSql = `SELECT * FROM employee`;

            db.query(managerSql, (err, data) => {
              if (err) throw err;

              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));

              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  params.push(manager);

                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                        VALUES (?, ?, ?, ?)`;

                  db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    logEmployees();
                    promptUser();
                  });
                });
            });
          });
      });
    });
};

// /new functions

// update function

updateEmployee = () => {
  const employeeSql = `SELECT * FROM employee`;

  db.query(employeeSql, (err, data) => {
    if (err) throw err;

    const employees = data.map(({ id, first_name, last_name }) => ({
      name: first_name + " " + last_name,
      value: id,
    }));

    inquirer
      .prompt([
        {
          type: "list",
          name: "name",
          message: "Select Employee",
          choices: employees,
        },
      ])
      .then((empChoice) => {
        const employee = empChoice.name;
        const params = [];
        params.push(employee);

        const roleSql = `SELECT * FROM role`;

        db.query(roleSql, (err, data) => {
          if (err) throw err;

          const roles = data.map(({ id, title }) => ({
            name: title,
            value: id,
          }));

          inquirer
            .prompt([
              {
                type: "list",
                name: "role",
                message: "Select new Role?",
                choices: roles,
              },
            ])
            .then((roleChoice) => {
              const role = roleChoice.role;
              params.push(role);

              let employee = params[0];
              params[0] = role;
              params[1] = employee;

              const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

              db.query(sql, params, (err, result) => {
                if (err) throw err;

                logEmployees();
              });
            });
        });
      });
  });
};
