create database project;

use project;

create table users (
  user_id INT AUTO_INCREMENT,
  username VARCHAR(50),
  password VARCHAR(50),
  user_type enum ('citizen', 'rescuer', 'admin') NOT NULL,
  primary key (user_id)
);

insert into
  user(user_name, user_surname, user_category)
VALUES
  ('Giorgos', 'Nikolaou', 'Diaswsths');

insert into
  credentials(cred_id, username, password)
VALUES
  ('1', 'giorgosnik', '23041978');

create table item_category (
  category_id INT not null,
  category_name VARCHAR(50) not null,
  primary key(category_id, category_name)
);

create table items (
  item_id INT NOT NULL,
  item_name VARCHAR(100) not null,
  item_category INT not null,
  primary key(item_id),
  CONSTRAINT TABLE_CAT FOREIGN KEY (item_category) REFERENCES item_category(category_id) on update CASCADE on delete CASCADE
);

create table item_details(
  item_detail_id int not null,
  item_detail_name VARCHAR(100),
  item_detail_value VARCHAR(100),
  CONSTRAINT TABLE_DET FOREIGN KEY (item_detail_id) REFERENCES items(item_id) on update CASCADE on delete CASCADE
);

create TABLE announcements (
  id INTEGER PRIMARY KEY,
  title TEXT,
  date DATE,
  content TEXT
);

CREATE TABLE base(
  lat varchar(255) NOT NULL,
  longi varchar(255) NOT NULL
);


CREATE TABLE citizen (
citizen_id INT,
f_name VARCHAR(50),
l_name VARCHAR(50),
phone_number VARCHAR(20) NOT NULL,
latitude  float NOT NULL,
longitude float NOT NULL,
primary key (citizen_id,phone_number),
CONSTRAINT TABLE_USER
FOREIGN KEY (citizen_id) REFERENCES users(user_id)
on update CASCADE on delete cascade
);

create table vehicle(
vehicle_id INT,
resquer_id INT,
vehicle_username VARCHAR(50),
lat varchar(255) NOT NULL,
longi varchar(255) NOT NULL,
primary key (vehicle_id),
CONSTRAINT vehicle_user
FOREIGN KEY (vehicle_id) REFERENCES users(user_id)
on update CASCADE on delete cascade
);

CREATE TABLE citizen_requests (
  requert_id INT auto_increment,
  submission_date DATETIME,
  persons INT,
  pickup_date DATETIME,
  req_veh_id INT,
  req_citizen_id INT,
  req_item_id INT,
  primary key (requert_id),
  FOREIGN KEY (req_veh_id) REFERENCES vehicle(vehicle_id)
  on update CASCADE on delete CASCADE,
  FOREIGN KEY (req_citizen_id) REFERENCES citizen(citizen_id)
  on update CASCADE on delete CASCADE
);

CREATE TABLE offers (
  citizen_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  submission_date DATE,
  offer_type VARCHAR(255),
  quantity INT,
  pickup_date DATE,
  veh_username VARCHAR(255),
  citizen_id INT,
  PRIMARY KEY (citizen_name, submission_date),
  FOREIGN KEY (veh_username) REFERENCES vehicles(vehusername),
  FOREIGN KEY (citizen_id) REFERENCES citizen(citizen_id)
);

CREATE TABLE item_quantity (
  item_qua_id int not null,
  item_qua int not null,
  primary key (item_qua_id)
);

create table request(
  id INT AUTO_INCREMENT PRIMARY KEY,
  weneed TEXT NOT NULL,
  date DATE NOT NULL,
  persons INT NOT NULL
);

INSERT INTO base VALUES
('37.9838','23.7275');

INSERT INTO users VALUES
(NULL,'dista',2002,'citizen'),
(NULL,'kourt',1234,'rescuer');

INSERT INTO vehicle VALUES
(NULL,2,"tracker",37.96477144899956,23.732011585729495);

INSERT INTO citizen VALUES
(1,'Dimitris','Stasinos','698',37.983310135428795,23.717597956722077);

INSERT INTO citizen_requests VALUES
(NULL,now(),2,NULL,NULL,1,15);

