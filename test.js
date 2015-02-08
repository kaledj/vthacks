var DB = require('db.js')

var database = new DB({URI: "/tmp/vthacks.db"});

database.openDatabase(function (err) {
	if(err) { console.log(err); return; }
	database.createPlaylist('TEST_PLAYLIST', function (err) {
		if(err) console.log(err);
		database.pushSongTo('TEST_PLAYLIST', 'Some song', function (err) {
			if(err) console.log(err); 
			database.popSongFrom('TEST_PLAYLIST', function (err, result) {
				if(err) console.log(err);
				console.log(result);
			});
		});
	});
	database.createPlaylist('TEST_PLAYLIST2', function (err) {
                if(err) console.log(err);
                database.pushSongTo('TEST_PLAYLIST2', 'Artist - Song', function (err) {
                        database.pushSongTo('TEST_PLAYLIST2', 'Artist2 - Song2', function (err) {
				if(err) console.log(err);
				database.popSongFrom('TEST_PLAYLIST2', function (err, result) {
					console.log(result);
                        		database.popSongFrom('TEST_PLAYLIST2', function (err, result) {
                                		if(err) console.log(err);
                                		console.log(result);
                        		});
				});
			});
                });
        });
});


