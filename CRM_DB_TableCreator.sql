
-- Dropping tables if they exist
IF OBJECT_ID(N'dbo.ContactPersons', N'U') IS NOT NULL  
   DROP TABLE [dbo].ContactPersons;

IF OBJECT_ID(N'dbo.TradeNodes', N'U') IS NOT NULL  
   DROP TABLE [dbo].TradeNodes;

IF OBJECT_ID(N'dbo.Companies', N'U') IS NOT NULL  
   DROP TABLE [dbo].Companies;

IF OBJECT_ID(N'dbo.Industries', N'U') IS NOT NULL  
   DROP TABLE [dbo].Industries;

IF OBJECT_ID(N'dbo.Users', N'U') IS NOT NULL  
   DROP TABLE [dbo].Users;

IF OBJECT_ID(N'dbo.Roles', N'U') IS NOT NULL  
   DROP TABLE [dbo].Roles;


-- Creating tables
CREATE TABLE dbo.Roles
(
	id			INT			PRIMARY KEY,
	roleName	VARCHAR(32)	UNIQUE
);

CREATE TABLE dbo.Users
(
	id			INT				PRIMARY KEY	IDENTITY(1,1),
	name		VARCHAR(32)		NOT NULL,
	surname		VARCHAR(32)		NOT NULL,
	dateOfBirth	DATETIME		NOT NULL,
	login		VARCHAR(32)		NOT NULL	UNIQUE,
	password	VARCHAR(256)	NOT NULL,
	role		INT				NOT NULL,
	isDeleted	BIT				NOT NULL,
	CONSTRAINT FK_Users_Roles FOREIGN KEY(role) REFERENCES dbo.Roles(id)
);

CREATE TABLE dbo.Industries
(
	id				INT			PRIMARY KEY	IDENTITY(1,1),
	industryName	VARCHAR(32)	UNIQUE
);

CREATE TABLE dbo.Companies
(
	id					INT			PRIMARY KEY	IDENTITY(1,1),
	name				VARCHAR(32)	NOT NULL,
	nip					CHAR(10)	NOT NULL,
	industry			INT			NOT NULL,
	address				VARCHAR(32)	NOT NULL,
	localization		VARCHAR(32)	NOT NULL,
	addingCompanyUser	INT			NOT NULL,
	dateOfAdd			DATETIME	NOT NULL,
	isDeleted			BIT			NOT NULL,
	CONSTRAINT FK_Companies_Users FOREIGN KEY(addingCompanyUser) REFERENCES dbo.Users(id),
	CONSTRAINT FK_Companies_Industries FOREIGN KEY(industry) REFERENCES dbo.Industries(id)
);

CREATE TABLE dbo.TradeNodes
(
	id				INT				PRIMARY KEY	IDENTITY(1,1),
	noteContent		VARCHAR(512)	NOT NULL,
	isDeleted		BIT				NOT NULL,
	relatedCompany	INT				NOT NULL,
	addingNoteUser	INT				NOT NULL,
	CONSTRAINT FK_TradeNotes_Users FOREIGN KEY(addingNoteUser) REFERENCES dbo.Users(id),
	CONSTRAINT FK_TradeNotes_Companies FOREIGN KEY(relatedCompany) REFERENCES dbo.Companies(id)
);

CREATE TABLE dbo.ContactPersons
(
	id					INT			PRIMARY KEY	IDENTITY(1,1),
	name				VARCHAR(32)	NOT NULL,
	surname				VARCHAR(32)	NOT NULL,
	phoneNumber			CHAR(9)		NOT NULL,
	email				VARCHAR(32)	NOT NULL,
	jobTitle			VARCHAR(32)	NOT NULL,
	relatedCompany		INT			NOT NULL,
	addingPersonUser	INT			NOT NULL,
	isDeleted			BIT			NOT NULL,
	CONSTRAINT FK_ContactPersons_Users FOREIGN KEY(addingPersonUser) REFERENCES dbo.Users(id),
	CONSTRAINT FK_ContactPersons_Companies FOREIGN KEY(relatedCompany) REFERENCES dbo.Companies(id)
);


-- Creating indexes
CREATE INDEX IX_Companies_Industry
	ON dbo.Companies(industry);

CREATE INDEX IX_Companies_DateOfAdd
	ON dbo.Companies(dateOfAdd);

CREATE INDEX IX_ContactPersons_Surname
	ON dbo.ContactPersons(surname);


-- Filling tables
INSERT INTO dbo.Roles VALUES
(1, 'user'),
(2, 'admin'),
(3, 'moderator');

SELECT *
FROM dbo.Roles;