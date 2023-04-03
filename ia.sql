-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-04-2023 a las 04:40:19
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `ia`
--

DELIMITER $$
--
-- Funciones
--
CREATE DEFINER=`root`@`localhost` FUNCTION `getcostUSD` (`tokens` INT(11)) RETURNS DECIMAL(10,5) DETERMINISTIC BEGIN 
    SET @costdolar = 0.002;
    SET @cost = (@costdolar/1000)*tokens;
    RETURN @cost;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `completions`
--

CREATE TABLE `completions` (
  `idc` int(11) NOT NULL,
  `cidapi` int(11) NOT NULL,
  `cnom` varchar(50) NOT NULL,
  `csession` varchar(100) NOT NULL,
  `cdata` blob NOT NULL,
  `cprompt` varchar(500) NOT NULL,
  `fcprompt` timestamp NULL DEFAULT current_timestamp(),
  `ccompletion` varchar(5000) DEFAULT NULL,
  `fccompletion` timestamp NULL DEFAULT NULL,
  `ctemperature` double NOT NULL,
  `cmaxtoken` int(11) NOT NULL,
  `prompt_tokens` int(11) DEFAULT 0,
  `completion_tokens` int(11) DEFAULT 0,
  `total_tokens` int(11) DEFAULT 0,
  `idcompletion` varchar(100) DEFAULT NULL,
  `cmodel` varchar(20) NOT NULL,
  `status` tinyint(4) DEFAULT 0,
  `idpayin` int(11) DEFAULT NULL,
  `log` varchar(1000) DEFAULT NULL,
  `flog` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `completions`
--
DELIMITER $$
CREATE TRIGGER `tripay` AFTER UPDATE ON `completions` FOR EACH ROW if new.idpayin >0 THEN
 UPDATE completions_pay set totaltoken=totaltoken+new.total_tokens,costoUSD= getcostUSD(totaltoken) where idpay= new.idpayin;
END IF
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `completions_pay`
--

CREATE TABLE `completions_pay` (
  `idpay` int(11) NOT NULL,
  `cidapi` int(11) NOT NULL,
  `totaltoken` int(11) DEFAULT 0,
  `costoUSD` decimal(10,5) DEFAULT 0.00000,
  `costoBOB` decimal(10,5) DEFAULT 0.00000,
  `status` int(11) NOT NULL DEFAULT 1,
  `fechareg` timestamp NOT NULL DEFAULT current_timestamp(),
  `fechastatus` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `completions`
--
ALTER TABLE `completions`
  ADD PRIMARY KEY (`idc`),
  ADD KEY `cidapi` (`cidapi`);

--
-- Indices de la tabla `completions_pay`
--
ALTER TABLE `completions_pay`
  ADD PRIMARY KEY (`idpay`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `completions`
--
ALTER TABLE `completions`
  MODIFY `idc` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `completions_pay`
--
ALTER TABLE `completions_pay`
  MODIFY `idpay` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
