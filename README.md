# Proyecto MongoDB - Sistema de Red Social

## Descripción
Implementación de una base de datos NoSQL con MongoDB para un sistema de red social, incluyendo consultas básicas, filtros y agregaciones.

## Estructura de la Base de Datos

### Colección: usuarios
```json
{
  "_id": ObjectId,
  "username": String,
  "email": String,
  "fecha_registro": Date,
  "seguidores": Number,
  "ubicacion": String
}
