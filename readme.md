# Proyecto  de Javier Ramirez Neira 
# Google Could Vision + NodeJS + Kubernetes

## Instalación en Kubernetes

### 1- Crear cluster de kubernetes en google cloud
### 2- Desde la terminal de google cloud importar código desde github
```bash
git clone https://github.com/jramirezneira/googlevisiontest.git
cd googlevisiontest
```
### 2- Obtener credenciales para el Registro de contenedores de Google
```bash
gcloud auth configure-docker
```
### 3- Construir imagen del proyecto
```bash
docker build -t gcr.io/[PROJECT_ID]/app:v1 .
```
### 4- Hacer push de la imagen
```bash
docker push gcr.io/[PROJECT_ID]/app:v1
```
### 5- Desplegar imagen en kubernetes
```bash
kubectl apply -f deployment.yaml --record
```
### 6- Validar activación de servicio y obtener ip externa
```bash
kubectl get services
```
![Image description](https://github.com/jramirezneira/googlevisiontest/blob/master/imagesreadme/testservices.jpg)


## Funciones JS ES6 (server.js) de la api que procesan las peticiones POST para el procesamiento de imagenes:

### 1- Obtiene objetos de la imagen
```bash
app.post("/objects", upload.single('uploads'), function (req, res) {
    const currentFile = req.file.path;
    console.log(currentFile);
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
```

### 2- Valida contenido explícito de la imagen:
```bash

app.post("/explicit", upload.single('uploads'), function (req, res) {
    const currentFile = req.file.path;
    console.log(req.file.path);
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
```