#!/bin/bash

# Validar els paràmetres d'entrada
if [ $# -ne 1 ]; then
    echo "Ús: $0 <nom_del_projecte>"
    exit 1
fi

# Configuració
PROJECT_NAME="$1"
REMOTE_SERVER="root@194.164.72.178"
REMOTE_DEPLOY_DIR="/deploy"
DOCKERFILE="Dockerfile"
IMAGE_TAR="${PROJECT_NAME}.tar"

# Funció per mostrar un missatge d'error i sortir
function error_exit {
    echo "Error: $1"
    exit 1
}

# 1. Construir la imatge Docker sense utilitzar la caché
echo "Dockeritzant el projecte $PROJECT_NAME sense caché..."
docker build --no-cache --platform linux/amd64 -t "$PROJECT_NAME" -f "$DOCKERFILE" . || error_exit "No s'ha pogut construir la imatge Docker."

# 2. Exportar la imatge a un fitxer .tar
echo "Exportant la imatge Docker a $IMAGE_TAR..."
docker save -o "$IMAGE_TAR" "$PROJECT_NAME" || error_exit "No s'ha pogut exportar la imatge Docker."

# 3. Copiar el fitxer .tar al servidor remot
echo "Copiant $IMAGE_TAR al servidor remot $REMOTE_SERVER:$REMOTE_DEPLOY_DIR..."
scp "$IMAGE_TAR" "$REMOTE_SERVER:$REMOTE_DEPLOY_DIR" || error_exit "No s'ha pogut copiar $IMAGE_TAR al servidor remot."

# 4. Carregar la imatge al servidor remot
echo "Carregant la imatge al servidor remot..."
ssh "$REMOTE_SERVER" "docker load -i $REMOTE_DEPLOY_DIR/$IMAGE_TAR" || error_exit "No s'ha pogut carregar la imatge al servidor remot."

# 5. Eliminar el fitxer .tar del servidor remot
echo "Eliminant el fitxer .tar del servidor remot..."
ssh "$REMOTE_SERVER" "rm -f $REMOTE_DEPLOY_DIR/$IMAGE_TAR" || echo "Advertència: No s'ha pogut eliminar el fitxer .tar del servidor remot."

# 6. Eliminar el fitxer .tar local
echo "Eliminant el fitxer .tar local..."
rm "$IMAGE_TAR" || echo "Advertència: No s'ha pogut eliminar el fitxer .tar local."

echo "Procés complet. La imatge $PROJECT_NAME s'ha desplegat correctament!"