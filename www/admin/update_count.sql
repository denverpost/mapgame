INSERT INTO count (games, guesses) SELECT COUNT(*), SUM(guesses) FROM games;
