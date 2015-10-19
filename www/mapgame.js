var mapg = {
    init: function ()
    {
        // Config handling. External config objects must be named mapg_config
        if ( typeof window.mapg_config !== 'undefined' )
        {
            this.update_config(mapg_config);
        }
        this.slug = this.build_slug();
        this.map = new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions);

        answer_marker = new google.maps.Marker(
        {
            position: this.config.markerlatlng,
            map: this.map,
            draggable: true,
            title: 'Your Guess'
        });

        google.maps.event.addListener(window.answer_marker, 'mouseup', function (guess) { window.mapg.make_guess(guess); });

        // If we start with a loaded boundary, load it
        if ( this.config.border_file !== '' )
        {
            var geoxml_config = {
                map: this.map,
                processStyles: true,
                zoom: false,
                createOverlay: this.create_overlay,
                createMarker: this.create_marker
            };
            var kml_parser = new geoXML3.parser(geoxml_config);
            kml_parser.parse(this.config.border_file);
        }
    },
    parent: this,
    in_dev: 0,
    config: 
    { 
        snark: 1,
        group_game: 1,
        log_guesses: 0,
        log_url: '',
        target_name: '',
        target_slug: '',
        target_type: 'latlng',
        boundary_file: '',
        border_file: '',
        unit: 'miles', // miles or km
        zoom: 6,
        radius: 0,
        target: new google.maps.LatLng(27.175015 , 78.042155),
        centerlatlng: new google.maps.LatLng(0, 0),
        markerlatlng: 0
    },
    update_config: function (config) {
        // Take an external config object and update this config object.
        for ( var key in config )
        {
            if ( config.hasOwnProperty(key) )
            {
                this.config[key] = config[key];
            }
        }

        // Zoom and center are something that goes in the mapg.mapOptions object,
        // so we update that separately.
        this.mapOptions.zoom = this.config.zoom;
        // Older maps only have centerlatlng -- separating centerlatlng from the markerlatlng
        // gives us more flexibility on where we put the marker.
        if ( this.config.markerlatlng === 0 )
        {
            this.config.markerlatlng = this.config.centerlatlng;
        }

        this.mapOptions.center = this.config.centerlatlng;

        if ( typeof this.config.styles !== 'undefined' )
        {
            this.mapOptions.styles = this.config.styles;
        }
    },
    mapOptions: 
    {
        zoom: 8,
        center: new google.maps.LatLng(0, 0),
        disableDefaultUI: true,
        //mapTypeId: google.maps.MapTypeId.SATELLITE,
        mapTypeId: google.maps.MapTypeId.TERRAIN,
        disableDoubleClickZoom: true,
        draggable: false,
        scrollwheel: false,
        styles: [
          {
            "featureType": "road",
            "stylers": [
              { "visibility": "off" }
            ]
          },{
            "featureType": "administrative.locality",
            "stylers": [
              { "visibility": "off" }
            ]
          },{
            "featureType": "administrative.province",
            "elementType": "labels",
            "stylers": [
              { "visibility": "off" }
            ]
          }
        ]
    },
    slugify: function(str)
    {
        // Cribbed from https://github.com/andrefarzat/slugify/blob/master/slugify.js
        var from = 'àáäãâèéëêìíïîòóöôõùúüûñç·/_,:;',
        to = 'aaaaaeeeeiiiiooooouuuunc------';

        var i = 0,
            len = from.length;
        
        str = str.toLowerCase();

        for ( ; i < len; i++ )
        {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        return str.replace(/^\s+|\s+$/g, '') //trim
            .replace(/[^-a-zA-Z0-9\s]+/ig, '')
            .replace(/\s/gi, "-");
    },
    build_slug: function ()
    {
        // Put together the slug of a map -- a name we can refer to.
        //return this.slugify(this.config.target_name) + '_' + this.config.unit;
        return this.slugify(this.config.target_name);
    },
    slug: '',
    log_answer: function (distance, lat, lon)
    {
        // Send a request to a remote server to log how far the guess was from the mark
        if ( this.config.log_guesses !== 0 )
        {
            var params = '?slug=' + this.config.target_slug + '&distance=' + distance + '&lat=' + lat + '&lon=' + lon + '&callback=';
            var jqxhr = $.getJSON( this.config.log_url + params, function(data) 
            {
                // Success
                // Display how the reader has done compared to everyone else.
                // **TODO provide a link so they can see everyone else's guesses.
                // data will look something like { "guesses": "1", "average": "8" }

                var average = Math.round(data.average);
                if ( average < 5 ) average = Math.round(data.average*10) / 10;

                var s = 's';
                if ( average === 1 ) s = '';
                $('#result').append(' ' + data.guesses + ' other people have played. An average guess landed ' + average + ' mile' + s + ' away.');
                if  ( typeof data.correct !== 'undefined' )
                {
                    var people = "people";
                    if ( data.correct == 1 ) people = "person";

                    var percent = Math.round(data.correct/data.guesses*1000)/10;
                    if ( data.guesses == 0 ) percent = 0;

                    $('#result').append(' ' + data.correct + ' ' + people + ' (' + percent + '%) picked right.');

                    // Calculate the percent of people they did worse than.
                    var esses = "es";
                    if ( data.worse_than == 1 ) esses = "";
                    percent = Math.round(data.worse_than/data.guesses*1000)/10;
                    $('#result').append('<br><br>Your guess was further away than ' + data.worse_than + ' other guess' + esses + '. That means you did worse than ' + percent + '% of the people who played this.');

                    if ( distance == 0 && data.correct == 1 )
                    {
                        $('#result').append(' <span style="color:red; clear: both;">You\'re the first to get this right! Congrats!</span>');
                    }
                    else if ( distance == 0 && data.correct < 11 )
                    {
                        $('#result').append(' <span style="color:red; clear: both;">You\'re the ' + to_ordinal(data.correct) + ' to get this right! Right on!</span>');
                    }
                }
                })
                .fail(function() {
                    $('#result').append(' Sorry, we could not reach the upstream servers. Please <a href="mailto:jmurphy@denverpost.com">email Joe and let him know this game is busted</a>... or you can refresh the page and try again.');
                })
                .always(function() {
                });

            // If this map is part of a group game, communicate the distance to the parent frame.
            // Group games, as of now, will be a bunch of iframes.
            if ( typeof parent.map_group !== 'undefined' )
            {
                parent.map_group.add_guess(distance);
            }
        }
    },
    great_circle: function (lat1, lon1, lat2, lon2)
    {
        // Calculate the distance between two sets of lat/longs.
        // Cribbed from http://stackoverflow.com/questions/5260423/torad-javascript-function-throwing-error/7179026#7179026
        var R = 3958.7558657440545; // Radius of earth in Miles
        var dLat = Math.radians(lat2-lat1);
        var dLon = Math.radians(lon2-lon1);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(Math.radians(lat1)) * Math.cos(Math.radians(lat2)) * 
                Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d;
    },
    guess: {},
    show_answer: function (distance)
    {
        // Show the answer.
        if ( distance == 0 )
        {
            $('#result').text('You got it right! Congratulations!');
        }
        else
        {
            var s = 's';
            if ( distance === 1 ) s = '';
            $('#result').text('Your guess landed ' + distance + ' mile' + s + ' from the target.');
        }
        this.log_answer(distance, this.guess.latLng.lat(), this.guess.latLng.lng());
    },
    make_guess: function (guess)
    {
        // If the marker hasn't been moved we don't want to do anything:
        if ( this.config.markerlatlng.lat() == guess.latLng.lat() && this.config.markerlatlng.lng() == guess.latLng.lng() )
        {
            console.log(this.config, guess, this.config.markerlatlng.lat(), guess.latLng.lat());
            return false;
        }

        // Keep people from guessing again.
        this.guess = guess;
        window.answer_marker.draggable = false;
        google.maps.event.clearListeners(window.answer_marker, 'mouseup');
    
        // Check how far the click was from the target.
        // There are two types of target checks: Lat-Long, used for small cities or foreign cities
        // (cities smaller than five miles wide, or cities we don't have boundary data for), and
        // boundary target checks. For boundary checks we need the KML string for the boundary.
        if ( this.config.target_type == 'latlng' )
        {
            // G is lat, K is long in Google maps. NOT ANYMORE
            // H is lat, L is long in Google maps. 20150921
            // J is lat, M is long in Google maps. 20151012
            var distance = this.great_circle(this.config.target.lat(), this.config.target.lng(), guess.latLng.lat(), guess.latLng.lng())
            var distance_rounded = Math.round(distance);

            // If we have a value for mapg.config.radius, we subtract that from the distance.
            if ( this.radius > 0 )
            {
                distance_rounded = distance_rounded - this.radius;
                if ( distance_rounded < 0 ) distance_rounded = 0;
            }

            // Show where the target was.
            var target_marker = new google.maps.Marker(
            {
                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                position: this.config.target,
                map: this.map,
                draggable: false,
                title: this.config.target_name
            });

            this.show_answer(distance_rounded);
        }
        else if ( this.config.target_type == 'boundary' )
        {
            // Start on the boundary work.
            // this.find_distance handles the guess calculations.
            var guess = { lat: guess.latLng.lat(), lon: guess.latLng.lng() }
            var geoxml_config = {
                map: this.map,
                processStyles: true,
                zoom: false,
                afterParse: this.find_distance,
                failedParse: this.failed_parse,
                createOverlay: this.create_overlay,
                createMarker: this.create_marker
            };
            var kml_parser = new geoXML3.parser(geoxml_config);
            kml_parser.parse(this.config.boundary_file);
        }
    },
    find_distance: function find_distance(obj)
    {
        // See how close the guess was to the nearest point,
        // in case the guess was outside the boundary.
        console.log(obj);
        coords = obj[0].placemarks[0].Polygon[0].outerBoundaryIs[0].coordinates;
        var len = coords.length;
        var best_guess = 0.0;
        var in_bounds = google.maps.geometry.poly.containsLocation(window.mapg.guess.latLng, obj[0].gpolygons[0]);
        if ( in_bounds === false )
        {
            for ( i = 0; i < len; i++ )
            {
                var distance = window.mapg.great_circle(coords[i].lat, coords[i].lng, window.mapg.guess.latLng.lat(), window.mapg.guess.latLng.lng());
                if ( best_guess === 0.0 ) best_guess = distance;
                else if ( distance < best_guess ) best_guess = distance;
            }
            var guess_rounded = Math.round(best_guess);
        }
        else
        {
            var guess_rounded = 0;
        }
        window.mapg.show_answer(guess_rounded);
    },
    failed_parse: function failed_parse(obj)
    {
        //console.log('Fail: ', obj);
    },
    create_overlay: function create_overlay(obj) { kml_parser.createOverlay(obj); },
    create_marker: function create_marker(obj) { kml_parser.createMarker(obj); }
};

Math.radians = function (degrees)
{
    return degrees * (Math.PI / 180);
}


$(document).ready( function () { mapg.init(); });

var to_ordinal = function(n)
{
    // From https://gist.github.com/jlbruno/1535691
   var s=["th","st","nd","rd"],
       v=n%100;
   return n+(s[(v-20)%10]||s[v]||s[0]);
};
