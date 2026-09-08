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
import { TagsService } from "./tags.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  AuthUser,
} from "../common/decorators/current-user.decorator";
import { ZValidationPipe } from "../common/pipes/z-validation.pipe";
import { createTagSchema, updateTagSchema } from "@expense-tracker/validation";

@ApiTags("Tags")
@Controller("tags")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TagsController {
  constructor(private readonly service: TagsService) {}

  @Get()
  @ApiOperation({ summary: "List tags" })
  async findAll(@CurrentUser() user: AuthUser) {
    return this.service.findAll(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get tag by ID" })
  async findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.findOne(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a tag" })
  async create(
    @CurrentUser() user: AuthUser,
    @Body(new ZValidationPipe(createTagSchema)) data: unknown,
  ) {
    return this.service.create(user.id, data as never);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update tag" })
  async update(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZValidationPipe(updateTagSchema)) data: unknown,
  ) {
    return this.service.update(user.id, id, data as never);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete tag" })
  async delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.delete(user.id, id);
  }
}
