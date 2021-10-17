INSERT INTO department (name)
VALUES ('IT'),
       ('HR');

INSERT INTO role (title, salary, department_id)
VALUES ("IT Manager", 150000, 1),
       ("Technical Consultant", 150000, 1),
       ("Integration Engineer", 180000, 1),
       ("Solution Architect", 170000, 1),
       ("Recruiter", 90000, 2),
       ("Senior Recruiter", 120000, 2);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Jill", "Hill", 1, NULL),
       ("Jason", "Jax", 6, NULL);



INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("John", "Bucket", 2, 1),
       ("Josh", "Water", 3, 1),
       ("Jim", "Bean", 5, 2);