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
    `hospital`	    VARCHAR(256)	        NOT NULL,
	`type_user`		ENUM('Clinical Imaging Staff', 'Referring Clinical Staff')		NOT NULL,

	PRIMARY KEY(`email`)
);

CREATE TABLE IF NOT EXISTS `not_accepted` (
    `email`		    	VARCHAR(256)		NOT NULL,
	`fullname`			VARCHAR(256)		NOT NULL,
	`password`	    	VARCHAR(256)        NOT NULL,
	`professional_id` 	VARCHAR(256)		NOT NULL,
    `hospital`	        VARCHAR(256)	    NOT NULL,
	`type_user`		ENUM('Clinical Imaging Staff', 'Referring Clinical Staff')		NOT NULL,

	PRIMARY KEY(`email`)
);

-- drop table `staff`;
-- drop table `not_accepted`;

DELIMITER $$
CREATE PROCEDURE `AcceptOnStaff` (IN Email VARCHAR(256))
BEGIN
	INSERT INTO `staff` SELECT * from `not_accepted` as na WHERE na.`email` = Email ;
END $$  

DELIMITER $$
CREATE PROCEDURE `DeleteOnNotAcceptedTable` (IN Email VARCHAR(256))
BEGIN
	DELETE FROM `not_accepted` as na WHERE na.`email` = Email;
END $$  

INSERT INTO `user` (`email`, `fullname`, `password`) VALUES
('silva@luz.pt', 'Rita Silva', 'ritinha');

INSERT INTO `staff` (`email`, `fullname`, `password`, `professional_id`, `hospital`, `type_user`) VALUES
('silva@luz.pt', 'Rita Silva', 'ritinha', '222333444', 'Hospital do Incesto', 'Clinical Imaging Staff'),
('costa@luz.pt', 'António Costa', 'costits', '876854387', 'Hospital da Luz', 'Clinical Imaging Staff');

-- INSERTS STAFF
INSERT INTO `staff` (`email`, `fullname`, `password`, `professional_id`, `hospital`, `type_user`) VALUES 
('andrefreixo@gmail.com', 'André Freixo', 'andrefreixo18!', '506984765', "Hospital do Porto", 'Clinical Imaging Staff'),
('pedrosobral@gmail.com', 'Pedro Sobral', 'pedrocas1!', '012938477', "Hospital da Luz", 'Clinical Imaging Staff'),
('filipefreixo@gmail.com', 'Filipe Freixo', 'filipefreixo07!', '012345678', "Hospital da Luz", 'Clinical Imaging Staff'),
('martafradiqs@gmail.com', 'Marta Fradique', 'martafradique/', '079685746', "Hospital do Porto", 'Clinical Imaging Staff'),
('danifigueiredo@gmail.com', 'Daniel Figueiredo', 'danifig?', '110022993', "Hospital Sao Joao", 'Clinical Imaging Staff'),
('evabart@gmail.com', 'Eva Bartolomeu', 'evapomposo!', '987645321', "Hospital de Coimbra", 'Clinical Imaging Staff'),
('marianarosa@gmail.com', 'Mariana Rosa', 'abcdef18!', '998877665', "Hospital de Coimbra", 'Referring Clinical Staff'),
('carlosalbanio@gmail.com', 'Carlos Albânio', 'carlitos089^', '111111111', "Hospital de Vila Real",'Referring Clinical Staff'),
('bernardorodrigues@gmail.com', 'Bernardo Rodrigues', 'bernaRodr-99', '002234444', "Hospital do Porto",'Referring Clinical Staff'),
('laurasilva@gmail.com', 'Laura Silva', 'laureta-SF1', '888777654', "Hospital do Porto",'Referring Clinical Staff'),
('josetrancoso@gmail.com', 'José  Trancoso', 'trancoso123/', '978675645', "Hospital Sao Joao", 'Referring Clinical Staff'),
('luisvasques@gmail.com', 'Luís Vasques', 'vasquesinho?', '019283746', "Hospital da Luz", 'Referring Clinical Staff');

-- INSERTS NOT_ACCEPTED
INSERT INTO `not_accepted` (`email`, `fullname`, `password`, `professional_id`, `hospital`,`type_user`) VALUES 
('luisao@gmail.com', 'Luís Albedo', 'luisito555%', '334221234', "Hospital da Luz", 'Clinical Imaging Staff'),
('ricardoalmeida@gmail.com', 'Ricardo Almeida', 'rics33!', '777896540', "Hospital do Porto", 'Clinical Imaging Staff'),
('inesfreixo@gmail.com', 'Inês Freixo', 'freixo18!', '012345678', "Hospital da Luz", 'Referring Clinical Staff'),
('silva@gmail.com', 'Rita Silva', 'ritinha_666', '000000002', "Hospital de Coimbra", 'Referring Clinical Staff'),
('jorge@gmail.com', 'Jorge Silva', 'jorgitosilva$', '000333450', "Hospital de Coimbra", 'Clinical Imaging Staff'),
('verapomp@gmail.com', 'Vera Pomposo', 'verits0!!', '897969594', "Hospital do Porto", 'Referring Clinical Staff');

-- INSERTS USER
INSERT INTO `user` (`email`, `fullname`, `password`) VALUES 
('andrefreixo@gmail.com', 'André Freixo', 'andrefreixo18!'),
('pedrosobral@gmail.com', 'Pedro Sobral', 'pedrocas1!'),
('filipefreixo@gmail.com', 'Filipe Freixo', 'filipefreixo07!'),
('martafradiqs@gmail.com', 'Marta Fradique', 'martafradique/'),
('danifigueiredo@gmail.com', 'Daniel Figueiredo', 'danifig?'),
('evabart@gmail.com', 'Eva Bartolomeu', 'evapomposo!'),
('marianarosa@gmail.com', 'Mariana Rosa', 'abcdef18!'),
('carlosalbanio@gmail.com', 'Carlos Albânio', 'carlitos089^'),
('bernardorodrigues@gmail.com', 'Bernardo Rodrigues', 'bernaRodr-99'),
('laurasilva@gmail.com', 'Laura Silva', 'laureta-SF1'),
('josetrancoso@gmail.com', 'José  Trancoso', 'trancoso123/'),
('luisvasques@gmail.com', 'Luís Vasques', 'vasquesinho?');