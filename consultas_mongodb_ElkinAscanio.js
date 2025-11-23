// CONSULTAS BÁSICAS (CRUD)

// 1. INSERCIÓN
db.usuarios.insertOne({
  username: "usuario_prueba",
  email: "prueba@email.com", 
  fecha_registro: new Date("2024-04-02"),
  seguidores: 100,
  ubicacion: "Madrid"
})

// 2. SELECCIÓN
db.usuarios.find({username: "usuario_prueba"})

// 3. ACTUALIZACIÓN
db.usuarios.updateOne(
  {username: "usuario_prueba"},
  {$set: {seguidores: 150}}
)

// 4. ELIMINACIÓN
db.usuarios.deleteOne({username: "usuario_prueba"})

// CONSULTAS CON FILTROS Y OPERADORES
db.posts.find({likes: {$gt: 50}})
db.posts.find({tipo: {$in: ["imagen", "video"]}})
db.posts.find({hashtags: "programacion"})
db.posts.find({
  tipo: "texto", 
  likes: {$gte: 30, $lte: 60},
  visualizaciones: {$gt: 200}
})

// CONSULTAS DE AGREGACIÓN
// 1. Estadísticas por tipo de contenido
db.posts.aggregate([
  {
    $group: {
      _id: "$tipo",
      total_posts: {$sum: 1},
      promedio_likes: {$avg: "$likes"},
      total_likes: {$sum: "$likes"},
      max_likes: {$max: "$likes"},
      total_visualizaciones: {$sum: "$visualizaciones"}
    }
  },
  {$sort: {total_posts: -1}}
])

// 2. Conteos generales
db.posts.aggregate([
  {
    $group: {
      _id: null,
      total_posts: {$sum: 1},
      total_likes: {$sum: "$likes"},
      promedio_likes: {$avg: "$likes"},
      total_visualizaciones: {$sum: "$visualizaciones"},
      promedio_visualizaciones: {$avg: "$visualizaciones"}
    }
  }
])

// 3. Hashtags más populares
db.posts.aggregate([
  {$unwind: "$hashtags"},
  {
    $group: {
      _id: "$hashtags",
      veces_utilizado: {$sum: 1},
      total_likes: {$sum: "$likes"},
      promedio_likes: {$avg: "$likes"}
    }
  },
  {$sort: {veces_utilizado: -1}},
  {$limit: 10}
])

// 4. Top usuarios con más engagement
db.posts.aggregate([
  {
    $group: {
      _id: "$usuario_id",
      total_likes: {$sum: "$likes"},
      total_posts: {$sum: 1},
      promedio_likes_por_post: {$avg: "$likes"}
    }
  },
  {
    $lookup: {
      from: "usuarios",
      localField: "_id",
      foreignField: "_id",
      as: "usuario_info"
    }
  },
  {$unwind: "$usuario_info"},
  {
    $project: {
      username: "$usuario_info.username",
      seguidores: "$usuario_info.seguidores",
      total_likes: 1,
      total_posts: 1,
      promedio_likes_por_post: {$round: ["$promedio_likes_por_post", 2]}
    }
  },
  {$sort: {total_likes: -1}},
  {$limit: 5}
])