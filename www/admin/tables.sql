CREATE TABLE `guesses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `games_id` int(11) NOT NULL,
  `guess` float NOT NULL,
  `lat` float NOT NULL,
  `lon` float NOT NULL,
  `ip` varchar(30) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`id`),
  KEY `games_id` (`games_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1;

CREATE TABLE `games` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) COLLATE utf8_bin NOT NULL,
  `group_slug` varchar(100) COLLATE utf8_bin NOT NULL,
  `title` varchar(250) COLLATE utf8_bin NOT NULL,
  `description` text COLLATE utf8_bin NOT NULL,
  `date_expire` date DEFAULT NULL,
  `guess_average` float NOT NULL DEFAULT '0',
  `guesses` int(11) NOT NULL DEFAULT '0',
  `lat` float NOT NULL,
  `lon` float NOT NULL,
  `ip` varchar(50) COLLATE utf8_bin NOT NULL,
  `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `correct` int(11) NOT NULL DEFAULT '0',
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;
