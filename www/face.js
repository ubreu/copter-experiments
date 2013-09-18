$(document).on('ready', function () {
    var running = false;
    var faces = [];
    camera.init({
        targetCanvas: document.getElementById('webcam'),

        onFrame: function (canvas) {
            for (var i = 0; i < faces.length; i++) {
                var face = faces[i]
                var context = canvas.getContext('2d');
                context.beginPath();
                context.rect(face.x, face.y, face.width, face.height);
                context.lineWidth = 2;
                context.strokeStyle = 'green';
                context.stroke();
            }
            if (!running) {
                running = true;
                var url = canvas.toDataURL('image/png');
                var data = url.substr(url.indexOf(','));
                $.ajax({
                    type: 'POST',
                    url: '/api/face_detection',
                    data: data,
                    contentType: 'text/plain'
                }).done(function (result) {
                    faces = result;
                }).fail(function (e) {
                    console.log(e);
                }).always(function (e) {
                    running = false;
                });
            }
        },

        onSuccess: function() {
            console.log('success!');
        },

        onError: function(error) {
            console.log(error);
        },

        onNotSupported: function() {
            console.log('not supported');
        }
    });
});
