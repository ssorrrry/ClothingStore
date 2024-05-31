-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Май 01 2024 г., 17:53
-- Версия сервера: 8.0.30
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `lime`
--

-- --------------------------------------------------------

--
-- Структура таблицы `category`
--

CREATE TABLE `category` (
  `id` int NOT NULL,
  `name` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'платье'),
(2, 'костюм');

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` int NOT NULL,
  `name` varchar(256) NOT NULL,
  `telephone` varchar(11) NOT NULL,
  `method_obtaining` varchar(50) NOT NULL,
  `method_payment` varchar(50) NOT NULL,
  `id_product` int NOT NULL,
  `size` varchar(1) NOT NULL,
  `quantity` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `name`, `telephone`, `method_obtaining`, `method_payment`, `id_product`, `size`, `quantity`) VALUES
(9, 'Анна', '80000000000', 'Самовывоз', 'Карта', 2, 'L', 1),
(11, 'Света', '89999999999', 'Доставка', 'Карта', 5, 'S', 1);

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

CREATE TABLE `products` (
  `id` int NOT NULL,
  `title` varchar(256) NOT NULL,
  `description` text NOT NULL,
  `color` varchar(256) NOT NULL,
  `image` varchar(256) NOT NULL,
  `price` int NOT NULL,
  `id_category` int NOT NULL,
  `article` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `title`, `description`, `color`, `image`, `price`, `id_category`, `article`) VALUES
(1, 'ПЛАТЬЕ МИДИ С ПРИНТОМ', 'Приталенное платье миди с принтом. Декорировано широкими лентами на v-образном вырезе. Длинные рукава с манжетами. Плиссировка на подоле. На подкладке. Застежка на потайную молнию сбоку.', 'черный / белый', '../../Photo/Products/Dress/75517657313d8706e940f11ee9de800155d011401.jpeg', 6599, 1, '12123-1'),
(2, 'ПЛАТЬЕ-БЛЕЙЗЕР ПРИТАЛЕННОГО КРОЯ', 'Строгое платье миди приталенного кроя с глубоким V-образным вырезом декольте. Отложной воротник с застроенными лацканами. Длинные рукава, подплечники. Передние прорезные карманы. Высокий фронтальный разрез. Подкладка в тон. Застежка на молнию.', 'черный', '../../Photo/Products/Dress/75517632013d87063940f11ee9de800155d011401.jpeg', 10999, 1, '12123-2'),
(3, 'ТРИКОТАЖНОЕ ПЛАТЬЕ С АППЛИКАЦИЯМИ ИЗ ПАЙЕТОК', 'Облегающее платье макси из металлизированного трикотажа с аппликациями из пайеток. Круглый вырез.', 'золотой', '../../Photo/Products/Dress/753391282ddf39c7e83cd11ee9de100155d011401.jpeg', 13999, 1, '12123-3'),
(4, 'УКОРОЧЕННЫЙ БЛЕЙЗЕР ПРИТАЛЕННОГО КРОЯ', 'Укороченный блейзер полуприталенного кроя из смесовой шерсти. Отложной воротник с заостренными лацканами. Длинные рукава с пуговицами на манжетах, подплечники. Передние боковые карманы с клапанами, декоративный нагрудный карман. На подкладке. Двубортная застежка на обтяжные пуговицы в тон.', 'черный', '../../Photo/Products/Suit/7540036942ded1fad896411ee9de300155d011401.jpeg', 10999, 2, '27163-1'),
(5, 'БРЮКИ ПРЯМОГО КРОЯ С ЗАЩИПАМИ', 'Костюмные брюки прямого кроя с защипами. Боковые передние карманы и декоративные прорезные карманы сзади. Застежка на молнию, крючок и внутреннюю пуговицу.', ' коричневый', '../../Photo/Products/Suit/7546771573f2268068f8311ee9de600155d011401.jpeg', 5599, 2, '27163-2');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `login` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `login`, `password`, `status`) VALUES
(1, 'admin', 'admin', 'admin'),
(2, 'user', 'user', 'user'),
(4, 'sd', 'sd', 'user');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `category`
--
ALTER TABLE `category`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT для таблицы `products`
--
ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
