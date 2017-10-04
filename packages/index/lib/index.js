'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.app = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressHandlebars = require('express-handlebars');

var _expressHandlebars2 = _interopRequireDefault(_expressHandlebars);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _wwOpenSpaceWws = require('ww-open-space-wws');

var _wwOpenSpaceWws2 = _interopRequireDefault(_wwOpenSpaceWws);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = exports.app = (0, _express2.default)();
app.use(_bodyParser2.default.json());

app.engine('handlebars', (0, _expressHandlebars2.default)());
app.set('view engine', 'handlebars');

var viewPath = require.resolve('ww-open-space-static');

var wwsClient = new _wwOpenSpaceWws2.default({
    id: process.env.APP_ID,
    secret: process.env.APP_SECRET
});

app.get('/', function (req, res) {
    res.sendStatus(200);
});

app.post('/api/join', function (req, res) {
    res.sendStatus(200);
    return;
});

app.use('/static', _express2.default.static(_path2.default.dirname(viewPath)));

app.get(/\/static\/.*/, function (req, res) {
    // If there is no matching file in the static directory
    res.status(404).send();
});

app.get('/join/:spaceId', function (req, res) {
    var id = req.params.spaceId;

    wwsClient.fetchSpace({ id: id }).then(function (space) {
        var args = {
            space: space,
            staticBase: '/static/',
            layout: false
        };

        res.render(viewPath, args);
    }).catch(function (err) {
        console.error('Error fetching space', id, err);
        res.sendStatus(404);
    });
});

var PORT = process.env.PORT || 8080;

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, function () {
        console.log('Server listening on port', PORT);
    });
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJ1c2UiLCJqc29uIiwiZW5naW5lIiwic2V0Iiwidmlld1BhdGgiLCJyZXF1aXJlIiwicmVzb2x2ZSIsInd3c0NsaWVudCIsImlkIiwicHJvY2VzcyIsImVudiIsIkFQUF9JRCIsInNlY3JldCIsIkFQUF9TRUNSRVQiLCJnZXQiLCJyZXEiLCJyZXMiLCJzZW5kU3RhdHVzIiwicG9zdCIsInN0YXRpYyIsImRpcm5hbWUiLCJzdGF0dXMiLCJzZW5kIiwicGFyYW1zIiwic3BhY2VJZCIsImZldGNoU3BhY2UiLCJ0aGVuIiwiYXJncyIsInNwYWNlIiwic3RhdGljQmFzZSIsImxheW91dCIsInJlbmRlciIsImNhdGNoIiwiY29uc29sZSIsImVycm9yIiwiZXJyIiwiUE9SVCIsIk5PREVfRU5WIiwibGlzdGVuIiwibG9nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFFQTs7Ozs7O0FBRU8sSUFBTUEsb0JBQU0sd0JBQVo7QUFDUEEsSUFBSUMsR0FBSixDQUFRLHFCQUFXQyxJQUFYLEVBQVI7O0FBRUFGLElBQUlHLE1BQUosQ0FBVyxZQUFYLEVBQXlCLGtDQUF6QjtBQUNBSCxJQUFJSSxHQUFKLENBQVEsYUFBUixFQUF1QixZQUF2Qjs7QUFFQSxJQUFNQyxXQUFXQyxRQUFRQyxPQUFSLENBQWdCLHNCQUFoQixDQUFqQjs7QUFFQSxJQUFNQyxZQUFZLDZCQUFjO0FBQzVCQyxRQUFJQyxRQUFRQyxHQUFSLENBQVlDLE1BRFk7QUFFNUJDLFlBQVFILFFBQVFDLEdBQVIsQ0FBWUc7QUFGUSxDQUFkLENBQWxCOztBQUtBZCxJQUFJZSxHQUFKLENBQVEsR0FBUixFQUFhLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3ZCQSxRQUFJQyxVQUFKLENBQWUsR0FBZjtBQUNILENBRkQ7O0FBSUFsQixJQUFJbUIsSUFBSixDQUFTLFdBQVQsRUFBc0IsVUFBQ0gsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDaENBLFFBQUlDLFVBQUosQ0FBZSxHQUFmO0FBQ0E7QUFDSCxDQUhEOztBQUtBbEIsSUFBSUMsR0FBSixDQUFRLFNBQVIsRUFBbUIsa0JBQVFtQixNQUFSLENBQWUsZUFBS0MsT0FBTCxDQUFhaEIsUUFBYixDQUFmLENBQW5COztBQUVBTCxJQUFJZSxHQUFKLENBQVEsY0FBUixFQUF3QixVQUFDQyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUFFO0FBQ3BDQSxRQUFJSyxNQUFKLENBQVcsR0FBWCxFQUFnQkMsSUFBaEI7QUFDSCxDQUZEOztBQUlBdkIsSUFBSWUsR0FBSixDQUFRLGdCQUFSLEVBQTBCLFVBQUNDLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3BDLFFBQU1SLEtBQUtPLElBQUlRLE1BQUosQ0FBV0MsT0FBdEI7O0FBRUFqQixjQUFVa0IsVUFBVixDQUFxQixFQUFFakIsTUFBRixFQUFyQixFQUE2QmtCLElBQTdCLENBQWtDLGlCQUFTO0FBQ3ZDLFlBQU1DLE9BQU87QUFDVEMsd0JBRFM7QUFFVEMsd0JBQVksVUFGSDtBQUdUQyxvQkFBUTtBQUhDLFNBQWI7O0FBTUFkLFlBQUllLE1BQUosQ0FBVzNCLFFBQVgsRUFBcUJ1QixJQUFyQjtBQUNILEtBUkQsRUFRR0ssS0FSSCxDQVFTLGVBQU87QUFDWkMsZ0JBQVFDLEtBQVIsQ0FBYyxzQkFBZCxFQUFzQzFCLEVBQXRDLEVBQTBDMkIsR0FBMUM7QUFDQW5CLFlBQUlDLFVBQUosQ0FBZSxHQUFmO0FBQ0gsS0FYRDtBQVlILENBZkQ7O0FBaUJBLElBQU1tQixPQUFPM0IsUUFBUUMsR0FBUixDQUFZMEIsSUFBWixJQUFvQixJQUFqQzs7QUFFQSxJQUFJM0IsUUFBUUMsR0FBUixDQUFZMkIsUUFBWixLQUF5QixNQUE3QixFQUFxQztBQUNqQ3RDLFFBQUl1QyxNQUFKLENBQVdGLElBQVgsRUFBaUIsWUFBTTtBQUNuQkgsZ0JBQVFNLEdBQVIsQ0FBWSwwQkFBWixFQUF3Q0gsSUFBeEM7QUFDSCxLQUZEO0FBR0giLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZXhwcmVzcyBmcm9tICdleHByZXNzJztcbmltcG9ydCBoYW5kbGViYXJzIGZyb20gJ2V4cHJlc3MtaGFuZGxlYmFycyc7XG5pbXBvcnQgYm9keVBhcnNlciBmcm9tICdib2R5LXBhcnNlcic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuaW1wb3J0IFdXU0NsaWVudCBmcm9tICd3dy1vcGVuLXNwYWNlLXd3cyc7XG5cbmV4cG9ydCBjb25zdCBhcHAgPSBleHByZXNzKCk7XG5hcHAudXNlKGJvZHlQYXJzZXIuanNvbigpKTtcblxuYXBwLmVuZ2luZSgnaGFuZGxlYmFycycsIGhhbmRsZWJhcnMoKSk7XG5hcHAuc2V0KCd2aWV3IGVuZ2luZScsICdoYW5kbGViYXJzJyk7XG5cbmNvbnN0IHZpZXdQYXRoID0gcmVxdWlyZS5yZXNvbHZlKCd3dy1vcGVuLXNwYWNlLXN0YXRpYycpO1xuXG5jb25zdCB3d3NDbGllbnQgPSBuZXcgV1dTQ2xpZW50KHtcbiAgICBpZDogcHJvY2Vzcy5lbnYuQVBQX0lELFxuICAgIHNlY3JldDogcHJvY2Vzcy5lbnYuQVBQX1NFQ1JFVFxufSk7XG5cbmFwcC5nZXQoJy8nLCAocmVxLCByZXMpID0+IHtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xufSk7XG5cbmFwcC5wb3N0KCcvYXBpL2pvaW4nLCAocmVxLCByZXMpID0+IHtcbiAgICByZXMuc2VuZFN0YXR1cygyMDApO1xuICAgIHJldHVybjtcbn0pO1xuXG5hcHAudXNlKCcvc3RhdGljJywgZXhwcmVzcy5zdGF0aWMocGF0aC5kaXJuYW1lKHZpZXdQYXRoKSkpO1xuXG5hcHAuZ2V0KC9cXC9zdGF0aWNcXC8uKi8sIChyZXEsIHJlcykgPT4geyAvLyBJZiB0aGVyZSBpcyBubyBtYXRjaGluZyBmaWxlIGluIHRoZSBzdGF0aWMgZGlyZWN0b3J5XG4gICAgcmVzLnN0YXR1cyg0MDQpLnNlbmQoKTtcbn0pO1xuXG5hcHAuZ2V0KCcvam9pbi86c3BhY2VJZCcsIChyZXEsIHJlcykgPT4ge1xuICAgIGNvbnN0IGlkID0gcmVxLnBhcmFtcy5zcGFjZUlkO1xuXG4gICAgd3dzQ2xpZW50LmZldGNoU3BhY2UoeyBpZCB9KS50aGVuKHNwYWNlID0+IHtcbiAgICAgICAgY29uc3QgYXJncyA9IHtcbiAgICAgICAgICAgIHNwYWNlLFxuICAgICAgICAgICAgc3RhdGljQmFzZTogJy9zdGF0aWMvJyxcbiAgICAgICAgICAgIGxheW91dDogZmFsc2VcbiAgICAgICAgfTtcblxuICAgICAgICByZXMucmVuZGVyKHZpZXdQYXRoLCBhcmdzKTtcbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBmZXRjaGluZyBzcGFjZScsIGlkLCBlcnIpO1xuICAgICAgICByZXMuc2VuZFN0YXR1cyg0MDQpO1xuICAgIH0pO1xufSk7XG5cbmNvbnN0IFBPUlQgPSBwcm9jZXNzLmVudi5QT1JUIHx8IDgwODA7XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Rlc3QnKSB7XG4gICAgYXBwLmxpc3RlbihQT1JULCAoKSA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTZXJ2ZXIgbGlzdGVuaW5nIG9uIHBvcnQnLCBQT1JUKTtcbiAgICB9KTtcbn1cbiJdfQ==