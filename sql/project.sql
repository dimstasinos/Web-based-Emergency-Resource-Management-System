create database project;

use project;

create table user (user_id INT AUTO_INCREMENT PRIMARY KEY, user_name VARCHAR(50), user_surname VARCHAR(50), user_category VARCHAR(50));
create table credentials (cred_id INT NOT NULL , username VARCHAR(50), password VARCHAR(50), FOREIGN KEY(cred_id) REFERENCES user(user_id));

insert into user(user_name,user_surname,user_category) VALUES('Giorgos','Nikolaou','Diaswsths');
insert into credentials(cred_id,username,password) VALUES ('1','giorgosnik','23041978');


create table item_category (
  category_id INT not null,
  category_name VARCHAR(50) not null,
  primary key(category_id)
  );

create table items (
  item_id INT NOT NULL,
  item_name VARCHAR(100) not null,
  item_category INT not null,
  primary key(item_id),
  CONSTRAINT TABLE_CAT
  FOREIGN KEY (item_category) REFERENCES item_category(category_id)
  on update CASCADE on delete CASCADE
);

create table item_details(
  item_detail_id int not null,
  item_detail_name VARCHAR(100) default null,
  item_value VARCHAR(100) default null,
  CONSTRAINT TABLE_DET
  FOREIGN KEY (item_detail_id) REFERENCES items(item_id)
  on update CASCADE on delete CASCADE
);


create TABLE announcements (
    id INTEGER PRIMARY KEY ,
    title TEXT,
    date DATE,
    content TEXT
);


CREATE TABLE locations (
  id int NOT NULL AUTO_INCREMENT,
  lat varchar(255) NOT NULL,
  longi varchar(255) NOT NULL,
  type enum( 'veh', 'req', 'off' ) NOT NULL,
  PRIMARY KEY (id)
) ;