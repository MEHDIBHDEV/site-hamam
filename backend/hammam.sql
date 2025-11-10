-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : mar. 04 nov. 2025 à 19:46
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `hammam`
--

-- --------------------------------------------------------

--
-- Structure de la table `log_events`
--

DROP TABLE IF EXISTS `log_events`;
CREATE TABLE IF NOT EXISTS `log_events` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `ts` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `level` enum('info','warn','error','security') NOT NULL,
  `name` varchar(100) NOT NULL,
  `page` varchar(255) DEFAULT NULL,
  `session_id` varchar(64) DEFAULT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL,
  `payload` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_logs_ts` (`ts`),
  KEY `idx_logs_level` (`level`),
  KEY `idx_logs_name` (`name`),
  KEY `fk_logs_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `log_events`
--

INSERT INTO `log_events` (`id`, `ts`, `level`, `name`, `page`, `session_id`, `user_id`, `payload`, `created_at`) VALUES
(1, '2025-11-04 17:24:10', 'info', 'reservation_confirmed', '/confirmation', 'session-demo', 1, '{\"amount\": 11000, \"people\": 2, \"service\": \"hammam-royal\"}', '2025-11-04 17:24:10');

-- --------------------------------------------------------

--
-- Structure de la table `reservations`
--

DROP TABLE IF EXISTS `reservations`;
CREATE TABLE IF NOT EXISTS `reservations` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `service_id` bigint UNSIGNED NOT NULL,
  `start_at` datetime NOT NULL,
  `people` tinyint UNSIGNED NOT NULL DEFAULT '1',
  `status` enum('pending','confirmed','canceled') NOT NULL DEFAULT 'pending',
  `total_cents` int UNSIGNED NOT NULL,
  `note` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reservation_slot` (`service_id`,`start_at`),
  KEY `idx_res_user` (`user_id`),
  KEY `idx_res_status` (`status`),
  KEY `idx_res_start` (`start_at`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `reservations`
--

INSERT INTO `reservations` (`id`, `user_id`, `service_id`, `start_at`, `people`, `status`, `total_cents`, `note`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-11-06 17:24:10', 2, 'confirmed', 11000, 'Anniversaire', '2025-11-04 17:24:10', '2025-11-04 17:24:10');

-- --------------------------------------------------------

--
-- Structure de la table `services`
--

DROP TABLE IF EXISTS `services`;
CREATE TABLE IF NOT EXISTS `services` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` varchar(150) NOT NULL,
  `title` varchar(150) NOT NULL,
  `description` text,
  `duration_min` smallint UNSIGNED NOT NULL,
  `price_cents` int UNSIGNED NOT NULL,
  `is_signature` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_services_slug` (`slug`),
  KEY `idx_services_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `services`
--

INSERT INTO `services` (`id`, `slug`, `title`, `description`, `duration_min`, `price_cents`, `is_signature`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'hammam-royal', 'Hammam Royal', 'Rituel traditionnel vapeur et repos.', 60, 5500, 1, 1, '2025-11-04 17:24:08', '2025-11-04 17:24:08'),
(2, 'gommage-savon-noir', 'Gommage au Savon Noir', 'Gommage kessa & savon noir.', 45, 4500, 0, 1, '2025-11-04 17:24:08', '2025-11-04 17:24:08'),
(3, 'massage-oriental', 'Massage Oriental', 'Massage relaxant aux huiles.', 60, 6500, 0, 1, '2025-11-04 17:24:08', '2025-11-04 17:24:08'),
(4, 'pack-detente', 'Pack Détente', 'Hammam + Massage (90 min).', 90, 9900, 0, 1, '2025-11-04 17:24:08', '2025-11-04 17:24:08');

-- --------------------------------------------------------

--
-- Structure de la table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint UNSIGNED NOT NULL,
  `token` char(64) NOT NULL,
  `user_agent` varchar(255) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `expires_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sessions_token` (`token`),
  KEY `idx_sessions_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(120) NOT NULL,
  `email` varchar(190) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `created_at`, `updated_at`) VALUES
(1, 'Client Test', 'client@example.com', '$2b$12$abcdefghijklmnopqrstuvwxyzABCDE12345', '2025-11-04 17:24:09', '2025-11-04 17:24:09');

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `log_events`
--
ALTER TABLE `log_events`
  ADD CONSTRAINT `fk_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `reservations`
--
ALTER TABLE `reservations`
  ADD CONSTRAINT `fk_res_service` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `fk_res_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Contraintes pour la table `sessions`
--
ALTER TABLE `sessions`
  ADD CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

