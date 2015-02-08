var DB = require('db.js')

var database = new DB({URI: "/tmp/vthacks.db"});

database.openDatabase(function (err) {
        if(err) {
                console.log(err);
                return;
        }
        database.createPlaylist('TEST_PLAYLIST', function (err) {
                if(err) console.log(err);
                database.popSongFrom('TEST_PLAYLIST', function (err, result) {
                        if(err) console.log(err);
                        console.log(result);
                        database.closeDatabase();
                });
        });
});

