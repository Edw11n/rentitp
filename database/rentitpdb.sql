-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.30 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.1.0.6537
-- --------------------------------------------------------

-- Configuración de caracteres y variables de sesión
SET @OLD_CHARACTER_SET_CLIENT = @@CHARACTER_SET_CLIENT;
SET @OLD_CHARACTER_SET_RESULTS = @@CHARACTER_SET_RESULTS;
SET @OLD_COLLATION_CONNECTION = @@COLLATION_CONNECTION;
SET @OLD_TIME_ZONE = @@TIME_ZONE;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET @OLD_SQL_MODE = @@SQL_MODE;
SET @OLD_SQL_NOTES = @@SQL_NOTES;

-- Establecer nuevos valores
SET NAMES utf8mb4;
SET character_set_client = utf8mb4;
SET character_set_results = utf8mb4;
SET character_set_connection = utf8mb4;
SET collation_connection = utf8mb4_unicode_ci;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';
SET sql_notes = 0;

-- Volcando estructura de base de datos para rentitpdb
CREATE DATABASE IF NOT EXISTS `rentitpdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `rentitpdb`;

-- Volcando estructura para tabla rentitpdb.rol
DROP TABLE IF EXISTS `user_rol`;
DROP TABLE IF EXISTS `user_apartment`;
DROP TABLE IF EXISTS `apartment_images`;
DROP TABLE IF EXISTS `apartments`;
DROP TABLE IF EXISTS `barrio`;
DROP TABLE IF EXISTS `mensajes`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `rol`;

CREATE TABLE IF NOT EXISTS `rol` (
  `rol_id` int NOT NULL AUTO_INCREMENT,
  `rol` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`rol_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- Volcando estructura para tabla rentitpdb.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_lastname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user_phonenumber` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_password` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_google_id` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `user_email` (`user_email`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- Volcando estructura para tabla rentitpdb.barrio
CREATE TABLE IF NOT EXISTS `barrio` (
  `id_barrio` int NOT NULL AUTO_INCREMENT,
  `barrio` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id_barrio`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- Volcando estructura para tabla rentitpdb.apartment_images
CREATE TABLE IF NOT EXISTS `apartment_images` (
  `id_img` int NOT NULL AUTO_INCREMENT,
  `imagen` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `iv` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `id_apt` int NOT NULL,
  PRIMARY KEY (`id_img`),
  KEY `FK_apartment_images_apartments` (`id_apt`),
  CONSTRAINT `FK_apartment_images_apartments` FOREIGN KEY (`id_apt`) REFERENCES `apartments` (`id_apt`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=96 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- Volcando estructura para tabla rentitpdb.user_rol
DROP TABLE IF EXISTS `user_rol`;
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- Volcando estructura para tabla rentitpdb.mensajes
DROP TABLE IF EXISTS `mensajes`;
CREATE TABLE IF NOT EXISTS `mensajes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `emisor_id` int NOT NULL,
  `receptor_id` int NOT NULL,
  `contenido` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `fecha_envio` datetime DEFAULT CURRENT_TIMESTAMP,
  `leido` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_cliente_mensajes` (`emisor_id`),
  KEY `FK_mensaje_receptor` (`receptor_id`),
  CONSTRAINT `FK_cliente_mensajes` FOREIGN KEY (`emisor_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FK_mensaje_receptor` FOREIGN KEY (`receptor_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insertando datos iniciales
INSERT IGNORE INTO `rol` (`rol_id`, `rol`) VALUES
(1, 'usuario'),
(2, 'arrendador'),
(3, 'admin');

-- Restaurar valores originales de manera segura
SET character_set_client = COALESCE(@OLD_CHARACTER_SET_CLIENT, 'utf8mb4');
SET character_set_results = COALESCE(@OLD_CHARACTER_SET_RESULTS, 'utf8mb4');
SET collation_connection = COALESCE(@OLD_COLLATION_CONNECTION, 'utf8mb4_unicode_ci');
SET time_zone = COALESCE(@OLD_TIME_ZONE, 'system');
SET foreign_key_checks = COALESCE(@OLD_FOREIGN_KEY_CHECKS, 1);
SET sql_mode = COALESCE(@OLD_SQL_MODE, '');
SET sql_notes = COALESCE(@OLD_SQL_NOTES, 1);