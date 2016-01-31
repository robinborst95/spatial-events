// global: map, SockJS, Stomp, omnivore
var domain = '54.76.43.47';
// 172.28.128.3

var ws = new SockJS('http://' + domain + '/stomp');
var client = Stomp.over(ws);
client.debug = null;
client.heartbeat.outgoing = 0; // client will not send heartbeats
client.heartbeat.incoming = 0; // client does not want to receive heartbeats

function fixCoords(coords) {
    // Work around leaflet bug....pfff...
    // update if any coordinates is < 180
    if (
        _.any(
            _.map(
                coords._latlngs,
                function(x) {
                    return x.lng < -0;
                }
            )
        )
    ) {
        // this whole thing is needed to fix some bug in leaflet where
        // coordinates around the 180 degree break
        coords._latlngs = _.map(
            coords._latlngs,
            function(x, i) {
                if (i > 0) {
                    // if we have a jump of more than 180deg
                    // this -> coords._latlngs
                    if ((x.lng - this[i - 1].lng) < -180.0) {
                        var wrapped = new L.latLng(x.lat, x.lng + 360, true);
                        this[i] = wrapped;
                        return wrapped;
                    }
                    if ((x.lng - this[i - 1].lng) > 180.0) {
                        var wrapped = new L.latLng(x.lat, x.lng - 360, true);
                        this[i] = wrapped;
                        return wrapped;
                    }
                }
                return x;
            },
            coords._latlngs
        )
    }
    return coords;
}

var subscription;

var on_connect = function() {
    console.log('connected');
    subscription = client.subscribe(
        '/exchange/crisis_crawl',
        function(message) {
            var obj = JSON.parse(message.body);
            var wkt = obj.footprint;
            var feature = omnivore.wkt.parse(wkt);
            feature.setStyle({fillColor: 'blue'});
            // replace coords by fixed coordinates (wrap around 180o)
            var coords = _.values(feature._layers)[0];
            coords = fixCoords(coords);

            // back to what we wanted to do... add it to the map
            feature.addTo(map);
            // remove layer after 1 second
            _.each(
                _.values(feature._layers),
                function(layer) {
                    // add the path, hide it, fade in, wait it bit, fade out and toss away
                    $(layer._path)
                        .hide()
                        .fadeIn()
                        .delay(3000)
                        .fadeOut({
                            duration: 'slow',
                            complete: function(){ map.removeLayer(feature); }
                        });
                }
            );
            feature.on('click', function(){
                console.log(this);

            })

        }
    );
    subscription = client.subscribe(
        '/queue/crisis_download',
        function(message) {
            var obj = JSON.parse(message.body);
            var wkt = obj.footprint;
            var feature = omnivore.wkt.parse(wkt);
            feature.setStyle({fillColor: 'green'});
            // replace coords by fixed coordinates (wrap around 180o)
            var coords = _.values(feature._layers)[0];

            coords = fixCoords(coords);
            // back to what we wanted to do... add it to the map
            feature.addTo(map);
            // remove layer after 1 second
            _.each(
                _.values(feature._layers),
                function(layer) {
                    // add the path, hide it, fade in, wait it bit, fade out and toss away
                    $(layer._path)
                        .hide()
                        .fadeIn()
                        .delay(10000)
                        .fadeOut({
                            duration: 'slow',
                            complete: function(){ map.removeLayer(feature); }
                        });
                }
            );
            feature.on('click', function(){
                console.log(this);

            })

        }
    );
    document.addEventListener(
        'incident',
        function(evt) {
            console.log('send to rabbitmq', evt.detail);
            client.send('/exchange/crisis_incident', {"content-type":"application/json"}, JSON.stringify(evt.detail));
        }
    );

};
var on_error = function(evt) {
    console.log('error', evt);
};
client.connect('public', 'public', on_connect, on_error, '/');
