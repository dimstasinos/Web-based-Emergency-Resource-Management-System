create database project;

use project;

create table user (user_id INT AUTO_INCREMENT PRIMARY KEY, user_name VARCHAR(50), user_surname VARCHAR(50), user_category VARCHAR(50));
create table credentials (cred_id INT NOT NULL , username VARCHAR(50), password VARCHAR(50), FOREIGN KEY(cred_id) REFERENCES user(user_id));

insert into user(user_name,user_surname,user_category) VALUES('Giorgos','Nikolaou','Diaswsths');
insert into credentials(cred_id,username,password) VALUES ('1','giorgosnik','23041978');
