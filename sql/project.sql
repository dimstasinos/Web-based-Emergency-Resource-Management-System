create database project;

use project;

create table users (
  user_id INT AUTO_INCREMENT,
  username VARCHAR(50) not null,
  password VARCHAR(50) not null,
  user_type enum ('citizen', 'rescuer', 'admin') NOT NULL,
  primary key (user_id)
);

create table item_category (
  category_id INT not null,
  category_name VARCHAR(50) not null,
  primary key(category_id,category_name)
);

create table items (
  item_id INT NOT NULL,
  item_name VARCHAR(100) not null,
  item_category INT not null,
  item_quantity int not null,
  primary key(item_id),
  CONSTRAINT TABLE_CAT 
  FOREIGN KEY (item_category) REFERENCES item_category(category_id)
  on update CASCADE on delete CASCADE
);

create table item_details(
  item_detail_id int not null,
  item_detail_name VARCHAR(100),
  item_detail_value VARCHAR(100),
  CONSTRAINT TABLE_DET
  FOREIGN KEY (item_detail_id) REFERENCES items(item_id)
  on update CASCADE on delete CASCADE
);


create TABLE announcements (
  id INTEGER PRIMARY KEY,
  title TEXT,
  date DATE,
  content TEXT
);

CREATE TABLE base(
  latitude varchar(255) NOT NULL,
  longitude varchar(255) NOT NULL
);

CREATE TABLE citizen (
citizen_id INT not null,
f_name VARCHAR(50) not null,
l_name VARCHAR(50) not null,
phone_number VARCHAR(20) NOT NULL,
latitude  float NOT NULL,
longitude float NOT NULL,
primary key (citizen_id,phone_number),
CONSTRAINT TABLE_USER
FOREIGN KEY (citizen_id) REFERENCES users(user_id)
on update CASCADE on delete cascade
);

create table vehicle(
vehicle_id INT auto_increment,
vehicle_username VARCHAR(50) not null,
latitude varchar(255) NOT NULL,
longitude varchar(255) NOT NULL,
primary key (vehicle_id,vehicle_username),
CONSTRAINT vehicle_user
FOREIGN KEY (vehicle_id) REFERENCES users(user_id)
on update CASCADE on delete cascade
);


CREATE TABLE citizen_requests (
  request_id INT auto_increment,
  submission_date DATETIME not null,
  persons INT not null,
  pickup_date DATETIME,
  req_veh_id INT,
  req_citizen_id INT not null,
  req_item_id INT not null,
  primary key (request_id),
  constraint CITIZEN_REQ_VEH
  FOREIGN KEY (req_veh_id) REFERENCES vehicle(vehicle_id)
  on update CASCADE on delete CASCADE,
  constraint CITIZEN_REQ_ID
  FOREIGN KEY (req_citizen_id) REFERENCES citizen(citizen_id)
  on update CASCADE on delete CASCADE,
  constraint REQ_ITEM_ID
  FOREIGN KEY (req_item_id) REFERENCES items(item_id)
  on update CASCADE on delete CASCADE
);

CREATE TABLE citizen_offers (
  offer_id INT auto_increment,
  submission_date DATETIME not null,
  pickup_date DATE,
  offer_veh_id int,
  offer_citizen_id INT not null,
  PRIMARY KEY (offer_id),
  constraint CITIZEN_VEH_ID
  FOREIGN KEY (offer_veh_id) REFERENCES vehicle(vehicle_id)
  on update CASCADE on delete CASCADE,
  constraint CITIZEN_OFFER_ID
  FOREIGN KEY (offer_citizen_id) REFERENCES citizen(citizen_id)
  on update CASCADE on delete CASCADE
);

create table vehicle_storage(
str_vehicle_id INT not null,
str_citizen_req INT,
str_citizen_off int,
unique key (str_citizen_req,str_citizen_off),
CONSTRAINT STR_ID
FOREIGN KEY (str_vehicle_id) REFERENCES vehicle(vehicle_id)
on update CASCADE on delete cascade,
CONSTRAINT STR_REQ
FOREIGN KEY (str_citizen_req) REFERENCES citizen_requests(request_id)
on update CASCADE on delete cascade,
CONSTRAINT STR_OFF
FOREIGN KEY (str_citizen_off) REFERENCES citizen_offers(offer_id)
on update CASCADE on delete cascade
);

CREATE TABLE offer_items (
  offer_id_item int not null,
  item_id_offer int not null,
  quantity int not null,
  primary key(offer_id_item,item_id_offer),
  constraint OFFER_ID
  FOREIGN KEY (offer_id_item) REFERENCES citizen_offers(offer_id)
  on update CASCADE on delete CASCADE,
  constraint ITEM_ID	
  FOREIGN KEY (item_id_offer) REFERENCES items(item_id)
  on update CASCADE on delete CASCADE
);


create table request(
  id INT AUTO_INCREMENT PRIMARY KEY,
  weneed TEXT NOT NULL,
  date DATE NOT NULL,
  persons INT NOT NULL
);

INSERT INTO base VALUES
(37.9838,23.7275);


INSERT INTO users VALUES
(NULL,'dista',2002,'citizen'),
(NULL,'kourt',1234,'citizen'),
(NULL,'vasilis',1234,'citizen'),
(NULL,'spilios',5516,'citizen'),
(NULL,'vera',7586,'citizen');

INSERT INTO vehicle VALUES
(NULL,"tracker",37.96477144899956,23.732011585729495);

INSERT INTO citizen VALUES
(1,'Dimitris','Stasinos','698',37.9593578107923,23.753819428699714),
(2,'Marios','Kourtakis','697',37.95989919257204,23.701968353689313),
(3,'Vasilis','Pistiolas','694',37.98547493214612,23.716905583907558),
(4,'Spilios','Apostolopoulos','695',37.98114527484491,23.74815350707955),
(5,'Vera','Karioti','693',37.95962850218102,23.725318514872313);

INSERT INTO citizen_requests VALUES
(NULL,now(),5,NULL,NULL,2,17),
(NULL,now(),2,now(),1,1,16),
(NULL,now(),4,NULL,NULL,2,19),
(NULL,now(),7,now(),1,3,18),
(NULL,now(),3,NULL,NULL,1,20);

insert into citizen_offers values
(NULL,now(),NULL,NULL,4),
(NULL,now(),NULL,1,5);

insert into offer_items VALUES
(1,17,9),
(2,18,25),
(1,19,3),
(2,20,8);

insert into vehicle_storage values
(1,7,NULL),
(1,9,NULL),
(1,NULL,2);
