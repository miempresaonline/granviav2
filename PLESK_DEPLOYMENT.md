# Guía de Despliegue en Plesk - Audífonos Gran Vía

Esta guía te ayudará a desplegar correctamente la aplicación React en tu servidor Plesk.

## 📋 Requisitos Previos

- Acceso al panel de control Plesk
- Dominio configurado en Plesk
- Node.js instalado en tu máquina local (para construir la aplicación)

## 🚀 Pasos para el Despliegue

### 1. Construir la Aplicación

En tu máquina local, ejecuta:

```bash
npm install
npm run build
```

Esto generará una carpeta `dist` con todos los archivos optimizados para producción.

### 2. Preparar los Archivos

La carpeta `dist` contendrá:
- `index.html` - Archivo principal
- `assets/` - CSS, JavaScript y otros recursos
- `.htaccess` - Configuración del servidor (ya incluido)

### 3. Subir Archivos a Plesk

1. **Accede a tu panel Plesk**
2. **Selecciona tu dominio**
3. **Ve a "Administrador de Archivos"**
4. **Navega a la carpeta raíz del sitio web** (generalmente `httpdocs` o `public_html`)
5. **Sube TODO el contenido de la carpeta `dist`** (no la carpeta dist en sí, sino su contenido)

### 4. Verificar la Estructura de Archivos

Después de subir, tu estructura debería verse así:
```
httpdocs/
├── index.html
├── .htaccess
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [otros archivos]
└── vite.svg
```

### 5. Configuración del Servidor Web

#### Para Apache (más común en Plesk):
El archivo `.htaccess` ya está configurado y se subirá automáticamente.

#### Para Nginx (si está disponible):
Si tu servidor usa Nginx, añade esta configuración en Plesk:

1. Ve a "Apache y nginx Settings"
2. En "Configuración adicional de nginx", añade:

```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 6. Configurar HTTPS (Recomendado)

1. En Plesk, ve a "SSL/TLS Certificates"
2. Instala un certificado SSL (Let's Encrypt es gratuito)
3. Habilita "Redirect from HTTP to HTTPS"

### 7. Optimizaciones Adicionales

#### Compresión GZIP
El archivo `.htaccess` ya incluye configuración para compresión GZIP.

#### Caché del Navegador
Los headers de caché están configurados para optimizar la carga.

#### Seguridad
Se incluyen headers de seguridad básicos en el `.htaccess`.

## 🔧 Solución de Problemas

### Problema: Página en blanco
**Solución**: Verifica que todos los archivos se hayan subido correctamente y que la ruta base sea correcta.

### Problema: Rutas no funcionan (Error 404)
**Solución**: Asegúrate de que el archivo `.htaccess` esté en la raíz y que mod_rewrite esté habilitado.

### Problema: Recursos no se cargan
**Solución**: Verifica que la carpeta `assets` se haya subido completamente.

### Problema: Formulario no funciona
**Solución**: El formulario usa reCAPTCHA y un webhook externo. Asegúrate de que:
- El dominio esté registrado en Google reCAPTCHA
- El webhook de Make.com esté funcionando

## 📱 Verificación Post-Despliegue

1. **Accede a tu sitio web**
2. **Verifica que todas las secciones carguen correctamente**
3. **Prueba el formulario de contacto**
4. **Verifica la responsividad en móvil**
5. **Comprueba que los enlaces de teléfono y WhatsApp funcionen**

## 🔄 Actualizaciones Futuras

Para actualizar la aplicación:

1. Realiza cambios en el código local
2. Ejecuta `npm run build`
3. Sube solo los archivos modificados o toda la carpeta `dist` nuevamente
4. Limpia la caché del navegador si es necesario

## 📞 Contactos Importantes

- **Teléfono Bilbao**: 944 987 951
- **Teléfono Rekalde**: 944 392 250
- **WhatsApp**: +34 688 696 427

## 🎯 Características de la Aplicación

- ✅ Responsive design (móvil y desktop)
- ✅ Formulario con reCAPTCHA
- ✅ Integración con WhatsApp y teléfono
- ✅ Carrusel de testimonios automático
- ✅ Efectos de animación optimizados
- ✅ SEO optimizado
- ✅ Compresión y caché configurados
- ✅ Headers de seguridad incluidos

---

**¡Tu aplicación está lista para producción en Plesk!** 🚀