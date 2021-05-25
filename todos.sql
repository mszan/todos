-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: localhost    Database: todos
-- ------------------------------------------------------
-- Server version	8.0.22

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tasks` (
  `title` varchar(100) NOT NULL,
  `description` varchar(300) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `priority` int NOT NULL DEFAULT '1',
  `addDate` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `dueDate` timestamp NULL DEFAULT NULL,
  `completeDate` timestamp NULL DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `users__id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `tasks_users_id_fk` (`users__id`),
  CONSTRAINT `tasks_users_id_fk` FOREIGN KEY (`users__id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=384 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(30) DEFAULT NULL,
  `password` varchar(300) DEFAULT NULL,
  `firstname` varchar(30) DEFAULT NULL,
  `lastname` varchar(30) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `registerDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `usersRoles__id` int DEFAULT '2',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `users_usersRoles_id_fk` (`usersRoles__id`),
  CONSTRAINT `users_usersRoles_id_fk` FOREIGN KEY (`usersRoles__id`) REFERENCES `usersRoles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersRefreshTokens`
--

DROP TABLE IF EXISTS `usersRefreshTokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersRefreshTokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `refreshToken` varchar(300) DEFAULT NULL,
  `lastUpdated` datetime NOT NULL,
  `users__id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usersRefreshTokens_users_id_fk` (`users__id`),
  CONSTRAINT `usersRefreshTokens_users_id_fk` FOREIGN KEY (`users__id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersRefreshTokens`
--

LOCK TABLES `usersRefreshTokens` WRITE;
/*!40000 ALTER TABLE `usersRefreshTokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `usersRefreshTokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usersRoles`
--

DROP TABLE IF EXISTS `usersRoles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usersRoles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) NOT NULL,
  `addUsers` tinyint(1) NOT NULL DEFAULT '0',
  `updateAllUsers` tinyint(1) NOT NULL DEFAULT '0',
  `deleteAllUsers` tinyint(1) NOT NULL DEFAULT '0',
  `addTasks` tinyint(1) NOT NULL DEFAULT '0',
  `modifyAllTasks` tinyint(1) NOT NULL DEFAULT '0',
  `modifyTasks` tinyint(1) NOT NULL DEFAULT '0',
  `deleteTasks` tinyint(1) DEFAULT '0',
  `getTasks` tinyint(1) NOT NULL DEFAULT '0',
  `getAllTasks` tinyint(1) NOT NULL DEFAULT '0',
  `getAllUsers` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usersRoles`
--

LOCK TABLES `usersRoles` WRITE;
/*!40000 ALTER TABLE `usersRoles` DISABLE KEYS */;
INSERT INTO `usersRoles` VALUES (1,'admin','Global administrator.',1,1,1,1,1,1,0,1,1,1),(2,'default','Default.',0,0,0,1,0,1,1,1,0,0),(3,'loser','No privileges.',0,0,0,0,0,0,0,0,0,0);
/*!40000 ALTER TABLE `usersRoles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-07 23:15:15
