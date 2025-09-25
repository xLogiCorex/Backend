-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2025. Sze 25. 22:02
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `project`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `categories`
--

INSERT INTO `categories` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Beviteli perifériák', '2025-07-05 23:26:10', '2025-07-05 23:26:10'),
(3, 'Monitor', '2025-07-05 23:42:00', '2025-07-05 23:42:00'),
(4, 'Számítógépház', '2025-07-05 23:42:31', '2025-07-05 23:42:31'),
(5, 'Nyomtató', '2025-07-05 23:43:00', '2025-07-05 23:43:00'),
(6, 'Alaplap', '2025-07-05 23:43:08', '2025-07-05 23:43:08'),
(7, 'Processzor', '2025-07-05 23:44:56', '2025-07-05 23:44:56'),
(8, 'Memória', '2025-07-05 23:46:11', '2025-07-05 23:46:11'),
(9, 'Merevlemez', '2025-07-05 23:48:01', '2025-07-05 23:48:01'),
(10, 'SSD', '2025-07-05 23:48:20', '2025-07-05 23:48:20'),
(11, 'Videókártya', '2025-07-05 23:48:40', '2025-07-05 23:48:40'),
(12, 'Hűtés', '2025-07-05 23:51:03', '2025-07-05 23:51:03'),
(13, 'RC járművek', '2025-07-13 19:36:25', '2025-07-13 19:36:25');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `invoices`
--

CREATE TABLE `invoices` (
  `id` int(11) NOT NULL,
  `invoiceNumber` varchar(255) NOT NULL,
  `orderId` int(11) NOT NULL,
  `partnerId` int(11) NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `totalNet` decimal(10,2) NOT NULL,
  `totalVAT` decimal(10,2) NOT NULL,
  `totalGross` decimal(10,2) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `issueDate` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `invoices`
--

INSERT INTO `invoices` (`id`, `invoiceNumber`, `orderId`, `partnerId`, `userId`, `items`, `totalNet`, `totalVAT`, `totalGross`, `note`, `createdAt`, `updatedAt`, `issueDate`) VALUES
(1, 'SZ-2025-00001', 2, 2, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":8,\"productName\":\"Logitech K235 vezeték nélküli billentyűzet\",\"quantity\":3,\"unitPrice\":8500,\"total\":25500}]', 25500.00, 6885.00, 32385.00, 'Számla a ORD-2025-00002 rendeléshez', '2025-09-21 20:01:59', '2025-09-21 20:01:59', '2025-09-21 20:01:59'),
(2, 'SZ-2025-00002', 1, 1, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":1,\"productName\":\"Genius NX-7005 Black\",\"quantity\":10,\"unitPrice\":5000,\"total\":50000},{\"productId\":5,\"productName\":\"Philips 24M2N3201A/00 EVNIA Gaming monitor, 23,8\\\", IPS, FHD, 180 Hz, 1ms, 0,5 ms, HDR10, FlickerFree, Hangszórók 2W x 2, HA, Pivot, HDMI, DisplayPort, fehér\",\"quantity\":1,\"unitPrice\":60000,\"total\":60000}]', 110000.00, 29700.00, 139700.00, 'Számla a ORD-2025-00001 rendeléshez', '2025-09-22 08:36:35', '2025-09-22 08:36:35', '2025-09-22 08:36:35'),
(3, 'SZ-2025-00003', 3, 3, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":3,\"productName\":\"A4TECH X77 OSCAR NEON - VEZETÉKES GAMER EGÉR\",\"quantity\":2,\"unitPrice\":3450,\"total\":6900},{\"productId\":7,\"productName\":\"Bbb egér\",\"quantity\":2,\"unitPrice\":3400,\"total\":6800},{\"productId\":2,\"productName\":\"A4Tech Bloody Blazing A60\",\"quantity\":1,\"unitPrice\":8000,\"total\":8000}]', 21700.00, 5859.00, 27559.00, 'Számla a ORD-2025-00003 rendeléshez', '2025-09-25 10:56:30', '2025-09-25 10:56:30', '2025-09-25 10:56:30'),
(7, 'SZ-2025-00004', 5, 4, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":7,\"productName\":\"Bbb egér\",\"quantity\":1,\"unitPrice\":3400,\"total\":3400}]', 3400.00, 918.00, 4318.00, 'Számla a ORD-2025-00005 rendeléshez', '2025-09-25 14:16:32', '2025-09-25 14:16:32', '2025-09-25 14:16:32'),
(8, 'SZ-2025-00005', 4, 1, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":4,\"productName\":\"A4Tech KV-300H usb-s billentyűzet\",\"quantity\":1,\"unitPrice\":12000,\"total\":12000}]', 12000.00, 3240.00, 15240.00, 'Számla a ORD-2025-00004 rendeléshez', '2025-09-25 14:17:14', '2025-09-25 14:17:14', '2025-09-25 14:17:14'),
(10, 'SZ-2025-00006', 6, 5, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":4,\"productName\":\"A4Tech KV-300H usb-s billentyűzet\",\"quantity\":2,\"unitPrice\":12000,\"total\":24000}]', 24000.00, 6480.00, 30480.00, 'Számla a ORD-2025-00006 rendeléshez', '2025-09-25 14:28:47', '2025-09-25 14:28:47', '2025-09-25 14:28:47'),
(11, 'SZ-2025-00007', 7, 6, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":1,\"productName\":\"Genius NX-7005 Black\",\"quantity\":2,\"unitPrice\":2400,\"total\":4800},{\"productId\":9,\"productName\":\"Jaj de jó\",\"quantity\":1,\"unitPrice\":5000,\"total\":5000}]', 9800.00, 2646.00, 12446.00, 'Számla a ORD-2025-00007 rendeléshez', '2025-09-25 14:38:32', '2025-09-25 14:38:32', '2025-09-25 14:38:32'),
(12, 'SZ-2025-00008', 8, 1, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":2,\"productName\":\"A4Tech Bloody Blazing A60\",\"quantity\":1,\"unitPrice\":8000,\"total\":8000}]', 8000.00, 2160.00, 10160.00, 'Számla a ORD-2025-00008 rendeléshez', '2025-09-25 14:41:01', '2025-09-25 14:41:01', '2025-09-25 14:41:01'),
(13, 'SZ-2025-00009', 10, 4, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":2,\"productName\":\"A4Tech Bloody Blazing A60\",\"quantity\":3,\"unitPrice\":8000,\"total\":24000}]', 24000.00, 6480.00, 30480.00, 'Számla a ORD-2025-00010 rendeléshez', '2025-09-25 15:36:12', '2025-09-25 15:36:12', '2025-09-25 15:36:12'),
(14, 'SZ-2025-00010', 9, 4, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":2,\"productName\":\"A4Tech Bloody Blazing A60\",\"quantity\":3,\"unitPrice\":8000,\"total\":24000}]', 24000.00, 6480.00, 30480.00, 'Számla a ORD-2025-00009 rendeléshez', '2025-09-25 15:37:18', '2025-09-25 15:37:18', '2025-09-25 15:37:18'),
(15, 'SZ-2025-00011', 15, 2, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":3,\"productName\":\"A4TECH X77 OSCAR NEON - VEZETÉKES GAMER EGÉR\",\"quantity\":1,\"unitPrice\":3450,\"total\":3450}]', 3450.00, 932.00, 4382.00, 'Számla a ORD-2025-00015 rendeléshez', '2025-09-25 16:33:49', '2025-09-25 16:33:49', '2025-09-25 16:33:49'),
(16, 'SZ-2025-00012', 18, 1, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":10,\"productName\":\"fasfaf\",\"quantity\":2,\"unitPrice\":13034,\"total\":26068}]', 26068.00, 7038.00, 33106.00, 'Számla a ORD-2025-00018 rendeléshez', '2025-09-25 17:33:55', '2025-09-25 17:33:55', '2025-09-25 17:33:55'),
(17, 'SZ-2025-00013', 17, 3, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":1,\"productName\":\"Genius NX-7005 Black\",\"quantity\":2,\"unitPrice\":2400,\"total\":4800}]', 4800.00, 1296.00, 6096.00, 'Számla a ORD-2025-00017 rendeléshez', '2025-09-25 17:38:34', '2025-09-25 17:38:34', '2025-09-25 17:38:34'),
(18, 'SZ-2025-00014', 22, 5, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '[{\"productId\":4,\"productName\":\"A4Tech KV-300H usb-s billentyűzet\",\"quantity\":2,\"unitPrice\":12000,\"total\":24000},{\"productId\":3,\"productName\":\"A4TECH X77 OSCAR NEON - VEZETÉKES GAMER EGÉR\",\"quantity\":2,\"unitPrice\":3450,\"total\":6900},{\"productId\":2,\"productName\":\"A4Tech Bloody Blazing A60\",\"quantity\":2,\"unitPrice\":8000,\"total\":16000}]', 46900.00, 12663.00, 59563.00, 'Számla a ORD-2025-00022 rendeléshez', '2025-09-25 18:04:03', '2025-09-25 18:04:03', '2025-09-25 18:04:03');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `action` enum('STOCK_IN','STOCK_OUT','STOCK_TRANSFER','LOGIN_SUCCESS','LOGIN_FAIL','USER_REGISTER','PRODUCT_CREATE','PRODUCT_UPDATE','PARTNER_CREATE','PARTNER_UPDATE','ORDER_CREATE','ORDER_UPDATE','INVOICE_CREATE','INVOICE_UPDATE') NOT NULL,
  `targetType` varchar(255) NOT NULL DEFAULT '',
  `targetId` int(11) NOT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`payload`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `logs`
--

INSERT INTO `logs` (`id`, `userId`, `createdAt`, `updatedAt`, `action`, `targetType`, `targetId`, `payload`) VALUES
(1, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-08-31 21:15:43', '2025-08-31 21:15:43', 'LOGIN_FAIL', 'User', 2, '{\"email\":\"admin@admin.hu\",\"reason\":\"Hibás jelszó\",\"ip\":\"::ffff:127.0.0.1\"}'),
(2, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-08-31 21:15:49', '2025-08-31 21:15:49', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-08-31T21:15:49.148Z\"}'),
(3, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-08-31 22:39:41', '2025-08-31 22:39:41', 'LOGIN_FAIL', 'User', 2, '{\"email\":\"admin@admin.hu\",\"reason\":\"Hibás jelszó\",\"ip\":\"::ffff:127.0.0.1\"}'),
(4, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-08-31 22:39:44', '2025-08-31 22:39:44', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-08-31T22:39:44.924Z\"}'),
(5, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-01 17:41:04', '2025-09-01 17:41:04', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-01T17:41:04.841Z\"}'),
(6, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-16 19:45:33', '2025-09-16 19:45:33', 'LOGIN_FAIL', 'User', 2, '{\"email\":\"admin@admin.hu\",\"reason\":\"Hibás jelszó\",\"ip\":\"::ffff:127.0.0.1\"}'),
(7, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-16 19:45:51', '2025-09-16 19:45:51', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-16T19:45:51.557Z\"}'),
(8, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-16 20:02:01', '2025-09-16 20:02:01', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-16T20:02:01.021Z\"}'),
(9, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-16 20:02:31', '2025-09-16 20:02:31', 'USER_REGISTER', 'User', 449, '{\"name\":\"Valaki Pista\",\"email\":\"pista@gmail.com\",\"role\":\"sales\",\"byUserId\":\"2b89fca2-5776-11f0-ac95-a39d2bfd7550\",\"createdAt\":\"2025-09-16T20:02:31.883Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(10, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-16 20:04:10', '2025-09-16 20:04:10', 'PRODUCT_CREATE', 'Product', 8, '{\"sku\":\"123456789\",\"name\":\"Logitech K235 vezeték nélküli billentyűzet\",\"categoryId\":1,\"subcategoryId\":1,\"unit\":\"db\",\"price\":8000,\"createdAt\":\"2025-09-16T20:04:10.172Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(11, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-16 20:16:08', '2025-09-16 20:16:08', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-16T20:16:08.777Z\"}'),
(12, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-16 20:20:18', '2025-09-16 20:20:18', 'LOGIN_FAIL', 'User', 2, '{\"email\":\"\",\"reason\":\"Hibás jelszó\",\"ip\":\"::ffff:127.0.0.1\"}'),
(13, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-16 20:20:35', '2025-09-16 20:20:35', 'LOGIN_FAIL', 'User', 2, '{\"email\":\"\",\"reason\":\"Hibás jelszó\",\"ip\":\"::ffff:127.0.0.1\"}'),
(14, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-16 20:21:05', '2025-09-16 20:21:05', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-16T20:21:05.745Z\"}'),
(15, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 11:17:57', '2025-09-21 11:17:57', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T11:17:57.181Z\"}'),
(16, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 11:20:41', '2025-09-21 11:20:41', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T11:20:41.670Z\"}'),
(17, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 11:22:54', '2025-09-21 11:22:54', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T11:22:54.870Z\"}'),
(18, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 11:26:39', '2025-09-21 11:26:39', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T11:26:39.391Z\"}'),
(19, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 11:29:59', '2025-09-21 11:29:59', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T11:29:59.589Z\"}'),
(20, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 11:47:28', '2025-09-21 11:47:28', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T11:47:28.422Z\"}'),
(21, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 11:52:05', '2025-09-21 11:52:05', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T11:52:05.156Z\"}'),
(22, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 12:41:53', '2025-09-21 12:41:53', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T12:41:53.624Z\"}'),
(23, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 12:48:50', '2025-09-21 12:48:50', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T12:48:50.847Z\"}'),
(24, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 12:50:16', '2025-09-21 12:50:16', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T12:50:16.013Z\"}'),
(25, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 12:53:14', '2025-09-21 12:53:14', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T12:53:14.732Z\"}'),
(26, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 13:06:36', '2025-09-21 13:06:36', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T13:06:36.343Z\"}'),
(27, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 16:49:06', '2025-09-21 16:49:06', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T16:49:06.706Z\"}'),
(28, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 16:55:57', '2025-09-21 16:55:57', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T16:55:57.220Z\"}'),
(29, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 17:25:33', '2025-09-21 17:25:33', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T17:25:33.679Z\"}'),
(30, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 17:34:16', '2025-09-21 17:34:16', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T17:34:16.997Z\"}'),
(31, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 17:35:06', '2025-09-21 17:35:06', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T17:35:06.101Z\"}'),
(32, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 17:47:51', '2025-09-21 17:47:51', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T17:47:51.939Z\"}'),
(33, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 17:49:18', '2025-09-21 17:49:18', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T17:49:18.650Z\"}'),
(34, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 17:51:40', '2025-09-21 17:51:40', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T17:51:40.979Z\"}'),
(35, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 18:01:24', '2025-09-21 18:01:24', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T18:01:24.291Z\"}'),
(36, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 18:52:24', '2025-09-21 18:52:24', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T18:52:24.481Z\"}'),
(37, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 18:53:38', '2025-09-21 18:53:38', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T18:53:38.644Z\"}'),
(38, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 19:19:21', '2025-09-21 19:19:21', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T19:19:21.656Z\"}'),
(39, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 19:55:05', '2025-09-21 19:55:05', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T19:55:05.855Z\"}'),
(40, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 19:57:00', '2025-09-21 19:57:00', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T19:57:00.978Z\"}'),
(41, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 20:01:55', '2025-09-21 20:01:55', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T20:01:55.488Z\"}'),
(42, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 20:01:59', '2025-09-21 20:01:59', 'ORDER_UPDATE', 'order', 2, '{\"status\":\"completed\",\"previousStatus\":\"paid\"}'),
(43, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 20:02:04', '2025-09-21 20:02:04', 'ORDER_UPDATE', 'order', 1, '{\"status\":\"completed\",\"previousStatus\":\"completed\"}'),
(44, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 20:22:18', '2025-09-21 20:22:18', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-21T20:22:18.076Z\"}'),
(45, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 05:54:31', '2025-09-22 05:54:31', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T05:54:31.842Z\"}'),
(46, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 07:41:47', '2025-09-22 07:41:47', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T07:41:47.089Z\"}'),
(47, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 07:47:04', '2025-09-22 07:47:04', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T07:47:04.810Z\"}'),
(48, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 07:48:38', '2025-09-22 07:48:38', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T07:48:38.593Z\"}'),
(49, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 07:52:37', '2025-09-22 07:52:37', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T07:52:37.461Z\"}'),
(50, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 07:57:11', '2025-09-22 07:57:11', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T07:57:11.875Z\"}'),
(51, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 08:03:09', '2025-09-22 08:03:09', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T08:03:09.200Z\"}'),
(52, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 08:25:07', '2025-09-22 08:25:07', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T08:25:07.432Z\"}'),
(53, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 08:30:25', '2025-09-22 08:30:25', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T08:30:25.351Z\"}'),
(54, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 08:32:19', '2025-09-22 08:32:19', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T08:32:19.890Z\"}'),
(55, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 08:35:33', '2025-09-22 08:35:33', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T08:35:33.534Z\"}'),
(56, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 08:35:42', '2025-09-22 08:35:42', 'ORDER_UPDATE', 'order', 2, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(57, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 08:36:35', '2025-09-22 08:36:35', 'ORDER_UPDATE', 'order', 1, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(58, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 08:41:56', '2025-09-22 08:41:56', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T08:41:56.933Z\"}'),
(59, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 08:44:01', '2025-09-22 08:44:01', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T08:44:01.730Z\"}'),
(60, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 13:28:01', '2025-09-22 13:28:01', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T13:28:01.512Z\"}'),
(61, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 14:12:23', '2025-09-22 14:12:23', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T14:12:23.857Z\"}'),
(62, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 14:17:21', '2025-09-22 14:17:21', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T14:17:21.899Z\"}'),
(63, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 14:21:12', '2025-09-22 14:21:12', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T14:21:12.421Z\"}'),
(64, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 14:22:34', '2025-09-22 14:22:34', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T14:22:34.203Z\"}'),
(65, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 14:23:36', '2025-09-22 14:23:36', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T14:23:36.865Z\"}'),
(66, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 14:33:56', '2025-09-22 14:33:56', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T14:33:56.466Z\"}'),
(67, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 14:37:49', '2025-09-22 14:37:49', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T14:37:49.577Z\"}'),
(68, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 14:38:38', '2025-09-22 14:38:38', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T14:38:38.512Z\"}'),
(69, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 14:39:37', '2025-09-22 14:39:37', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T14:39:37.791Z\"}'),
(70, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 14:40:09', '2025-09-22 14:40:09', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-22T14:40:09.308Z\"}'),
(71, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-22 16:31:34', '2025-09-22 16:31:34', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-22T16:31:34.455Z\"}'),
(72, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 11:12:41', '2025-09-23 11:12:41', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-23T11:12:41.606Z\"}'),
(73, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 11:15:05', '2025-09-23 11:15:05', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-23T11:15:05.731Z\"}'),
(74, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 11:26:28', '2025-09-23 11:26:28', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::1\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-23T11:26:28.864Z\"}'),
(75, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 15:38:24', '2025-09-23 15:38:24', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T15:38:24.006Z\"}'),
(76, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 15:47:44', '2025-09-23 15:47:44', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T15:47:44.384Z\"}'),
(77, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 15:49:41', '2025-09-23 15:49:41', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T15:49:41.479Z\"}'),
(78, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 15:50:21', '2025-09-23 15:50:21', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T15:50:21.434Z\"}'),
(79, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 16:24:04', '2025-09-23 16:24:04', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T16:24:04.444Z\"}'),
(80, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 16:29:27', '2025-09-23 16:29:27', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T16:29:27.472Z\"}'),
(81, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 16:39:13', '2025-09-23 16:39:13', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T16:39:13.107Z\"}'),
(82, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 16:52:45', '2025-09-23 16:52:45', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T16:52:45.100Z\"}'),
(83, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 16:56:52', '2025-09-23 16:56:52', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T16:56:52.015Z\"}'),
(84, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 16:59:04', '2025-09-23 16:59:04', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T16:59:04.178Z\"}'),
(85, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:00:24', '2025-09-23 17:00:24', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:00:24.629Z\"}'),
(86, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:03:44', '2025-09-23 17:03:44', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:03:44.434Z\"}'),
(87, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:05:01', '2025-09-23 17:05:01', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:05:01.919Z\"}'),
(88, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:05:24', '2025-09-23 17:05:24', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:05:24.347Z\"}'),
(89, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:06:58', '2025-09-23 17:06:58', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:06:58.662Z\"}'),
(90, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:12:55', '2025-09-23 17:12:55', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:12:55.171Z\"}'),
(91, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:13:48', '2025-09-23 17:13:48', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:13:48.787Z\"}'),
(92, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:14:07', '2025-09-23 17:14:07', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:14:07.219Z\"}'),
(93, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:14:44', '2025-09-23 17:14:44', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:14:44.145Z\"}'),
(94, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:16:43', '2025-09-23 17:16:43', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:16:43.553Z\"}'),
(95, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:17:52', '2025-09-23 17:17:52', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:17:52.514Z\"}'),
(96, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:19:50', '2025-09-23 17:19:50', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:19:50.074Z\"}'),
(97, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:20:10', '2025-09-23 17:20:10', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:20:10.109Z\"}'),
(98, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:24:40', '2025-09-23 17:24:40', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:24:40.322Z\"}'),
(99, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:27:37', '2025-09-23 17:27:37', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:27:37.295Z\"}'),
(100, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:28:32', '2025-09-23 17:28:32', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:28:32.565Z\"}'),
(101, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 17:57:58', '2025-09-23 17:57:58', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T17:57:58.097Z\"}'),
(102, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 18:01:22', '2025-09-23 18:01:22', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T18:01:22.954Z\"}'),
(103, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 18:08:10', '2025-09-23 18:08:10', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T18:08:10.581Z\"}'),
(104, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 18:08:57', '2025-09-23 18:08:57', 'LOGIN_FAIL', 'User', 2, '{\"email\":\"admin\",\"reason\":\"Hibás jelszó\",\"ip\":\"::ffff:127.0.0.1\"}'),
(105, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 18:09:04', '2025-09-23 18:09:04', 'LOGIN_FAIL', 'User', 2, '{\"email\":\"admin\",\"reason\":\"Hibás jelszó\",\"ip\":\"::ffff:127.0.0.1\"}'),
(106, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 18:09:10', '2025-09-23 18:09:10', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T18:09:10.077Z\"}'),
(107, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 18:55:20', '2025-09-23 18:55:20', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T18:55:20.846Z\"}'),
(108, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:01:16', '2025-09-23 19:01:16', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T19:01:16.841Z\"}'),
(109, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:04:37', '2025-09-23 19:04:37', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T19:04:37.524Z\"}'),
(110, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:04:50', '2025-09-23 19:04:50', '', 'User', 0, '{\"isActive\":true,\"createdAt\":\"2025-09-23T19:04:50.212Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(111, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:05:01', '2025-09-23 19:05:01', '', 'User', 0, '{\"isActive\":false,\"createdAt\":\"2025-09-23T19:05:01.525Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(112, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:05:03', '2025-09-23 19:05:03', '', 'User', 0, '{\"isActive\":false,\"createdAt\":\"2025-09-23T19:05:03.468Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(113, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:05:05', '2025-09-23 19:05:05', '', 'User', 523, '{\"isActive\":false,\"createdAt\":\"2025-09-23T19:05:05.571Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(114, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:05:17', '2025-09-23 19:05:17', '', 'User', 523, '{\"isActive\":true,\"createdAt\":\"2025-09-23T19:05:17.348Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(115, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:05:28', '2025-09-23 19:05:28', '', 'User', 0, '{\"isActive\":true,\"createdAt\":\"2025-09-23T19:05:28.345Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(116, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:08:16', '2025-09-23 19:08:16', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T19:08:16.845Z\"}'),
(117, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:08:43', '2025-09-23 19:08:43', '', 'User', 0, '{\"isActive\":false,\"createdAt\":\"2025-09-23T19:08:43.206Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(118, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:08:57', '2025-09-23 19:08:57', '', 'User', 0, '{\"isActive\":true,\"createdAt\":\"2025-09-23T19:08:57.062Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(119, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:09:07', '2025-09-23 19:09:07', '', 'User', 0, '{\"isActive\":false,\"createdAt\":\"2025-09-23T19:09:07.030Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(120, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:09:09', '2025-09-23 19:09:09', '', 'User', 0, '{\"isActive\":true,\"createdAt\":\"2025-09-23T19:09:09.320Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(121, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:09:11', '2025-09-23 19:09:11', '', 'User', 523, '{\"isActive\":true,\"createdAt\":\"2025-09-23T19:09:11.169Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(122, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:09:21', '2025-09-23 19:09:21', '', 'User', 0, '{\"isActive\":false,\"createdAt\":\"2025-09-23T19:09:21.353Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(123, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:09:31', '2025-09-23 19:09:31', '', 'User', 0, '{\"isActive\":false,\"createdAt\":\"2025-09-23T19:09:31.115Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(124, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:13:40', '2025-09-23 19:13:40', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T19:13:40.637Z\"}'),
(125, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:14:03', '2025-09-23 19:14:03', '', 'User', 0, '{\"isActive\":true,\"createdAt\":\"2025-09-23T19:14:03.014Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(126, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:15:26', '2025-09-23 19:15:26', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T19:15:26.793Z\"}'),
(127, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:15:31', '2025-09-23 19:15:31', '', 'User', 0, '{\"isActive\":false,\"createdAt\":\"2025-09-23T19:15:31.813Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(128, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:15:43', '2025-09-23 19:15:43', '', 'User', 0, '{\"isActive\":true,\"createdAt\":\"2025-09-23T19:15:43.464Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(129, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:24:03', '2025-09-23 19:24:03', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T19:24:03.943Z\"}'),
(130, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:24:17', '2025-09-23 19:24:17', '', 'User', 0, '{\"isActive\":true,\"createdAt\":\"2025-09-23T19:24:17.366Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(131, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:24:38', '2025-09-23 19:24:38', '', 'User', 0, '{\"isActive\":false,\"createdAt\":\"2025-09-23T19:24:38.484Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(132, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:26:07', '2025-09-23 19:26:07', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T19:26:07.660Z\"}'),
(133, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:34:47', '2025-09-23 19:34:47', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T19:34:47.376Z\"}'),
(134, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:35:06', '2025-09-23 19:35:06', '', 'User', 0, '{\"isActive\":true,\"createdAt\":\"2025-09-23T19:35:06.418Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(135, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:41:09', '2025-09-23 19:41:09', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T19:41:09.893Z\"}'),
(136, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 19:45:19', '2025-09-23 19:45:19', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-23T19:45:19.031Z\"}'),
(137, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 21:08:29', '2025-09-23 21:08:29', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-23T21:08:29.112Z\"}'),
(138, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 21:09:45', '2025-09-23 21:09:45', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36\",\"createdAt\":\"2025-09-23T21:09:45.618Z\"}'),
(139, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-23 21:25:14', '2025-09-23 21:25:14', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-23T21:25:14.606Z\"}'),
(140, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 10:39:43', '2025-09-25 10:39:43', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T10:39:43.875Z\"}'),
(141, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 10:40:20', '2025-09-25 10:40:20', 'USER_REGISTER', 'User', 29, '{\"name\":\"Lacika\",\"email\":\"laci@laci.hu\",\"role\":\"sales\",\"byUserId\":\"2b89fca2-5776-11f0-ac95-a39d2bfd7550\",\"createdAt\":\"2025-09-25T10:40:20.842Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(142, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 10:40:37', '2025-09-25 10:40:37', '', 'User', 29, '{\"isActive\":false,\"createdAt\":\"2025-09-25T10:40:37.359Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(143, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 10:40:44', '2025-09-25 10:40:44', '', 'User', 29, '{\"isActive\":true,\"createdAt\":\"2025-09-25T10:40:44.392Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(144, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 10:41:51', '2025-09-25 10:41:51', 'PRODUCT_CREATE', 'Product', 9, '{\"sku\":\"jjjj\",\"name\":\"Jaj de jó\",\"categoryId\":1,\"subcategoryId\":1,\"unit\":\"db\",\"price\":5000,\"createdAt\":\"2025-09-25T10:41:51.793Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(145, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 10:51:47', '2025-09-25 10:51:47', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T10:51:47.214Z\"}'),
(146, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 10:53:51', '2025-09-25 10:53:51', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T10:53:51.095Z\"}'),
(147, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 10:56:03', '2025-09-25 10:56:03', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T10:56:03.103Z\"}'),
(148, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 10:56:27', '2025-09-25 10:56:27', 'ORDER_UPDATE', 'order', 3, '{\"status\":\"new\",\"previousStatus\":\"new\"}'),
(149, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 10:56:30', '2025-09-25 10:56:30', 'ORDER_UPDATE', 'order', 3, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(150, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 11:00:11', '2025-09-25 11:00:11', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T11:00:11.584Z\"}'),
(151, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 11:06:10', '2025-09-25 11:06:10', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T11:06:10.497Z\"}'),
(152, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 11:07:57', '2025-09-25 11:07:57', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T11:07:57.791Z\"}'),
(153, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 11:08:54', '2025-09-25 11:08:54', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T11:08:54.821Z\"}'),
(154, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 11:09:27', '2025-09-25 11:09:27', 'ORDER_UPDATE', 'order', 5, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(155, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 13:06:27', '2025-09-25 13:06:27', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T13:06:27.897Z\"}'),
(156, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 13:07:09', '2025-09-25 13:07:09', 'ORDER_UPDATE', 'order', 5, '{\"status\":\"completed\",\"previousStatus\":\"completed\"}'),
(157, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 13:09:38', '2025-09-25 13:09:38', 'LOGIN_FAIL', 'User', 2, '{\"email\":\"admin\",\"reason\":\"Hibás jelszó\",\"ip\":\"::ffff:127.0.0.1\"}'),
(158, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 13:09:44', '2025-09-25 13:09:44', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T13:09:44.433Z\"}'),
(159, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 13:11:20', '2025-09-25 13:11:20', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T13:11:20.667Z\"}'),
(160, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 13:16:06', '2025-09-25 13:16:06', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T13:16:06.751Z\"}'),
(161, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 13:18:51', '2025-09-25 13:18:51', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T13:18:51.004Z\"}'),
(162, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 13:18:56', '2025-09-25 13:18:56', 'ORDER_UPDATE', 'order', 5, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(163, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 13:18:59', '2025-09-25 13:18:59', 'ORDER_UPDATE', 'order', 4, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(164, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 13:20:46', '2025-09-25 13:20:46', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T13:20:46.206Z\"}'),
(165, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:16:26', '2025-09-25 14:16:26', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T14:16:26.762Z\"}'),
(166, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:16:32', '2025-09-25 14:16:32', 'ORDER_UPDATE', 'order', 5, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(167, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:17:14', '2025-09-25 14:17:14', 'ORDER_UPDATE', 'order', 4, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(168, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:20:03', '2025-09-25 14:20:03', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.29\",\"userAgent\":\"okhttp/4.12.0\",\"createdAt\":\"2025-09-25T14:20:03.370Z\"}'),
(169, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:26:24', '2025-09-25 14:26:24', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T14:26:24.023Z\"}'),
(170, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:26:28', '2025-09-25 14:26:28', 'ORDER_UPDATE', 'order', 6, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(171, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:28:41', '2025-09-25 14:28:41', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T14:28:41.466Z\"}'),
(172, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:28:47', '2025-09-25 14:28:47', 'ORDER_UPDATE', 'order', 6, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(173, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:37:26', '2025-09-25 14:37:26', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T14:37:26.636Z\"}'),
(174, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:38:15', '2025-09-25 14:38:15', 'ORDER_UPDATE', 'order', 7, '{\"status\":\"new\",\"previousStatus\":\"new\"}'),
(175, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:38:32', '2025-09-25 14:38:32', 'ORDER_UPDATE', 'order', 7, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(176, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:38:37', '2025-09-25 14:38:37', 'ORDER_UPDATE', 'order', 7, '{\"status\":\"completed\",\"previousStatus\":\"completed\"}'),
(177, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:40:21', '2025-09-25 14:40:21', 'ORDER_UPDATE', 'order', 7, '{\"status\":\"completed\",\"previousStatus\":\"completed\"}'),
(178, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:40:52', '2025-09-25 14:40:52', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.29\",\"userAgent\":\"okhttp/4.12.0\",\"createdAt\":\"2025-09-25T14:40:52.256Z\"}'),
(179, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:40:59', '2025-09-25 14:40:59', 'ORDER_UPDATE', 'order', 8, '{\"status\":\"new\",\"previousStatus\":\"new\"}'),
(180, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:41:01', '2025-09-25 14:41:01', 'ORDER_UPDATE', 'order', 8, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(181, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:43:23', '2025-09-25 14:43:23', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T14:43:23.770Z\"}'),
(182, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:57:56', '2025-09-25 14:57:56', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.29\",\"userAgent\":\"okhttp/4.12.0\",\"createdAt\":\"2025-09-25T14:57:56.628Z\"}'),
(183, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 15:33:00', '2025-09-25 15:33:00', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T15:33:00.139Z\"}'),
(184, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 15:36:00', '2025-09-25 15:36:00', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T15:36:00.621Z\"}'),
(185, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 15:36:10', '2025-09-25 15:36:10', 'ORDER_UPDATE', 'order', 10, '{\"status\":\"new\",\"previousStatus\":\"new\"}'),
(186, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 15:36:12', '2025-09-25 15:36:12', 'ORDER_UPDATE', 'order', 10, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(187, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 15:36:55', '2025-09-25 15:36:55', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T15:36:55.127Z\"}'),
(188, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 15:37:18', '2025-09-25 15:37:18', 'ORDER_UPDATE', 'order', 9, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(189, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:01:00', '2025-09-25 16:01:00', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T16:01:00.925Z\"}'),
(190, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:08:49', '2025-09-25 16:08:49', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T16:08:49.425Z\"}'),
(191, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:10:02', '2025-09-25 16:10:02', 'STOCK_OUT', 'StockMovement', 3, '{\"productId\":2,\"quantity\":2,\"movementNumber\":\"KT-2025-00003\",\"note\":\"Oda adtam Lalinak\",\"createdAt\":\"2025-09-25T16:10:02.716Z\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\"}'),
(192, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:24:36', '2025-09-25 16:24:36', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T16:24:36.065Z\"}'),
(193, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:28:42', '2025-09-25 16:28:42', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T16:28:42.368Z\"}'),
(194, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:33:49', '2025-09-25 16:33:49', 'ORDER_UPDATE', 'order', 15, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(195, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:57:29', '2025-09-25 16:57:29', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T16:57:29.606Z\"}'),
(196, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:59:52', '2025-09-25 16:59:52', 'STOCK_OUT', 'StockMovement', 4, '{\"productId\":4,\"quantity\":4,\"movementNumber\":\"KT-2025-00004\",\"note\":null,\"createdAt\":\"2025-09-25T16:59:52.894Z\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\"}'),
(197, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:01:41', '2025-09-25 17:01:41', 'STOCK_IN', 'StockMovement', 5, '{\"productId\":9,\"quantity\":10,\"movementNumber\":\"KT-2025-00005\",\"note\":null,\"createdAt\":\"2025-09-25T17:01:41.849Z\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\"}'),
(198, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:04:17', '2025-09-25 17:04:17', 'STOCK_OUT', 'StockMovement', 6, '{\"productId\":3,\"quantity\":1,\"movementNumber\":\"KT-2025-00006\",\"note\":\"oda adom Daninak\",\"createdAt\":\"2025-09-25T17:04:17.597Z\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\"}'),
(199, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:06:10', '2025-09-25 17:06:10', 'STOCK_OUT', 'StockMovement', 7, '{\"productId\":8,\"quantity\":10,\"movementNumber\":\"KT-2025-00007\",\"note\":\"kuka\",\"createdAt\":\"2025-09-25T17:06:10.763Z\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\"}'),
(200, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:06:41', '2025-09-25 17:06:41', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T17:06:41.100Z\"}'),
(201, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:09:52', '2025-09-25 17:09:52', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:09:52.311Z\"}'),
(202, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:14:29', '2025-09-25 17:14:29', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:14:29.323Z\"}'),
(203, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:18:00', '2025-09-25 17:18:00', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:18:00.745Z\"}'),
(204, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:18:15', '2025-09-25 17:18:15', 'PRODUCT_CREATE', 'Product', 10, '{\"sku\":\"2321\",\"name\":\"fasfaf\",\"categoryId\":6,\"subcategoryId\":null,\"unit\":\"db\",\"price\":13034,\"createdAt\":\"2025-09-25T17:18:15.763Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(205, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:18:55', '2025-09-25 17:18:55', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:18:55.040Z\"}'),
(206, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:22:41', '2025-09-25 17:22:41', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:22:41.920Z\"}'),
(207, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:24:39', '2025-09-25 17:24:39', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:24:39.648Z\"}'),
(208, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:25:41', '2025-09-25 17:25:41', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:25:41.436Z\"}'),
(209, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:25:58', '2025-09-25 17:25:58', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:25:58.443Z\"}'),
(210, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:26:48', '2025-09-25 17:26:48', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:26:48.655Z\"}'),
(211, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:27:14', '2025-09-25 17:27:14', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:27:14.561Z\"}'),
(212, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:27:51', '2025-09-25 17:27:51', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:27:51.233Z\"}'),
(213, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:29:39', '2025-09-25 17:29:39', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:29:39.336Z\"}'),
(214, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:30:12', '2025-09-25 17:30:12', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:30:12.357Z\"}'),
(215, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:30:41', '2025-09-25 17:30:41', 'PRODUCT_CREATE', 'Product', 11, '{\"sku\":\"vfiga\",\"name\":\"hfiaha\",\"categoryId\":7,\"subcategoryId\":null,\"unit\":\"db\",\"price\":1000000,\"createdAt\":\"2025-09-25T17:30:41.619Z\",\"ip\":\"::ffff:127.0.0.1\"}'),
(216, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:32:22', '2025-09-25 17:32:22', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T17:32:22.663Z\"}');
INSERT INTO `logs` (`id`, `userId`, `createdAt`, `updatedAt`, `action`, `targetType`, `targetId`, `payload`) VALUES
(217, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:32:57', '2025-09-25 17:32:57', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T17:32:57.026Z\"}'),
(218, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:33:33', '2025-09-25 17:33:33', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T17:33:33.809Z\"}'),
(219, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:33:54', '2025-09-25 17:33:54', 'ORDER_UPDATE', 'order', 18, '{\"status\":\"new\",\"previousStatus\":\"new\"}'),
(220, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:33:55', '2025-09-25 17:33:55', 'ORDER_UPDATE', 'order', 18, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(221, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:37:13', '2025-09-25 17:37:13', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T17:37:13.515Z\"}'),
(222, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:38:29', '2025-09-25 17:38:29', 'ORDER_UPDATE', 'order', 17, '{\"status\":\"confirmed\",\"previousStatus\":\"new\"}'),
(223, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:38:34', '2025-09-25 17:38:34', 'ORDER_UPDATE', 'order', 17, '{\"status\":\"completed\",\"previousStatus\":\"\"}'),
(224, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:38:37', '2025-09-25 17:38:37', 'ORDER_UPDATE', 'order', 16, '{\"status\":\"cancelled\",\"previousStatus\":\"new\"}'),
(225, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:41:23', '2025-09-25 17:41:23', 'ORDER_UPDATE', 'order', 11, '{\"status\":\"new\",\"previousStatus\":\"new\"}'),
(226, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:47:33', '2025-09-25 17:47:33', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T17:47:33.926Z\"}'),
(227, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:01:18', '2025-09-25 18:01:18', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:01:18.743Z\"}'),
(228, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:01:52', '2025-09-25 18:01:52', 'ORDER_UPDATE', 'order', 21, '{\"status\":\"new\",\"previousStatus\":\"new\"}'),
(229, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:03:12', '2025-09-25 18:03:12', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T18:03:12.139Z\"}'),
(230, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:04:03', '2025-09-25 18:04:03', 'ORDER_UPDATE', 'order', 22, '{\"status\":\"completed\",\"previousStatus\":\"new\"}'),
(231, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:06:41', '2025-09-25 18:06:41', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:06:41.347Z\"}'),
(232, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:09:19', '2025-09-25 18:09:19', 'STOCK_TRANSFER', 'StockMovement', 8, '{\"productId\":2,\"quantity\":1,\"transferReason\":\"Pécs\",\"movementNumber\":\"KT-2025-00008\",\"createdAt\":\"2025-09-25T18:09:19.122Z\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\"}'),
(233, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:12:14', '2025-09-25 18:12:14', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:12:14.111Z\"}'),
(234, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:18:01', '2025-09-25 18:18:01', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:18:01.273Z\"}'),
(235, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:19:04', '2025-09-25 18:19:04', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:19:04.554Z\"}'),
(236, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:19:43', '2025-09-25 18:19:43', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:19:43.724Z\"}'),
(237, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:21:13', '2025-09-25 18:21:13', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:21:13.636Z\"}'),
(238, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:21:38', '2025-09-25 18:21:38', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:21:38.241Z\"}'),
(239, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:23:48', '2025-09-25 18:23:48', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:23:48.380Z\"}'),
(240, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:24:46', '2025-09-25 18:24:46', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:24:46.203Z\"}'),
(241, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:24:51', '2025-09-25 18:24:51', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:24:51.863Z\"}'),
(242, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:25:08', '2025-09-25 18:25:08', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:25:08.915Z\"}'),
(243, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:25:48', '2025-09-25 18:25:48', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:25:48.367Z\"}'),
(244, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:26:43', '2025-09-25 18:26:43', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:26:43.883Z\"}'),
(245, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:33:15', '2025-09-25 18:33:15', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T18:33:15.808Z\"}'),
(246, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:58:43', '2025-09-25 18:58:43', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T18:58:43.970Z\"}'),
(247, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 19:00:39', '2025-09-25 19:00:39', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T19:00:39.309Z\"}'),
(248, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 19:04:31', '2025-09-25 19:04:31', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T19:04:31.622Z\"}'),
(249, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 19:45:15', '2025-09-25 19:45:15', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:192.168.0.10\",\"userAgent\":\"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36\",\"createdAt\":\"2025-09-25T19:45:15.669Z\"}'),
(250, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 19:53:21', '2025-09-25 19:53:21', 'LOGIN_SUCCESS', 'User', 2, '{\"email\":\"admin@admin.hu\",\"ip\":\"::ffff:127.0.0.1\",\"createdAt\":\"2025-09-25T19:53:21.172Z\"}');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `orderitems`
--

CREATE TABLE `orderitems` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unitPrice` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `totalPrice` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `orderitems`
--

INSERT INTO `orderitems` (`id`, `orderId`, `productId`, `quantity`, `unitPrice`, `createdAt`, `updatedAt`, `totalPrice`) VALUES
(1, 1, 1, 10, 5000, '2025-09-21 14:42:26', '2025-09-21 14:42:26', 50000),
(2, 1, 5, 1, 60000, '2025-09-21 19:50:05', '2025-09-21 19:50:05', 60000),
(3, 2, 8, 3, 8500, '2025-09-21 19:50:57', '2025-09-21 19:50:57', 25500),
(4, 3, 3, 2, 3450, '2025-09-25 10:55:30', '2025-09-25 10:55:30', 6900),
(5, 3, 7, 2, 3400, '2025-09-25 10:55:30', '2025-09-25 10:55:30', 6800),
(6, 3, 2, 1, 8000, '2025-09-25 10:55:30', '2025-09-25 10:55:30', 8000),
(7, 4, 4, 1, 12000, '2025-09-25 11:06:01', '2025-09-25 11:06:01', 12000),
(8, 5, 7, 1, 3400, '2025-09-25 11:08:48', '2025-09-25 11:08:48', 3400),
(9, 6, 4, 2, 12000, '2025-09-25 14:21:21', '2025-09-25 14:21:21', 24000),
(10, 7, 1, 2, 2400, '2025-09-25 14:37:52', '2025-09-25 14:37:52', 4800),
(11, 7, 9, 1, 5000, '2025-09-25 14:37:52', '2025-09-25 14:37:52', 5000),
(12, 8, 2, 1, 8000, '2025-09-25 14:39:39', '2025-09-25 14:39:39', 8000),
(13, 9, 2, 3, 8000, '2025-09-25 15:35:24', '2025-09-25 15:35:24', 24000),
(14, 10, 2, 3, 8000, '2025-09-25 15:35:30', '2025-09-25 15:35:30', 24000),
(15, 11, 4, 2, 12000, '2025-09-25 16:20:15', '2025-09-25 16:20:15', 24000),
(16, 12, 4, 2, 12000, '2025-09-25 16:21:40', '2025-09-25 16:21:40', 24000),
(17, 13, 9, 3, 5000, '2025-09-25 16:22:02', '2025-09-25 16:22:02', 15000),
(18, 14, 3, 1, 3450, '2025-09-25 16:24:45', '2025-09-25 16:24:45', 3450),
(19, 15, 3, 1, 3450, '2025-09-25 16:25:25', '2025-09-25 16:25:25', 3450),
(20, 16, 3, 1, 3450, '2025-09-25 16:28:35', '2025-09-25 16:28:35', 3450),
(21, 17, 1, 2, 2400, '2025-09-25 16:28:56', '2025-09-25 16:28:56', 4800),
(22, 18, 10, 2, 13034, '2025-09-25 17:33:26', '2025-09-25 17:33:26', 26068),
(23, 19, 4, 1, 12000, '2025-09-25 17:57:02', '2025-09-25 17:57:02', 12000),
(24, 19, 3, 1, 3450, '2025-09-25 17:57:02', '2025-09-25 17:57:02', 3450),
(25, 20, 4, 1, 12000, '2025-09-25 17:57:19', '2025-09-25 17:57:19', 12000),
(26, 20, 3, 1, 3450, '2025-09-25 17:57:19', '2025-09-25 17:57:19', 3450),
(27, 21, 4, 1, 12000, '2025-09-25 17:59:22', '2025-09-25 17:59:22', 12000),
(28, 21, 3, 1, 3450, '2025-09-25 17:59:22', '2025-09-25 17:59:22', 3450),
(29, 22, 4, 2, 12000, '2025-09-25 18:02:55', '2025-09-25 18:02:55', 24000),
(30, 22, 3, 2, 3450, '2025-09-25 18:02:55', '2025-09-25 18:02:55', 6900),
(31, 22, 2, 2, 8000, '2025-09-25 18:02:55', '2025-09-25 18:02:55', 16000);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `orderNumber` varchar(255) NOT NULL,
  `partnerId` int(11) NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `date` datetime NOT NULL,
  `status` enum('new','completed','paid','under transport','cancelled') NOT NULL DEFAULT 'new',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `invoiceId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `orders`
--

INSERT INTO `orders` (`id`, `orderNumber`, `partnerId`, `userId`, `date`, `status`, `createdAt`, `updatedAt`, `invoiceId`) VALUES
(1, 'ORD-2025-00001', 1, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 12:17:04', 'completed', '2025-09-21 12:17:04', '2025-09-22 08:36:35', 1),
(2, 'ORD-2025-00002', 2, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-21 13:20:05', 'completed', '2025-09-21 13:20:05', '2025-09-22 08:35:42', 2),
(3, 'ORD-2025-00003', 3, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 10:55:30', 'completed', '2025-09-25 10:55:30', '2025-09-25 10:56:30', 3),
(4, 'ORD-2025-00004', 1, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 11:06:01', 'completed', '2025-09-25 11:06:01', '2025-09-25 14:17:14', 8),
(5, 'ORD-2025-00005', 4, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 11:08:48', 'completed', '2025-09-25 11:08:48', '2025-09-25 14:16:32', 7),
(6, 'ORD-2025-00006', 5, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:21:21', 'completed', '2025-09-25 14:21:21', '2025-09-25 14:28:47', 10),
(7, 'ORD-2025-00007', 6, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:37:52', 'completed', '2025-09-25 14:37:52', '2025-09-25 14:38:32', 11),
(8, 'ORD-2025-00008', 1, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 14:39:39', 'completed', '2025-09-25 14:39:39', '2025-09-25 14:41:01', 12),
(9, 'ORD-2025-00009', 4, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 15:35:24', 'completed', '2025-09-25 15:35:24', '2025-09-25 15:37:18', 14),
(10, 'ORD-2025-00010', 4, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 15:35:30', 'completed', '2025-09-25 15:35:30', '2025-09-25 15:36:12', 13),
(11, 'ORD-2025-00011', 3, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:20:15', 'new', '2025-09-25 16:20:15', '2025-09-25 16:20:15', NULL),
(12, 'ORD-2025-00012', 3, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:21:40', 'new', '2025-09-25 16:21:40', '2025-09-25 16:21:40', NULL),
(13, 'ORD-2025-00013', 1, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:22:02', 'new', '2025-09-25 16:22:02', '2025-09-25 16:22:02', NULL),
(14, 'ORD-2025-00014', 2, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:24:45', 'new', '2025-09-25 16:24:45', '2025-09-25 16:24:45', NULL),
(15, 'ORD-2025-00015', 2, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:25:24', 'completed', '2025-09-25 16:25:24', '2025-09-25 16:33:49', 15),
(16, 'ORD-2025-00016', 2, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:28:35', 'cancelled', '2025-09-25 16:28:35', '2025-09-25 17:38:37', NULL),
(17, 'ORD-2025-00017', 3, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 16:28:56', 'completed', '2025-09-25 16:28:56', '2025-09-25 17:38:34', 17),
(18, 'ORD-2025-00018', 1, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:33:26', 'completed', '2025-09-25 17:33:26', '2025-09-25 17:33:55', 16),
(19, 'ORD-2025-00019', 3, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:57:02', 'new', '2025-09-25 17:57:02', '2025-09-25 17:57:02', NULL),
(20, 'ORD-2025-00020', 3, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:57:19', 'new', '2025-09-25 17:57:19', '2025-09-25 17:57:19', NULL),
(21, 'ORD-2025-00021', 3, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 17:59:22', 'new', '2025-09-25 17:59:22', '2025-09-25 17:59:22', NULL),
(22, 'ORD-2025-00022', 5, '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '2025-09-25 18:02:55', 'completed', '2025-09-25 18:02:55', '2025-09-25 18:04:03', 18);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `partners`
--

CREATE TABLE `partners` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `taxNumber` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `contactPerson` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `partners`
--

INSERT INTO `partners` (`id`, `name`, `taxNumber`, `address`, `contactPerson`, `email`, `phone`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'iPon Computer Kft.', '13392327-2-42', '1143 Budapest, Francia út 40/b.', 'Kiss Albert', 'info@iPon.hu', '+3615566565', 1, '2025-07-06 00:10:24', '2025-07-06 00:10:24'),
(2, 'PCX Kereskedelmi Kft', '23563539-2-41', '1046 Budapest,  Knézits Károly u. 4.', 'Pityi Palkó', 'pcx@pcx.hu', '+36706710410', 1, '2025-07-06 00:14:25', '2025-07-06 00:14:25'),
(3, 'Copy-Depo Hungary Kft', '13827166-2-44', '1158 Budapest, Késmárk u. 18.', 'Patron Dezső', 'info@copydepo.hu', '+3613831580', 1, '2025-07-06 00:18:10', '2025-07-06 00:18:10'),
(4, 'Demand.hu Kft.', '14715453-2-43', '1097 Budapest, Külső-Mester utca 82-86.', 'Demeter Robi', 'demeter.robi@demand.hu', '+36204898740', 1, '2025-07-09 17:20:56', '2025-07-09 17:20:56'),
(5, 'Ingram Micro Magyarország Kft', '10586224-2-44', '1138 Budapest, Madarász Viktor utca 47-49.', 'Ingo Ingrid', 'ingi@micro.hu', '+36247621415', 1, '2025-07-09 17:22:42', '2025-07-09 17:22:42'),
(6, 'Miki Bt', '12345678-1-11', '1037 Budapest, Fillér utca 7.', 'Miki Miki', 'info@miki.hu', '012345567744', 1, '2025-07-13 19:35:53', '2025-07-13 19:35:53');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `sku` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `subcategoryId` int(11) DEFAULT NULL,
  `unit` varchar(255) NOT NULL DEFAULT 'db',
  `price` int(11) NOT NULL,
  `stockQuantity` int(11) NOT NULL DEFAULT 0,
  `minStockLevel` int(11) DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `availableStock` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `products`
--

INSERT INTO `products` (`id`, `sku`, `name`, `categoryId`, `subcategoryId`, `unit`, `price`, `stockQuantity`, `minStockLevel`, `isActive`, `createdAt`, `updatedAt`, `availableStock`) VALUES
(1, '31030127101', 'Genius NX-7005 Black egér', 1, 2, 'db', 2400, 23, 0, 1, '2025-07-06 00:23:45', '2025-08-14 16:54:12', 23),
(2, 'A4TMYS46161', 'A4Tech Bloody Blazing A60 egér', 1, 2, 'db', 8000, 8, 0, 1, '2025-07-06 00:26:23', '2025-09-25 16:10:02', 8),
(3, 'A4TMYS46833', 'A4TECH X77 OSCAR NEON - VEZETÉKES GAMER EGÉR', 1, 2, 'db', 3450, 29, 0, 1, '2025-07-06 00:28:10', '2025-09-25 17:04:17', 29),
(4, 'A4TKLA39976', 'A4Tech KV-300H usb-s billentyűzet', 1, 1, 'db', 12000, 16, 0, 1, '2025-07-06 00:29:30', '2025-09-25 16:59:52', 16),
(5, '24M2N3201A/00', 'Philips 24M2N3201A/00 EVNIA Gaming monitor, 23,8\", IPS, FHD, 180 Hz, 1ms, 0,5 ms, HDR10, FlickerFree, Hangszórók 2W x 2, HA, Pivot, HDMI, DisplayPort, fehér', 3, NULL, 'db', 52000, 20, 0, 1, '2025-07-06 00:32:43', '2025-07-06 00:32:43', 20),
(6, '49M2C8900/00', 'Philips Evnia 49M2C8900/00 OLED Gamer Monitor 240Hz - 48,9\"', 3, NULL, 'db', 349000, 20, 0, 1, '2025-07-06 00:34:53', '2025-07-06 00:34:53', 20),
(7, 'CH-9307011-EU', 'Corsair Ironclaw RGB (CH-9307011-EU) egér', 1, 2, 'db', 26000, 20, 2, 1, '2025-07-13 19:18:48', '2025-07-13 19:18:48', 20),
(8, 'K235', 'Logitech K235 vezeték nélküli billentyűzet', 1, 1, 'db', 8000, 0, 1, 1, '2025-09-16 20:04:10', '2025-09-25 17:06:10', 0),
(9, 'CH-912A01A-NA', 'Corsair K100 RGB OPX (CH-912A01A-NA) billentyűzet', 1, 1, 'db', 5000, 40, 1, 1, '2025-09-25 10:41:51', '2025-09-25 17:01:41', 40),
(10, 'MAGB650', 'MSI MAG B650 Tomahawk WIFI Alaplap', 6, NULL, 'db', 70000, 0, 0, 1, '2025-09-25 17:18:15', '2025-09-25 17:18:15', 0),
(11, '100-000000597', 'AMD Ryzen 5 7500F 6-Core 3.7GHz AM5 Tray (100-000000597) Processzor', 7, NULL, 'db', 100000, 0, 0, 1, '2025-09-25 17:30:41', '2025-09-25 17:30:41', 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `stockmovements`
--

CREATE TABLE `stockmovements` (
  `id` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `type` enum('in','out','transfer') NOT NULL,
  `quantity` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `userId` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `movementNumber` varchar(255) DEFAULT NULL,
  `transferReason` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `stockmovements`
--

INSERT INTO `stockmovements` (`id`, `productId`, `type`, `quantity`, `date`, `userId`, `note`, `createdAt`, `updatedAt`, `movementNumber`, `transferReason`) VALUES
(3, 2, 'out', 2, '2025-09-25 16:10:02', '2b89fca2-5776-11f0-ac95-a39d2bfd7550', 'Odaadtam Lalinak', '2025-09-25 16:10:02', '2025-09-25 16:10:02', 'KT-2025-00003', NULL),
(4, 4, 'out', 4, '2025-09-25 16:59:52', '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '', '2025-09-25 16:59:52', '2025-09-25 16:59:52', 'KT-2025-00004', NULL),
(5, 9, 'in', 10, '2025-09-25 17:01:41', '2b89fca2-5776-11f0-ac95-a39d2bfd7550', '', '2025-09-25 17:01:41', '2025-09-25 17:01:41', 'KT-2025-00005', NULL),
(6, 3, 'out', 1, '2025-09-25 17:04:17', '2b89fca2-5776-11f0-ac95-a39d2bfd7550', 'odaadom Daninak', '2025-09-25 17:04:17', '2025-09-25 17:04:17', 'KT-2025-00006', NULL),
(7, 8, 'out', 10, '2025-09-25 17:06:10', '2b89fca2-5776-11f0-ac95-a39d2bfd7550', 'kuka', '2025-09-25 17:06:10', '2025-09-25 17:06:10', 'KT-2025-00007', NULL),
(8, 2, 'transfer', 1, '2025-09-25 18:09:19', '2b89fca2-5776-11f0-ac95-a39d2bfd7550', NULL, '2025-09-25 18:09:19', '2025-09-25 18:09:19', 'KT-2025-00008', 'Pécs');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `subcategories`
--

CREATE TABLE `subcategories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `categoryId` int(11) NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `subcategories`
--

INSERT INTO `subcategories` (`id`, `name`, `categoryId`, `createdAt`, `updatedAt`) VALUES
(1, 'Billentyűzet', 1, '2025-07-05 23:51:17', '2025-07-05 23:51:17'),
(2, 'Egér', 1, '2025-07-05 23:52:35', '2025-07-05 23:52:35'),
(3, 'Joystick', 1, '2025-07-05 23:52:42', '2025-07-05 23:52:42'),
(4, 'Lézernyomtató', 5, '2025-07-05 23:54:38', '2025-07-05 23:54:38'),
(5, 'Tintasugaras nyomtató', 5, '2025-07-05 23:54:43', '2025-07-05 23:54:43'),
(6, 'Színes lézer nyomtató', 5, '2025-07-05 23:54:57', '2025-07-05 23:54:57'),
(7, 'Kiegészítők', 5, '2025-07-05 23:55:14', '2025-07-05 23:55:14'),
(8, 'Processzor hűtő', 12, '2025-07-05 23:56:01', '2025-07-05 23:56:01'),
(9, 'Házhűtés', 12, '2025-07-05 23:56:17', '2025-07-05 23:56:17'),
(10, 'RC helikopter', 13, '2025-07-13 19:36:43', '2025-07-13 19:36:43');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` char(36) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('sales','admin') NOT NULL DEFAULT 'sales',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `isActive`, `createdAt`, `updatedAt`) VALUES
('1ea14583-2050-4451-ad2f-2b8e2933e3e5', 'Béla', 'bela@bela.hu', '$2b$10$l04/QPQbiaARkA7zpn8KzOKn3Gnl/IGJBOQDhfFUyXdl5b41XMuXq', 'sales', 1, '2025-08-14 15:50:37', '2025-08-14 15:50:37'),
('29c28b66-8931-48c9-85d9-354e850dc64e', 'Lacika', 'laci@laci.hu', '$2b$10$bQOr2Efq6Lo/.Zb26c62iu0CCYIA3yh8/p.hi7VpFnYS3xtiQRa7K', 'sales', 1, '2025-09-25 10:40:20', '2025-09-25 10:40:44'),
('2b89fca2-5776-11f0-ac95-a39d2bfd7550', 'admin', 'admin@admin.hu', '$2b$10$Q/TrpYp3qHHyLlwne9kV3uAU9h1B.S.AvhATTRAgeyzP5nq2Ry.u.', 'admin', 1, '2025-07-02 20:53:59', '2025-07-02 18:54:53'),
('449c7cac-9c8c-4c51-87ac-c35231f23a9c', 'Valaki Pista', 'pista@gmail.com', '$2b$10$UdtQSz0UONqteijPHzbmp.kgZaFLvROS9aY/4OfejbPkRLGfOt3h.', 'sales', 1, '2025-09-16 20:02:31', '2025-09-16 20:02:31'),
('523b3775-59eb-11f0-8aaf-8bce689cd760', 'Teszt Elek', 'mekkelek@teszt.hu', '$2b$10$5Y.ng/9K.qsaf.xx/54KIuCcNc08VXYC3YOPObkn9kVHknSM3J3le', 'sales', 1, '2025-07-05 23:56:51', '2025-09-23 19:05:17'),
('b953281f-c5f0-4a4a-aff2-1f9394276bf7', 'Pityuka', 'pityu@gmailke.com', '$2b$10$yBj1S35A2pRuPKh3iewBfuG1/oMsINigVvEA1FFniXPIOmfdcEo2i', 'sales', 0, '2025-07-13 19:15:45', '2025-09-23 19:09:07'),
('c18b17ec-dfce-4f0d-b520-5e8430ac3f8a', 'Géza', 'geza@geza.hu', '$2b$10$OrqgJ78.p2F/W3bSw42g1.dB77.O0YRYi1MZQXJXawOeVuQBSwPe6', 'sales', 1, '2025-08-14 16:05:13', '2025-09-23 19:35:06'),
('d8763969-a2ea-42f3-b516-38d03f2a4569', 'Karakter Pista', 'pisti@gmail.com', '$2b$10$v4/bif.jvJoRpvrX46mfvO7drqIAAKYkNxJWi2QhzyyEvaUAXG3Za', 'sales', 0, '2025-07-28 15:19:42', '2025-09-23 19:24:38');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- A tábla indexei `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoiceNumber` (`invoiceNumber`);

--
-- A tábla indexei `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `orderitems`
--
ALTER TABLE `orderitems`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderNumber` (`orderNumber`);

--
-- A tábla indexei `partners`
--
ALTER TABLE `partners`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`);

--
-- A tábla indexei `stockmovements`
--
ALTER TABLE `stockmovements`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `subcategories`
--
ALTER TABLE `subcategories`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT a táblához `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT a táblához `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=251;

--
-- AUTO_INCREMENT a táblához `orderitems`
--
ALTER TABLE `orderitems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT a táblához `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT a táblához `partners`
--
ALTER TABLE `partners`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `stockmovements`
--
ALTER TABLE `stockmovements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `subcategories`
--
ALTER TABLE `subcategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
