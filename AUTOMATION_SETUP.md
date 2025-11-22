# 🤖 Guía de Configuración de Automatización GitHub

## ✅ Archivos Creados

1. `.github/workflows/auto-generate-posts.yml` - Genera posts automáticamente
2. `.github/workflows/deploy.yml` - Despliega a GitHub Pages
3. `vite.config.js` - Configurado para GitHub Pages

---

## 📋 Pasos para Activar la Automatización

### 1️⃣ Crear Repositorio en GitHub

```bash
# Inicializa git (si no lo has hecho)
git init

# Añade todos los archivos
git add .

# Primer commit
git commit -m "Initial commit - Blockchain blog with automation"

# Crea el repositorio en GitHub y luego:
git remote add origin https://github.com/TU_USUARIO/blockchain.git
git branch -M main
git push -u origin main
```

---

### 2️⃣ Configurar Secret de OpenAI en GitHub

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral: **Secrets and variables** → **Actions**
4. Click en **New repository secret**
5. Nombre: `OPENAI_API_KEY`
6. Valor: Tu API key de OpenAI (la que tienes en `.env`)
7. Click en **Add secret**

---

### 3️⃣ Activar GitHub Pages

1. En tu repositorio, ve a **Settings**
2. En el menú lateral: **Pages**
3. En **Source**, selecciona: **GitHub Actions**
4. ¡Listo! GitHub Pages está activado

---

### 4️⃣ Ajustar la Configuración Base (IMPORTANTE)

En `vite.config.js`, cambia `/blockchain/` por el nombre real de tu repositorio:

```javascript
base: '/TU-NOMBRE-DE-REPO/', // Por ejemplo: '/crypto-blog/'
```

Si tu repo se llama "blockchain", déjalo como está.

---

## 🎯 Cómo Funciona

### Generación Automática de Posts

- **9:00 AM EST** (14:00 UTC): Se genera el primer post del día
- **6:00 PM EST** (23:00 UTC): Se genera el segundo post del día

### Flujo Completo

```
Horario programado (9 AM / 6 PM)
         ↓
GitHub Action se activa
         ↓
Ejecuta: npm run generate-post
         ↓
Genera post con OpenAI + Pollinations.ai
         ↓
Actualiza src/data/posts.json
         ↓
Hace commit automático
         ↓
Trigger del workflow de deploy
         ↓
Build del proyecto (npm run build)
         ↓
Deploy a GitHub Pages
         ↓
¡Nuevo post visible en tu sitio!
```

---

## 🧪 Probar Manualmente

Puedes probar la generación manual:

1. Ve a tu repositorio en GitHub
2. Click en **Actions**
3. Selecciona **Auto Generate Blog Posts**
4. Click en **Run workflow**
5. Espera ~1 minuto
6. ¡Verás el nuevo post en tu sitio!

---

## 📊 Monitoreo

- **Ver logs**: GitHub → Actions → Click en cualquier ejecución
- **Ver posts generados**: Revisa los commits con mensaje "🤖 Auto-generated blog post"
- **URL del sitio**: `https://TU_USUARIO.github.io/blockchain/`

---

## ⚠️ Notas Importantes

1. **Zona Horaria**: Los horarios están en UTC. Ajusta si es necesario:
   - 9 AM EST = 14:00 UTC
   - 6 PM EST = 23:00 UTC

2. **Costos de OpenAI**: 
   - 2 posts/día = 60 posts/mes
   - Costo estimado: ~$0.12/mes (muy barato)

3. **Límites de GitHub Actions**:
   - 2,000 minutos/mes (plan gratuito)
   - Cada ejecución toma ~1-2 minutos
   - 60 ejecuciones/mes = ~120 minutos usados

---

## 🐛 Solución de Problemas

### El workflow no se ejecuta
- Verifica que el repositorio sea público o tengas Actions habilitado
- Revisa que el secret `OPENAI_API_KEY` esté configurado

### Error en la generación de posts
- Revisa los logs en Actions
- Verifica que tu API key de OpenAI sea válida
- Asegúrate de tener créditos en OpenAI

### El sitio no se actualiza
- Verifica que GitHub Pages esté activado
- Revisa el workflow de deploy en Actions
- Asegúrate de que `base` en vite.config.js sea correcto

---

## 🎉 ¡Listo!

Una vez configurado, tu blog generará automáticamente 2 posts diarios sin intervención manual.

**URL de tu sitio**: `https://TU_USUARIO.github.io/blockchain/`
