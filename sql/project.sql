create table users (
  user_id INT AUTO_INCREMENT,
  username VARCHAR(50) not null,
  password VARCHAR(50) not null,
  user_type enum ('citizen', 'rescuer', 'admin') NOT NULL,
  primary key (user_id,username)
);

create table admins (
admin_id int not null,
f_name VARCHAR(50) not null,
l_name varchar(50) not null,
CONSTRAINT ADMIN_TABLE
FOREIGN KEY (admin_id) REFERENCES users(user_id)
on update CASCADE on delete cascade
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
latitude float NOT NULL,
longitude float NOT NULL,
primary key (vehicle_id,vehicle_username),
CONSTRAINT vehicle_user
FOREIGN KEY (vehicle_id) REFERENCES users(user_id)
on update CASCADE on delete cascade
);

create table rescuer (
	rescuer_id int not null,
    f_name VARCHAR(50) not null,
	l_name VARCHAR(50) not null,
	rescuer_vehicle_id int not null,
    primary key(rescuer_id),
    constraint RESQ_ID
    foreign key (rescuer_id) references users(user_id)
    on update CASCADE on delete cascade,
    constraint RESQ_VEH
    foreign key (rescuer_vehicle_id) references vehicle(vehicle_id)
    on update CASCADE on delete cascade
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

CREATE TABLE base(
  latitude varchar(255) NOT NULL,
  longitude varchar(255) NOT NULL
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
create table citizen_requests_complete(
  request_id INT,
  submission_date DATETIME not null,
  persons INT not null,
  pickup_date DATETIME,
  req_veh_id INT,
  req_citizen_id INT not null,
  req_item_id INT not null,
  complete_date datetime,
  primary key (request_id),
  constraint CITIZEN_REQ_VEH_CMP
  FOREIGN KEY (req_veh_id) REFERENCES vehicle(vehicle_id)
  on update CASCADE on delete CASCADE,
  constraint CITIZEN_REQ_ID_CMP
  FOREIGN KEY (req_citizen_id) REFERENCES citizen(citizen_id)
  on update CASCADE on delete CASCADE,
  constraint REQ_ITEM_ID_CMP
  FOREIGN KEY (req_item_id) REFERENCES items(item_id)
  on update CASCADE on delete CASCADE
);

CREATE TABLE citizen_offers (
  offer_id INT auto_increment,
  submission_date DATETIME not null,
  pickup_date DATETIME,
  offer_veh_id int,
  offer_citizen_id INT not null,
  announcement_id INT not null,
  PRIMARY KEY (offer_id),
  constraint CITIZEN_VEH_ID
  FOREIGN KEY (offer_veh_id) REFERENCES vehicle(vehicle_id)
  on update CASCADE on delete CASCADE,
  constraint CITIZEN_OFFER_ID
  FOREIGN KEY (offer_citizen_id) REFERENCES citizen(citizen_id)
  on update CASCADE on delete CASCADE
);
CREATE TABLE citizen_offers_complete (
  offer_id INT,
  submission_date DATETIME not null,
  pickup_date DATETIME,
  offer_veh_id int,
  offer_citizen_id INT not null,
  complete_date datetime,
  PRIMARY KEY (offer_id),
  constraint CITIZEN_VEH_ID_OFF
  FOREIGN KEY (offer_veh_id) REFERENCES vehicle(vehicle_id)
  on update CASCADE on delete CASCADE,
  constraint CITIZEN_OFFER_ID_OFF
  FOREIGN KEY (offer_citizen_id) REFERENCES citizen(citizen_id)
  on update CASCADE on delete CASCADE
);

create table vehicle_storage(
str_vehicle_id int not null,
str_item_id int not null,
str_quantity int not null,
primary key(str_vehicle_id,str_item_id),
CONSTRAINT STR_ID
FOREIGN KEY (str_vehicle_id) REFERENCES vehicle(vehicle_id)
on update CASCADE on delete cascade,
CONSTRAINT STR_ITEM
FOREIGN KEY (str_item_id) REFERENCES items(item_id)
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

create table announcements(
	announcement_id int auto_increment,
    primary key (announcement_id)
);

create table announcement_items(
	announcement_id int not null,
    announcement_item_id int not null,
    announcement_item_quantity int not null,
    primary key(announcement_id,announcement_item_id),
    constraint ANN_ID	
	FOREIGN KEY (announcement_id) REFERENCES announcements(announcement_id),
    constraint ANN_ITEM_ID	
	FOREIGN KEY (announcement_item_id) REFERENCES items(item_id)
	on update CASCADE on delete CASCADE
);

create index item_cat on items (item_category);

/*DROP TABLE item_details,item_category,citizen,vehicle,citizen_requests,citizen_requests_complete,base,
users,vehicle_storage,offer_items,citizen_offers,citizen_offers_complete,items,rescuer,announcements,announcement_items;