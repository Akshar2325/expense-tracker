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
import { AccountsService } from "./accounts.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ZValidationPipe } from "../common/pipes/z-validation.pipe";
import {
  createAccountSchema,
  updateAccountSchema,
} from "@expense-tracker/validation";
import { AuthUser } from "../common/decorators/current-user.decorator";

@ApiTags("Accounts")
@Controller("accounts")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Get()
  @ApiOperation({ summary: "List all accounts" })
  @ApiResponse({ status: 200, description: "Accounts retrieved" })
  async findAll(@CurrentUser() user: AuthUser) {
    return this.accountsService.findAll(user.id);
  }

  @Get("balance")
  @ApiOperation({ summary: "Get total balance across accounts" })
  @ApiResponse({ status: 200, description: "Total balance" })
  async getBalance(@CurrentUser() user: AuthUser) {
    return this.accountsService.getBalance(user.id);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get account by ID" })
  @ApiResponse({ status: 200, description: "Account retrieved" })
  @ApiResponse({ status: 404, description: "Account not found" })
  async findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.accountsService.findOne(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new account" })
  @ApiResponse({ status: 201, description: "Account created" })
  async create(
    @CurrentUser() user: AuthUser,
    @Body(new ZValidationPipe(createAccountSchema)) data: unknown,
  ) {
    return this.accountsService.create(user.id, data as never);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update account" })
  @ApiResponse({ status: 200, description: "Account updated" })
  async update(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZValidationPipe(updateAccountSchema)) data: unknown,
  ) {
    return this.accountsService.update(user.id, id, data as never);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete account" })
  @ApiResponse({ status: 200, description: "Account deleted" })
  async delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.accountsService.delete(user.id, id);
  }
}
