# Audifonos Gran Vía - Despliegue en Plesk

Este documento explica cómo desplegar esta aplicación React en un servidor Plesk.

## Pasos para el despliegue

1. **Construir la aplicación**

   ```bash
   npm run build
   ```

   Esto generará una carpeta `dist` con todos los archivos estáticos necesarios.

2. **Subir archivos al servidor Plesk**

   - Accede a tu panel de control Plesk
   - Navega hasta el dominio donde quieres alojar la aplicación
   - Usa el Administrador de Archivos de Plesk para subir todo el contenido de la carpeta `dist` al directorio raíz del sitio web (generalmente `httpdocs` o `public_html`)

3. **Configuración adicional en Plesk**

   Si tu aplicación utiliza rutas de cliente (client-side routing), necesitarás configurar una redirección para que todas las rutas se dirijan a `index.html`:

   - En el panel de Plesk, ve a la sección "Apache y nginx" de tu dominio
   - Añade la siguiente configuración en la sección de "Configuración adicional de nginx":

   ```
   location / {
       try_files $uri $uri/ /index.html;
   }
   ```

   - Si solo tienes Apache disponible, crea un archivo `.htaccess` en la raíz con:

   ```
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

4. **Verificación**

   Accede a tu sitio web a través del navegador para verificar que todo funciona correctamente.

## Solución de problemas comunes

- **Rutas de recursos incorrectas**: Si las imágenes o recursos no se cargan, verifica que las rutas en el código sean relativas o absolutas según corresponda.
- **Errores 404 en rutas de la aplicación**: Asegúrate de que la configuración de redirección esté correctamente implementada.
- **Problemas de CORS**: Si la aplicación hace llamadas a APIs, asegúrate de que los encabezados CORS estén configurados correctamente en el servidor de la API.