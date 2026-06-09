import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlatformEntity } from './platform.entity';
import { PLATFORM_SEEDS } from './platform-seeds';

@Injectable()
export class PlatformsService implements OnModuleInit {
  private readonly logger = new Logger(PlatformsService.name);

  constructor(
    @InjectRepository(PlatformEntity)
    private readonly repo: Repository<PlatformEntity>,
  ) {}

  async onModuleInit() {
    await this.ensureSeeded();
  }

  private async ensureSeeded() {
    for (const seed of PLATFORM_SEEDS) {
      const existing = await this.repo.findOne({ where: { slug: seed.slug } });
      if (existing) {
        await this.repo.update(existing.id, {
          name: seed.name,
          short_name: seed.short_name,
          color: seed.color,
          logo_url: seed.logo_url,
        });
      } else {
        await this.repo.save(this.repo.create(seed));
        this.logger.log(`Platform seeded: ${seed.slug}`);
      }
    }
  }

  findAll(): Promise<PlatformEntity[]> {
    return this.repo.find({ order: { id: 'ASC' } });
  }

  findBySlug(slug: string): Promise<PlatformEntity | null> {
    return this.repo.findOne({ where: { slug } });
  }
}
