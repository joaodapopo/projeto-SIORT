import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'better-sqlite3',
      database: './siort.sqlite',
      autoLoadEntities: true,
      synchronize: true, // Auto-create tables in dev
    }),
  ],
})
export class DatabaseModule {}
