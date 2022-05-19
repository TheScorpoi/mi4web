SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET TIME_ZONE = "+00:00";
 


CREATE DATABASE IF NOT EXISTS `mi4web` DEFAULT CHARACTER SET latin1;
USE `mi4web`;

CREATE TABLE `user` (
    `email`		    VARCHAR(256)		NOT NULL,
	`fullname`		VARCHAR(256)		NOT NULL,
	`password`	    VARCHAR(256)        NOT NULL,

	PRIMARY KEY(`email`)
);

CREATE TABLE IF NOT EXISTS `admin` (
    `email`		    VARCHAR(256)		NOT NULL,
	`fullname`		VARCHAR(256)		NOT NULL,
	`password`	    VARCHAR(256)        NOT NULL,

	PRIMARY KEY(`email`)
);

CREATE TABLE IF NOT EXISTS `staff` (
    `email`		    VARCHAR(256)			NOT NULL,
	`fullname`		VARCHAR(256)			NOT NULL,
	`password`	    VARCHAR(256)        	NOT NULL,
	`professional_id` 	VARCHAR(256)		NOT NULL,
	`type_user`		ENUM('Clinical Imaging Staff', 'Referring Clinical Staff')		NOT NULL,

	PRIMARY KEY(`email`)
);

CREATE TABLE IF NOT EXISTS `not_accepted` (
    `email`		    	VARCHAR(256)		NOT NULL,
	`fullname`			VARCHAR(256)		NOT NULL,
	`password`	    	VARCHAR(256)        NOT NULL,
	`professional_id` 	VARCHAR(256)		NOT NULL,
	`type_user`		ENUM('Clinical Imaging Staff', 'Referring Clinical Staff')		NOT NULL,

	PRIMARY KEY(`email`)
);

INSERT INTO `user` (`email`, `fullname`, `password`) VALUES
('silva@luz.pt', 'Rita Silva', 'ritinha');