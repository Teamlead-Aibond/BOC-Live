use db_crm;
CREATE TABLE `tbl_customers` (
  `customer_id` bigint NOT NULL AUTO_INCREMENT COMMENT 'This is a customer table used for users registration and login purpose. ',
  `first_name` varchar(45) DEFAULT NULL,
  `last_name` varchar(45) DEFAULT NULL,
  `mobile_number` varchar(15) DEFAULT NULL COMMENT 'accepts only indain number',
  `gender` varchar(1) DEFAULT NULL,
  `city` varchar(45) DEFAULT NULL,
  `language_id` int DEFAULT NULL,
  `registered_date` datetime DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1; 


use db_crm;
CREATE TABLE `tbl_languages` (
  `language_id` int NOT NULL AUTO_INCREMENT,
  `language` varchar(100) NOT NULL,
  `active` tinyint DEFAULT NULL,
  PRIMARY KEY (`language_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1;
