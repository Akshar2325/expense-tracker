import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { ReportsService } from "./reports.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  AuthUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Reports")
@Controller("reports")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly service: ReportsService) {}

  @Get("summary")
  @ApiOperation({ summary: "Get spending summary" })
  async getSummary(
    @CurrentUser() user: AuthUser,
    @Query() query: Record<string, string>,
  ) {
    return this.service.getSummary(user.id, query);
  }

  @Get("category-breakdown")
  @ApiOperation({ summary: "Get category breakdown" })
  async getCategoryBreakdown(
    @CurrentUser() user: AuthUser,
    @Query() query: Record<string, string>,
  ) {
    return this.service.getCategoryBreakdown(user.id, query);
  }

  @Get("trend")
  @ApiOperation({ summary: "Get spending trend over time" })
  @ApiQuery({
    name: "groupBy",
    enum: ["day", "week", "month"],
    required: false,
  })
  async getTrend(
    @CurrentUser() user: AuthUser,
    @Query() query: Record<string, string>,
  ) {
    return this.service.getTrend(user.id, query);
  }

  @Get("account-breakdown")
  @ApiOperation({ summary: "Get account breakdown" })
  async getAccountBreakdown(
    @CurrentUser() user: AuthUser,
    @Query() query: Record<string, string>,
  ) {
    return this.service.getAccountBreakdown(user.id, query);
  }
}
