// Ugly global stuff from twtter

window.twttr = (function (d, s, id) {
    var t, js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src= "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);
    return window.twttr || (t = { _e: [], ready: function (f) { t._e.push(f) } });
}(document, "script", "twitter-wjs"));

var addTweet = function(tweet) {

    // use the text by default for the popup
    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties && feature.properties.oembed.html) {
            // if we have an oembed html, we'll use that
            layer.bindPopup(feature.properties.oembed.html);
            // the twttr.widgets.createWidget is not easy to use becausse the body is created on popup
        } else {
            layer.bindPopup(feature.properties.text);
        }
    }
    var feature = L.geoJson(tweet, {
        onEachFeature: onEachFeature,
        style: {
            stroke: true,
            color: 'white',
            fill: false
        }
    });

    feature.addTo(map);

    _.each(
        _.values(feature._layers),
        function(layer) {
            // add the path, hide it, fade in, wait it bit, fade out and toss away
            $(layer._path)
                .hide()
                .fadeIn({
                    'duration': 'slow'
                })
                .delay(15000);
                // .fadeOut({
                //     duration: 'slow',
                //     complete: function(){
                //         // map.removeLayer(feature);
                //     }
                // });
        }
    );
}

var addTweets = function(){
    // Subscribe or load dataset
    // TODO: add /exchange/floodtags subscription here...
    fetch('../data/tweets.json')
        .then(function(response){
            return response.json();
        })
        .then(function(tweets){
            _.each(tweets, function(tweet){
                addTweet(tweet);
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
