USE CRM_DB;

-- Dropping tables if they exist
IF OBJECT_ID(N'dbo.ContactPersons', N'U') IS NOT NULL  
   DROP TABLE [dbo].ContactPersons;

IF OBJECT_ID(N'dbo.TradeNotes', N'U') IS NOT NULL  
   DROP TABLE [dbo].TradeNotes;

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
	id			INT			PRIMARY KEY	IDENTITY(1,1),
	roleName	VARCHAR(32)	UNIQUE		NOT NULL
);

CREATE TABLE dbo.Users
(
	id			INT				PRIMARY KEY	IDENTITY(1,1),
	name		VARCHAR(32)		NOT NULL,
	surname		VARCHAR(32)		NOT NULL,
	dateOfBirth	DATETIME		NOT NULL,
	login		VARCHAR(32)		NOT NULL	UNIQUE,
	password	VARCHAR(256)	NOT NULL,
	role		INT				NOT NULL	DEFAULT 1,
	isDeleted	BIT				NOT NULL	DEFAULT 0,
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

CREATE TABLE dbo.TradeNotes
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
INSERT INTO [CRM_DB].[dbo].[Roles] VALUES
('user'),
('admin'),
('moderator');

INSERT INTO [CRM_DB].[dbo].[Users] VALUES
('Mikolaj', 'Koffnyt', '2000-05-06', 'qwertyuiop', 'asdfghjkl', 2, 0),
('Jan', 'Kowalski', '2001-02-12', 'qazwsx', 'edcrfv', 1, 0),
('Krzysztof', 'Nowak', '1998-10-03', 'rfvtgb', 'ujmikl', 1, 1)


-- Selecting tables
SELECT *
FROM dbo.Roles;

SELECT *
FROM dbo.Users;

SELECT *
FROM dbo.Companies;

SELECT *
FROM dbo.ContactPersons;

SELECT *
FROM dbo.Industries;

SELECT *
FROM dbo.TradeNotes;