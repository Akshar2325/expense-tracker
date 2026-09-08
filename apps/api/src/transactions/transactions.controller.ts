import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Headers,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiHeader,
} from "@nestjs/swagger";
import { TransactionsService } from "./transactions.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  AuthUser,
} from "../common/decorators/current-user.decorator";
import { ZValidationPipe } from "../common/pipes/z-validation.pipe";
import {
  createTransactionSchema,
  updateTransactionSchema,
  transactionQuerySchema,
} from "@expense-tracker/validation";

@ApiTags("Transactions")
@Controller("transactions")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionsController {
  constructor(private readonly txService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: "List transactions with filters" })
  @ApiHeader({ name: "idempotency-key", required: false })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query() query: Record<string, unknown>,
  ) {
    const parsed = transactionQuerySchema.parse(query);
    return this.txService.findAll(user.id, parsed);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get transaction by ID" })
  async findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.txService.findOne(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a transaction" })
  @ApiHeader({ name: "idempotency-key", required: false })
  async create(
    @CurrentUser() user: AuthUser,
    @Body(new ZValidationPipe(createTransactionSchema)) data: unknown,
    @Headers("idempotency-key") idempotencyKey?: string,
  ) {
    return this.txService.create(user.id, data as never, idempotencyKey);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update transaction" })
  async update(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZValidationPipe(updateTransactionSchema)) data: unknown,
  ) {
    return this.txService.update(user.id, id, data as never);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete transaction" })
  async delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.txService.delete(user.id, id);
  }

  @Post(":id/restore")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Restore deleted transaction" })
  async restore(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.txService.restore(user.id, id);
  }
}
