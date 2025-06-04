-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2025 at 07:52 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `acc`
--

-- --------------------------------------------------------

--
-- Table structure for table `addbalance`
--

CREATE TABLE `addbalance` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `creator__id` bigint(20) UNSIGNED DEFAULT NULL,
  `note` text DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `addbalance`
--

INSERT INTO `addbalance` (`id`, `bank__id`, `wallet__id`, `amount`, `creator__id`, `note`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 2, 11, '1200.00', 11, 'ddddddfffff', 1, 1, 0, NULL, '2025-03-28 07:37:55', '2025-03-28 07:38:43');

-- --------------------------------------------------------

--
-- Table structure for table `address`
--

CREATE TABLE `address` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `country__id` bigint(20) UNSIGNED DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `ps` varchar(255) DEFAULT NULL,
  `zip` varchar(255) DEFAULT NULL,
  `address_1` text DEFAULT NULL,
  `address_2` text DEFAULT NULL,
  `geo_lat` varchar(255) DEFAULT NULL,
  `geo_lon` varchar(255) DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `app`
--

CREATE TABLE `app` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `app`
--

INSERT INTO `app` (`id`, `name`) VALUES
(1, 'Main');

-- --------------------------------------------------------

--
-- Table structure for table `app_image`
--

CREATE TABLE `app_image` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT 'new',
  `image` varchar(255) DEFAULT 'assets/media/app_image/default.png',
  `image_thumb` varchar(255) DEFAULT 'assets/media/app_image/default.png',
  `height` int(11) DEFAULT NULL,
  `width` int(11) DEFAULT NULL,
  `ti` int(11) NOT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `app_image`
--

INSERT INTO `app_image` (`id`, `key_code`, `name`, `image`, `image_thumb`, `height`, `width`, `ti`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 'shop_logo', 'logo', 'assets/media/app_image/05c26eaf58580dd4676eac7aeb2199.webp', 'assets/media/app_image/default.png', 55, 175, 0, 1, 1, 0, NULL, '2024-12-27 11:32:42', '2024-12-27 11:32:42');

-- --------------------------------------------------------

--
-- Table structure for table `app_setting`
--

CREATE TABLE `app_setting` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT 'new',
  `data_type` varchar(255) DEFAULT 'new',
  `value` text DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `bank`
--

CREATE TABLE `bank` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(511) DEFAULT 'assets/media/bank/default.png',
  `country__id` bigint(20) UNSIGNED DEFAULT NULL,
  `api` text DEFAULT NULL,
  `app_ac` varchar(255) DEFAULT '0000000000000',
  `app_ac_name` varchar(255) DEFAULT '0000000000000',
  `des` text DEFAULT NULL,
  `is_addfund` int(11) NOT NULL DEFAULT 1,
  `is_withdraw` int(11) NOT NULL DEFAULT 1,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bank`
--

INSERT INTO `bank` (`id`, `key_code`, `name`, `image`, `country__id`, `api`, `app_ac`, `app_ac_name`, `des`, `is_addfund`, `is_withdraw`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 'nagad', 'Nagad', '/public/media/bank/uploads-1741773868635.webp', NULL, NULL, '0000000000000', '0000000000000', NULL, 1, 1, 1, 1, 0, NULL, NULL, '2025-03-12 10:04:28'),
(2, 'bkash', 'bKash', '/public/media/bank/uploads-1741773912081.jpg', NULL, NULL, '0000000000000', '0000000000000', NULL, 1, 1, 1, 1, 0, NULL, NULL, '2025-03-12 10:05:12'),
(3, 'ssss', 'ssss', '/public/media/bank/uploads-1741772958138.jpg', NULL, NULL, '0000000000000', '0000000000000', NULL, 1, 1, 1, 1, 1, NULL, '2025-03-12 09:49:18', '2025-03-12 09:51:59'),
(4, 'xcx', 'xcx', '/public/media/bank/default.png', NULL, NULL, '0000000000000', '0000000000000', 'sss', 1, 1, 1, 1, 0, NULL, '2025-03-12 10:28:09', '2025-03-12 10:31:32'),
(5, 'fdf', 'fdf', '/public/media/bank/default.png', NULL, NULL, '0000000000000', '0000000000000', 'ggghhh', 1, 1, 1, 1, 0, NULL, '2025-03-12 10:35:16', '2025-03-12 10:35:16'),
(6, 'as2er', 'as2er', '/public/media/bank/uploads-1741776670888.png', NULL, NULL, '0000000000000', '0000000000000', 'drfg', 1, 1, 1, 1, 0, NULL, '2025-03-12 10:51:10', '2025-03-12 10:51:10');

-- --------------------------------------------------------

--
-- Table structure for table `bill`
--

CREATE TABLE `bill` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `duration` int(11) NOT NULL DEFAULT 30,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `bill_pay`
--

CREATE TABLE `bill_pay` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bill__id` bigint(20) UNSIGNED DEFAULT NULL,
  `creator__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `month_int` int(11) DEFAULT 202007,
  `note` text DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT 1,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `country`
--

CREATE TABLE `country` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key_code` varchar(127) DEFAULT NULL,
  `name` varchar(127) DEFAULT NULL,
  `native_name` varchar(127) DEFAULT NULL,
  `iso3` varchar(127) DEFAULT NULL,
  `iso2` varchar(127) DEFAULT NULL,
  `phone_code` varchar(127) DEFAULT NULL,
  `capital` varchar(127) DEFAULT NULL,
  `currency` varchar(65) DEFAULT NULL,
  `currency_symbol` varchar(65) DEFAULT NULL,
  `flag` int(11) DEFAULT 1,
  `flag_image` varchar(511) DEFAULT 'assets/media/country/default.png',
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `country`
--

INSERT INTO `country` (`id`, `key_code`, `name`, `native_name`, `iso3`, `iso2`, `phone_code`, `capital`, `currency`, `currency_symbol`, `flag`, `flag_image`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(10, 'afghanistan', 'Afghanistan', NULL, 'AFG', 'AF', '93', 'Kabul', 'AFN', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(11, 'aland_islands', 'Aland Islands', NULL, 'ALA', 'AX', '+358-18', 'Mariehamn', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(12, 'albania', 'Albania', NULL, 'ALB', 'AL', '355', 'Tirana', 'ALL', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(13, 'algeria', 'Algeria', NULL, 'DZA', 'DZ', '213', 'Algiers', 'DZD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(14, 'american_samoa', 'American Samoa', NULL, 'ASM', 'AS', '+1-684', 'Pago Pago', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(15, 'andorra', 'Andorra', NULL, 'AND', 'AD', '376', 'Andorra la Vella', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(16, 'angola', 'Angola', NULL, 'AGO', 'AO', '244', 'Luanda', 'AOA', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(17, 'anguilla', 'Anguilla', NULL, 'AIA', 'AI', '+1-264', 'The Valley', 'XCD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(18, 'antarctica', 'Antarctica', NULL, 'ATA', 'AQ', '', '', '', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(19, 'antigua_and_barbuda', 'Antigua And Barbuda', NULL, 'ATG', 'AG', '+1-268', 'St. John\'s', 'XCD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(20, 'argentina', 'Argentina', NULL, 'ARG', 'AR', '54', 'Buenos Aires', 'ARS', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(21, 'armenia', 'Armenia', NULL, 'ARM', 'AM', '374', 'Yerevan', 'AMD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(22, 'aruba', 'Aruba', NULL, 'ABW', 'AW', '297', 'Oranjestad', 'AWG', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(23, 'australia', 'Australia', NULL, 'AUS', 'AU', '61', 'Canberra', 'AUD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(24, 'austria', 'Austria', NULL, 'AUT', 'AT', '43', 'Vienna', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(25, 'azerbaijan', 'Azerbaijan', NULL, 'AZE', 'AZ', '994', 'Baku', 'AZN', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(26, 'bahamas_the', 'Bahamas The', NULL, 'BHS', 'BS', '+1-242', 'Nassau', 'BSD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(27, 'bahrain', 'Bahrain', NULL, 'BHR', 'BH', '973', 'Manama', 'BHD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(28, 'bangladesh', 'Bangladesh', NULL, 'BGD', 'BD', '880', 'Dhaka', 'BDT', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(29, 'barbados', 'Barbados', NULL, 'BRB', 'BB', '+1-246', 'Bridgetown', 'BBD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(30, 'belarus', 'Belarus', NULL, 'BLR', 'BY', '375', 'Minsk', 'BYR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(31, 'belgium', 'Belgium', NULL, 'BEL', 'BE', '32', 'Brussels', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(32, 'belize', 'Belize', NULL, 'BLZ', 'BZ', '501', 'Belmopan', 'BZD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(33, 'benin', 'Benin', NULL, 'BEN', 'BJ', '229', 'Porto-Novo', 'XOF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(34, 'bermuda', 'Bermuda', NULL, 'BMU', 'BM', '+1-441', 'Hamilton', 'BMD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(35, 'bhutan', 'Bhutan', NULL, 'BTN', 'BT', '975', 'Thimphu', 'BTN', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(36, 'bolivia', 'Bolivia', NULL, 'BOL', 'BO', '591', 'Sucre', 'BOB', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(37, 'bosnia_and_herzegovina', 'Bosnia and Herzegovina', NULL, 'BIH', 'BA', '387', 'Sarajevo', 'BAM', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(38, 'botswana', 'Botswana', NULL, 'BWA', 'BW', '267', 'Gaborone', 'BWP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(39, 'bouvet_island', 'Bouvet Island', NULL, 'BVT', 'BV', '', '', 'NOK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(40, 'brazil', 'Brazil', NULL, 'BRA', 'BR', '55', 'Brasilia', 'BRL', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(41, 'british_indian_ocean_territory', 'British Indian Ocean Territory', NULL, 'IOT', 'IO', '246', 'Diego Garcia', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(42, 'brunei', 'Brunei', NULL, 'BRN', 'BN', '673', 'Bandar Seri Begawan', 'BND', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(43, 'bulgaria', 'Bulgaria', NULL, 'BGR', 'BG', '359', 'Sofia', 'BGN', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(44, 'burkina_faso', 'Burkina Faso', NULL, 'BFA', 'BF', '226', 'Ouagadougou', 'XOF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(45, 'burundi', 'Burundi', NULL, 'BDI', 'BI', '257', 'Bujumbura', 'BIF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(46, 'cambodia', 'Cambodia', NULL, 'KHM', 'KH', '855', 'Phnom Penh', 'KHR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(47, 'cameroon', 'Cameroon', NULL, 'CMR', 'CM', '237', 'Yaounde', 'XAF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(48, 'canada', 'Canada', NULL, 'CAN', 'CA', '1', 'Ottawa', 'CAD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(49, 'cape_verde', 'Cape Verde', NULL, 'CPV', 'CV', '238', 'Praia', 'CVE', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(50, 'cayman_islands', 'Cayman Islands', NULL, 'CYM', 'KY', '+1-345', 'George Town', 'KYD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(51, 'central_african_republic', 'Central African Republic', NULL, 'CAF', 'CF', '236', 'Bangui', 'XAF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(52, 'chad', 'Chad', NULL, 'TCD', 'TD', '235', 'N\'Djamena', 'XAF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(53, 'chile', 'Chile', NULL, 'CHL', 'CL', '56', 'Santiago', 'CLP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(54, 'china', 'China', NULL, 'CHN', 'CN', '86', 'Beijing', 'CNY', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(55, 'christmas_island', 'Christmas Island', NULL, 'CXR', 'CX', '61', 'Flying Fish Cove', 'AUD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(56, 'cocos_(keeling)_islands', 'Cocos (Keeling) Islands', NULL, 'CCK', 'CC', '61', 'West Island', 'AUD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(57, 'colombia', 'Colombia', NULL, 'COL', 'CO', '57', 'Bogota', 'COP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(58, 'comoros', 'Comoros', NULL, 'COM', 'KM', '269', 'Moroni', 'KMF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(59, 'congo', 'Congo', NULL, 'COG', 'CG', '242', 'Brazzaville', 'XAF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(60, 'congo_the_democratic_republic_of_the', 'Congo The Democratic Republic Of The', NULL, 'COD', 'CD', '243', 'Kinshasa', 'CDF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(61, 'cook_islands', 'Cook Islands', NULL, 'COK', 'CK', '682', 'Avarua', 'NZD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(62, 'costa_rica', 'Costa Rica', NULL, 'CRI', 'CR', '506', 'San Jose', 'CRC', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(63, 'cote_d\'ivoire_(ivory_coast)', 'Cote D\'Ivoire (Ivory Coast)', NULL, 'CIV', 'CI', '225', 'Yamoussoukro', 'XOF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(64, 'croatia_(hrvatska)', 'Croatia (Hrvatska)', NULL, 'HRV', 'HR', '385', 'Zagreb', 'HRK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(65, 'cuba', 'Cuba', NULL, 'CUB', 'CU', '53', 'Havana', 'CUP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(66, 'cyprus', 'Cyprus', NULL, 'CYP', 'CY', '357', 'Nicosia', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(67, 'czech_republic', 'Czech Republic', NULL, 'CZE', 'CZ', '420', 'Prague', 'CZK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(68, 'denmark', 'Denmark', NULL, 'DNK', 'DK', '45', 'Copenhagen', 'DKK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(69, 'djibouti', 'Djibouti', NULL, 'DJI', 'DJ', '253', 'Djibouti', 'DJF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(70, 'dominica', 'Dominica', NULL, 'DMA', 'DM', '+1-767', 'Roseau', 'XCD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(71, 'dominican_republic', 'Dominican Republic', NULL, 'DOM', 'DO', '+1-809 and 1-829', 'Santo Domingo', 'DOP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(72, 'east_timor', 'East Timor', NULL, 'TLS', 'TL', '670', 'Dili', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(73, 'ecuador', 'Ecuador', NULL, 'ECU', 'EC', '593', 'Quito', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(74, 'egypt', 'Egypt', NULL, 'EGY', 'EG', '20', 'Cairo', 'EGP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(75, 'el_salvador', 'El Salvador', NULL, 'SLV', 'SV', '503', 'San Salvador', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(76, 'equatorial_guinea', 'Equatorial Guinea', NULL, 'GNQ', 'GQ', '240', 'Malabo', 'XAF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(77, 'eritrea', 'Eritrea', NULL, 'ERI', 'ER', '291', 'Asmara', 'ERN', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(78, 'estonia', 'Estonia', NULL, 'EST', 'EE', '372', 'Tallinn', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(79, 'ethiopia', 'Ethiopia', NULL, 'ETH', 'ET', '251', 'Addis Ababa', 'ETB', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(80, 'falkland_islands', 'Falkland Islands', NULL, 'FLK', 'FK', '500', 'Stanley', 'FKP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(81, 'faroe_islands', 'Faroe Islands', NULL, 'FRO', 'FO', '298', 'Torshavn', 'DKK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(82, 'fiji_islands', 'Fiji Islands', NULL, 'FJI', 'FJ', '679', 'Suva', 'FJD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(83, 'finland', 'Finland', NULL, 'FIN', 'FI', '358', 'Helsinki', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(84, 'france', 'France', NULL, 'FRA', 'FR', '33', 'Paris', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(85, 'french_guiana', 'French Guiana', NULL, 'GUF', 'GF', '594', 'Cayenne', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(86, 'french_polynesia', 'French Polynesia', NULL, 'PYF', 'PF', '689', 'Papeete', 'XPF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(87, 'french_southern_territories', 'French Southern Territories', NULL, 'ATF', 'TF', '', 'Port-aux-Francais', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(88, 'gabon', 'Gabon', NULL, 'GAB', 'GA', '241', 'Libreville', 'XAF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(89, 'gambia_the', 'Gambia The', NULL, 'GMB', 'GM', '220', 'Banjul', 'GMD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(90, 'georgia', 'Georgia', NULL, 'GEO', 'GE', '995', 'Tbilisi', 'GEL', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(91, 'germany', 'Germany', NULL, 'DEU', 'DE', '49', 'Berlin', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(92, 'ghana', 'Ghana', NULL, 'GHA', 'GH', '233', 'Accra', 'GHS', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(93, 'gibraltar', 'Gibraltar', NULL, 'GIB', 'GI', '350', 'Gibraltar', 'GIP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(94, 'greece', 'Greece', NULL, 'GRC', 'GR', '30', 'Athens', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(95, 'greenland', 'Greenland', NULL, 'GRL', 'GL', '299', 'Nuuk', 'DKK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(96, 'grenada', 'Grenada', NULL, 'GRD', 'GD', '+1-473', 'St. George\'s', 'XCD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(97, 'guadeloupe', 'Guadeloupe', NULL, 'GLP', 'GP', '590', 'Basse-Terre', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(98, 'guam', 'Guam', NULL, 'GUM', 'GU', '+1-671', 'Hagatna', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(99, 'guatemala', 'Guatemala', NULL, 'GTM', 'GT', '502', 'Guatemala City', 'GTQ', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(100, 'guernsey_and_alderney', 'Guernsey and Alderney', NULL, 'GGY', 'GG', '+44-1481', 'St Peter Port', 'GBP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(101, 'guinea', 'Guinea', NULL, 'GIN', 'GN', '224', 'Conakry', 'GNF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(102, 'guinea-bissau', 'Guinea-Bissau', NULL, 'GNB', 'GW', '245', 'Bissau', 'XOF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(103, 'guyana', 'Guyana', NULL, 'GUY', 'GY', '592', 'Georgetown', 'GYD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(104, 'haiti', 'Haiti', NULL, 'HTI', 'HT', '509', 'Port-au-Prince', 'HTG', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(105, 'heard_and_mcdonald_islands', 'Heard and McDonald Islands', NULL, 'HMD', 'HM', ' ', '', 'AUD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(106, 'honduras', 'Honduras', NULL, 'HND', 'HN', '504', 'Tegucigalpa', 'HNL', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(107, 'hong_kong_s.a.r.', 'Hong Kong S.A.R.', NULL, 'HKG', 'HK', '852', 'Hong Kong', 'HKD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(108, 'hungary', 'Hungary', NULL, 'HUN', 'HU', '36', 'Budapest', 'HUF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(109, 'iceland', 'Iceland', NULL, 'ISL', 'IS', '354', 'Reykjavik', 'ISK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(110, 'india', 'India', NULL, 'IND', 'IN', '91', 'New Delhi', 'INR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(111, 'indonesia', 'Indonesia', NULL, 'IDN', 'ID', '62', 'Jakarta', 'IDR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(112, 'iran', 'Iran', NULL, 'IRN', 'IR', '98', 'Tehran', 'IRR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(113, 'iraq', 'Iraq', NULL, 'IRQ', 'IQ', '964', 'Baghdad', 'IQD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(114, 'ireland', 'Ireland', NULL, 'IRL', 'IE', '353', 'Dublin', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(115, 'israel', 'Israel', NULL, 'ISR', 'IL', '972', 'Jerusalem', 'ILS', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(116, 'italy', 'Italy', NULL, 'ITA', 'IT', '39', 'Rome', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(117, 'jamaica', 'Jamaica', NULL, 'JAM', 'JM', '+1-876', 'Kingston', 'JMD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(118, 'japan', 'Japan', NULL, 'JPN', 'JP', '81', 'Tokyo', 'JPY', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(119, 'jersey', 'Jersey', NULL, 'JEY', 'JE', '+44-1534', 'Saint Helier', 'GBP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(120, 'jordan', 'Jordan', NULL, 'JOR', 'JO', '962', 'Amman', 'JOD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(121, 'kazakhstan', 'Kazakhstan', NULL, 'KAZ', 'KZ', '7', 'Astana', 'KZT', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(122, 'kenya', 'Kenya', NULL, 'KEN', 'KE', '254', 'Nairobi', 'KES', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(123, 'kiribati', 'Kiribati', NULL, 'KIR', 'KI', '686', 'Tarawa', 'AUD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(124, 'korea_north\n', 'Korea North\n', NULL, 'PRK', 'KP', '850', 'Pyongyang', 'KPW', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(125, 'korea_south', 'Korea South', NULL, 'KOR', 'KR', '82', 'Seoul', 'KRW', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(126, 'kuwait', 'Kuwait', NULL, 'KWT', 'KW', '965', 'Kuwait City', 'KWD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(127, 'kyrgyzstan', 'Kyrgyzstan', NULL, 'KGZ', 'KG', '996', 'Bishkek', 'KGS', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(128, 'laos', 'Laos', NULL, 'LAO', 'LA', '856', 'Vientiane', 'LAK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(129, 'latvia', 'Latvia', NULL, 'LVA', 'LV', '371', 'Riga', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(130, 'lebanon', 'Lebanon', NULL, 'LBN', 'LB', '961', 'Beirut', 'LBP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(131, 'lesotho', 'Lesotho', NULL, 'LSO', 'LS', '266', 'Maseru', 'LSL', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(132, 'liberia', 'Liberia', NULL, 'LBR', 'LR', '231', 'Monrovia', 'LRD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(133, 'libya', 'Libya', NULL, 'LBY', 'LY', '218', 'Tripolis', 'LYD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(134, 'liechtenstein', 'Liechtenstein', NULL, 'LIE', 'LI', '423', 'Vaduz', 'CHF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(135, 'lithuania', 'Lithuania', NULL, 'LTU', 'LT', '370', 'Vilnius', 'LTL', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(136, 'luxembourg', 'Luxembourg', NULL, 'LUX', 'LU', '352', 'Luxembourg', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(137, 'macau_s.a.r.', 'Macau S.A.R.', NULL, 'MAC', 'MO', '853', 'Macao', 'MOP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(138, 'macedonia', 'Macedonia', NULL, 'MKD', 'MK', '389', 'Skopje', 'MKD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(139, 'madagascar', 'Madagascar', NULL, 'MDG', 'MG', '261', 'Antananarivo', 'MGA', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(140, 'malawi', 'Malawi', NULL, 'MWI', 'MW', '265', 'Lilongwe', 'MWK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(141, 'malaysia', 'Malaysia', NULL, 'MYS', 'MY', '60', 'Kuala Lumpur', 'MYR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(142, 'maldives', 'Maldives', NULL, 'MDV', 'MV', '960', 'Male', 'MVR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(143, 'mali', 'Mali', NULL, 'MLI', 'ML', '223', 'Bamako', 'XOF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(144, 'malta', 'Malta', NULL, 'MLT', 'MT', '356', 'Valletta', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(145, 'man_(isle_of)', 'Man (Isle of)', NULL, 'IMN', 'IM', '+44-1624', 'Douglas, Isle of Man', 'GBP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(146, 'marshall_islands', 'Marshall Islands', NULL, 'MHL', 'MH', '692', 'Majuro', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(147, 'martinique', 'Martinique', NULL, 'MTQ', 'MQ', '596', 'Fort-de-France', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(148, 'mauritania', 'Mauritania', NULL, 'MRT', 'MR', '222', 'Nouakchott', 'MRO', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(149, 'mauritius', 'Mauritius', NULL, 'MUS', 'MU', '230', 'Port Louis', 'MUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(150, 'mayotte', 'Mayotte', NULL, 'MYT', 'YT', '262', 'Mamoudzou', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(151, 'mexico', 'Mexico', NULL, 'MEX', 'MX', '52', 'Mexico City', 'MXN', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(152, 'micronesia', 'Micronesia', NULL, 'FSM', 'FM', '691', 'Palikir', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(153, 'moldova', 'Moldova', NULL, 'MDA', 'MD', '373', 'Chisinau', 'MDL', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(154, 'monaco', 'Monaco', NULL, 'MCO', 'MC', '377', 'Monaco', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(155, 'mongolia', 'Mongolia', NULL, 'MNG', 'MN', '976', 'Ulan Bator', 'MNT', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(156, 'montenegro', 'Montenegro', NULL, 'MNE', 'ME', '382', 'Podgorica', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(157, 'montserrat', 'Montserrat', NULL, 'MSR', 'MS', '+1-664', 'Plymouth', 'XCD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(158, 'morocco', 'Morocco', NULL, 'MAR', 'MA', '212', 'Rabat', 'MAD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(159, 'mozambique', 'Mozambique', NULL, 'MOZ', 'MZ', '258', 'Maputo', 'MZN', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(160, 'myanmar', 'Myanmar', NULL, 'MMR', 'MM', '95', 'Nay Pyi Taw', 'MMK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(161, 'namibia', 'Namibia', NULL, 'NAM', 'NA', '264', 'Windhoek', 'NAD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(162, 'nauru', 'Nauru', NULL, 'NRU', 'NR', '674', 'Yaren', 'AUD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(163, 'nepal', 'Nepal', NULL, 'NPL', 'NP', '977', 'Kathmandu', 'NPR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(164, 'netherlands_antilles', 'Netherlands Antilles', NULL, 'ANT', 'AN', '', '', '', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(165, 'netherlands_the', 'Netherlands The', NULL, 'NLD', 'NL', '31', 'Amsterdam', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(166, 'new_caledonia', 'New Caledonia', NULL, 'NCL', 'NC', '687', 'Noumea', 'XPF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(167, 'new_zealand', 'New Zealand', NULL, 'NZL', 'NZ', '64', 'Wellington', 'NZD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(168, 'nicaragua', 'Nicaragua', NULL, 'NIC', 'NI', '505', 'Managua', 'NIO', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(169, 'niger', 'Niger', NULL, 'NER', 'NE', '227', 'Niamey', 'XOF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(170, 'nigeria', 'Nigeria', NULL, 'NGA', 'NG', '234', 'Abuja', 'NGN', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(171, 'niue', 'Niue', NULL, 'NIU', 'NU', '683', 'Alofi', 'NZD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(172, 'norfolk_island', 'Norfolk Island', NULL, 'NFK', 'NF', '672', 'Kingston', 'AUD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(173, 'northern_mariana_islands', 'Northern Mariana Islands', NULL, 'MNP', 'MP', '+1-670', 'Saipan', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(174, 'norway', 'Norway', NULL, 'NOR', 'NO', '47', 'Oslo', 'NOK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(175, 'oman', 'Oman', NULL, 'OMN', 'OM', '968', 'Muscat', 'OMR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(176, 'pakistan', 'Pakistan', NULL, 'PAK', 'PK', '92', 'Islamabad', 'PKR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(177, 'palau', 'Palau', NULL, 'PLW', 'PW', '680', 'Melekeok', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(178, 'palestinian_territory_occupied', 'Palestinian Territory Occupied', NULL, 'PSE', 'PS', '970', 'East Jerusalem', 'ILS', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(179, 'panama', 'Panama', NULL, 'PAN', 'PA', '507', 'Panama City', 'PAB', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(180, 'papua_new_guinea', 'Papua new Guinea', NULL, 'PNG', 'PG', '675', 'Port Moresby', 'PGK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(181, 'paraguay', 'Paraguay', NULL, 'PRY', 'PY', '595', 'Asuncion', 'PYG', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(182, 'peru', 'Peru', NULL, 'PER', 'PE', '51', 'Lima', 'PEN', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(183, 'philippines', 'Philippines', NULL, 'PHL', 'PH', '63', 'Manila', 'PHP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(184, 'pitcairn_island', 'Pitcairn Island', NULL, 'PCN', 'PN', '870', 'Adamstown', 'NZD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(185, 'poland', 'Poland', NULL, 'POL', 'PL', '48', 'Warsaw', 'PLN', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(186, 'portugal', 'Portugal', NULL, 'PRT', 'PT', '351', 'Lisbon', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(187, 'puerto_rico', 'Puerto Rico', NULL, 'PRI', 'PR', '+1-787 and 1-939', 'San Juan', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(188, 'qatar', 'Qatar', NULL, 'QAT', 'QA', '974', 'Doha', 'QAR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(189, 'reunion', 'Reunion', NULL, 'REU', 'RE', '262', 'Saint-Denis', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(190, 'romania', 'Romania', NULL, 'ROU', 'RO', '40', 'Bucharest', 'RON', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(191, 'russia', 'Russia', NULL, 'RUS', 'RU', '7', 'Moscow', 'RUB', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(192, 'rwanda', 'Rwanda', NULL, 'RWA', 'RW', '250', 'Kigali', 'RWF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(193, 'saint_helena', 'Saint Helena', NULL, 'SHN', 'SH', '290', 'Jamestown', 'SHP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(194, 'saint_kitts_and_nevis', 'Saint Kitts And Nevis', NULL, 'KNA', 'KN', '+1-869', 'Basseterre', 'XCD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(195, 'saint_lucia', 'Saint Lucia', NULL, 'LCA', 'LC', '+1-758', 'Castries', 'XCD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(196, 'saint_pierre_and_miquelon', 'Saint Pierre and Miquelon', NULL, 'SPM', 'PM', '508', 'Saint-Pierre', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(197, 'saint_vincent_and_the_grenadines', 'Saint Vincent And The Grenadines', NULL, 'VCT', 'VC', '+1-784', 'Kingstown', 'XCD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(198, 'saint-barthelemy', 'Saint-Barthelemy', NULL, 'BLM', 'BL', '590', 'Gustavia', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(199, 'saint-martin_(french_part)', 'Saint-Martin (French part)', NULL, 'MAF', 'MF', '590', 'Marigot', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(200, 'samoa', 'Samoa', NULL, 'WSM', 'WS', '685', 'Apia', 'WST', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(201, 'san_marino', 'San Marino', NULL, 'SMR', 'SM', '378', 'San Marino', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(202, 'sao_tome_and_principe', 'Sao Tome and Principe', NULL, 'STP', 'ST', '239', 'Sao Tome', 'STD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(203, 'saudi_arabia', 'Saudi Arabia', NULL, 'SAU', 'SA', '966', 'Riyadh', 'SAR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(204, 'senegal', 'Senegal', NULL, 'SEN', 'SN', '221', 'Dakar', 'XOF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(205, 'serbia', 'Serbia', NULL, 'SRB', 'RS', '381', 'Belgrade', 'RSD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(206, 'seychelles', 'Seychelles', NULL, 'SYC', 'SC', '248', 'Victoria', 'SCR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(207, 'sierra_leone', 'Sierra Leone', NULL, 'SLE', 'SL', '232', 'Freetown', 'SLL', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(208, 'singapore', 'Singapore', NULL, 'SGP', 'SG', '65', 'Singapur', 'SGD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(209, 'slovakia', 'Slovakia', NULL, 'SVK', 'SK', '421', 'Bratislava', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(210, 'slovenia', 'Slovenia', NULL, 'SVN', 'SI', '386', 'Ljubljana', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(211, 'solomon_islands', 'Solomon Islands', NULL, 'SLB', 'SB', '677', 'Honiara', 'SBD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(212, 'somalia', 'Somalia', NULL, 'SOM', 'SO', '252', 'Mogadishu', 'SOS', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(213, 'south_africa', 'South Africa', NULL, 'ZAF', 'ZA', '27', 'Pretoria', 'ZAR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(214, 'south_georgia', 'South Georgia', NULL, 'SGS', 'GS', '', 'Grytviken', 'GBP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(215, 'south_sudan', 'South Sudan', NULL, 'SSD', 'SS', '211', 'Juba', 'SSP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(216, 'spain', 'Spain', NULL, 'ESP', 'ES', '34', 'Madrid', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(217, 'sri_lanka', 'Sri Lanka', NULL, 'LKA', 'LK', '94', 'Colombo', 'LKR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(218, 'sudan', 'Sudan', NULL, 'SDN', 'SD', '249', 'Khartoum', 'SDG', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(219, 'suriname', 'Suriname', NULL, 'SUR', 'SR', '597', 'Paramaribo', 'SRD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(220, 'svalbard_and_jan_mayen_islands', 'Svalbard And Jan Mayen Islands', NULL, 'SJM', 'SJ', '47', 'Longyearbyen', 'NOK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(221, 'swaziland', 'Swaziland', NULL, 'SWZ', 'SZ', '268', 'Mbabane', 'SZL', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(222, 'sweden', 'Sweden', NULL, 'SWE', 'SE', '46', 'Stockholm', 'SEK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(223, 'switzerland', 'Switzerland', NULL, 'CHE', 'CH', '41', 'Berne', 'CHF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(224, 'syria', 'Syria', NULL, 'SYR', 'SY', '963', 'Damascus', 'SYP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(225, 'taiwan', 'Taiwan', NULL, 'TWN', 'TW', '886', 'Taipei', 'TWD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(226, 'tajikistan', 'Tajikistan', NULL, 'TJK', 'TJ', '992', 'Dushanbe', 'TJS', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(227, 'tanzania', 'Tanzania', NULL, 'TZA', 'TZ', '255', 'Dodoma', 'TZS', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(228, 'thailand', 'Thailand', NULL, 'THA', 'TH', '66', 'Bangkok', 'THB', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(229, 'togo', 'Togo', NULL, 'TGO', 'TG', '228', 'Lome', 'XOF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(230, 'tokelau', 'Tokelau', NULL, 'TKL', 'TK', '690', '', 'NZD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(231, 'tonga', 'Tonga', NULL, 'TON', 'TO', '676', 'Nuku\'alofa', 'TOP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(232, 'trinidad_and_tobago', 'Trinidad And Tobago', NULL, 'TTO', 'TT', '+1-868', 'Port of Spain', 'TTD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(233, 'tunisia', 'Tunisia', NULL, 'TUN', 'TN', '216', 'Tunis', 'TND', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(234, 'turkey', 'Turkey', NULL, 'TUR', 'TR', '90', 'Ankara', 'TRY', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(235, 'turkmenistan', 'Turkmenistan', NULL, 'TKM', 'TM', '993', 'Ashgabat', 'TMT', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(236, 'turks_and_caicos_islands', 'Turks And Caicos Islands', NULL, 'TCA', 'TC', '+1-649', 'Cockburn Town', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(237, 'tuvalu', 'Tuvalu', NULL, 'TUV', 'TV', '688', 'Funafuti', 'AUD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(238, 'uganda', 'Uganda', NULL, 'UGA', 'UG', '256', 'Kampala', 'UGX', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(239, 'ukraine', 'Ukraine', NULL, 'UKR', 'UA', '380', 'Kiev', 'UAH', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(240, 'united_arab_emirates', 'United Arab Emirates', NULL, 'ARE', 'AE', '971', 'Abu Dhabi', 'AED', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(241, 'united_kingdom', 'United Kingdom', NULL, 'GBR', 'GB', '44', 'London', 'GBP', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(242, 'united_states', 'United States', NULL, 'USA', 'US', '1', 'Washington', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(243, 'united_states_minor_outlying_islands', 'United States Minor Outlying Islands', NULL, 'UMI', 'UM', '1', '', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(244, 'uruguay', 'Uruguay', NULL, 'URY', 'UY', '598', 'Montevideo', 'UYU', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(245, 'uzbekistan', 'Uzbekistan', NULL, 'UZB', 'UZ', '998', 'Tashkent', 'UZS', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(246, 'vanuatu', 'Vanuatu', NULL, 'VUT', 'VU', '678', 'Port Vila', 'VUV', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(247, 'vatican_city_state_(holy_see)', 'Vatican City State (Holy See)', NULL, 'VAT', 'VA', '379', 'Vatican City', 'EUR', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(248, 'venezuela', 'Venezuela', NULL, 'VEN', 'VE', '58', 'Caracas', 'VEF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(249, 'vietnam', 'Vietnam', NULL, 'VNM', 'VN', '84', 'Hanoi', 'VND', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(250, 'virgin_islands_(british)', 'Virgin Islands (British)', NULL, 'VGB', 'VG', '+1-284', 'Road Town', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(251, 'virgin_islands_(us)', 'Virgin Islands (US)', NULL, 'VIR', 'VI', '+1-340', 'Charlotte Amalie', 'USD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(252, 'wallis_and_futuna_islands', 'Wallis And Futuna Islands', NULL, 'WLF', 'WF', '681', 'Mata Utu', 'XPF', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(253, 'western_sahara', 'Western Sahara', NULL, 'ESH', 'EH', '212', 'El-Aaiun', 'MAD', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(254, 'yemen', 'Yemen', NULL, 'YEM', 'YE', '967', 'Sanaa', 'YER', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(255, 'zambia', 'Zambia', NULL, 'ZMB', 'ZM', '260', 'Lusaka', 'ZMK', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL),
(256, 'zimbabwe', 'Zimbabwe', NULL, 'ZWE', 'ZW', '263', 'Harare', 'ZWL', NULL, 1, 'assets/media/country/default.png', 1, 1, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `credit_rec`
--

CREATE TABLE `credit_rec` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `creator__id` bigint(20) UNSIGNED DEFAULT NULL,
  `summary` varchar(511) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `table_name` varchar(255) DEFAULT NULL,
  `row__id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `currency`
--

CREATE TABLE `currency` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key_code` varchar(127) DEFAULT NULL,
  `name` varchar(127) DEFAULT NULL,
  `code_c3` varchar(127) DEFAULT NULL,
  `code_c2` varchar(127) DEFAULT NULL,
  `symbol` varchar(64) DEFAULT NULL,
  `value` decimal(12,2) NOT NULL DEFAULT 1.00,
  `flag_image` varchar(511) DEFAULT 'assets/media/currency/default.png',
  `localization` varchar(127) DEFAULT NULL,
  `country__id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_default` int(11) NOT NULL DEFAULT 0,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `currency`
--

INSERT INTO `currency` (`id`, `key_code`, `name`, `code_c3`, `code_c2`, `symbol`, `value`, `flag_image`, `localization`, `country__id`, `is_default`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 'usd', 'US Dollar', 'USD', 'USD', '$', '1.00', 'assets/media/currency/default.png', NULL, NULL, 0, 1, 1, 0, NULL, NULL, NULL),
(2, 'eru', 'Euro', 'EUR', 'EU', '€', '1.00', 'assets/media/currency/default.png', NULL, NULL, 0, 1, 1, 0, NULL, NULL, NULL),
(3, 'taka', 'Bangladeshi Taka', 'BDT', 'TK', '৳', '1.00', 'assets/media/currency/default.png', NULL, NULL, 0, 1, 1, 0, NULL, NULL, NULL),
(4, 'cny', 'Chinese Yuan', 'CNY', 'CNY', 'CN¥', '1.00', 'assets/media/currency/default.png', NULL, NULL, 0, 1, 1, 0, NULL, NULL, NULL),
(5, 'gbp', 'British Pound Sterling', 'GBP', 'GBP', '£', '1.00', 'assets/media/currency/default.png', NULL, NULL, 0, 1, 1, 0, NULL, NULL, NULL),
(6, 'jpy', 'Japanese Yen', 'JPY', 'JPY', '¥', '1.00', 'assets/media/currency/default.png', NULL, NULL, 0, 1, 1, 0, NULL, NULL, NULL),
(7, 'rub', 'Russian Ruble', 'RUB', 'RUB', '₽.', '1.00', 'assets/media/currency/default.png', NULL, NULL, 0, 1, 1, 0, NULL, NULL, NULL),
(8, 'inr', 'Indian Rupee', 'INR', 'RS', '₹', '1.00', 'assets/media/currency/default.png', NULL, NULL, 0, 1, 1, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `debit_rec`
--

CREATE TABLE `debit_rec` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `creator__id` bigint(20) UNSIGNED DEFAULT NULL,
  `summary` varchar(511) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `table_name` varchar(255) DEFAULT NULL,
  `row__id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `due_pay`
--

CREATE TABLE `due_pay` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment_receive__id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `due_pay`
--

INSERT INTO `due_pay` (`id`, `user__id`, `amount`, `payment_receive__id`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(3, 100020, '0.00', 41, 1, 1, 0, NULL, '2025-03-25 14:24:12', '2025-03-25 14:24:12'),
(5, 100021, '400.00', 46, 1, 1, 1, NULL, '2025-03-25 17:49:07', '2025-03-25 17:51:12');

-- --------------------------------------------------------

--
-- Table structure for table `expense`
--

CREATE TABLE `expense` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `due` decimal(12,2) NOT NULL DEFAULT 0.00,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `expense_type__id` bigint(20) UNSIGNED DEFAULT NULL,
  `des` text DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type_name` varchar(255) DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `expense`
--

INSERT INTO `expense` (`id`, `amount`, `due`, `bank__id`, `wallet__id`, `expense_type__id`, `des`, `name`, `type_name`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, '300.00', '0.00', 1, 11, NULL, 'wsdfaqsdf', 'bill', 'net bill', 1, 1, 0, 'asdasd', '2025-03-31 08:47:44', '2025-03-17 12:51:12'),
(2, '500.00', '0.00', 2, 11, NULL, NULL, 'off', 'ok', 1, 1, 0, NULL, '2025-03-17 09:09:24', '2025-03-17 13:18:55');

-- --------------------------------------------------------

--
-- Table structure for table `expense_type`
--

CREATE TABLE `expense_type` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `des` varchar(521) DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT 1,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `expense_type`
--

INSERT INTO `expense_type` (`id`, `name`, `des`, `count`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 'WiFi bill', NULL, 1, 1, 1, 0, NULL, '2025-02-13 08:46:45', '2025-02-12 18:00:00'),
(2, 'employee Salary', NULL, 1, 1, 1, 0, NULL, '2025-02-13 08:46:45', '2025-02-12 18:00:00'),
(3, 'Other Expense', NULL, 1, 1, 1, 0, NULL, '2025-02-13 08:46:45', '2025-02-12 18:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `loan`
--

CREATE TABLE `loan` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `interest` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_open` int(11) NOT NULL DEFAULT 1,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `payment_receive`
--

CREATE TABLE `payment_receive` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user__id` bigint(20) UNSIGNED DEFAULT NULL,
  `service__id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_service__id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_service_ins__id` bigint(20) UNSIGNED DEFAULT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment` decimal(12,2) NOT NULL DEFAULT 0.00,
  `due` decimal(12,2) NOT NULL DEFAULT 0.00,
  `sql` text DEFAULT NULL,
  `table_name` varchar(255) DEFAULT 'new table',
  `row__id` bigint(20) UNSIGNED DEFAULT NULL,
  `note` text DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `payment_receive`
--

INSERT INTO `payment_receive` (`id`, `user__id`, `service__id`, `user_service__id`, `user_service_ins__id`, `bank__id`, `wallet__id`, `amount`, `payment`, `due`, `sql`, `table_name`, `row__id`, `note`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 100003, 2, 7, NULL, 2, 11, '0.00', '1200.00', '0.00', NULL, 'user_service', 7, NULL, 1, 1, 1, NULL, '2025-03-11 15:25:46', '2025-03-12 07:53:06'),
(2, 100004, 2, 9, NULL, 2, 11, '0.00', '1200.00', '0.00', NULL, 'user_service', 9, NULL, 1, 1, 0, NULL, '2025-03-11 15:28:21', '2025-03-11 15:28:21'),
(3, 100005, 15, 10, NULL, 2, 11, '0.00', '80.00', '0.00', NULL, 'user_service', 10, NULL, 1, 1, 0, NULL, '2025-03-12 07:58:01', '2025-03-12 07:58:01'),
(4, 100003, 2, 11, NULL, 1, 11, '0.00', '1500.00', '0.00', NULL, 'user_service', 11, NULL, 1, 1, 0, NULL, '2025-03-18 10:23:14', '2025-03-18 10:23:14'),
(5, 100004, 2, 12, NULL, 1, 11, '0.00', '3000.00', '0.00', NULL, 'user_service', 12, NULL, 1, 1, 0, NULL, '2025-03-18 11:03:26', '2025-03-18 11:03:26'),
(6, 100005, 2, 13, NULL, 1, 11, '0.00', '1000.00', '0.00', NULL, 'user_service', 13, NULL, 1, 1, 0, NULL, '2025-03-18 11:05:46', '2025-03-18 11:05:46'),
(7, 100005, 1, 14, NULL, 2, 11, '0.00', '3000.00', '0.00', NULL, 'user_service', 14, NULL, 1, 1, 0, NULL, '2025-03-19 07:36:58', '2025-03-19 07:36:58'),
(8, 100005, 1, 15, NULL, 2, 11, '0.00', '3000.00', '0.00', NULL, 'user_service', 15, NULL, 1, 1, 0, NULL, '2025-03-19 07:38:45', '2025-03-19 07:38:45'),
(9, 100001, 2, 16, NULL, 2, 11, '0.00', '1000.00', '0.00', NULL, 'user_service', 16, NULL, 1, 1, 0, NULL, '2025-03-19 07:41:41', '2025-03-19 07:41:41'),
(10, 100001, 2, 17, NULL, 2, 11, '0.00', '500.00', '0.00', NULL, 'user_service', 17, NULL, 1, 1, 0, NULL, '2025-03-19 07:42:24', '2025-03-19 07:42:24'),
(13, 100001, NULL, NULL, NULL, 1, 11, '0.00', '1000.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 0, NULL, '2025-03-19 08:29:45', '2025-03-19 08:29:45'),
(14, 100006, 2, 18, NULL, 5, 11, '0.00', '1500.00', '0.00', NULL, 'user_service', 18, NULL, 1, 1, 0, NULL, '2025-03-19 13:25:05', '2025-03-19 13:25:05'),
(15, 100005, NULL, NULL, NULL, 2, 11, '0.00', '5000.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 0, NULL, '2025-03-20 12:29:56', '2025-03-20 13:28:45'),
(16, 100005, NULL, NULL, NULL, 2, 11, '0.00', '1000.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 0, NULL, '2025-03-20 13:30:08', '2025-03-20 13:38:18'),
(23, 100011, 2, 22, NULL, 2, 11, '0.00', '1500.00', '0.00', NULL, 'user_service', 22, NULL, 1, 1, 0, NULL, '2025-03-20 14:38:24', '2025-03-20 14:38:24'),
(24, 100011, 2, 23, NULL, 1, 11, '0.00', '1000.00', '0.00', NULL, 'user_service', 23, NULL, 1, 1, 0, NULL, '2025-03-20 14:39:00', '2025-03-20 14:39:00'),
(25, 100011, NULL, NULL, NULL, 2, 11, '0.00', '4500.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 0, NULL, '2025-03-20 14:42:43', '2025-03-20 16:58:11'),
(26, 100011, NULL, NULL, NULL, 2, 11, '0.00', '500.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 0, NULL, '2025-03-20 16:51:45', '2025-03-20 17:00:41'),
(27, 100011, NULL, NULL, NULL, 4, 11, '0.00', '200.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 0, NULL, '2025-03-21 14:18:22', '2025-03-21 14:18:22'),
(28, 100011, NULL, NULL, NULL, 2, 11, '0.00', '1500.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 0, NULL, '2025-03-25 10:11:33', '2025-03-25 10:13:19'),
(29, 100017, 2, 24, NULL, 2, 11, '0.00', '200.00', '0.00', NULL, 'user_service', 24, NULL, 1, 1, 0, NULL, '2025-03-25 12:37:33', '2025-03-25 12:37:33'),
(30, 100017, NULL, NULL, NULL, 2, 11, '0.00', '300.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 0, NULL, '2025-03-25 12:38:42', '2025-03-25 12:38:42'),
(31, 100017, NULL, NULL, NULL, 1, 11, '0.00', '300.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 0, NULL, '2025-03-25 12:42:35', '2025-03-25 12:42:35'),
(32, 100018, 2, 25, NULL, 2, 11, '0.00', '1000.00', '0.00', NULL, 'user_service', 25, NULL, 1, 1, 0, NULL, '2025-03-25 12:46:35', '2025-03-25 12:46:35'),
(33, 100018, NULL, NULL, NULL, 2, 11, '0.00', '500.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 0, NULL, '2025-03-25 12:47:11', '2025-03-25 12:47:11'),
(34, 100018, NULL, NULL, NULL, 2, 11, '0.00', '500.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 0, NULL, '2025-03-25 12:50:00', '2025-03-25 12:50:00'),
(35, 100019, 2, 26, NULL, 2, 11, '0.00', '500.00', '0.00', NULL, 'user_service', 26, NULL, 1, 1, 0, NULL, '2025-03-25 12:51:26', '2025-03-25 12:51:26'),
(36, 100020, 2, 27, NULL, 2, 11, '0.00', '1000.00', '0.00', NULL, 'user_service', 27, NULL, 1, 1, 0, NULL, '2025-03-25 13:58:18', '2025-03-25 13:58:18'),
(40, 100020, NULL, NULL, NULL, 2, 11, '0.00', '300.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 1, NULL, '2025-03-25 14:20:13', '2025-03-25 14:20:13'),
(41, 100020, NULL, NULL, NULL, 2, 11, '0.00', '300.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 0, NULL, '2025-03-25 14:24:12', '2025-03-25 14:24:12'),
(42, 100021, 2, 28, NULL, 2, 11, '0.00', '1000.00', '0.00', NULL, 'user_service', 28, NULL, 1, 1, 1, NULL, '2025-03-25 17:10:10', '2025-03-25 17:19:34'),
(43, 100021, 2, 29, NULL, 2, 11, '0.00', '1000.00', '0.00', NULL, 'user_service', 29, NULL, 1, 1, 1, NULL, '2025-03-25 17:34:50', '2025-03-25 17:44:19'),
(44, 100021, NULL, NULL, NULL, 1, 11, '0.00', '300.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 1, NULL, '2025-03-25 17:35:39', '2025-03-25 17:35:39'),
(45, 100021, 2, 30, NULL, 2, 11, '0.00', '1000.00', '0.00', NULL, 'user_service', 30, NULL, 1, 1, 1, NULL, '2025-03-25 17:48:41', '2025-03-25 17:49:58'),
(46, 100021, NULL, NULL, NULL, 2, 11, '0.00', '400.00', '0.00', NULL, 'new table', NULL, NULL, 1, 1, 1, NULL, '2025-03-25 17:49:07', '2025-03-25 17:49:07');

-- --------------------------------------------------------

--
-- Table structure for table `payment_return`
--

CREATE TABLE `payment_return` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user__id` bigint(20) UNSIGNED DEFAULT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `count` int(11) NOT NULL DEFAULT 1,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `pay_bill`
--

CREATE TABLE `pay_bill` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `vendor__id` bigint(20) UNSIGNED DEFAULT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `creator__id` bigint(20) UNSIGNED DEFAULT NULL,
  `note` text DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `previous_due_adv`
--

CREATE TABLE `previous_due_adv` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user__id` bigint(20) UNSIGNED DEFAULT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `st_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `note` text DEFAULT NULL,
  `is_due` int(11) NOT NULL DEFAULT 1,
  `count` int(11) NOT NULL DEFAULT 1,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `previous_due_adv`
--

INSERT INTO `previous_due_adv` (`id`, `user__id`, `bank__id`, `wallet__id`, `amount`, `st_amount`, `note`, `is_due`, `count`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 100011, NULL, NULL, '0.00', '0.00', 'old due', 1, 1, 1, 1, 0, NULL, '2025-03-20 13:43:06', '2025-03-25 10:11:33'),
(2, 100012, NULL, NULL, '500.00', '0.00', 'note here......', 1, 1, 1, 1, 0, NULL, '2025-03-20 17:10:53', '2025-03-20 17:10:53'),
(3, 100013, NULL, NULL, '1000.00', '0.00', 'old due', 1, 1, 1, 1, 0, NULL, '2025-03-22 13:48:29', '2025-03-22 13:48:29'),
(4, 100017, NULL, NULL, '0.00', '400.00', 'old due 400', 1, 1, 1, 1, 0, NULL, '2025-03-25 12:36:47', '2025-03-25 12:42:35'),
(5, 100018, NULL, NULL, '600.00', '600.00', 'old due 600', 1, 1, 1, 1, 0, NULL, '2025-03-25 12:46:09', '2025-03-25 12:50:00'),
(6, 100019, NULL, NULL, '700.00', '700.00', 'old due 700', 1, 1, 1, 1, 0, NULL, '2025-03-25 12:51:01', '2025-03-25 12:51:01'),
(7, 100020, NULL, NULL, '600.00', '600.00', 'old due', 1, 1, 1, 1, 0, NULL, '2025-03-25 13:57:58', '2025-03-25 13:57:58'),
(8, 100021, NULL, NULL, '700.00', '700.00', 'old due 700', 1, 1, 1, 1, 0, NULL, '2025-03-25 17:09:45', '2025-03-25 17:09:45');

-- --------------------------------------------------------

--
-- Table structure for table `salary`
--

CREATE TABLE `salary` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `employee__id` bigint(20) UNSIGNED DEFAULT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `issuer__id` bigint(20) UNSIGNED DEFAULT NULL,
  `issue_date` date DEFAULT NULL,
  `salary_month` varchar(255) DEFAULT NULL,
  `smd` int(11) DEFAULT 202501,
  `note` text DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT 1,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(127) DEFAULT NULL,
  `des` text DEFAULT NULL,
  `image` varchar(511) DEFAULT 'assets/media/service/default.png',
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `service_type__id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_install` int(11) NOT NULL DEFAULT 0,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`id`, `name`, `des`, `image`, `price`, `service_type__id`, `is_install`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 'FB boost Service', 'ponxghh', '/public/media/service/uploads-1740825716779.webp', '15000.00', 1, 0, 1, 1, 0, NULL, '2025-02-13 08:47:55', '2025-03-01 10:41:56'),
(2, 'Logo design', 'kon', '/public/media/service/uploads-1740825825064.jpg', '1500.00', 1, 0, 1, 1, 0, NULL, '2025-02-13 08:47:55', '2025-03-01 10:43:45'),
(10, 'aaaa', 'hhhh', '/public/media/service/uploads-1740825747064.webp', '180.00', 1, 1, 1, 1, 0, NULL, '2025-02-14 18:18:14', '2025-03-01 10:42:27'),
(11, 'vvv', 'gg', '/public/media/service/uploads-1740825778649.webp', '44.00', 1, 1, 1, 1, 0, NULL, '2025-02-17 07:15:24', '2025-03-01 10:42:58'),
(12, 'fghf', 'vhjk', '/public/media/service/uploads-1740825804120.jpg', '222.00', 1, 1, 1, 1, 0, NULL, '2025-02-18 09:54:01', '2025-03-01 10:43:24'),
(13, 'ddd', 'ddddd', 'assets/media/service/default.png', '109.00', 1, 1, 1, 1, 1, NULL, '2025-02-18 13:38:44', '2025-02-24 07:56:58'),
(14, 'dsfgd', 'ccc', '/public/media/service/uploads-1740825697093.webp', '333.00', 1, 1, 1, 1, 0, NULL, '2025-02-25 10:04:40', '2025-03-01 10:41:37'),
(15, 'dfffsf', 'vbcvh', '/public/media/service/uploads-1740825685722.png', '100.00', 1, 1, 1, 1, 0, NULL, '2025-02-25 10:31:25', '2025-03-01 10:41:25'),
(16, 'dddd', '4545', '/public/media/service/uploads-1740825669456.webp', '555.00', 1, 1, 1, 1, 0, NULL, '2025-02-25 12:37:00', '2025-03-01 10:41:09'),
(17, 'dd', 'dddd', '/public/uploads/imgx-1740488305562.png', '33.00', 1, 1, 1, 1, 0, NULL, '2025-02-25 12:58:25', '2025-02-25 12:58:25'),
(18, 'xxx', 'dddd', '/public/uploads/imgx-1740488474710.jpg', '222.00', 1, 1, 1, 1, 0, NULL, '2025-02-25 13:01:14', '2025-02-25 13:01:14'),
(19, 'dde', 'sss', '/public/uploads/imgx-1740488557412.png', '34.00', 1, 1, 1, 1, 0, NULL, '2025-02-25 13:02:37', '2025-02-25 13:02:37'),
(20, 'fde', 'sss', '/public/media/service/uploads-1740825656672.webp', '21.00', 1, 1, 1, 1, 0, NULL, '2025-02-25 13:03:29', '2025-03-01 10:40:56'),
(21, 'as2er', 'vvv', '/public/media/service/uploads-1740825645207.webp', '123.50', 1, 1, 1, 1, 0, NULL, '2025-02-25 13:09:57', '2025-03-01 10:40:45'),
(22, 'dddd', 'vvv', '/public/media/service/uploads-1740825636120.webp', '123.50', 1, 1, 1, 1, 0, NULL, '2025-02-25 13:11:20', '2025-03-01 10:40:36'),
(23, 'service 001', 'dddd dddd fggggg', '/public/media/service/uploads-1740825616055.png', '5500.00', 1, 0, 1, 1, 0, NULL, '2025-03-01 10:35:31', '2025-03-01 10:40:16'),
(24, 'xcds', 'dfh', '/public/media/service/default.png', '190.00', 2, 0, 1, 1, 0, NULL, '2025-03-28 18:12:18', '2025-03-28 18:12:18'),
(25, 'bbb', 'dfg', '/public/media/service/default.png', '66.00', 1, 0, 1, 1, 0, NULL, '2025-03-28 18:47:09', '2025-03-28 18:47:09');

-- --------------------------------------------------------

--
-- Table structure for table `service_type`
--

CREATE TABLE `service_type` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `service_type`
--

INSERT INTO `service_type` (`id`, `key_code`, `name`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 'general', 'General', 1, 1, 0, NULL, '2024-12-19 17:55:03', '2024-10-29 15:39:19'),
(2, 'boost', 'Boost', 1, 1, 0, NULL, '2024-12-19 17:55:03', '2024-10-29 15:39:19');

-- --------------------------------------------------------

--
-- Table structure for table `setting`
--

CREATE TABLE `setting` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'string',
  `is_public` int(11) NOT NULL DEFAULT 0,
  `is_jsonview` int(11) NOT NULL DEFAULT 1,
  `is_editable` int(11) NOT NULL DEFAULT 1,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `setting`
--

INSERT INTO `setting` (`id`, `key_code`, `name`, `value`, `type`, `is_public`, `is_jsonview`, `is_editable`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 'currency_symbol', 'Currency Symbol', 'TK', 'string', 0, 1, 1, 1, 1, 0, NULL, '2024-12-06 17:33:17', '2024-12-19 17:33:17'),
(2, 'shipping_charge_inside', 'shipping charge inside', '1,2,3', 'array_int', 0, 1, 1, 1, 1, 0, NULL, '2024-12-06 17:33:17', '2024-12-19 17:33:17'),
(3, 'shipping_charge_outside', 'shipping charge outside', '135', 'float', 0, 1, 1, 1, 1, 0, NULL, '2024-12-06 17:33:17', '2024-12-19 17:33:17'),
(4, 'masterpassword', 'Master Password', 'U2FsdGVkX19oJ+cLe6lVrxWOQ1A/Z8seS9Wqdxem838=', 'encrypt', 0, 1, 1, 1, 1, 0, NULL, '2024-12-06 17:33:17', '2024-12-19 17:33:17');

-- --------------------------------------------------------

--
-- Table structure for table `setting_array_value`
--

CREATE TABLE `setting_array_value` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `setting__id` bigint(20) UNSIGNED DEFAULT NULL,
  `key_map` varchar(255) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `key_type` varchar(255) NOT NULL DEFAULT 'int',
  `type` varchar(255) NOT NULL DEFAULT 'string',
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `status`
--

CREATE TABLE `status` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key_code` varchar(127) DEFAULT NULL,
  `type` varchar(127) DEFAULT NULL,
  `status_group__id` bigint(20) UNSIGNED DEFAULT NULL,
  `status_group` varchar(127) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `status`
--

INSERT INTO `status` (`id`, `key_code`, `type`, `status_group__id`, `status_group`, `name`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 'pending', NULL, NULL, NULL, 'pending', 1, 1, 0, NULL, NULL, NULL),
(2, 'complete', NULL, NULL, NULL, 'complete', 1, 1, 0, NULL, NULL, NULL),
(3, 'reject', NULL, NULL, NULL, 'reject', 1, 1, 0, NULL, NULL, NULL),
(4, 'success', NULL, NULL, NULL, 'success', 1, 1, 0, NULL, NULL, NULL),
(5, 'fail', NULL, NULL, NULL, 'fail', 1, 1, 0, NULL, NULL, NULL),
(6, 'error', NULL, NULL, NULL, 'error', 1, 1, 0, NULL, NULL, NULL),
(7, 'accept', NULL, NULL, NULL, 'accept', 1, 1, 0, NULL, NULL, NULL),
(8, 'delete', NULL, NULL, NULL, 'delete', 1, 1, 0, NULL, NULL, NULL),
(9, 'processing', NULL, NULL, NULL, 'processing', 1, 1, 0, NULL, NULL, NULL),
(10, 'waiting', NULL, NULL, NULL, 'waiting', 1, 1, 0, NULL, NULL, NULL),
(11, 'done', NULL, NULL, NULL, 'done', 1, 1, 0, NULL, NULL, NULL),
(12, 'active', NULL, NULL, NULL, 'active', 1, 1, 0, NULL, NULL, NULL),
(13, 'inactive', NULL, NULL, NULL, 'inactive', 1, 1, 0, NULL, NULL, NULL),
(14, 'yes', NULL, NULL, NULL, 'yes', 1, 1, 0, NULL, NULL, NULL),
(15, 'no', NULL, NULL, NULL, 'no', 1, 1, 0, NULL, NULL, NULL),
(16, 'true', NULL, NULL, NULL, 'true', 1, 1, 0, NULL, NULL, NULL),
(17, 'false', NULL, NULL, NULL, 'false', 1, 1, 0, NULL, NULL, NULL),
(18, 'start', NULL, NULL, NULL, 'start', 1, 1, 0, NULL, NULL, NULL),
(19, 'end', NULL, NULL, NULL, 'end', 1, 1, 0, NULL, NULL, NULL),
(20, 'open', NULL, NULL, NULL, 'open', 1, 1, 0, NULL, NULL, NULL),
(21, 'close', NULL, NULL, NULL, 'close', 1, 1, 0, NULL, NULL, NULL),
(22, 'win', NULL, NULL, NULL, 'win', 1, 1, 0, NULL, NULL, NULL),
(23, 'loss', NULL, NULL, NULL, 'loss', 1, 1, 0, NULL, NULL, NULL),
(24, 'upcoming', NULL, NULL, NULL, 'Upcoming', 1, 1, 0, NULL, NULL, NULL),
(25, 'in_stock', NULL, NULL, NULL, 'In Stock', 1, 1, 0, NULL, NULL, NULL),
(26, 'stock_out', NULL, NULL, NULL, 'Stock Out', 1, 1, 0, NULL, NULL, NULL),
(27, 'discontinue', NULL, NULL, NULL, 'Discontinue', 1, 1, 0, NULL, NULL, NULL),
(28, 'on_sale', NULL, NULL, NULL, 'On Sale', 1, 1, 0, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `login_id` varchar(255) NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `verify_email` int(11) NOT NULL DEFAULT 0,
  `verify_phone` int(11) NOT NULL DEFAULT 0,
  `birthdate` timestamp NULL DEFAULT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'assets/media/user/default.png',
  `image_thumb` varchar(255) NOT NULL DEFAULT 'assets/media/user/default_thumb.png',
  `country__id` bigint(20) UNSIGNED DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `ps` varchar(255) DEFAULT NULL,
  `zip` varchar(255) DEFAULT NULL,
  `address_1` text DEFAULT NULL,
  `address_2` text DEFAULT NULL,
  `password` text DEFAULT NULL,
  `user_role__id` bigint(20) UNSIGNED DEFAULT NULL,
  `security_key` text DEFAULT NULL,
  `login_enable` int(11) NOT NULL DEFAULT 1,
  `adv` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_login` int(11) NOT NULL DEFAULT 0,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `login_id`, `user_name`, `first_name`, `last_name`, `email`, `phone`, `company`, `verify_email`, `verify_phone`, `birthdate`, `image`, `image_thumb`, `country__id`, `state`, `city`, `ps`, `zip`, `address_1`, `address_2`, `password`, `user_role__id`, `security_key`, `login_enable`, `adv`, `is_login`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(11, 'admin', 'admin', NULL, NULL, 'admin.emaikl', NULL, NULL, 0, 0, NULL, '/public/media/user/default.png', '/public/media/user/default.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1/6gDQGy9bWO8NOpks7hq9nd95BsA0SW4g=', 1, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2024-12-11 19:43:44', '2024-12-11 19:43:44'),
(100001, 'user', 'user', NULL, NULL, 'user.email', NULL, NULL, 0, 0, NULL, '/public/media/user/default.png', '/public/media/user/default.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1/OZvX9kG6l7XDFP8h9UF37DtWgZ4j+Wgk=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2024-12-11 19:43:44', '2024-12-11 19:43:44'),
(100003, 'user2', 'user2', NULL, NULL, 'pisveley113@eoilup.com', '+880111111111', NULL, 0, 0, NULL, '/public/media/user/uploads-1740822599502.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1/vZ6DmlzTP4C6xwX6N2PKRtvW+3u5u4WU=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-01 09:49:59', '2025-03-01 09:49:59'),
(100004, 'user3', 'user3', NULL, NULL, 'pissveley113@eoilup.com', '122333', 'cpmp', 0, 0, NULL, '/public/media/user/uploads-1740823142150.jpg', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1/MgujoA5fXYPovdunOmnwoR44IjHW3WhY=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-01 09:59:02', '2025-03-01 09:59:02'),
(100005, 'user4', 'user4', NULL, NULL, 'pisssxveley113@eoilup.com', '11111444', NULL, 0, 0, NULL, '/public/media/user/default.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX18ZSzkZG/vPV23sUiVHxFiudawADQpEA3E=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-01 10:00:25', '2025-03-01 10:14:03'),
(100006, 'user5', 'user5', NULL, NULL, 'xxxxx@eoilup.com', '11111444', 'qqqqqq', 0, 0, NULL, '/public/media/user/uploads-1740824144207.jpg', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX18Ao2N6WrzAYgLqXLEe55EbfXIVP9Th+K0=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-01 10:02:26', '2025-03-01 10:15:44'),
(100007, 'user6', 'user6', NULL, NULL, 'pisveley113@eoilup.com', '11111444', NULL, 0, 0, NULL, '/public/media/user/uploads-1740823386760.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1/9ge3q3CnXHPPc3iG3h/+euoGwJ/bic5o=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-01 10:03:06', '2025-03-01 10:03:06'),
(100011, 'user12', 'user12', NULL, NULL, 'pisveley113@eoilup.com', '1122', 'qqqqqq', 0, 0, NULL, '/public/media/user/default.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1+OBq5bfo9UeftZCq2PYlYYdXbLgN7wKLs=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-20 13:43:06', '2025-03-20 13:43:06'),
(100012, 'user33', 'user33', NULL, NULL, 'pissveley113@eoilup.com', '01212121215', 'sssd', 0, 0, NULL, '/public/media/user/default.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX18doDlRMSESC/9w/uUtJUnYO3768RNAzt4=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-20 17:10:53', '2025-03-20 17:10:53'),
(100013, 'user2xt', 'user2xt', 'sssssss', NULL, 'pisveley113@eoilup.com', '01212121215', 'cpmp', 0, 0, NULL, '/public/media/user/default.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1+u7AWZSoA6NXkO243HPvioC3K5wQsNktc=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-22 13:48:29', '2025-03-22 13:48:29'),
(100014, 'aaa', 'aaa', 'sssssss', NULL, 'pissveley113@eoilup.com', '1122', 'dddddd', 0, 0, NULL, '/public/media/user/default.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1/LMe5ytqJCR8ankyGVVllIhZDcZoDodw4=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-22 14:08:37', '2025-03-22 14:08:37'),
(100015, 'employee01', 'employee01', NULL, NULL, 'employee01', NULL, NULL, 0, 0, NULL, '/public/media/user/default.png', '/public/media/user/default.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1/OZvX9kG6l7XDFP8h9UF37DtWgZ4j+Wgk=', 11, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2024-12-11 19:43:44', '2024-12-11 19:43:44'),
(100016, 'employee 001', 'employee 001', 'employee full name', NULL, 'pisveleddy113@eoilup.com', '1122', 'sssd', 0, 0, NULL, '/public/media/user/default.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX197m5zLhY9XmIXrdtGSRlKJslPCbJ9I43A=', 11, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-23 08:26:22', '2025-03-23 08:26:22'),
(100017, 'userx1', 'userx1', 'mpl', NULL, 'pisveley113@eoilup.com', '01212121215', 'qqqqqq', 0, 0, NULL, '/public/media/user/default.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1/+b4bYg/U6UsRQva4oSnwVtqZZe14X7GA=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-25 12:36:47', '2025-03-25 12:36:47'),
(100018, 'userx123', 'userx123', 'userx123', NULL, 'pisveley113@eoilup.com', '01212121215', 'userx123', 0, 0, NULL, '/public/media/user/default.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1983wPUtw9PaRnMo84kIkg6zE4jc5xrzGc=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-25 12:46:09', '2025-03-25 12:46:09'),
(100019, 'userx124', 'userx124', 'userx124', NULL, 'pisveley113@eoilup.com', '01212121215', 'userx124', 0, 0, NULL, '/public/media/user/default.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1+4Fibnq2WBJ96sQw7IlTdM4C2O0QRVl5s=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-25 12:51:01', '2025-03-25 12:51:01'),
(100020, 'user2xs', 'user2xs', 'user2xs', NULL, 'pisveleddy113@eoilup.com', '01212121215', 'qqqqqq', 0, 0, NULL, '/public/media/user/default.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX18paMnRRvm7WJNZCSaVlnWzvCc0B3JxmHI=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-25 13:57:58', '2025-03-25 13:57:58'),
(100021, 'user12x', 'user12x', 'user12x', NULL, 'pisveley113@eoilup.com', '01212121215', 'user12x', 0, 0, NULL, '/public/media/user/default.png', 'assets/media/user/default_thumb.png', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'U2FsdGVkX1+JNbQJEIjYfB40j+BfuxeYrXNCpKHKIdc=', 10, NULL, 1, '0.00', 0, 1, 1, 0, NULL, '2025-03-25 17:09:45', '2025-03-25 17:09:45');

-- --------------------------------------------------------

--
-- Table structure for table `user_balance`
--

CREATE TABLE `user_balance` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `count` int(11) NOT NULL DEFAULT 1,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_bank_exchange`
--

CREATE TABLE `user_bank_exchange` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user__id` bigint(20) UNSIGNED DEFAULT NULL,
  `send_wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `receive_wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `send_bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `receive_bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `send_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `receive_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `uuid` varchar(255) DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT 1,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_date_service`
--

CREATE TABLE `user_date_service` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_service__id` bigint(20) UNSIGNED DEFAULT NULL,
  `currency_buy_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `currency_sale_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `currency_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `total` decimal(12,2) NOT NULL DEFAULT 0.00,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_extend`
--

CREATE TABLE `user_extend` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user__id` bigint(20) UNSIGNED NOT NULL,
  `address__id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_role__id` bigint(20) UNSIGNED DEFAULT NULL,
  `security_key` text DEFAULT NULL,
  `login_enable` int(11) NOT NULL DEFAULT 1,
  `is_login` int(11) NOT NULL DEFAULT 0,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE `user_role` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `view_panel` varchar(255) DEFAULT NULL,
  `image` varchar(511) DEFAULT 'assets/media/user_role/default.png',
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`id`, `key_code`, `name`, `view_panel`, `image`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 'admin', 'admin', 'admin', 'assets/media/user_role/default.png', 1, 1, 0, NULL, '2025-03-12 06:55:04', '2025-03-17 18:00:00'),
(10, 'user', 'user', 'user', 'assets/media/user_role/default.png', 1, 1, 0, NULL, '2025-03-05 06:54:35', '2025-03-09 18:00:00'),
(11, 'employee', 'Employee', 'employee', 'assets/media/user_role/default.png', 1, 1, 0, NULL, '2025-03-18 06:54:00', '2025-03-18 06:54:00');

-- --------------------------------------------------------

--
-- Table structure for table `user_service`
--

CREATE TABLE `user_service` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user__id` bigint(20) UNSIGNED DEFAULT NULL,
  `service__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `buy_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `ori_price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `discount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `net` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment` decimal(12,2) NOT NULL DEFAULT 0.00,
  `due` decimal(12,2) NOT NULL DEFAULT 0.00,
  `note` text DEFAULT NULL,
  `is_install` int(11) NOT NULL DEFAULT 0,
  `is_install_active` int(11) NOT NULL DEFAULT 0,
  `auto_renew` int(11) NOT NULL DEFAULT 0,
  `is_closed` int(11) NOT NULL DEFAULT 0,
  `start_date` timestamp NULL DEFAULT NULL,
  `end_date` timestamp NULL DEFAULT NULL,
  `type_detail` text DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_service`
--

INSERT INTO `user_service` (`id`, `user__id`, `service__id`, `wallet__id`, `bank__id`, `price`, `buy_price`, `ori_price`, `discount`, `net`, `payment`, `due`, `note`, `is_install`, `is_install_active`, `auto_renew`, `is_closed`, `start_date`, `end_date`, `type_detail`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(7, 100003, 2, NULL, NULL, '1500.00', '0.00', '0.00', '300.00', '1200.00', '1200.00', '0.00', 'hello', 0, 0, 0, 0, '2025-03-11 15:25:46', '2025-03-11 15:25:46', NULL, 1, 1, 1, NULL, '2025-03-11 15:25:46', '2025-03-12 07:53:06'),
(9, 100004, 2, NULL, NULL, '1500.00', '0.00', '0.00', '300.00', '1200.00', '1200.00', '0.00', 'hello', 0, 0, 0, 0, '2025-03-11 15:28:21', '2025-03-11 15:28:21', NULL, 1, 1, 0, NULL, '2025-03-11 15:28:21', '2025-03-11 15:28:21'),
(10, 100005, 15, NULL, NULL, '100.00', '0.00', '0.00', '0.00', '100.00', '80.00', '20.00', '', 1, 0, 0, 0, '2025-03-12 07:58:01', '2025-03-12 07:58:01', NULL, 1, 1, 0, NULL, '2025-03-12 07:58:01', '2025-03-12 07:58:01'),
(11, 100003, 2, NULL, NULL, '1500.00', '0.00', '0.00', '0.00', '1500.00', '1500.00', '0.00', '', 0, 0, 0, 0, '2025-03-18 10:23:14', '2025-03-18 10:23:14', NULL, 1, 1, 0, NULL, '2025-03-18 10:23:14', '2025-03-18 10:23:14'),
(12, 100004, 2, NULL, NULL, '6000.00', '0.00', '1500.00', '2000.00', '-500.00', '3000.00', '-3500.00', '', 0, 0, 0, 0, '2025-03-18 11:03:26', '2025-03-18 11:03:26', NULL, 1, 1, 0, NULL, '2025-03-18 11:03:26', '2025-03-18 11:03:26'),
(13, 100005, 2, NULL, NULL, '8000.00', '0.00', '1500.00', '3000.00', '5000.00', '3000.00', '2000.00', '', 0, 0, 0, 0, '2025-03-18 11:05:46', '2025-03-18 11:05:46', NULL, 1, 1, 0, NULL, '2025-03-18 11:05:46', '2025-03-20 13:38:18'),
(14, 100005, 1, NULL, NULL, '15000.00', '0.00', '15000.00', '12000.00', '3000.00', '3000.00', '0.00', '', 0, 0, 0, 0, '2025-03-19 07:36:58', '2025-03-19 07:36:58', NULL, 1, 1, 0, NULL, '2025-03-19 07:36:58', '2025-03-19 07:36:58'),
(15, 100005, 1, NULL, NULL, '15000.00', '0.00', '15000.00', '10000.00', '5000.00', '5000.00', '0.00', '', 0, 0, 0, 0, '2025-03-19 07:38:45', '2025-03-19 07:38:45', NULL, 1, 1, 0, NULL, '2025-03-19 07:38:45', '2025-03-20 12:29:56'),
(16, 100001, 2, NULL, NULL, '1500.00', '0.00', '1500.00', '100.00', '1400.00', '1100.00', '300.00', '', 0, 0, 0, 0, '2025-03-19 07:41:41', '2025-03-19 07:41:41', NULL, 1, 1, 0, NULL, '2025-03-19 07:41:41', '2025-03-19 08:29:45'),
(17, 100001, 2, NULL, NULL, '1500.00', '0.00', '1500.00', '100.00', '1400.00', '1400.00', '0.00', '', 0, 0, 0, 0, '2025-03-19 07:42:24', '2025-03-19 07:42:24', NULL, 1, 1, 0, NULL, '2025-03-19 07:42:24', '2025-03-19 08:29:45'),
(18, 100006, 2, NULL, NULL, '1500.00', '0.00', '1500.00', '0.00', '1500.00', '1500.00', '0.00', '', 0, 0, 0, 0, '2025-03-19 13:25:05', '2025-03-19 13:25:05', NULL, 1, 1, 0, NULL, '2025-03-19 13:25:05', '2025-03-19 13:25:05'),
(22, 100011, 2, NULL, NULL, '5000.00', '0.00', '1500.00', '0.00', '5000.00', '5000.00', '0.00', '', 0, 0, 0, 0, '2025-03-20 14:38:24', '2025-03-20 14:38:24', NULL, 1, 1, 0, NULL, '2025-03-20 14:38:24', '2025-03-25 10:13:19'),
(23, 100011, 2, NULL, NULL, '4000.00', '0.00', '1500.00', '0.00', '4000.00', '4000.00', '0.00', '', 0, 0, 0, 0, '2025-03-20 14:39:00', '2025-03-20 14:39:00', NULL, 1, 1, 0, NULL, '2025-03-20 14:39:00', '2025-03-20 16:58:11'),
(24, 100017, 2, NULL, NULL, '1500.00', '0.00', '1500.00', '0.00', '1500.00', '0.00', '1300.00', '', 0, 0, 0, 0, '2025-03-25 12:37:33', '2025-03-25 12:37:33', NULL, 1, 1, 0, NULL, '2025-03-25 12:37:33', '2025-03-25 12:37:33'),
(25, 100018, 2, NULL, NULL, '1500.00', '0.00', '1500.00', '0.00', '1500.00', '0.00', '500.00', '', 0, 0, 0, 0, '2025-03-25 12:46:35', '2025-03-25 12:46:35', NULL, 1, 1, 0, NULL, '2025-03-25 12:46:35', '2025-03-25 12:46:35'),
(26, 100019, 2, NULL, NULL, '1500.00', '0.00', '1500.00', '0.00', '1500.00', '0.00', '1000.00', '', 0, 0, 0, 0, '2025-03-25 12:51:26', '2025-03-25 12:51:26', NULL, 1, 1, 0, NULL, '2025-03-25 12:51:26', '2025-03-25 12:51:26'),
(27, 100020, 2, NULL, NULL, '1500.00', '0.00', '1500.00', '0.00', '1500.00', '0.00', '500.00', '', 0, 0, 0, 0, '2025-03-25 13:58:18', '2025-03-25 13:58:18', NULL, 1, 1, 0, NULL, '2025-03-25 13:58:18', '2025-03-25 13:58:18'),
(28, 100021, 2, NULL, NULL, '1500.00', '0.00', '1500.00', '0.00', '1500.00', '0.00', '500.00', '', 0, 0, 0, 0, '2025-03-25 17:10:10', '2025-03-25 17:10:10', NULL, 1, 1, 1, NULL, '2025-03-25 17:10:10', '2025-03-25 17:19:34'),
(29, 100021, 2, NULL, NULL, '1500.00', '0.00', '1500.00', '0.00', '1500.00', '1000.00', '500.00', '', 0, 0, 0, 0, '2025-03-25 17:34:50', '2025-03-25 17:34:50', NULL, 1, 1, 1, NULL, '2025-03-25 17:34:50', '2025-03-25 17:44:19'),
(30, 100021, 2, NULL, NULL, '1500.00', '0.00', '1500.00', '0.00', '1500.00', '1000.00', '500.00', '', 0, 0, 0, 0, '2025-03-25 17:48:41', '2025-03-25 17:48:41', NULL, 1, 1, 1, NULL, '2025-03-25 17:48:41', '2025-03-25 17:49:58');

-- --------------------------------------------------------

--
-- Table structure for table `user_service_ins`
--

CREATE TABLE `user_service_ins` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user__id` bigint(20) UNSIGNED DEFAULT NULL,
  `service__id` bigint(20) UNSIGNED DEFAULT NULL,
  `user_service__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `price` decimal(12,2) NOT NULL DEFAULT 0.00,
  `paymant` decimal(12,2) NOT NULL DEFAULT 0.00,
  `due` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_service_payment`
--

CREATE TABLE `user_service_payment` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_service__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `payment_receive__id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_service_payment`
--

INSERT INTO `user_service_payment` (`id`, `user_service__id`, `amount`, `payment_receive__id`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 11, '1500.00', 4, 1, 1, 0, NULL, '2025-03-18 10:23:14', '2025-03-18 10:23:14'),
(2, 12, '3000.00', 5, 1, 1, 0, NULL, '2025-03-18 11:03:26', '2025-03-18 11:03:26'),
(3, 13, '1000.00', 6, 1, 1, 0, NULL, '2025-03-18 11:05:46', '2025-03-18 11:05:46'),
(4, 14, '3000.00', 7, 1, 1, 0, NULL, '2025-03-19 07:36:58', '2025-03-19 07:36:58'),
(5, 15, '3000.00', 8, 1, 1, 0, NULL, '2025-03-19 07:38:45', '2025-03-19 07:38:45'),
(6, 16, '1000.00', 9, 1, 1, 0, NULL, '2025-03-19 07:41:41', '2025-03-19 07:41:41'),
(7, 17, '500.00', 10, 1, 1, 0, NULL, '2025-03-19 07:42:24', '2025-03-19 07:42:24'),
(8, 17, '900.00', 13, 1, 1, 0, NULL, '2025-03-19 08:29:45', '2025-03-19 08:29:45'),
(9, 16, '100.00', 13, 1, 1, 0, NULL, '2025-03-19 08:29:45', '2025-03-19 08:29:45'),
(10, 18, '1500.00', 14, 1, 1, 0, NULL, '2025-03-19 13:25:05', '2025-03-19 13:25:05'),
(11, 15, '2000.00', 15, 1, 1, 0, NULL, '2025-03-20 12:29:56', '2025-03-20 13:28:45'),
(12, 13, '2000.00', 15, 1, 1, 0, NULL, '2025-03-20 12:29:56', '2025-03-20 13:28:45'),
(13, 13, '1500.00', 16, 1, 1, 1, NULL, '2025-03-20 13:30:08', '2025-03-20 13:38:18'),
(23, 22, '1500.00', 23, 1, 1, 0, NULL, '2025-03-20 14:38:24', '2025-03-20 14:38:24'),
(24, 23, '1000.00', 24, 1, 1, 0, NULL, '2025-03-20 14:39:00', '2025-03-20 14:39:00'),
(25, 23, '3000.00', 25, 1, 1, 1, NULL, '2025-03-20 14:42:43', '2025-03-20 16:50:19'),
(26, 22, '2000.00', 25, 1, 1, 1, NULL, '2025-03-20 14:42:43', '2025-03-20 16:50:19'),
(27, 23, '3000.00', 25, 1, 1, 1, NULL, '2025-03-20 16:50:19', '2025-03-20 16:50:54'),
(28, 22, '2500.00', 25, 1, 1, 1, NULL, '2025-03-20 16:50:19', '2025-03-20 16:50:54'),
(29, 23, '3000.00', 25, 1, 1, 1, NULL, '2025-03-20 16:50:54', '2025-03-20 16:58:11'),
(30, 22, '1500.00', 25, 1, 1, 1, NULL, '2025-03-20 16:50:54', '2025-03-20 16:58:11'),
(31, 22, '500.00', 26, 1, 1, 1, NULL, '2025-03-20 16:51:45', '2025-03-20 17:00:20'),
(32, 23, '3000.00', 25, 1, 1, 0, NULL, '2025-03-20 16:58:11', '2025-03-20 16:58:11'),
(33, 22, '1500.00', 25, 1, 1, 0, NULL, '2025-03-20 16:58:11', '2025-03-20 16:58:11'),
(34, 22, '500.00', 26, 1, 1, 1, NULL, '2025-03-20 17:00:20', '2025-03-20 17:00:41'),
(35, 22, '500.00', 26, 1, 1, 0, NULL, '2025-03-20 17:00:41', '2025-03-20 17:00:41'),
(36, 22, '200.00', 27, 1, 1, 0, NULL, '2025-03-21 14:18:22', '2025-03-21 14:18:22'),
(37, 22, '1000.00', 28, 1, 1, 1, NULL, '2025-03-25 10:12:51', '2025-03-25 10:13:19'),
(38, 22, '1300.00', 28, 1, 1, 0, NULL, '2025-03-25 10:13:19', '2025-03-25 10:13:19'),
(39, 24, '0.00', 29, 1, 1, 0, NULL, '2025-03-25 12:37:33', '2025-03-25 12:37:33'),
(40, 25, '0.00', 32, 1, 1, 0, NULL, '2025-03-25 12:46:35', '2025-03-25 12:46:35'),
(41, 26, '0.00', 35, 1, 1, 0, NULL, '2025-03-25 12:51:26', '2025-03-25 12:51:26'),
(42, 27, '0.00', 36, 1, 1, 0, NULL, '2025-03-25 13:58:18', '2025-03-25 13:58:18'),
(43, 28, '0.00', 42, 1, 1, 1, NULL, '2025-03-25 17:10:10', '2025-03-25 17:19:34'),
(44, 29, '1000.00', 43, 1, 1, 1, NULL, '2025-03-25 17:34:50', '2025-03-25 17:44:19'),
(45, 30, '1000.00', 45, 1, 1, 1, NULL, '2025-03-25 17:48:41', '2025-03-25 17:49:58');

-- --------------------------------------------------------

--
-- Table structure for table `user_to_setting`
--

CREATE TABLE `user_to_setting` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user__id` bigint(20) UNSIGNED DEFAULT NULL,
  `setting__id` bigint(20) UNSIGNED DEFAULT NULL,
  `value` text DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT 1,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `user_to_setting_array_value`
--

CREATE TABLE `user_to_setting_array_value` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_to_setting__id` bigint(20) UNSIGNED DEFAULT NULL,
  `key_map` varchar(255) DEFAULT NULL,
  `value` text DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT 1,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `vendor`
--

CREATE TABLE `vendor` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `des` text DEFAULT NULL,
  `bill_amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `wallet`
--

CREATE TABLE `wallet` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `key_code` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(511) DEFAULT 'assets/media/wallet/default.png',
  `user_role__id` bigint(20) UNSIGNED DEFAULT NULL,
  `is_transfer` int(11) NOT NULL DEFAULT 1,
  `min_transfer` decimal(12,2) NOT NULL DEFAULT 1.00,
  `max_transfer` decimal(12,2) NOT NULL DEFAULT 9999999.00,
  `transfer_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_addfund` int(11) NOT NULL DEFAULT 1,
  `min_addfund` decimal(12,2) NOT NULL DEFAULT 1.00,
  `max_addfund` decimal(12,2) NOT NULL DEFAULT 9999999.00,
  `addfund_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_exchange` int(11) NOT NULL DEFAULT 1,
  `min_exchange` decimal(12,2) NOT NULL DEFAULT 1.00,
  `max_exchange` decimal(12,2) NOT NULL DEFAULT 9999999.00,
  `exchange_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_withdraw` int(11) NOT NULL DEFAULT 1,
  `min_withdraw` decimal(12,2) NOT NULL DEFAULT 1.00,
  `max_withdraw` decimal(12,2) NOT NULL DEFAULT 9999999.00,
  `withdraw_charge` decimal(12,2) NOT NULL DEFAULT 0.00,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `wallet`
--

INSERT INTO `wallet` (`id`, `key_code`, `name`, `image`, `user_role__id`, `is_transfer`, `min_transfer`, `max_transfer`, `transfer_charge`, `is_addfund`, `min_addfund`, `max_addfund`, `addfund_charge`, `is_exchange`, `min_exchange`, `max_exchange`, `exchange_charge`, `is_withdraw`, `min_withdraw`, `max_withdraw`, `withdraw_charge`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(11, 'admin_current', 'Current', 'assets/media/wallet/default.png', 1, 1, '1.00', '9999999.00', '0.00', 1, '1.00', '9999999.00', '0.00', 1, '1.00', '9999999.00', '0.00', 1, '1.00', '9999999.00', '0.00', 1, 1, 0, NULL, '2025-03-02 08:49:05', '2025-03-02 08:49:05'),
(1001, 'user_current', 'Current', 'assets/media/wallet/default.png', 10, 1, '1.00', '9999999.00', '0.00', 1, '1.00', '9999999.00', '0.00', 1, '1.00', '9999999.00', '0.00', 1, '1.00', '9999999.00', '0.00', 1, 1, 0, NULL, '2025-03-02 08:49:05', '2025-03-02 08:49:05');

-- --------------------------------------------------------

--
-- Table structure for table `withdraw`
--

CREATE TABLE `withdraw` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `bank__id` bigint(20) UNSIGNED DEFAULT NULL,
  `wallet__id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL DEFAULT 0.00,
  `creator__id` bigint(20) UNSIGNED DEFAULT NULL,
  `note` text DEFAULT NULL,
  `is_visible` int(11) NOT NULL DEFAULT 1,
  `is_active` int(11) NOT NULL DEFAULT 1,
  `is_delete` int(11) NOT NULL DEFAULT 0,
  `log` text DEFAULT NULL,
  `created_date` timestamp NULL DEFAULT NULL,
  `updated_date` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `withdraw`
--

INSERT INTO `withdraw` (`id`, `bank__id`, `wallet__id`, `amount`, `creator__id`, `note`, `is_visible`, `is_active`, `is_delete`, `log`, `created_date`, `updated_date`) VALUES
(1, 2, 11, '120.00', 11, '100 out', 1, 1, 0, NULL, '2025-03-26 17:42:44', '2025-03-26 18:52:48');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `addbalance`
--
ALTER TABLE `addbalance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator__id` (`creator__id`),
  ADD KEY `bank__id` (`bank__id`),
  ADD KEY `wallet__id` (`wallet__id`);

--
-- Indexes for table `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`),
  ADD KEY `country__id` (`country__id`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `app`
--
ALTER TABLE `app`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `app_image`
--
ALTER TABLE `app_image`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_code` (`key_code`),
  ADD KEY `key_code_2` (`key_code`);

--
-- Indexes for table `app_setting`
--
ALTER TABLE `app_setting`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_code` (`key_code`),
  ADD KEY `key_code_2` (`key_code`);

--
-- Indexes for table `bank`
--
ALTER TABLE `bank`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_code` (`key_code`),
  ADD KEY `country__id` (`country__id`),
  ADD KEY `key_code_2` (`key_code`);

--
-- Indexes for table `bill`
--
ALTER TABLE `bill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `bill_pay`
--
ALTER TABLE `bill_pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bill__id` (`bill__id`),
  ADD KEY `creator__id` (`creator__id`),
  ADD KEY `wallet__id` (`wallet__id`),
  ADD KEY `bank__id` (`bank__id`);

--
-- Indexes for table `country`
--
ALTER TABLE `country`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_code` (`key_code`),
  ADD KEY `key_code_2` (`key_code`);

--
-- Indexes for table `credit_rec`
--
ALTER TABLE `credit_rec`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank__id` (`bank__id`),
  ADD KEY `creator__id` (`creator__id`),
  ADD KEY `wallet__id` (`wallet__id`);

--
-- Indexes for table `currency`
--
ALTER TABLE `currency`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_code` (`key_code`),
  ADD KEY `country__id` (`country__id`),
  ADD KEY `key_code_2` (`key_code`);

--
-- Indexes for table `debit_rec`
--
ALTER TABLE `debit_rec`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank__id` (`bank__id`),
  ADD KEY `creator__id` (`creator__id`),
  ADD KEY `wallet__id` (`wallet__id`);

--
-- Indexes for table `due_pay`
--
ALTER TABLE `due_pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user__id` (`user__id`),
  ADD KEY `payment_receive__id` (`payment_receive__id`);

--
-- Indexes for table `expense`
--
ALTER TABLE `expense`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank__id` (`bank__id`),
  ADD KEY `wallet__id` (`wallet__id`),
  ADD KEY `amount` (`amount`);

--
-- Indexes for table `expense_type`
--
ALTER TABLE `expense_type`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `loan`
--
ALTER TABLE `loan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user__id` (`user__id`),
  ADD KEY `amount` (`amount`);

--
-- Indexes for table `payment_receive`
--
ALTER TABLE `payment_receive`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank__id` (`bank__id`),
  ADD KEY `user_service_ins__id` (`user_service_ins__id`),
  ADD KEY `user_service__id` (`user_service__id`),
  ADD KEY `wallet__id` (`wallet__id`),
  ADD KEY `user__id` (`user__id`),
  ADD KEY `service__id` (`service__id`);

--
-- Indexes for table `payment_return`
--
ALTER TABLE `payment_return`
  ADD PRIMARY KEY (`id`),
  ADD KEY `wallet__id` (`wallet__id`),
  ADD KEY `user__id` (`user__id`),
  ADD KEY `bank__id` (`bank__id`);

--
-- Indexes for table `pay_bill`
--
ALTER TABLE `pay_bill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vendor__id` (`vendor__id`),
  ADD KEY `bank__id` (`bank__id`),
  ADD KEY `creator__id` (`creator__id`),
  ADD KEY `wallet__id` (`wallet__id`);

--
-- Indexes for table `previous_due_adv`
--
ALTER TABLE `previous_due_adv`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user__id` (`user__id`),
  ADD KEY `bank__id` (`bank__id`),
  ADD KEY `wallet__id` (`wallet__id`);

--
-- Indexes for table `salary`
--
ALTER TABLE `salary`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id` (`id`),
  ADD KEY `employee__id` (`employee__id`),
  ADD KEY `issuer__id` (`issuer__id`),
  ADD KEY `bank__id` (`bank__id`),
  ADD KEY `wallet__id` (`wallet__id`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`),
  ADD KEY `name_2` (`name`),
  ADD KEY `service_type__id` (`service_type__id`);

--
-- Indexes for table `service_type`
--
ALTER TABLE `service_type`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_code` (`key_code`);

--
-- Indexes for table `setting`
--
ALTER TABLE `setting`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_uk` (`key_code`),
  ADD KEY `key_code` (`key_code`);

--
-- Indexes for table `setting_array_value`
--
ALTER TABLE `setting_array_value`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_map` (`key_map`,`setting__id`),
  ADD KEY `setting__id` (`setting__id`),
  ADD KEY `setting__id_2` (`setting__id`);

--
-- Indexes for table `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_code` (`key_code`),
  ADD KEY `key_code_2` (`key_code`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login_id` (`login_id`),
  ADD KEY `country__id` (`country__id`),
  ADD KEY `user_role__id` (`user_role__id`),
  ADD KEY `login_id_2` (`login_id`);

--
-- Indexes for table `user_balance`
--
ALTER TABLE `user_balance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user__id` (`user__id`),
  ADD KEY `wallet__id` (`wallet__id`),
  ADD KEY `bank__id` (`bank__id`);

--
-- Indexes for table `user_bank_exchange`
--
ALTER TABLE `user_bank_exchange`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uuid` (`uuid`),
  ADD KEY `user__id` (`user__id`),
  ADD KEY `send_wallet__id` (`send_wallet__id`),
  ADD KEY `receive_wallet__id` (`receive_wallet__id`),
  ADD KEY `send_bank__id` (`send_bank__id`),
  ADD KEY `receive_bank__id` (`receive_bank__id`);

--
-- Indexes for table `user_date_service`
--
ALTER TABLE `user_date_service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_service__id` (`user_service__id`);

--
-- Indexes for table `user_extend`
--
ALTER TABLE `user_extend`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user__id` (`user__id`),
  ADD KEY `address__id` (`address__id`),
  ADD KEY `user_role__id` (`user_role__id`),
  ADD KEY `user__id_2` (`user__id`);

--
-- Indexes for table `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_code` (`key_code`),
  ADD KEY `key_code_2` (`key_code`);

--
-- Indexes for table `user_service`
--
ALTER TABLE `user_service`
  ADD PRIMARY KEY (`id`),
  ADD KEY `bank__id` (`bank__id`),
  ADD KEY `wallet__id` (`wallet__id`),
  ADD KEY `user__id` (`user__id`),
  ADD KEY `service__id` (`service__id`);

--
-- Indexes for table `user_service_ins`
--
ALTER TABLE `user_service_ins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_service__id` (`user_service__id`),
  ADD KEY `bank__id` (`bank__id`),
  ADD KEY `wallet__id` (`wallet__id`),
  ADD KEY `user__id` (`user__id`),
  ADD KEY `service__id` (`service__id`);

--
-- Indexes for table `user_service_payment`
--
ALTER TABLE `user_service_payment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_service__id` (`user_service__id`),
  ADD KEY `payment_receive__id` (`payment_receive__id`);

--
-- Indexes for table `user_to_setting`
--
ALTER TABLE `user_to_setting`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user__id` (`user__id`,`setting__id`),
  ADD KEY `setting__id` (`setting__id`),
  ADD KEY `user__id_2` (`user__id`),
  ADD KEY `setting__id_2` (`setting__id`);

--
-- Indexes for table `user_to_setting_array_value`
--
ALTER TABLE `user_to_setting_array_value`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_map` (`key_map`,`user_to_setting__id`),
  ADD KEY `user_to_setting__id` (`user_to_setting__id`),
  ADD KEY `user_to_setting__id_2` (`user_to_setting__id`);

--
-- Indexes for table `vendor`
--
ALTER TABLE `vendor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `wallet`
--
ALTER TABLE `wallet`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_code` (`key_code`),
  ADD KEY `user_role__id` (`user_role__id`),
  ADD KEY `key_code_2` (`key_code`),
  ADD KEY `key_code_3` (`key_code`),
  ADD KEY `name` (`name`);

--
-- Indexes for table `withdraw`
--
ALTER TABLE `withdraw`
  ADD PRIMARY KEY (`id`),
  ADD KEY `creator__id` (`creator__id`),
  ADD KEY `bank__id` (`bank__id`),
  ADD KEY `wallet__id` (`wallet__id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `addbalance`
--
ALTER TABLE `addbalance`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `address`
--
ALTER TABLE `address`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `app`
--
ALTER TABLE `app`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `app_image`
--
ALTER TABLE `app_image`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `app_setting`
--
ALTER TABLE `app_setting`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bank`
--
ALTER TABLE `bank`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `bill`
--
ALTER TABLE `bill`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `bill_pay`
--
ALTER TABLE `bill_pay`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `country`
--
ALTER TABLE `country`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=257;

--
-- AUTO_INCREMENT for table `credit_rec`
--
ALTER TABLE `credit_rec`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `currency`
--
ALTER TABLE `currency`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `debit_rec`
--
ALTER TABLE `debit_rec`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `due_pay`
--
ALTER TABLE `due_pay`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `expense`
--
ALTER TABLE `expense`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `expense_type`
--
ALTER TABLE `expense_type`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `loan`
--
ALTER TABLE `loan`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payment_receive`
--
ALTER TABLE `payment_receive`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `payment_return`
--
ALTER TABLE `payment_return`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pay_bill`
--
ALTER TABLE `pay_bill`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `previous_due_adv`
--
ALTER TABLE `previous_due_adv`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `salary`
--
ALTER TABLE `salary`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `service_type`
--
ALTER TABLE `service_type`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `setting`
--
ALTER TABLE `setting`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `setting_array_value`
--
ALTER TABLE `setting_array_value`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `status`
--
ALTER TABLE `status`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100022;

--
-- AUTO_INCREMENT for table `user_balance`
--
ALTER TABLE `user_balance`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_bank_exchange`
--
ALTER TABLE `user_bank_exchange`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_date_service`
--
ALTER TABLE `user_date_service`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_extend`
--
ALTER TABLE `user_extend`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_role`
--
ALTER TABLE `user_role`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `user_service`
--
ALTER TABLE `user_service`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT for table `user_service_ins`
--
ALTER TABLE `user_service_ins`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_service_payment`
--
ALTER TABLE `user_service_payment`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `user_to_setting`
--
ALTER TABLE `user_to_setting`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_to_setting_array_value`
--
ALTER TABLE `user_to_setting_array_value`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `vendor`
--
ALTER TABLE `vendor`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wallet`
--
ALTER TABLE `wallet`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1002;

--
-- AUTO_INCREMENT for table `withdraw`
--
ALTER TABLE `withdraw`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `addbalance`
--
ALTER TABLE `addbalance`
  ADD CONSTRAINT `addbalance_ibfk_1` FOREIGN KEY (`creator__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `addbalance_ibfk_2` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `addbalance_ibfk_3` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `address`
--
ALTER TABLE `address`
  ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`country__id`) REFERENCES `country` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `bank`
--
ALTER TABLE `bank`
  ADD CONSTRAINT `bank_ibfk_1` FOREIGN KEY (`country__id`) REFERENCES `country` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `bill_pay`
--
ALTER TABLE `bill_pay`
  ADD CONSTRAINT `bill_pay_ibfk_1` FOREIGN KEY (`creator__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bill_pay_ibfk_2` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bill_pay_ibfk_3` FOREIGN KEY (`bill__id`) REFERENCES `bill` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `bill_pay_ibfk_4` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `credit_rec`
--
ALTER TABLE `credit_rec`
  ADD CONSTRAINT `credit_rec_ibfk_1` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `credit_rec_ibfk_2` FOREIGN KEY (`creator__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `credit_rec_ibfk_3` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `currency`
--
ALTER TABLE `currency`
  ADD CONSTRAINT `currency_ibfk_1` FOREIGN KEY (`country__id`) REFERENCES `country` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `debit_rec`
--
ALTER TABLE `debit_rec`
  ADD CONSTRAINT `debit_rec_ibfk_1` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `debit_rec_ibfk_2` FOREIGN KEY (`creator__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `debit_rec_ibfk_3` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `due_pay`
--
ALTER TABLE `due_pay`
  ADD CONSTRAINT `due_pay_ibfk_1` FOREIGN KEY (`user__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `due_pay_ibfk_2` FOREIGN KEY (`payment_receive__id`) REFERENCES `payment_receive` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `expense`
--
ALTER TABLE `expense`
  ADD CONSTRAINT `expense_ibfk_1` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `expense_ibfk_2` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `loan`
--
ALTER TABLE `loan`
  ADD CONSTRAINT `loan_ibfk_1` FOREIGN KEY (`user__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `payment_receive`
--
ALTER TABLE `payment_receive`
  ADD CONSTRAINT `payment_receive_ibfk_1` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_receive_ibfk_2` FOREIGN KEY (`user__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_receive_ibfk_3` FOREIGN KEY (`service__id`) REFERENCES `service` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_receive_ibfk_4` FOREIGN KEY (`user_service_ins__id`) REFERENCES `user_service_ins` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_receive_ibfk_5` FOREIGN KEY (`user_service__id`) REFERENCES `user_service` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_receive_ibfk_6` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `payment_return`
--
ALTER TABLE `payment_return`
  ADD CONSTRAINT `payment_return_ibfk_1` FOREIGN KEY (`user__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_return_ibfk_2` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `payment_return_ibfk_3` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `pay_bill`
--
ALTER TABLE `pay_bill`
  ADD CONSTRAINT `pay_bill_ibfk_1` FOREIGN KEY (`vendor__id`) REFERENCES `vendor` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pay_bill_ibfk_2` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pay_bill_ibfk_3` FOREIGN KEY (`creator__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `pay_bill_ibfk_4` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `previous_due_adv`
--
ALTER TABLE `previous_due_adv`
  ADD CONSTRAINT `previous_due_adv_ibfk_1` FOREIGN KEY (`user__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `previous_due_adv_ibfk_2` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `previous_due_adv_ibfk_3` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `salary`
--
ALTER TABLE `salary`
  ADD CONSTRAINT `salary_ibfk_1` FOREIGN KEY (`employee__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_ibfk_2` FOREIGN KEY (`issuer__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_ibfk_3` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `salary_ibfk_4` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `service`
--
ALTER TABLE `service`
  ADD CONSTRAINT `service_ibfk_1` FOREIGN KEY (`service_type__id`) REFERENCES `service_type` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `setting_array_value`
--
ALTER TABLE `setting_array_value`
  ADD CONSTRAINT `setting_array_value_ibfk_1` FOREIGN KEY (`setting__id`) REFERENCES `setting` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`country__id`) REFERENCES `country` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`user_role__id`) REFERENCES `user_role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_balance`
--
ALTER TABLE `user_balance`
  ADD CONSTRAINT `user_balance_ibfk_1` FOREIGN KEY (`user__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_balance_ibfk_2` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_balance_ibfk_3` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_bank_exchange`
--
ALTER TABLE `user_bank_exchange`
  ADD CONSTRAINT `user_bank_exchange_ibfk_1` FOREIGN KEY (`user__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_bank_exchange_ibfk_2` FOREIGN KEY (`send_wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_bank_exchange_ibfk_3` FOREIGN KEY (`receive_wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_bank_exchange_ibfk_4` FOREIGN KEY (`send_bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_bank_exchange_ibfk_5` FOREIGN KEY (`receive_bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_date_service`
--
ALTER TABLE `user_date_service`
  ADD CONSTRAINT `user_date_service_ibfk_1` FOREIGN KEY (`user_service__id`) REFERENCES `user_service` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_extend`
--
ALTER TABLE `user_extend`
  ADD CONSTRAINT `user_extend_ibfk_1` FOREIGN KEY (`user__id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_extend_ibfk_2` FOREIGN KEY (`address__id`) REFERENCES `address` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_extend_ibfk_3` FOREIGN KEY (`user_role__id`) REFERENCES `user_role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_service`
--
ALTER TABLE `user_service`
  ADD CONSTRAINT `user_service_ibfk_1` FOREIGN KEY (`user__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_service_ibfk_2` FOREIGN KEY (`service__id`) REFERENCES `service` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_service_ibfk_3` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_service_ibfk_4` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_service_ins`
--
ALTER TABLE `user_service_ins`
  ADD CONSTRAINT `user_service_ins_ibfk_1` FOREIGN KEY (`user__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_service_ins_ibfk_2` FOREIGN KEY (`service__id`) REFERENCES `service` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_service_ins_ibfk_3` FOREIGN KEY (`user_service__id`) REFERENCES `user_service` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_service_ins_ibfk_4` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_service_ins_ibfk_5` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_service_payment`
--
ALTER TABLE `user_service_payment`
  ADD CONSTRAINT `user_service_payment_ibfk_1` FOREIGN KEY (`user_service__id`) REFERENCES `user_service` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_service_payment_ibfk_2` FOREIGN KEY (`payment_receive__id`) REFERENCES `payment_receive` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_to_setting`
--
ALTER TABLE `user_to_setting`
  ADD CONSTRAINT `user_to_setting_ibfk_1` FOREIGN KEY (`user__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `user_to_setting_ibfk_2` FOREIGN KEY (`setting__id`) REFERENCES `setting` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `user_to_setting_array_value`
--
ALTER TABLE `user_to_setting_array_value`
  ADD CONSTRAINT `user_to_setting_array_value_ibfk_1` FOREIGN KEY (`user_to_setting__id`) REFERENCES `user_to_setting` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `wallet`
--
ALTER TABLE `wallet`
  ADD CONSTRAINT `wallet_ibfk_1` FOREIGN KEY (`user_role__id`) REFERENCES `user_role` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `withdraw`
--
ALTER TABLE `withdraw`
  ADD CONSTRAINT `withdraw_ibfk_1` FOREIGN KEY (`creator__id`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `withdraw_ibfk_2` FOREIGN KEY (`bank__id`) REFERENCES `bank` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `withdraw_ibfk_3` FOREIGN KEY (`wallet__id`) REFERENCES `wallet` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
