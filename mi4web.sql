SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `SIO_P1`
--
CREATE DATABASE IF NOT EXISTS `mi4web` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `mi4web`;



CREATE TABLE IF NOT EXISTS `Users` (
    `id`			INT		AUTO_INCREMENT			NOT NULL,
	`username`		VARCHAR(100)		NOT NULL,
	`pass`		VARCHAR(256)		NOT NULL,
	`token`		char(10),
	PRIMARY KEY(`id`)
);
GO

--
-- Dumping data for table `Users`
--


INSERT INTO `Users` (`username`, `pass`) VALUES
('goncalo', '90a8bcd468169483d39361f817e78c07081ebce0a83c15dff48b7ba6d0b3e30a9cbab9bedbf564a5f3652b7c3d1d8d4dea9780d61e26c7ec988b05294da858eb'),
('serras', '490b991781fc92228e4a7926251ff778b8c599cc194f181a16b69421b3e4ecc5bb8e0e5123d4051e945ffdb7a8fcb69688d01a721dc442eeb665cf750d181494'),
('sobral', 'f7f3bffff896e84e8a7f77027964173116f14708b9f1d1bab996b401fbfbbdc3dbf9a15e6af82cbbe7d39e8f892dee6b2621a1dffef9dd539d6615f612fd24b5'),
('bernas', 'bcbe60dc3267c853d13635f6b15475a733076c9aad1c3775b1952547aa19710056afc0e21d21b14c26c854d663dc8c9f3bd842a6ed22156c59a4e60a4df40f87');