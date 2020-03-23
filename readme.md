# Proyecto  de Javier Ramirez Neira 
# Google Could Vision + NodeJS + Kubernetes

## Instalación en Kubernetes

### 1- Crear uno cluster de kubernetes en google cloud
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
### 6- Validar servicio y obtener ip externa
```bash
kubectl get services
```