import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
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
import { ReceiptsService } from "./receipts.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  AuthUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Receipts")
@Controller("receipts")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReceiptsController {
  constructor(private readonly service: ReceiptsService) {}

  @Get()
  @ApiOperation({ summary: "List receipts" })
  @ApiQuery({ name: "transactionId", required: false })
  async findAll(
    @CurrentUser() user: AuthUser,
    @Query("transactionId") transactionId?: string,
  ) {
    return this.service.findAll(user.id, transactionId);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get receipt by ID" })
  async findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.findOne(user.id, id);
  }

  @Post(":id/extract")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Trigger OCR extraction for receipt" })
  async extract(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    const receipt = await this.service.findOne(user.id, id);
    return {
      receipt,
      message: "Extraction queued. Check back for extracted data.",
    };
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete receipt" })
  async delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.service.delete(user.id, id);
  }
}
