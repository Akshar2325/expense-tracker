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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { PaymentMethodsService } from "./payment-methods.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  AuthUser,
} from "../common/decorators/current-user.decorator";
import { ZValidationPipe } from "../common/pipes/z-validation.pipe";
import {
  createPaymentMethodSchema,
  updatePaymentMethodSchema,
} from "@expense-tracker/validation";

@ApiTags("Payment Methods")
@Controller("payment-methods")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentMethodsController {
  constructor(private readonly service: PaymentMethodsService) {}

  @Get()
  @ApiOperation({ summary: "List all payment methods" })
  @ApiResponse({ status: 200 })
  async findAll(@CurrentUser() user: AuthUser) {
    return this.service.findAll(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get payment method by ID" })
  async findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.findOne(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a payment method" })
  async create(
    @CurrentUser() user: AuthUser,
    @Body(new ZValidationPipe(createPaymentMethodSchema)) data: unknown,
  ) {
    return this.service.create(user.id, data as never);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update payment method" })
  async update(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZValidationPipe(updatePaymentMethodSchema)) data: unknown,
  ) {
    return this.service.update(user.id, id, data as never);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete payment method" })
  async delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.delete(user.id, id);
  }
}
