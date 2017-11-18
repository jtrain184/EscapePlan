-- phpMyAdmin SQL Dump
-- version 4.6.6deb4
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 18, 2017 at 02:46 PM
-- Server version: 10.1.23-MariaDB-9+deb9u1
-- PHP Version: 7.0.19-1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydb`
--

-- --------------------------------------------------------

--
-- Table structure for table `Availability`
--

DROP TABLE IF EXISTS `Availability`;
CREATE TABLE `Availability` (
  `availability` tinyint(1) NOT NULL,
  `description` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `Availability`
--

INSERT INTO `Availability` (`availability`, `description`) VALUES
(1, 'Yes'),
(0, 'No');

-- --------------------------------------------------------

--
-- Table structure for table `caseFile`
--

DROP TABLE IF EXISTS `caseFile`;
CREATE TABLE `caseFile` (
  `id` int(11) NOT NULL,
  `vicID` int(11) DEFAULT NULL,
  `volID` int(11) DEFAULT NULL,
  `sID` int(11) DEFAULT NULL,
  `comments` varchar(255) DEFAULT NULL,
  `recommends` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `caseFile`
--

INSERT INTO `caseFile` (`id`, `vicID`, `volID`, `sID`, `comments`, `recommends`) VALUES
(13, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `shelter`
--

DROP TABLE IF EXISTS `shelter`;
CREATE TABLE `shelter` (
  `id` int(11) NOT NULL,
  `usr` varchar(20) NOT NULL,
  `pass` varchar(10) NOT NULL,
  `name` varchar(255) NOT NULL,
  `pnum` varchar(20) NOT NULL,
  `location_lat` float NOT NULL,
  `location_lon` float NOT NULL,
  `capacity` int(11) NOT NULL,
  `availability` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `shelter`
--

INSERT INTO `shelter` (`id`, `usr`, `pass`, `name`, `pnum`, `location_lat`, `location_lon`, `capacity`, `availability`) VALUES
(1, 'CamJam', 'buttface', 'Cam\'s Home for the victims of video game violence ', '1-800-SNES-CITY', 40.517, -80.2214, 4433, 1),
(3, 'bugsch', 'chris', 'Chris\'s Home for Awesome People', '15516156155', 123.02, 231, 10, 1);

-- --------------------------------------------------------

--
-- Table structure for table `victim`
--

DROP TABLE IF EXISTS `victim`;
CREATE TABLE `victim` (
  `id` int(11) NOT NULL,
  `fname` varchar(255) DEFAULT NULL,
  `lname` varchar(255) DEFAULT NULL,
  `pnum` varchar(20) DEFAULT NULL,
  `location_lat` float NOT NULL,
  `location_lon` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `victim`
--

INSERT INTO `victim` (`id`, `fname`, `lname`, `pnum`, `location_lat`, `location_lon`) VALUES
(7, NULL, NULL, NULL, 44.5638, -123.279),
(8, NULL, NULL, NULL, 44.5638, -123.279);

-- --------------------------------------------------------

--
-- Table structure for table `volunteer`
--

DROP TABLE IF EXISTS `volunteer`;
CREATE TABLE `volunteer` (
  `id` int(11) NOT NULL,
  `fname` varchar(255) NOT NULL,
  `lname` varchar(255) NOT NULL,
  `pnum` varchar(20) NOT NULL,
  `location_lat` float NOT NULL,
  `location_lon` float NOT NULL,
  `carMake` varchar(20) NOT NULL,
  `carModel` varchar(20) NOT NULL,
  `carColor` varchar(10) NOT NULL,
  `approvalRating` float DEFAULT NULL,
  `responseCount` int(11) DEFAULT NULL,
  `availability` tinyint(1) NOT NULL,
  `usr` varchar(20) NOT NULL,
  `pass` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `volunteer`
--

INSERT INTO `volunteer` (`id`, `fname`, `lname`, `pnum`, `location_lat`, `location_lon`, `carMake`, `carModel`, `carColor`, `approvalRating`, `responseCount`, `availability`, `usr`, `pass`) VALUES
(1, 'James', 'Buttface', '1-800-SAVE-YOU', 100, 100, 'Fiat', 'Multipla', 'Rainbow', 0.1, 1, 1, 'JamCam', 'buttface'),
(2, 'Chris', 'Wittich', '555-555-5555', 100, 1000, 'Honda', 'Civic', 'Blue', 1, 1, 1, 'wittichc', 'buttface');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `caseFile`
--
ALTER TABLE `caseFile`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vicID` (`vicID`),
  ADD KEY `volID` (`volID`),
  ADD KEY `sID` (`sID`);

--
-- Indexes for table `shelter`
--
ALTER TABLE `shelter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `victim`
--
ALTER TABLE `victim`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `volunteer`
--
ALTER TABLE `volunteer`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `caseFile`
--
ALTER TABLE `caseFile`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
--
-- AUTO_INCREMENT for table `shelter`
--
ALTER TABLE `shelter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `victim`
--
ALTER TABLE `victim`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `volunteer`
--
ALTER TABLE `volunteer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `caseFile`
--
ALTER TABLE `caseFile`
  ADD CONSTRAINT `caseFile_ibfk_1` FOREIGN KEY (`vicID`) REFERENCES `victim` (`id`),
  ADD CONSTRAINT `caseFile_ibfk_2` FOREIGN KEY (`volID`) REFERENCES `volunteer` (`id`),
  ADD CONSTRAINT `caseFile_ibfk_3` FOREIGN KEY (`sID`) REFERENCES `shelter` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
