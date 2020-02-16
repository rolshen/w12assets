DROP DATABASE IF EXISTS employees;

CREATE DATABASE employees;

USE employees;

CREATE TABLE department (
  id INT AUTO_INCREMENT NOT NULL,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY(id)
);

INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("Legal");

CREATE TABLE role (
  id INT AUTO_INCREMENT NOT NULL,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY(id)
);

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 80000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);

INSERT INTO role (title, salary, department_id)
VALUES ("Account Manager", 160000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 190000, 4);

CREATE TABLE employee (
  id INT AUTO_INCREMENT NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id iNT NOT NULL,
  manager_id VARCHAR(30),
  PRIMARY KEY(id)
);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mike", "Chan", 2, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ashley", "Rodriguez", 3, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kevin", "Tupik", 4, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Kunal", "Singh", 5, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Malia", "Brown", 6, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Sarah", "Lourd", 7, null);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Tom", "Allen", 8, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Hanna", "Lauth", 3, 4);
