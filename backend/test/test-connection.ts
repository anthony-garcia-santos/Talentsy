import { DataSource } from 'typeorm';

const testConnection = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await dataSource.initialize();
    console.log('✅ Conexão com o Supabase estabelecida com sucesso!');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Erro na conexão:', error);
  }
};

testConnection();