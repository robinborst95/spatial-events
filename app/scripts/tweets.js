/* eslint no-underscore-dangle: 0  */

// exported variables
var addTweets; // eslint-disable-line no-unused-vars


(function () {
    'use strict';
    // we need to use some internal leaflet variables
    // Ugly global stuff from twtter
    var addTweetCluster = function(tweets) {
        var markers = L.markerClusterGroup({ chunkedLoading: true });
        _.each(tweets.features, function(tweet) {
            var coordinate = tweet.geometry.coordinates;
            var marker = L.marker(L.latLng(coordinate[1], coordinate[0]),
                                  { title: tweet.properties.title });
            marker.bindPopup(tweet.properties.text);
            markers.addLayer(marker);
        });
        map.addLayer(markers);
    };

    var addTweet = function(tweet) {
        // use the text by default for the popup
        function onEachFeature(feature, layer) {
            // does this feature have a property named popupContent?
            if (_.has(feature, 'properties.oembed.html')) {
                // if we have an oembed html, we'll use that
                layer.bindPopup(feature.properties.oembed.html);
                // the twttr.widgets.createWidget is not easy to use becausse the body is created on popup
            } else {
                layer.bindPopup(feature.properties.text);
            }
        }
        // feature collection
        var features = L.geoJson(tweet, {
            onEachFeature: onEachFeature,
            style: {
                stroke: true,
                color: 'white',
                fill: false
            }
        });

        features.addTo(map);

        _.each(
            _.values(features._layers),
            function(layer) {
                // add the path, hide it, fade in, wait it bit, fade out and toss away
                $(layer._path)
                    .hide()
                    .fadeIn({
                        'duration': 'slow'
                    })
                    .delay(15000)
                    .fadeOut({
                        duration: 'slow',
                        complete: function(){
                            map.removeLayer(features);
                        }
                    });
            }
        );
    };

    addTweets = function(){
        // Subscribe or load dataset
        // TODO: add /exchange/floodtags subscription here...
        _.each([
            'data/indonesia.json',
            'data/tweets.json'
        ], function(url) {
            fetch(url)
                .then(function(response){
                    return response.json();
                })
                .then(function(tweets){
                    if (_.isArray(tweets)) {
                        _.each(tweets, function(tweet){
                            addTweet(tweet);
                        });
                    } else if (_.isObject(tweets)) {
                        if (!_.get(tweets, 'type') === 'FeatureCollection') {
                            console.error('No feature collection in tweets', tweets);
                        }
                        addTweetCluster(tweets);
                    }

                });

        });

        // Once a popup is opened, load the twitter images.
        map.on('popupopen', function(popup) {
            var content = popup.popup._contentNode;
            twttr.widgets.load(content);
            // alternatively create a widget on the fly here.
            // Not sure how to get this working...
            // var id = popup.popup._source.feature.id;
            // twttr.widgets.createTweet(id.toString(), content, {});
        });
    };
}());
