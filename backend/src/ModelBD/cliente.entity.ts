//src/ModelBD/cliente.entity.ts

// cliente.entity.ts
import { Entity, PrimaryColumn, Column, CreateDateColumn } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { IsOptional, IsString } from 'class-validator';

@Entity('users') // Mantemos o nome original da tabela no Supabase
export class Cliente {
  @PrimaryColumn({
    type: 'uuid',
    default: () => 'gen_random_uuid()' // Função do PostgreSQL
  })
  id: string; // UUID em vez de número

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ type: 'text' })
  senha: string; // Armazenará o hash

  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  sobre: string;

  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  habilidades: string;

  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true, name: 'projetos_recentes' })
  projetosRecentes: string;

  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true, })
  cargo: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  foto?: string;

  @Column({
    type: 'enum',
    enum: ['user', 'admin', 'freelancer'],
    default: 'user'
  })
  role: string;

  @CreateDateColumn({ name: 'criado_em', type: 'timestamp' })
  criadoEm: Date;
}