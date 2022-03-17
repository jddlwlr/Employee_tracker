INSERT INTO department (name)
VALUES 
('Information Tech'),
('Accounting'),
('Sales');

INSERT INTO role (title, salary, department_id)
VALUES
('Accountant', 1000, 2), 
('Finanical Analyst', 150000, 2),
('Project Manager', 100000, 4),


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('James', 'Jamies', 2, null),
('roger', 'Moore', 1, 1),
('Katherine', 'schuber', 8, 7);