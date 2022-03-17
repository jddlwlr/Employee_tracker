// imports
const mysql = require("mysql2");
const inquirer = require("inquirer");
const cTable = require("console.table");

require("dotenv").config();

// db to database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "employee_db",
});

// Create a movie
// app.post("/api/new-movie", ({ body }, res) => {
//   const sql = `INSERT INTO movies (movie_name)
//     VALUES (?)`;
//   const params = [body.movie_name];

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: "success",
//       data: body,
//     });
//   });
// });

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
                      manager.first_name, manager.last_name,
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

newDepartment = () => {};
newRole = () => {};
newEmployee = () => {};

// / new functions

updateEmployee = () => {};

// Modify this
// app.get("/api/movies", (req, res) => {
//   const sql = `SELECT id, movie_name AS title FROM movies`;

//   db.query(sql, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: "success",
//       data: rows,
//     });
//   });
// });

// // And This
// app.get("/api/movie-reviews", (req, res) => {
//   const sql = `SELECT movies.movie_name AS movie, reviews.review FROM reviews LEFT JOIN movies ON reviews.movie_id = movies.id ORDER BY movies.movie_name;`;
//   db.query(sql, (err, rows) => {
//     if (err) {
//       res.status(500).json({ error: err.message });
//       return;
//     }
//     res.json({
//       message: "success",
//       data: rows,
//     });
//   });
// });

// Delete a movie
// app.delete("/api/movie/:id", (req, res) => {
//   const sql = `DELETE FROM movies WHERE id = ?`;
//   const params = [req.params.id];

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       res.statusMessage(400).json({ error: res.message });
//     } else if (!result.affectedRows) {
//       res.json({
//         message: "Movie not found",
//       });
//     } else {
//       res.json({
//         message: "deleted",
//         changes: result.affectedRows,
//         id: req.params.id,
//       });
//     }
//   });
// });

// // BONUS: Update review name
// app.put("/api/review/:id", (req, res) => {
//   const sql = `UPDATE reviews SET review = ? WHERE id = ?`;
//   const params = [req.body.review, req.params.id];

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       res.status(400).json({ error: err.message });
//     } else if (!result.affectedRows) {
//       res.json({
//         message: "Movie not found",
//       });
//     } else {
//       res.json({
//         message: "success",
//         data: req.body,
//         changes: result.affectedRows,
//       });
//     }
//   });
// });

// Default response for any other request (Not Found)
// app.use((req, res) => {
//   res.status(404).end();
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
