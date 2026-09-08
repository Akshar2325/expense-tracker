import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { SavedFiltersService } from "./saved-filters.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  AuthUser,
} from "../common/decorators/current-user.decorator";
import { ZValidationPipe } from "../common/pipes/z-validation.pipe";
import {
  createSavedFilterSchema,
  updateSavedFilterSchema,
} from "@expense-tracker/validation";

@ApiTags("Saved Filters")
@Controller("saved-filters")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SavedFiltersController {
  constructor(private readonly service: SavedFiltersService) {}

  @Get()
  @ApiOperation({ summary: "List saved filters" })
  async findAll(@CurrentUser() user: AuthUser) {
    return this.service.findAll(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get saved filter by ID" })
  async findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.findOne(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a saved filter" })
  async create(
    @CurrentUser() user: AuthUser,
    @Body(new ZValidationPipe(createSavedFilterSchema)) data: unknown,
  ) {
    return this.service.create(user.id, data as never);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update saved filter" })
  async update(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZValidationPipe(updateSavedFilterSchema)) data: unknown,
  ) {
    return this.service.update(user.id, id, data as never);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete saved filter" })
  async delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.delete(user.id, id);
  }
}
