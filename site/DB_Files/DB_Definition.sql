/*
Victim table will hold victim's info
Id will be auto assigned every time a victim uses the app
First name, last name and phone number are all optional
Location latitude and longitude will be retrieved from a google api
 */
CREATE TABLE `victim` (
  `id` INT AUTO_INCREMENT,
  `fname` VARCHAR(25),
  `lname` VARCHAR(25),
  `pnum`  VARCHAR(13),
  `location_lat` FLOAT NOT NULL,
  `location_lon` FLOAT NOT NULL,
  PRIMARY KEY (`id`)
)ENGINE = InnoDB;

/*
Volunteer table to hold info on the volunteers
Id will be auto assigned for each volunteer
availability is a tiny int(mysql doesn't use bools) where 0 = not available
approval rating is the average of victim recommendations
response count keeps track of how many times that volunteer has responded
 */
CREATE TABLE `volunteer` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `fname` VARCHAR(25) NOT NULL,
  `lname` VARCHAR(25) NOT NULL,
  `pnum`  VARCHAR(13) NOT NULL,
  `location_lat` FLOAT NOT NULL,
  `location_lon` FLOAT NOT NULL,
  `availability` TINYINT(1),
  `carMake` VARCHAR(20) NOT NULL,
  `carModel` VARCHAR(20) NOT NULL,
  `carColor` VARCHAR(10) NOT NULL,
  `approvalRating` FLOAT,
  `responseCount` INT,
  PRIMARY KEY (`id`)
)ENGINE = InnoDB;

/*
Name is only the name of the shelter
usr and pass are used to log into the shelter interface
 */
CREATE TABLE `shelter` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `pnum`  VARCHAR(20) NOT NULL,
  `location_lat` FLOAT NOT NULL,
  `location_lon` FLOAT NOT NULL,
  `capacity` INT NOT NULL,
  `availability` TINYINT(1) NOT NULL,
  `usr` VARCHAR(20) NOT NULL,
  `pass` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`)
)ENGINE = InnoDB;

/*
every time the escape system is used, a case will be created
It will hold the victim, volunteer, and shelter IDs involved
as well as any comments the victim has and whether or not the victim
would recommend the volunteer for more cases
 */
CREATE TABLE `caseFile` (
  `id` INT AUTO_INCREMENT NOT NULL,
  `vicID` INT NOT NULL,
  `volID` INT NOT NULL,
  `sID` INT NOT NULL,
  `comments` VARCHAR(255),
  `recommends` TINYINT(1),
  PRIMARY KEY (`id`),
  FOREIGN KEY (`vicID`) REFERENCES `victim` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`volID`) REFERENCES `volunteer` (`id`) ON DELETE SET NULL,
  FOREIGN KEY (`sID`) REFERENCES `shelter` (`id`) ON DELETE SET NULL
)ENGINE = InnoDB;

/*
table used to associated the bool value of availability with a string description
eg. 1 = "Yes", 0 = "No"
 */
CREATE TABLE `Availability` (
  `availability` TINYINT(1) NOT NULL,
  `description` VARCHAR(3) NOT NULL,
  PRIMARY KEY (`availability`),
  FOREIGN KEY (`availability`) REFERENCES `shelter` (`availability`)
) ENGINE = InnoDB;









