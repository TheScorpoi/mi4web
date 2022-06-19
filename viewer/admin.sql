use mi4web;

CREATE TABLE user (
    email		    VARCHAR(256)		NOT NULL,
	fullname		VARCHAR(256)		NOT NULL,
	password	    VARCHAR(256)        NOT NULL,
    token         CHAR(10)            ,
	PRIMARY KEY(email)
);

CREATE TABLE admin (
    email		    VARCHAR(256)		NOT NULL,
	PRIMARY KEY(email),
    FOREIGN KEY(email) REFERENCES user(email) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE staff (
    email		   		 VARCHAR(256)			NOT NULL,
	professional_id 	VARCHAR(256)			NOT NULL,
    hospital	    	VARCHAR(256)	        NOT NULL,
	type_user		ENUM('Clinical Imaging Staff', 'Referring Clinical Staff')		NOT NULL,

	PRIMARY KEY(email),
    FOREIGN KEY(email) REFERENCES user(email)  ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE not_accepted (
    email		    	VARCHAR(256)		NOT NULL,
	fullname			VARCHAR(256)		NOT NULL,
	password	    	VARCHAR(256)        NOT NULL,
	professional_id 	VARCHAR(256)		NOT NULL,
    hospital	        VARCHAR(256)	    NOT NULL,
	type_user			ENUM('Clinical Imaging Staff', 'Referring Clinical Staff')		NOT NULL,

	PRIMARY KEY(email)
);

create table store_pdf (
    id_     int AUTO_INCREMENT NOT NULL,
    pdf_file text not null,
    study_id text,

    primary key (id_)
);

-- drop table store_pdf;
-- select * from store_pdf;

CREATE TABLE chart_info (
	day_ 			DATE	NOT NULL,
    count_studies	INT 	NOT NULL,

    PRIMARY KEY (day_)
);

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

INSERT INTO chart_info (day_, count_studies) VALUES
('2022-05-26', 5),
('2022-05-27', 6),
('2022-05-28', 7),
('2022-05-29', 5),
('2022-05-30', 7),
('2022-05-31', 9),
('2022-06-1', 8);

select * from chart_info;

-- INSERTS STAFF
INSERT INTO staff (email, professional_id, hospital, type_user) VALUES
('andrefreixo@gmail.com', '506984765', 'Hospital do Incesto', 'Clinical Imaging Staff'),
('pedrosobral@gmail.com', '012938477', 'Hospital da Luz', 'Clinical Imaging Staff'),
('filipefreixo@gmail.com', '012345678', 'Hospital da Incesto', 'Clinical Imaging Staff'),
('martafradiqs@gmail.com', '079685746', 'Hospital do Porto', 'Clinical Imaging Staff'),
('danifigueiredo@gmail.com', '110022993', 'Hospital Sao Joao', 'Clinical Imaging Staff'),
('evabart@gmail.com', '987645321', 'Hospital de Coimbra', 'Clinical Imaging Staff'),
('marianarosa@gmail.com', '998877665', 'Hospital de Ponta Delgada', 'Referring Clinical Staff'),
('carlosalbanio@gmail.com', '111111111', 'Hospital de Vila Real','Referring Clinical Staff'),
('bernardorodrigues@gmail.com', '002234444', 'Hospital de Câmara de Lobos','Referring Clinical Staff'),
('laurasilva@gmail.com', '888777654', 'Hospital do Porto','Referring Clinical Staff'),
('josetrancoso@gmail.com', '978675645', 'Hospital Sao Joao', 'Referring Clinical Staff'),
('luisvasques@gmail.com', '019283746', 'Hospital da Luz', 'Referring Clinical Staff');

-- INSERTS NOT_ACCEPTED
INSERT INTO not_accepted (email, fullname, password, professional_id, hospital,type_user) VALUES
('luisao@gmail.com', 'Luís Albedo', '7c5fbdaf56b64306126c9ecaf464f4589dd4cef34d31b28d8233667d6c281b695653872b509578a422ab141cbcfdba0111db811fd97314af304824180ab72ad2', '334221234', 'Hospital da Luz', 'Clinical Imaging Staff'),
('ricardoalmeida@gmail.com', 'Ricardo Almeida', '1b6174b04d6ffae0ca1dc05c3fc0f210b3e8838f13fc971ce3b91e8853c10e2f3757c12b37c1a125cd2a98fee262cc8912ad86862b160be65be36468f19e52dc', '777896540', 'Hospital do Porto', 'Clinical Imaging Staff'),
('inesfreixo@gmail.com', 'Inês Freixo', 'c27bce6521a53cdae49583cda071a2a9002d5b48dfff0b8131c2f8f68b29e5df3ebf229829dbd96f4c8f8f060ea0711fe90b5fb271683156c99aea5b7eda0be3', '012345678', 'Hospital da Luz', 'Referring Clinical Staff'),
('silva@gmail.com', 'Rita Silva', 'b414d6f5e9211bec1be1f535527c048327f5490dd9a9be7a60a45fb1a873563f1879028cae00206f2e6f447dbd458b11da63315a81304fa03ca0b02c59639050', '000000002', 'Hospital de Coimbra', 'Referring Clinical Staff'),
('jorge@gmail.com', 'Jorge Silva', '22d4f7ad66afcd91a881dad2d6d2738210c418448520851812ccf2e1ac8cdfe7d7458a9a3ca6728955d0f029cdc8215360b0f4f65c5ab28b8d3d0c7a3164b668', '000333450', 'Hospital de Coimbra', 'Clinical Imaging Staff'),
('verapomp@gmail.com', 'Vera Pomposo', 'db19fb5b845b5a1f53ff7395bdd818f8aa7d4a558a35143d97ac7be9f4267cffb59eafd9d69e21121b1bec4e249c1cb433d891fb0923c5b07b1fb9e7c0c53217', '897969594', 'Hospital do Porto', 'Referring Clinical Staff');

-- INSERTS USER
INSERT INTO user(email, fullname, password) VALUES
('andrefreixo@gmail.com', 'André Freixo', 'e4aefa469a6d17fcf54b0c23dcdc19ebf81603d1773f3a2a7d1b01c5edaa0ee084c89b3ca0804f2476bec4ebd8b27fa9dd1cdd09c710e2d12385b6cf36f4d6c0'),
('pedrosobral@gmail.com', 'Pedro Sobral', 'd3cf120f85001acd4d20c9e961c8ae6ad9b505ce028b4c13a9e2589c4fbb8a35e41c04b3ad55296e170adb694fc1e487eeff70ade39a00742f8543610428351f'),
('filipefreixo@gmail.com', 'Filipe Freixo', '037c6563b6e92611cba1ad86355f34a27221b7f7434fba418393783f260d0ee4a676d8ef224641a031d4a448b817dee86d6f73fac0ac93b3776f2eea43bd7407'),
('martafradiqs@gmail.com', 'Marta Fradique', '5ef052407cb885835e784e1c2e9c111214660edb70d2de06db2b8decb2365a7389d3bdf3869a2a9a518e4494ff0d3f6abe5c19ab8391fcc5b89a7e6c8a4985e9'),
('danifigueiredo@gmail.com', 'Daniel Figueiredo', '8328f0e5a279e56bcf00e09ce7f26aef7d41e55537f8f78a220b8f99b679665145124a547510d606cae6073336520d549b350f387c63c779f06208a8039274d2'),
('evabart@gmail.com', 'Eva Bartolomeu', '1388ce9d4eb57eba01b7d2b21df599ba210a595b699a1c84a5b5a7ed9600686c18524bc17e47d7edffdbc8b6d8d34d5c0549baf2e1501a9f8958dfd3d0ec07fc'),
('marianarosa@gmail.com', 'Mariana Rosa', '25a6ab2d9bae72cfecb090a5d31ca6f7245174b09fe13d38d1641e4605362ed6b3bec8a9c62b3b49d74327652ba36b92a8fb2c71dbd7aa43d571f6e5efeb7d42'),
('carlosalbanio@gmail.com', 'Carlos Albânio', '80edf715aed9693f56c689e1fb1a7b9798633deaab6d6d6b7ea41869432ceed066864dfa8a3de59f739674bd20f1d411e9bf9f242270ccb6b43f5b6df1fda721'),
('bernardorodrigues@gmail.com', 'Bernardo Rodrigues', '6a162cde7b08fa1e6031ec970d4436b85f028fc0b7163d7e28b17daba9cb5323eebbe1716c43e9d80e8e326687523635e3bbf4182077ae32a10116e18800539b'),
('laurasilva@gmail.com', 'Laura Silva', 'dff7604c10b4e0b9921e220b8e133d917997486eb7dea477098645dbced4f3eb6e06a5435240925d1ae796cf8db5a3d05cfd6e957813e8eedff446f4bc2a771d'),
('josetrancoso@gmail.com', 'José  Trancoso', '78df9eab81df7435cd560ce0d2f0f8adc3bcb30a78e374891b3e459b3f0207b1099f15f51d030be62906c0e0da5a47145376025316eea4618002559f8da1e599'),
('luisvasques@gmail.com', 'Luís Vasques', '2307d27bb2d8cdac51d9b5a5754118ae7b42d531c24b00f6dca090783e34f135f97d9615541e7fa147e4cef333091b6c7caa6975e63f02c5fd42cdcdefc2be25');

#UPDATE user SET token="2dsfs12e" WHERE email="andrefreixo@gmail.com";

#select * from user;
