import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { BudgetsService } from "./budgets.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  AuthUser,
} from "../common/decorators/current-user.decorator";
import { ZValidationPipe } from "../common/pipes/z-validation.pipe";
import {
  createBudgetSchema,
  updateBudgetSchema,
} from "@expense-tracker/validation";

@ApiTags("Budgets")
@Controller("budgets")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BudgetsController {
  constructor(private readonly service: BudgetsService) {}

  @Get()
  @ApiOperation({ summary: "List budgets" })
  @ApiQuery({ name: "activeOnly", required: false, type: Boolean })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query("activeOnly") activeOnly?: string,
  ) {
    return this.service.findAll(user.id, activeOnly === "true");
  }

  @Get(":id")
  @ApiOperation({ summary: "Get budget by ID" })
  async findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.findOne(user.id, id);
  }

  @Get(":id/spending")
  @ApiOperation({ summary: "Get budget spending progress" })
  async getSpending(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.getSpending(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a budget" })
  async create(
    @CurrentUser() user: AuthUser,
    @Body(new ZValidationPipe(createBudgetSchema)) data: unknown,
  ) {
    return this.service.create(user.id, data as never);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update budget" })
  async update(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZValidationPipe(updateBudgetSchema)) data: unknown,
  ) {
    return this.service.update(user.id, id, data as never);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete budget" })
  async delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.delete(user.id, id);
  }
}
