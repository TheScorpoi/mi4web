SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET TIME_ZONE = "+00:00";
 


CREATE DATABASE IF NOT EXISTS `mi4web` DEFAULT CHARACTER SET latin1;
USE `mi4web`;

CREATE TABLE IF NOT EXISTS `User` (
	`id`    INT        AUTO_INCREMENT 	NOT NULL,
    `email`		    VARCHAR(256)		NOT NULL,
	`fullname`		VARCHAR(256)		NOT NULL,
	`password`	    VARCHAR(256)        NOT NULL,

	PRIMARY KEY(`email`)
);

CREATE TABLE IF NOT EXISTS `Admin` (
	`id`    INT        AUTO_INCREMENT 	NOT NULL,
    `email`		    VARCHAR(256)		NOT NULL,
	`fullname`		VARCHAR(256)		NOT NULL,
	`password`	    VARCHAR(256)        NOT NULL,

	PRIMARY KEY(`email`)
)

CREATE TABLE IF NOT EXISTS `Staff` (
	`id`    INT        AUTO_INCREMENT 		NOT NULL,
    `email`		    VARCHAR(256)			NOT NULL,
	`fullname`		VARCHAR(256)			NOT NULL,
	`password`	    VARCHAR(256)        	NOT NULL,
	`professional_id` 	VARCHAR(256)		NOT NULL,
	`type_user`		ENUM('Clinical Imaging Staff', 'Referring Clinical Staff')		NOT NULL,

	PRIMARY KEY(`email`)
)

CREATE TABLE IF NOT EXISTS `NotAccepted` (
	`id`    INT        AUTO_INCREMENT 		NOT NULL,
    `email`		    	VARCHAR(256)		NOT NULL,
	`fullname`			VARCHAR(256)		NOT NULL,
	`password`	    	VARCHAR(256)        NOT NULL,
	`professional_id` 	VARCHAR(256)		NOT NULL,
	`type_user`		ENUM('Clinical Imaging Staff', 'Referring Clinical Staff')		NOT NULL,

	PRIMARY KEY(`email`)
)