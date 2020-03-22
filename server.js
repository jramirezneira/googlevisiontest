const express = require('express');
const cors = require('cors');
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const app = express();

// serves main page 
app.get("/", function (req, res) {
    res.sendfile('./index.html')
});

//Configura cors para que api pueda ser usada en forma remota
app.use(cors());

/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
    console.log('static file request : ' + req.params);
    res.sendfile(__dirname + req.params[0]);
});

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});

// configura storage para subir imágenes, las imagenes se registran en formato jpg con la fecha y hora actual como nombre
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '.jpg')
    }
});
const upload = multer({ storage: storage })


//importa y configura parámetros y credenciales de google vision
const vision = require('@google-cloud/vision')({
    projectId: 'testimages-269619',
    keyFilename: './cloud-credentials.json'
});



app.post("/objects", upload.single('uploads'), function (req, res) {
    const currentFile = req.file.path;
    const request = {
        source: {
            filename: currentFile
        }
    };
    vision.labelDetection(request)
        .then((results) => {
            const objects = results[0].labelAnnotations;
            //console.log('objects:');
            //objects.forEach((object) => console.log(object.description));
            unlinkAsync(req.file.path);
            res.send(objects);
        })
        .catch((err) => {
            console.error('ERROR:', err);
            res.send("ERROR");
        });
});



app.post("/explicit", upload.single('uploads'), function (req, res) {
    const currentFile = req.file.path;
    const request = {
        source: {
            filename: currentFile
        }
    };
    vision.safeSearchDetection(request)
        .then((results) => {
            const objects = results[0].safeSearchAnnotation;
            //console.log(objects);
            unlinkAsync(req.file.path);
            res.send(objects);
        })
        .catch((err) => {
            console.error('ERROR:', err);
            res.send("ERROR");
        });
});

