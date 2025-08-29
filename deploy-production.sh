#!/bin/bash

# Script de despliegue para producción
# Este script configura la base de datos y prepara la aplicación para producción

echo "=== Iniciando configuración para producción ==="

# Establecer entorno de producción
export NODE_ENV=production

# 1. Generar cliente Prisma
echo "1. Generando cliente Prisma..."
npx prisma generate

# 2. Aplicar migraciones a la base de datos de producción
echo "2. Aplicando migraciones a la base de datos..."
NODE_ENV=production npx prisma db push

# 3. Sembrar la base de datos con datos iniciales
echo "3. Sembrando base de datos con datos iniciales..."
NODE_ENV=production npm run db:seed

# 4. Construir la aplicación
echo "4. Construyendo la aplicación..."
npm run build

# 5. Verificar que la base de datos de producción esté configurada
echo "5. Verificando configuración de base de datos..."
if [ -f "db/production.db" ]; then
    echo "✅ Base de datos de producción creada exitosamente"
    echo "📁 Ubicación: db/production.db"
else
    echo "❌ Error: No se pudo crear la base de datos de producción"
    exit 1
fi

echo ""
echo "=== Configuración de producción completada ==="
echo "🚀 La aplicación está lista para ser desplegada"
echo ""
echo "Para iniciar la aplicación en producción:"
echo "  npm start"
echo ""
echo "Variables de entorno configuradas:"
echo "  - NODE_ENV=production"
echo "  - DATABASE_URL=file:./db/production.db"