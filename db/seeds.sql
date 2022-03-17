INSERT INTO department (name)
VALUES 
('Internet Technologies'),
('Finance'),
('Sales'),
('Customer success');

INSERT INTO role (title, salary, department_id)
VALUES
('CEO', 180000, 1),
('Engineer', 120000, 1),
('Accountant', 10000, 2), 
('Janitor', 150000, 2),
('CSM', 70000, 3), 
('Photographer', 90000, 3),
('Geologist', 100000, 4),
('Hole Digger', 1000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Drew', 'Warren', 2, null),
('Michael', 'Scott', 1, 1),
('Angela', 'Simpson', 4, null),
('Creed', 'McFaddon', 3, 3),
('Dwight', 'Schrute', 6, null),
('Jim', 'Halper', 5, 5),
('Kelly', 'Kapur', 7, null),
('Pam', 'Halper', 8, 7);
