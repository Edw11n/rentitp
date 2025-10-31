const fs = require('fs').promises;
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function fileExists(filePath) {
  try {
    await fs.stat(filePath);
    return true;
  } catch (e) {
    return false;
  }
}

async function importDatabase() {
  let conn;
  
  try {
    // 1. Obtener la ruta del archivo SQL
    const root = path.resolve(__dirname, '..', '..');
    const schemaPath = path.join(root, 'database', 'rentitpdb.sql');
    
    if (!await fileExists(schemaPath)) {
      throw new Error(`❌ No se encontró el archivo de base de datos: ${schemaPath}`);
    }

    // 2. Configurar conexión
    const connectionConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true
    };

    // 3. Conectar a MySQL
    console.log('🔌 Conectando a MySQL...');
    conn = await mysql.createConnection(connectionConfig);

    // 4. Configurar el entorno MySQL
    await conn.query('SET FOREIGN_KEY_CHECKS=0');
    await conn.query('SET SQL_MODE=""');
    
    // 5. Crear y usar la base de datos
    await conn.query('CREATE DATABASE IF NOT EXISTS rentitpdb');
    await conn.query('USE rentitpdb');
    
    // 6. Leer y ejecutar el archivo SQL completo
    console.log('📄 Leyendo archivo SQL...');
    const sql = await fs.readFile(schemaPath, 'utf8');
    
    console.log('🔧 Importando base de datos...');
    await conn.query(sql);
    
    // 7. Verificar las tablas creadas
    const [tables] = await conn.query('SHOW TABLES');
    console.log('\n📊 Tablas importadas correctamente:');
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });

    // 8. Restaurar configuración
    await conn.query('SET FOREIGN_KEY_CHECKS=1');

    console.log('✅ Base de datos importada exitosamente');

  } catch (error) {
    console.error('❌ Error al importar la base de datos:', error.message);
    throw error;
  } finally {
    if (conn) {
      try {
        await conn.end();
      } catch (e) {
        console.error('Error cerrando conexión:', e.message);
      }
    }
  }
}

module.exports = importDatabase;