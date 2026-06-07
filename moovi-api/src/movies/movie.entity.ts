import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlatformEntity } from '../platforms/platform.entity';

@Entity('movies')
export class MovieEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  tmdb_id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  overview: string;

  @Column({ nullable: true })
  poster_url: string;

  @Column({ nullable: true })
  backdrop_url: string;

  @Column({ type: 'tinyint', unsigned: true, nullable: true })
  age_rating: number;

  @ManyToOne(() => PlatformEntity, { nullable: true, eager: true })
  @JoinColumn({ name: 'platform_id' })
  platform: PlatformEntity;

  @Column({ default: false })
  trending: boolean;

  @Column({ nullable: true })
  badge: string;

  @Column({ type: 'smallint', unsigned: true, nullable: true })
  popularity_rank: number;

  @Column({ type: 'enum', enum: ['up', 'down'], nullable: true })
  popularity_trend: string;

  @Column({ nullable: true, length: 500 })
  genres: string;

  @Column({ type: 'enum', enum: ['movie', 'tv'], default: 'tv' })
  media_type: string;

  @Column({ type: 'smallint', unsigned: true, nullable: true })
  runtime: number;

  @Column({ type: 'smallint', unsigned: true, nullable: true })
  release_year: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
