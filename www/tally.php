<?php
/*
Handle form requests such as
*/
    header("Access-Control-Allow-Headers: X-Requested-With");
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST");
    header("Vary: Accept-Encoding");

// Because handling form requests is easier with PHP.
// Return the AJAX request

if ( strpos($_SERVER['HTTP_REFERER'], 'localhost') === FALSE && strpos($_SERVER['HTTP_REFERER'], 'denverpost.com') === FALSE ) die();

function error_out($slug)
{
    $error_url = 'http://www.denverpost.com/ci_15208788?source=err_';
    header('Location: ' . $error_url . $slug);
    die();
}

if ( !isset($_GET) ) error_out('nopost');


// Validate input.
// If we're taking input from a non-javascript enabled browser, we check that out here:
$is_ajax = FALSE;
if ( !isset($_GET['distance']) ) error_out('no-distance');
$distance = intval($_GET['distance']);

if ( isset($_SERVER['HTTP_ORIGIN']) )
{
    $is_ajax = TRUE;
    $distance = intval($_GET['distance']);
}

// Make sure there are POST fields for the submit_x and submit_y values
//if ( $is_ajax === FALSE && intval($_GET['x']) == 0 && intval($_GET['y']) == 0 ) error_out('noxy');
//if ( strpos('denverpost', $_SERVER["HTTP_REFERER"]) === FALSE ) error_out('referer');
if ( $distance < 0 ) header('Location: ' . $_SERVER['HTTP_REFERER'] . '?source=err_novote');


// Passed the security checks. Now we add the record to the database.
$slug = htmlspecialchars($_GET['slug']);
if ( isset($_ENV['MYSQL_PASS']) ) $password = trim($_ENV['MYSQL_PASS']);
if ( isset($_ENV['MYSQL_USER']) ) $user = trim($_ENV['MYSQL_USER']);
$connection = array(
    'user' => $user,
    'password' => $password,
    'db' => 'mapgame');
$db = new mysqli('localhost', $connection['user'], $connection['password'], $connection['db']);
if ( $db->connect_errno )
{
    echo 'Could not connect to database: ' . $db->connect_error;
}

// Get the game id
$sql = 'SELECT id, guesses, guess_average, wrong_guess_average, correct FROM games WHERE slug = "' . $slug . '" LIMIT 1';
$result = $db->query($sql);
$game = $result->fetch_object();
$games_id = intval($game->id);
$correct = intval($game->correct);
if ( $games_id == 0 ) die('Bad ID');

// Insert the guess
if ( $distance != -1 ):
    $sql = 'INSERT INTO guesses 
            (games_id, guess, lat, lon, ip) VALUES 
            (' . $games_id . ', ' . $distance . ', ' . floatval($_GET['lat']) . ',
            ' . floatval($_GET['lon']) . ', 
            "' . $_SERVER['REMOTE_ADDR'] . '")';
    $result = $db->query($sql);
endif;

// **** UPDATE THE GUESSES
$new_guesses = $game->guesses + 1;
if ( $distance == 0 ) $correct += 1;
$new_average = floatval(( ( $game->guesses * $game->guess_average ) + $distance ) / $new_guesses);

$new_wrong_average = $game->wrong_guess_average;
if ( $distance > 0 ):
    $wrong = $new_guesses - $correct;
    if ( $wrong < 1 ) $wrong = 1;
    $new_wrong_average =  floatval(( ( ( $wrong - 1 ) * $game->wrong_guess_average ) + $distance ) / $wrong );
endif;

$sql = 'UPDATE games SET correct = ' . $correct . ',
    guesses = ' . $new_guesses . ',
    guess_average = ' . $new_average . ',
    wrong_guess_average = ' . $new_wrong_average . '
    WHERE id = ' . $games_id . ' LIMIT 1';
$result = $db->query($sql);

// **** TELL THE READER HOW THEY DID.
echo '{ "correct": "' . $correct . '", "guesses": "' . $game->guesses . '", "average": "' . $game->guess_average . '" }';
