SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `SIO_P1`
--
CREATE DATABASE IF NOT EXISTS `SIO_P1` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `SIO_P1`;



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
-- --------------------------------------------------------

--
-- Table structure for table `Publications`
--

CREATE TABLE IF NOT EXISTS `Publications` (
    `id`			INT		AUTO_INCREMENT			NOT NULL,
	`title`			VARCHAR(512)		NOT NULL,
	`content`			TEXT				NOT NULL,
	`created_by`		INT					NOT NULL,
	`created_on`		DATETIME			NOT NULL,
	`updated_by`		INT,		
	`updated_on`		DATETIME,	

	PRIMARY KEY (`id`),
	FOREIGN KEY (`created_by`) REFERENCES Users(`id`),
	FOREIGN KEY (`updated_by`) REFERENCES Users(`id`)

);
GO

--
-- Dumping data for table `users`
--

INSERT INTO `Publications` (`title`, `content`, `created_by`, `created_on`) VALUES
('5 Brilliant Ways To Teach Your Audience About ADS','Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Sodales ut eu sem integer vitae justo eget magna fermentum. Nunc non blandit massa enim nec. Neque ornare aenean euismod elementum. Luctus accumsan tortor posuere ac ut consequat semper. Cursus eget nunc scelerisque viverra mauris. Placerat in egestas erat imperdiet sed euismod nisi. Pellentesque nec nam aliquam sem et tortor consequat id. Purus in massa tempor nec feugiat nisl pretium. Sit amet est placerat in. Sed faucibus turpis in eu mi bibendum neque.' ,1,'2021-10-10 13:45:56'),
('The Anthony Robins Guide To ADS', 'Amet est placerat in egestas. Facilisis magna etiam tempor orci eu lobortis. Lacus sed viverra tellus in hac habitasse platea. Dui nunc mattis enim ut tellus elementum sagittis vitae et. Tortor consequat id porta nibh venenatis cras sed. Porta lorem mollis aliquam ut porttitor leo. Quisque sagittis purus sit amet volutpat. Dui faucibus in ornare quam viverra orci sagittis eu volutpat. Tristique nulla aliquet enim tortor at. Dui nunc mattis enim ut tellus elementum sagittis vitae et. Arcu felis bibendum ut tristique et egestas quis ipsum suspendisse. Tortor consequat id porta nibh venenatis cras sed felis eget. Vulputate enim nulla aliquet porttitor. Fames ac turpis egestas sed tempus urna et pharetra pharetra. Nullam ac tortor vitae purus faucibus ornare suspendisse sed.' ,2,'2021-05-20 09:45:56'),
('Why ADS Succeeds','Volutpat ac tincidunt vitae semper quis lectus nulla. Eleifend quam adipiscing vitae proin sagittis nisl rhoncus. Mattis pellentesque id nibh tortor id. Duis at consectetur lorem donec massa. Quisque egestas diam in arcu cursus euismod. A condimentum vitae sapien pellentesque habitant morbi tristique senectus. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras. Pretium aenean pharetra magna ac placerat vestibulum lectus mauris. Tristique risus nec feugiat in fermentum posuere. Consequat semper viverra nam libero justo laoreet sit amet cursus. Hendrerit dolor magna eget est lorem ipsum dolor sit. Tellus orci ac auctor augue mauris augue. Ipsum a arcu cursus vitae congue mauris rhoncus aenean vel. Posuere lorem ipsum dolor sit.',3,'2001-05-20 08:55:56'),
('10 Tips That Will Make You Influential In ADS','Vel pharetra vel turpis nunc eget lorem dolor sed viverra. Facilisis leo vel fringilla est ullamcorper eget. Justo laoreet sit amet cursus. Sit amet consectetur adipiscing elit ut aliquam purus. Sit amet nulla facilisi morbi tempus iaculis urna. Velit laoreet id donec ultrices. Nec ullamcorper sit amet risus. Scelerisque viverra mauris in aliquam sem fringilla ut morbi tincidunt. Amet cursus sit amet dictum. Adipiscing elit pellentesque habitant morbi tristique senectus et.',4,'2021-12-10 05:45:40');






--
-- Table structure for table `Comments`
--

CREATE TABLE  IF NOT EXISTS `Comments`(
	`comment_id`		INT AUTO_INCREMENT NOT NULL,
	`publication_id`	INT				NOT NULL,
	`created_by`			INT				NOT NULL,
	`created_on`			DATETIME		NOT NULL,
	`content`				TEXT			NOT NULL,
	
	PRIMARY KEY(`comment_id`),
	FOREIGN KEY (`created_by`) REFERENCES Users(`id`),
	FOREIGN KEY (`publication_id`) REFERENCES Publications(`id`)
);
GO


INSERT INTO `Comments` (`publication_id`, `created_by`, `created_on`, `content`) VALUES
(1, 4, '2021-05-25 09:00:32', 'Concordo!'),
(1, 3, '2021-05-25 09:00:32', 'Concordo mais ou menos!'),
(2, 1, '2021-06-05 10:00:32', 'Discordo!'),
(3, 2, '2011-07-05 10:00:32', 'Concordo parcialmente'),
(4, 3, '2001-11-05 23:00:32', 'Discordo totalmente');
--
-- Table structure for table `Files`
--

CREATE TABLE  IF NOT EXISTS `Files` (
	`publication_id`		INT				NOT NULL,
	`nome`				VARCHAR(256)	NOT NULL,
	`uploaded_by`			INT				NOT NULL,
	`uploaded_on`			DATETIME		NOT NULL,
	
	PRIMARY KEY (`nome`),
	FOREIGN KEY (`uploaded_by`) REFERENCES Users(`id`),
	FOREIGN KEY (`publication_id`) REFERENCES Publications(`id`)
);
GO


INSERT INTO `Files` (`publication_id`,`nome`, `uploaded_by`, `uploaded_on`) VALUES
(1,'file1.php',1,'2021-10-10 12:55:56'),
(2,'file2.pdf',2,'2014-01-20 11:05:56'),
(3,'file3.sql',3,'2013-06-19 19:35:56'),
(4,'file4.c',4,'2005-03-04 18:45:16');

