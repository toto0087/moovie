import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformEntity } from './platform.entity';

@Injectable()
export class PlatformsService {
  constructor(
    @InjectRepository(PlatformEntity)
    private readonly repo: Repository<PlatformEntity>,
  ) {}

  findAll(): Promise<PlatformEntity[]> {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findBySlug(slug: string): Promise<PlatformEntity | null> {
    return this.repo.findOne({ where: { slug } });
  }
}
