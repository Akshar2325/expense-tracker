import { Module } from "@nestjs/common";
import { SavedFiltersService } from "./saved-filters.service";
import { SavedFiltersController } from "./saved-filters.controller";
import { PrismaModule } from "../common/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [SavedFiltersService],
  controllers: [SavedFiltersController],
  exports: [SavedFiltersService],
})
export class SavedFiltersModule {}
