import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { ExportsService } from "./exports.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  AuthUser,
} from "../common/decorators/current-user.decorator";
import { ZValidationPipe } from "../common/pipes/z-validation.pipe";
import { createExportSchema } from "@expense-tracker/validation";

@ApiTags("Exports")
@Controller("exports")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExportsController {
  constructor(private readonly service: ExportsService) {}

  @Get()
  @ApiOperation({ summary: "List export jobs" })
  async findAll(@CurrentUser() user: AuthUser) {
    return this.service.findAll(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get export job by ID" })
  async findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.findOne(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create an export job" })
  async create(
    @CurrentUser() user: AuthUser,
    @Body(new ZValidationPipe(createExportSchema)) data: unknown,
  ) {
    return this.service.create(user.id, data as never);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete export job" })
  async delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.delete(user.id, id);
  }
}
