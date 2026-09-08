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
import { RecurringTransactionsService } from "./recurring-transactions.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  AuthUser,
} from "../common/decorators/current-user.decorator";
import { ZValidationPipe } from "../common/pipes/z-validation.pipe";
import {
  createRecurringTransactionSchema,
  updateRecurringTransactionSchema,
} from "@expense-tracker/validation";

@ApiTags("Recurring Transactions")
@Controller("recurring-transactions")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RecurringTransactionsController {
  constructor(private readonly service: RecurringTransactionsService) {}

  @Get()
  @ApiOperation({ summary: "List recurring transactions" })
  @ApiQuery({ name: "activeOnly", required: false, type: Boolean })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query("activeOnly") activeOnly?: string,
  ) {
    return this.service.findAll(user.id, activeOnly === "true");
  }

  @Get(":id")
  @ApiOperation({ summary: "Get recurring transaction by ID" })
  async findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.findOne(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create recurring transaction" })
  async create(
    @CurrentUser() user: AuthUser,
    @Body(new ZValidationPipe(createRecurringTransactionSchema)) data: unknown,
  ) {
    return this.service.create(user.id, data as never);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update recurring transaction" })
  async update(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZValidationPipe(updateRecurringTransactionSchema)) data: unknown,
  ) {
    return this.service.update(user.id, id, data as never);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete recurring transaction" })
  async delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.delete(user.id, id);
  }

  @Post(":id/pause")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Pause recurring transaction" })
  async pause(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.pause(user.id, id);
  }

  @Post(":id/resume")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Resume recurring transaction" })
  async resume(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.resume(user.id, id);
  }
}
