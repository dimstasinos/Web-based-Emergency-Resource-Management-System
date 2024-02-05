create table users (
  user_id INT AUTO_INCREMENT,
  username VARCHAR(50) not null,
  password VARCHAR(50) not null,
  user_type enum ('citizen', 'rescuer', 'admin') NOT NULL,
  primary key (user_id, username)
);

create table admins (
  admin_id int not null,
  f_name VARCHAR(50) not null,
  l_name varchar(50) not null,
  CONSTRAINT ADMIN_TABLE FOREIGN KEY (admin_id) REFERENCES users(user_id) on update CASCADE on delete cascade
);

CREATE TABLE citizen (
  citizen_id INT not null,
  f_name VARCHAR(50) not null,
  l_name VARCHAR(50) not null,
  phone_number VARCHAR(20) NOT NULL,
  latitude float NOT NULL,
  longitude float NOT NULL,
  primary key (citizen_id, phone_number),
  CONSTRAINT TABLE_USER FOREIGN KEY (citizen_id) REFERENCES users(user_id) on update CASCADE on delete cascade
);

create table vehicle(
  vehicle_id INT auto_increment,
  vehicle_username VARCHAR(50) not null,
  latitude float NOT NULL,
  longitude float NOT NULL,
  primary key (vehicle_id, vehicle_username),
  CONSTRAINT vehicle_user FOREIGN KEY (vehicle_id) REFERENCES users(user_id) on update CASCADE on delete cascade
);

create table rescuer (
  rescuer_id int not null,
  f_name VARCHAR(50) not null,
  l_name VARCHAR(50) not null,
  rescuer_vehicle_id int not null,
  primary key(rescuer_id),
  constraint RESQ_ID foreign key (rescuer_id) references users(user_id) on update CASCADE on delete cascade,
  constraint RESQ_VEH foreign key (rescuer_vehicle_id) references vehicle(vehicle_id) on update CASCADE on delete cascade
);

create table item_category (
  category_id INT not null,
  category_name VARCHAR(50) not null,
  primary key(category_id, category_name)
);

create table items (
  item_id INT NOT NULL,
  item_name VARCHAR(100) not null,
  item_category INT not null,
  item_quantity int not null,
  primary key(item_id),
  CONSTRAINT TABLE_CAT FOREIGN KEY (item_category) REFERENCES item_category(category_id) on update CASCADE on delete CASCADE
);

create table item_details(
  item_detail_id int not null,
  item_detail_name VARCHAR(100),
  item_detail_value VARCHAR(100),
  CONSTRAINT TABLE_DET FOREIGN KEY (item_detail_id) REFERENCES items(item_id) on update CASCADE on delete CASCADE
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
  constraint CITIZEN_REQ_VEH FOREIGN KEY (req_veh_id) REFERENCES vehicle(vehicle_id) on update CASCADE on delete CASCADE,
  constraint CITIZEN_REQ_ID FOREIGN KEY (req_citizen_id) REFERENCES citizen(citizen_id) on update CASCADE on delete CASCADE,
  constraint REQ_ITEM_ID FOREIGN KEY (req_item_id) REFERENCES items(item_id) on update CASCADE on delete CASCADE
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
  constraint CITIZEN_REQ_VEH_CMP FOREIGN KEY (req_veh_id) REFERENCES vehicle(vehicle_id) on update CASCADE on delete CASCADE,
  constraint CITIZEN_REQ_ID_CMP FOREIGN KEY (req_citizen_id) REFERENCES citizen(citizen_id) on update CASCADE on delete CASCADE,
  constraint REQ_ITEM_ID_CMP FOREIGN KEY (req_item_id) REFERENCES items(item_id) on update CASCADE on delete CASCADE
);

CREATE TABLE citizen_offers (
  offer_id INT auto_increment,
  submission_date DATETIME not null,
  pickup_date DATETIME,
  offer_veh_id int,
  offer_citizen_id INT not null,
  announcement_id INT not null,
  PRIMARY KEY (offer_id),
  constraint CITIZEN_VEH_ID FOREIGN KEY (offer_veh_id) REFERENCES vehicle(vehicle_id) on update CASCADE on delete CASCADE,
  constraint CITIZEN_OFFER_ID FOREIGN KEY (offer_citizen_id) REFERENCES citizen(citizen_id) on update CASCADE on delete CASCADE
);

CREATE TABLE citizen_offers_complete (
  offer_id INT,
  submission_date DATETIME not null,
  pickup_date DATETIME,
  offer_veh_id int,
  offer_citizen_id INT not null,
  complete_date datetime,
  PRIMARY KEY (offer_id),
  constraint CITIZEN_VEH_ID_OFF FOREIGN KEY (offer_veh_id) REFERENCES vehicle(vehicle_id) on update CASCADE on delete CASCADE,
  constraint CITIZEN_OFFER_ID_OFF FOREIGN KEY (offer_citizen_id) REFERENCES citizen(citizen_id) on update CASCADE on delete CASCADE
);

create table vehicle_storage(
  str_vehicle_id int not null,
  str_item_id int not null,
  str_quantity int not null,
  primary key(str_vehicle_id, str_item_id),
  CONSTRAINT STR_ID FOREIGN KEY (str_vehicle_id) REFERENCES vehicle(vehicle_id) on update CASCADE on delete cascade,
  CONSTRAINT STR_ITEM FOREIGN KEY (str_item_id) REFERENCES items(item_id) on update CASCADE on delete cascade
);

CREATE TABLE offer_items (
  offer_id_item int not null,
  item_id_offer int not null,
  quantity int not null,
  primary key(offer_id_item, item_id_offer),
  constraint OFFER_ID FOREIGN KEY (offer_id_item) REFERENCES citizen_offers(offer_id) on update CASCADE on delete CASCADE,
  constraint ITEM_ID FOREIGN KEY (item_id_offer) REFERENCES items(item_id) on update CASCADE on delete CASCADE
);

create table announcements(
  announcement_id int auto_increment,
  primary key (announcement_id)
);

create table announcement_items(
  announcement_id int not null,
  announcement_item_id int not null,
  announcement_item_quantity int not null,
  primary key(announcement_id, announcement_item_id),
  constraint ANN_ID FOREIGN KEY (announcement_id) REFERENCES announcements(announcement_id),
  constraint ANN_ITEM_ID FOREIGN KEY (announcement_item_id) REFERENCES items(item_id) on update CASCADE on delete CASCADE
);

INSERT INTO
  base
VALUES
  (37.984003, 23.727950);

INSERT INTO
  users
VALUES
  (NULL, 'dimitris', '2000', 'admin'),
  (NULL, 'vasilis', '2001', 'admin'),
  (NULL, 'vera', '2002', 'admin'),
  (NULL, 'spilios', 'sp20', 'citizen'),
  (NULL, 'platon', '1234pl', 'citizen'),
  (NULL, 'fotis', '159753', 'citizen'),
  (NULL, 'xristos', '74123', 'citizen'),
  (NULL, 'alex', '15963', 'citizen'),
  (NULL, 'marios', '123456', 'rescuer'),
  (NULL, 'giorgos', '65482', 'rescuer'),
  (NULL, 'sakis', 'sa7485', 'rescuer');

INSERT INTO
  vehicle
VALUES
  (NULL, "oxima_1", 37.997674, 23.667426),
  (NULL, "oxima_2", 38.024325, 23.789415),
  (
    NULL,
    "oxima_3",
    37.910309490512326,
    23.711972203672794
  );

insert into
  admins
values
  (1, 'Dimitris', 'Stasinos'),
  (2, 'Vasilis', 'Pistiolas'),
  (3, 'Vera', 'Karioti');

INSERT INTO
  rescuer
values
  (9, 'Marios', 'Tsarouxis', 1),
  (10, 'Giorgos', 'Georgiou', 2),
  (11, 'Sakis', 'Apostolou', 3);

INSERT INTO
  citizen
VALUES
  (
    4,
    'Spilios',
    'Apostolopoulos',
    '6954658213',
    38.037424013297475,
    23.70968074010114
  ),
  (
    5,
    'Platonas',
    'Nikolaou',
    '6931235321',
    38.01377164147305,
    23.646575355362437
  ),
  (
    6,
    'Fotis',
    'Stravodimos',
    '6951237598',
    37.97295590950958,
    23.780778997004717
  ),
  (
    7,
    'Xristos',
    'Skordopoulos',
    '69785624830',
    37.940576857814335,
    23.707412560205587
  ),
  (
    8,
    'Alexandros',
    'Nikolaou',
    '6981023456',
    37.973213429715024,
    23.65525324828876
  );

insert into
  announcements
values
  (NULL),
  (NULL),
  (NULL),
  (NULL);

insert into
  announcement_items
values
  (1, 20, 5),
  (1, 25, 3),
  (2, 125, 2),
  (2, 143, 6),
  (2, 114, 2),
  (3, 29, 3);

INSERT INTO
  citizen_requests
VALUES
  (
    NULL,
    '2024-02-04 14:00:26',
    5,
    NULL,
    NULL,
    4,
    20
  ),
  (NULL, '2024-02-05 16:20:00', 2, now(), 1, 5, 25),
  (
    NULL,
    '2024-02-03 12:35:00',
    4,
    NULL,
    NULL,
    6,
    125
  ),
  (NULL, '2024-02-04 17:00:00', 2, now(), 2, 4, 115);

insert into
  citizen_offers
values
  (NULL, '2024-02-04 9:25:00', NULL, 3, 7, 4),
  (
    NULL,
    '2024-02-05 8:40:00',
    '2024-02-05 15:25:00',
    1,
    8,
    5
  ),
  (NULL, '2024-02-03 15:19:00', NULL, NULL, 2, 8, 6);

insert into
  offer_items
VALUES
  (1, 115, 2),
  (1, 125, 4),
  (2, 20, 5),
  (3, 26, 10);

create index item_cat on items (item_category);

/*DROP TABLE admins,item_details,item_category,citizen,vehicle,citizen_requests,citizen_requests_complete,base,
 users,vehicle_storage,offer_items,citizen_offers,citizen_offers_complete,items,rescuer,announcements,announcement_items;