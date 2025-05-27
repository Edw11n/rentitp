-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para rentitpdb
CREATE DATABASE IF NOT EXISTS `rentitpdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `rentitpdb`;

-- Volcando estructura para tabla rentitpdb.apartments
CREATE TABLE IF NOT EXISTS `apartments` (
  `id_apt` int NOT NULL AUTO_INCREMENT,
  `id_barrio` int NOT NULL,
  `direccion_apt` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `latitud_apt` decimal(9,6) DEFAULT NULL,
  `longitud_apt` decimal(9,6) DEFAULT NULL,
  `info_add_apt` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id_apt`),
  KEY `FK_apartments_barrio` (`id_barrio`),
  KEY `fk_user` (`user_id`),
  CONSTRAINT `FK_apartments_barrio` FOREIGN KEY (`id_barrio`) REFERENCES `barrio` (`id_barrio`) ON DELETE CASCADE,
  CONSTRAINT `fk_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla rentitpdb.apartment_images
CREATE TABLE IF NOT EXISTS `apartment_images` (
  `id_img` int NOT NULL AUTO_INCREMENT,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `iv` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `id_apt` int NOT NULL,
  PRIMARY KEY (`id_img`),
  KEY `FK_apartment_images_apartments` (`id_apt`),
  CONSTRAINT `FK_apartment_images_apartments` FOREIGN KEY (`id_apt`) REFERENCES `apartments` (`id_apt`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla rentitpdb.barrio
CREATE TABLE IF NOT EXISTS `barrio` (
  `id_barrio` int NOT NULL AUTO_INCREMENT,
  `barrio` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_barrio`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla rentitpdb.rol
CREATE TABLE IF NOT EXISTS `rol` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `rol` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla rentitpdb.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_lastname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_phonenumber` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_google_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email` (`user_email`),
  UNIQUE KEY `user_email_2` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla rentitpdb.user_apartment
CREATE TABLE IF NOT EXISTS `user_apartment` (
  `id_user_apt` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_apt` int NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id_user_apt`),
  KEY `FK_user_apartment_user` (`id_user`),
  KEY `FK_user_apartment_apartments` (`id_apt`),
  CONSTRAINT `FK_user_apartment_apartments` FOREIGN KEY (`id_apt`) REFERENCES `apartments` (`id_apt`) ON DELETE CASCADE,
  CONSTRAINT `FK_user_apartment_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- La exportación de datos fue deseleccionada.

-- Volcando estructura para tabla rentitpdb.user_rol
CREATE TABLE IF NOT EXISTS `user_rol` (
  `id_user_rol` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `rol_id` int NOT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`id_user_rol`),
  KEY `FK_user_rol_users` (`user_id`) USING BTREE,
  KEY `FK_user_rol_rol` (`rol_id`) USING BTREE,
  CONSTRAINT `FK_rol_rol_user` FOREIGN KEY (`rol_id`) REFERENCES `rol` (`rol_id`) ON DELETE CASCADE,
  CONSTRAINT `FK_user_rol_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `rol` (`rol_id`, `rol`) VALUES
(1, 'usuario'),
(2, 'arrendador'),
(3, 'admin');

-- La exportación de datos fue deseleccionada.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
