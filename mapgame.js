var mapg = {
    config: 
    { 
        log_guesses: 0,
        log_url: '',
        target_name: '',
        target_type: 'latlng',
        unit: 'miles', // miles or km
        target: new google.maps.LatLng(27.175015 , 78.042155),
        centerlatlng: new google.maps.LatLng(0, 0)
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
    },
    mapOptions: 
    {
        zoom: 8,
        center: new google.maps.LatLng(0, 0),
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    },
    log_answer: function (slug, distance)
    {
        // Send a request to a remote server to log how far the guess was from the mark
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
    init: function ()
    {
        // Config handling. External config objects must be named mapg_config
        if ( typeof window.mapg_config !== 'undefined' )
        {
            this.update_config(mapg_config);
        }

        var map = new google.maps.Map(document.getElementById('map-canvas'), this.mapOptions);

        var marker = new google.maps.Marker(
        {
            position: this.config.centerlatlng,
            map: map,
            draggable: true,
            title: 'Your Guess'
        });

        google.maps.event.addListener(marker, 'mouseup', function() 
        {
            // If the marker hasn't been moved we don't want to do anything:
            if ( config.centerlatlng.B == this.position.B && config.centerlatlng.k == this.position.k )
            {
                return false;
            }
        
            // Check how far the click was from the target.
            // There are two types of target checks: Lat-Long, used for small cities or foreign cities
            // (cities smaller than five miles wide, or cities we don't have boundary data for), and
            // boundary target checks. For boundary checks we need the KML string for the boundary.
            if ( this.config.target_type == 'latlng' )
            {
                // k is lat, B is long in Google maps.
                distance = this.great_circle(this.config.centerlatlng.k, this.position.k, this.config.centerlatlng.B, this.position.B);
                $('#result').text('Your guess landed ' + distance + ' miles from the target');
                console.log(distance, ' miles');
            }
        });
        var boundary = new google.maps.KmlLayer('http://extras.denverpost.com/media/kml/state/montana.kml');
        //boundary.setMap(map);
        //console.log(boundary);
    }
};

$(document).ready( function () { mapg.init(); });

Math.radians = function (degrees)
{
    return degrees * (Math.PI / 180);
}

