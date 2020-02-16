var mysql = require("mysql");
const inquirer = require("inquirer");
const confirm = require('inquirer-confirm');

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "RaOl91559590!",
  database: "employees"
}); 



var showroles;
var showdepartments;
var showemployees;
var showmanagers;

connection.connect(function (err) {
  
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);

  connection.query("SELECT * from role", function (error, res) {
    showroles = res.map(role => ({ name: role.title, value: role.id }))
  })
  connection.query("SELECT * from department", function (error, res) {
    showdepartments = res.map(dep => ({ name: dep.name, value: dep.id }))
  })
  connection.query("SELECT * from employee", function (error, res) {
    showemployees = res.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
  })
  connection.query("SELECT * FROM employee WHERE manager_id IS NOT NULL", function (error, res) {
    showmanagers = res.map(emp => ({ name: `${emp.first_name} ${emp.last_name}`, value: emp.id }))
  })

  showmenu();
})

function showmenu() {
  inquirer
    .prompt(
      {
        type: "list",
        message: "Welcome to Employee Tracker. What would you like to do?",
        name: "choices",
        choices: [
          {
            name: "View all employees",
            value: "viewEmployees"
          },
          {
            name: "View all departments",
            value: "viewDepartments"
          },
          {
            name: "View all roles",
            value: "viewRoles"
          },
          {
            name: "View all employees by manager",
            value: "viewManagers"
          },
          {
            name: "Add employee",
            value: "addEmployee"
          },
          {
            name: "Add department",
            value: "addDept"
          },
          {
            name: "Add role",
            value: "addRole"
          },
          {
            name: "Update role",
            value: "updateRole"
          },
          {
            name: "Update employee manager",
            value: "updateManager"
          },
          {
            name: "Quit",
            value: "quit"
          }
        ]
      }).then(function (res) {
      menu(res.choices)
    })
}

function menu(option) {
  switch (option) {
    case "viewEmployees":
      viewAllEmployees();
      break;
    case "viewDepartments":
      viewAllDepartments();
      break;
    case "viewManagers":
      viewAllManagers();
      break;
    case "viewRoles":
      viewAllRoles();
      break;
    case "addEmployee":
      addEmployee();
      break;
    case "addDept":
      addDept();
      break;
    case "addRole":
      addRole();
      break;
    case "updateRole":
      updateRole();
      break;
    case "updateManager":
      updateManager();
      break;
    case "quit":
      end();
  }
}

function viewAllEmployees() {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;", function (error, res) {
    console.table(res);
    endOrMenu();
  })
}

function viewAllDepartments() {
  console.log("view all departments")
  connection.query("SELECT * from department", function (error, res) {
    console.table(res);
    endOrMenu();
  })
}

function viewAllManagers() {
  connection.query("select distinct man.manager_id, CONCAT(emp.first_name, ' ', emp.last_name) AS manager   , CONCAT(emp_w_man.first_name, ' ', emp_w_man.last_name) AS employee from employee as man left join employee as emp on man.manager_id = emp.id left join employee as emp_w_man on man.manager_id = emp_w_man.manager_id where man.manager_id is not null order by man.manager_id;", function (error, res) {
    console.table(res);
    endOrMenu();
  })
}

function viewAllRoles() {
  connection.query("SELECT * from role", function (error, res) {
    console.table(res);
    endOrMenu();
  })
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: "What is the first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the last name?",
        name: "lastName",
      },
      {
        type: "list",
        message: "What is the employee's title?",
        name: "title",
        choices: showroles
      },
      {
        type: "list",
        message: "Who is the employee's manager?",
        name: "manager",
        choices: showemployees,
      }
    ]).then(function (response) {
      addEmployees(response)
    })
}

function addEmployees(data) {

  connection.query("INSERT INTO employee SET ?",
    {
      first_name: data.firstName,
      last_name: data.lastName,
      role_id: data.title,
      manager_id: data.manager
    }, function (error, res) {
      if (error) throw error;
    })
    endOrMenu();
}

function addDept() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the new department?",
        name: "name"
      }
    ])
    .then(function (response) {
      addDepartment(response);
    })
}

function addDepartment(data) {
  connection.query("INSERT INTO department SET ?", { name: data.name },
  function (error, res) {
    if (error) throw error;
  });
  endOrMenu();
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the new employee role?",
        name: "title"
      },
      {
        type: "input",
        message: "How much is the salary of the new role?",
        name: "salary"
      },
      {
        type: "list",
        message: "In which department is the new role?",
        name: "id",
        choices: showdepartments
      }
    ])
    .then(function (response) {
      addEmployeeRole(response);
    })
}

function addEmployeeRole(data) {
  connection.query("INSERT INTO role SET ?", {
    title: data.title,
    salary: data.salary,
    department_id: data.id
  }, function (error, res) {
    if (error) throw error;
  });
  endOrMenu();
}

function updateRole() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "For which employee would you like to update the role?",
        name: "empID",
        choices: showemployees
      },
      {
        type: "list",
        message: "What is the employee's new role?",
        name: "titleID",
        choices: showroles
      }
    ])
    .then(function (response) {
      updateEmployeeRole(response);
    })
}

function updateEmployeeRole(data) {
  connection.query(`UPDATE employee SET role_id = ${data.titleID} WHERE id = ${data.empID}`,
  function (error, res) {
    if (error) throw error;
  });
  endOrMenu();
}

function updateManager() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "For which employee would you like to update the manager?",
        name: "empID",
        choices: showemployees
      },
      {
        type: "list",
        message: "Who is the employee's new manager?",
        name: "manager_id",
        choices: showemployees
      }
    ])
    .then(function (response) {
      updateEmployeeManager(response);
    })
}

function updateEmployeeManager(data) {
  connection.query(`UPDATE employee SET manager_id = ${data.manager_id} WHERE id = ${data.empID}`,
  function (error, res) {
    if (error) throw error;
  });
  endOrMenu();
}



function endOrMenu() {
  confirm("Would you like to continue?")
  .then(function confirmed() {
    showmenu();
  }, function cancelled() {
    end();
  });
}

function end() {
  console.log("Thank you for using Employee Tracker!");
  connection.end();
  process.exit();
}