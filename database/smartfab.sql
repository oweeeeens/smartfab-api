-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: smartfab
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `smartfab`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `smartfab` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `smartfab`;

--
-- Table structure for table `machine`
--

DROP TABLE IF EXISTS `machine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `machine` (
  `MachineID` int(11) NOT NULL AUTO_INCREMENT,
  `LineID` int(11) NOT NULL,
  `MachineName` varchar(50) NOT NULL,
  `Model` varchar(50) DEFAULT NULL,
  `SerialNumber` varchar(50) NOT NULL,
  `Status` varchar(20) NOT NULL DEFAULT 'Running',
  `InstallationDate` date DEFAULT NULL,
  PRIMARY KEY (`MachineID`),
  UNIQUE KEY `IDX_c4987bc28123b922b2a3d4df8a` (`SerialNumber`),
  KEY `FK_b11af084244a86ed7f1d0a10bf3` (`LineID`),
  CONSTRAINT `FK_b11af084244a86ed7f1d0a10bf3` FOREIGN KEY (`LineID`) REFERENCES `productionline` (`LineID`) ON UPDATE NO ACTION,
  CONSTRAINT `CHK_Machine_Status` CHECK (`Status` in ('Running','Idle','Down','Under Maintenance'))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `machine`
--

LOCK TABLES `machine` WRITE;
/*!40000 ALTER TABLE `machine` DISABLE KEYS */;
INSERT INTO `machine` VALUES (1,2,'CNC Lathe 1','HL-200','SN-88231','Running','2024-03-10'),(2,2,'Press 3','HP-50','SN-77120','Idle','2023-11-02'),(3,1,'Conveyor 1','CV-10','SN-55001','Running','2022-06-15');
/*!40000 ALTER TABLE `machine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenancerequest`
--

DROP TABLE IF EXISTS `maintenancerequest`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maintenancerequest` (
  `RequestID` int(11) NOT NULL AUTO_INCREMENT,
  `MachineID` int(11) NOT NULL,
  `ReportedBy` int(11) NOT NULL,
  `AssignedTo` int(11) DEFAULT NULL,
  `IssueDescription` text NOT NULL,
  `Priority` varchar(10) NOT NULL,
  `Status` varchar(20) NOT NULL DEFAULT 'Pending',
  `DateReported` datetime NOT NULL DEFAULT current_timestamp(),
  `DateCompleted` datetime DEFAULT NULL,
  PRIMARY KEY (`RequestID`),
  KEY `FK_cc888930c8475753e27ba0b2ed1` (`MachineID`),
  KEY `FK_20b69d2ac65036474d984180c30` (`ReportedBy`),
  KEY `FK_aa7663558f1ab2ce28beebef4de` (`AssignedTo`),
  CONSTRAINT `FK_20b69d2ac65036474d984180c30` FOREIGN KEY (`ReportedBy`) REFERENCES `user` (`UserID`) ON UPDATE NO ACTION,
  CONSTRAINT `FK_aa7663558f1ab2ce28beebef4de` FOREIGN KEY (`AssignedTo`) REFERENCES `user` (`UserID`) ON DELETE SET NULL ON UPDATE NO ACTION,
  CONSTRAINT `FK_cc888930c8475753e27ba0b2ed1` FOREIGN KEY (`MachineID`) REFERENCES `machine` (`MachineID`) ON UPDATE NO ACTION,
  CONSTRAINT `CHK_MaintenanceRequest_Status` CHECK (`Status` in ('Pending','In Progress','Completed','Cancelled')),
  CONSTRAINT `CHK_MaintenanceRequest_Priority` CHECK (`Priority` in ('Low','Medium','High','Critical'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenancerequest`
--

LOCK TABLES `maintenancerequest` WRITE;
/*!40000 ALTER TABLE `maintenancerequest` DISABLE KEYS */;
/*!40000 ALTER TABLE `maintenancerequest` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `maintenanceschedule`
--

DROP TABLE IF EXISTS `maintenanceschedule`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `maintenanceschedule` (
  `ScheduleID` int(11) NOT NULL AUTO_INCREMENT,
  `MachineID` int(11) NOT NULL,
  `TaskDescription` varchar(255) NOT NULL,
  `FrequencyDays` int(11) NOT NULL,
  `LastPerformed` date DEFAULT NULL,
  `NextDueDate` date NOT NULL,
  PRIMARY KEY (`ScheduleID`),
  KEY `FK_3785d0ca2dd98581334182f61d7` (`MachineID`),
  CONSTRAINT `FK_3785d0ca2dd98581334182f61d7` FOREIGN KEY (`MachineID`) REFERENCES `machine` (`MachineID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `CHK_MaintenanceSchedule_Frequency` CHECK (`FrequencyDays` > 0)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `maintenanceschedule`
--

LOCK TABLES `maintenanceschedule` WRITE;
/*!40000 ALTER TABLE `maintenanceschedule` DISABLE KEYS */;
INSERT INTO `maintenanceschedule` VALUES (1,1,'Lubricate spindle and gears',30,'2026-10-25','2026-11-24'),(2,2,'Inspect hydraulic hoses',90,NULL,'2026-12-15');
/*!40000 ALTER TABLE `maintenanceschedule` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partusage`
--

DROP TABLE IF EXISTS `partusage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partusage` (
  `UsageID` int(11) NOT NULL AUTO_INCREMENT,
  `RequestID` int(11) NOT NULL,
  `PartID` int(11) NOT NULL,
  `QuantityUsed` int(11) NOT NULL,
  `DateUsed` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`UsageID`),
  KEY `FK_4e42b4bfb6930fb316aa0c5f8bf` (`RequestID`),
  KEY `FK_7b6a3e2b5ffcdfffc5a9632cf54` (`PartID`),
  CONSTRAINT `FK_4e42b4bfb6930fb316aa0c5f8bf` FOREIGN KEY (`RequestID`) REFERENCES `maintenancerequest` (`RequestID`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `FK_7b6a3e2b5ffcdfffc5a9632cf54` FOREIGN KEY (`PartID`) REFERENCES `sparepart` (`PartID`) ON UPDATE NO ACTION,
  CONSTRAINT `CHK_PartUsage_Quantity` CHECK (`QuantityUsed` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partusage`
--

LOCK TABLES `partusage` WRITE;
/*!40000 ALTER TABLE `partusage` DISABLE KEYS */;
/*!40000 ALTER TABLE `partusage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productionline`
--

DROP TABLE IF EXISTS `productionline`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productionline` (
  `LineID` int(11) NOT NULL AUTO_INCREMENT,
  `LineName` varchar(50) NOT NULL,
  `Location` varchar(100) NOT NULL,
  `SupervisorID` int(11) NOT NULL,
  PRIMARY KEY (`LineID`),
  UNIQUE KEY `IDX_842f827beb41a826b70fc95035` (`LineName`),
  KEY `FK_3dab7ef455b9dc1b9eeb52cc93a` (`SupervisorID`),
  CONSTRAINT `FK_3dab7ef455b9dc1b9eeb52cc93a` FOREIGN KEY (`SupervisorID`) REFERENCES `user` (`UserID`) ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productionline`
--

LOCK TABLES `productionline` WRITE;
/*!40000 ALTER TABLE `productionline` DISABLE KEYS */;
INSERT INTO `productionline` VALUES (1,'Assembly Line A','Building 1',2),(2,'Machining Line B','Building 2',2);
/*!40000 ALTER TABLE `productionline` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `productionlog`
--

DROP TABLE IF EXISTS `productionlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `productionlog` (
  `LogID` int(11) NOT NULL AUTO_INCREMENT,
  `MachineID` int(11) NOT NULL,
  `OperatorID` int(11) NOT NULL,
  `ShiftDate` date NOT NULL,
  `Shift` varchar(10) NOT NULL,
  `UnitsProduced` int(11) NOT NULL DEFAULT 0,
  `UnitsDefective` int(11) NOT NULL DEFAULT 0,
  `DowntimeMinutes` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`LogID`),
  KEY `FK_95ad032e985b12e66b8976adc03` (`MachineID`),
  KEY `FK_28e921cfdc52519bb670f07fdfd` (`OperatorID`),
  CONSTRAINT `FK_28e921cfdc52519bb670f07fdfd` FOREIGN KEY (`OperatorID`) REFERENCES `user` (`UserID`) ON UPDATE NO ACTION,
  CONSTRAINT `FK_95ad032e985b12e66b8976adc03` FOREIGN KEY (`MachineID`) REFERENCES `machine` (`MachineID`) ON UPDATE NO ACTION,
  CONSTRAINT `CHK_ProductionLog_Downtime` CHECK (`DowntimeMinutes` >= 0),
  CONSTRAINT `CHK_ProductionLog_UnitsDefective` CHECK (`UnitsDefective` >= 0),
  CONSTRAINT `CHK_ProductionLog_UnitsProduced` CHECK (`UnitsProduced` >= 0),
  CONSTRAINT `CHK_ProductionLog_Shift` CHECK (`Shift` in ('Morning','Afternoon','Night'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `productionlog`
--

LOCK TABLES `productionlog` WRITE;
/*!40000 ALTER TABLE `productionlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `productionlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sparepart`
--

DROP TABLE IF EXISTS `sparepart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sparepart` (
  `PartID` int(11) NOT NULL AUTO_INCREMENT,
  `PartName` varchar(100) NOT NULL,
  `PartNumber` varchar(50) NOT NULL,
  `QuantityOnHand` int(11) NOT NULL DEFAULT 0,
  `ReorderLevel` int(11) NOT NULL DEFAULT 0,
  `UnitCost` decimal(10,2) NOT NULL,
  PRIMARY KEY (`PartID`),
  UNIQUE KEY `IDX_cf9c190ff16a4d291ee51403fe` (`PartNumber`),
  CONSTRAINT `CHK_SparePart_UnitCost` CHECK (`UnitCost` >= 0),
  CONSTRAINT `CHK_SparePart_Reorder` CHECK (`ReorderLevel` >= 0),
  CONSTRAINT `CHK_SparePart_Quantity` CHECK (`QuantityOnHand` >= 0)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sparepart`
--

LOCK TABLES `sparepart` WRITE;
/*!40000 ALTER TABLE `sparepart` DISABLE KEYS */;
INSERT INTO `sparepart` VALUES (1,'Spindle Bearing','BRG-6205',12,5,850.00),(2,'Drive Belt','BLT-A42',3,4,420.50),(3,'Hydraulic Hose','HYD-H12',8,2,1200.00);
/*!40000 ALTER TABLE `sparepart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `Role` varchar(20) NOT NULL,
  `ContactNumber` varchar(15) DEFAULT NULL,
  `DateCreated` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`UserID`),
  UNIQUE KEY `IDX_b7eee57d84fb7ed872e660197f` (`Email`),
  CONSTRAINT `CHK_User_Role` CHECK (`Role` in ('Operator','Technician','Supervisor','Manager','Admin'))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'System','Admin','admin@smartfab.com','$2b$10$lS1ZFNPrkgXPLBshfTU2J.A8ENzJm5HRHMd9fguBdRAL8/vzGEwPK','Admin',NULL,'2026-11-24 10:58:38'),(2,'Maria','Santos','supervisor@smartfab.com','$2b$10$lS1ZFNPrkgXPLBshfTU2J.A8ENzJm5HRHMd9fguBdRAL8/vzGEwPK','Supervisor','09170000001','2026-11-24 10:58:38'),(3,'Juan','Dela Cruz','operator@smartfab.com','$2b$10$lS1ZFNPrkgXPLBshfTU2J.A8ENzJm5HRHMd9fguBdRAL8/vzGEwPK','Operator','09170000002','2026-11-24 10:58:38'),(4,'Ana','Reyes','technician@smartfab.com','$2b$10$lS1ZFNPrkgXPLBshfTU2J.A8ENzJm5HRHMd9fguBdRAL8/vzGEwPK','Technician','09170000003','2026-11-24 10:58:38'),(5,'Carlo','Mendoza','manager@smartfab.com','$2b$10$lS1ZFNPrkgXPLBshfTU2J.A8ENzJm5HRHMd9fguBdRAL8/vzGEwPK','Manager',NULL,'2026-11-24 10:58:38');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
