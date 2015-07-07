var domain = '172.28.128.3';

var ws = new SockJS('http://' + domain + '/stomp');
var client = Stomp.over(ws);
client.debug = null;
client.heartbeat.outgoing = 0; // client will not send heartbeats
client.heartbeat.incoming = 0; // client does not want to receive heartbeats

var subscription;
var on_connect = function() {
    console.log('connected');
    subscription = client.subscribe(
        "/exchange/crisis_crawl",
        function(message){
            var obj = JSON.parse(message.body);
            wkt = obj.footprint;
            var feature = omnivore.wkt.parse(wkt);
            // replace coords by fixed coordinates (wrap around 180o)
            var coords = _.values(feature._layers)[0];
            // update if any coordinates is < 180

            if (
                _.any(
                    _.map(
                        coords._latlngs,
                        function(x){return x.lng < -0;}
                    )
                )
            ) {
                coords._latlngs = _.map(
                    coords._latlngs,
                    function(x, i) {
                        if (i > 0 ) {
                            // if we have a jump of more than 180deg
                            if ( (x.lng - this[i-1].lng) < -180.0 ) {
                                var wrapped = new L.latLng(x.lat, x.lng + 360, true);
                                this[i] = wrapped;
                                return wrapped;
                            }
                            if ( (x.lng - this[i-1].lng) > 180.0 ) {
                                var wrapped = new L.latLng(x.lat, x.lng - 360, true);
                                this[i] = wrapped;
                                return wrapped;
                            }
                        }
                        return x;
                    }, coords._latlngs
                )
            }
            feature.addTo(map);

            // remove layer after 1 second
            _.each(
                _.values(feature._layers),
                function(layer){
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

};
var on_error =  function() {
    console.log('error');
};
client.connect('public', 'public', on_connect, on_error, '/');
