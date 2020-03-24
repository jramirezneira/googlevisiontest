//const openApiDocumentation =  require('./openApiDocumentation');
const express = require('express');
const swagger = require('swagger-ui-express');
const yaml = require('js-yaml');
const cors = require('cors');
const path  = require('path');
const fs = require('fs')
const { promisify } = require('util')
const unlinkAsync = promisify(fs.unlink)
const app = express();

let fileContents = fs.readFileSync('./openApiDocumentation.yaml', 'utf8');
let openApiDocumentation = yaml.safeLoad(fileContents);


//Configura cors para que api pueda ser usada en forma remota
app.use(cors());



var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log("Listening on " + port);
});



// configura storage para subir imágenes, las imagenes se registran en formato jpg con la fecha y hora actual como nombre
const multer = require('multer');
const storage = multer.diskStorage({
    destination: path.join(__dirname,'/uploads'), 
    
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


//Objetos detectados en la imagen
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
            unlinkAsync(req.file.path);
            res.send(objects);
        })
        .catch((err) => {
            console.error('ERROR:', err);
            res.send("ERROR");
        });
});


//Contenido explícito
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

app.use('/api-doc', swagger.serve, swagger.setup(openApiDocumentation));