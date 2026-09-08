import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiBearerAuth } from "@nestjs/swagger";
import { InsightsService } from "./insights.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  AuthUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Insights")
@Controller("insights")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class InsightsController {
  constructor(private readonly service: InsightsService) {}

  @Get("dashboard")
  @ApiOperation({ summary: "Get dashboard insights" })
  async getDashboardInsights(@CurrentUser() user: AuthUser) {
    return this.service.getDashboardInsights(user.id);
  }

  @Get("patterns")
  @ApiOperation({ summary: "Get spending patterns" })
  async getSpendingPatterns(@CurrentUser() user: AuthUser) {
    return this.service.getSpendingPatterns(user.id);
  }
}
