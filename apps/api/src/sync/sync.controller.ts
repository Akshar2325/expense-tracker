import {
  Controller,
  Get,
  Post,
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
import { SyncService } from "./sync.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import {
  CurrentUser,
  AuthUser,
} from "../common/decorators/current-user.decorator";

@ApiTags("Sync")
@Controller("sync")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SyncController {
  constructor(private readonly service: SyncService) {}

  @Get("state")
  @ApiOperation({ summary: "Get sync state" })
  @ApiQuery({ name: "deviceId", required: false })
  async getSyncState(
    @CurrentUser() user: AuthUser,
    @Query("deviceId") deviceId?: string,
  ) {
    return this.service.getSyncState(user.id, deviceId);
  }

  @Get("changes")
  @ApiOperation({ summary: "Get changes since timestamp" })
  @ApiQuery({ name: "since", required: false })
  async getChanges(
    @CurrentUser() user: AuthUser,
    @Query("since") since?: string,
  ) {
    return this.service.getChanges(user.id, since);
  }

  @Post("cursor")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Update sync cursor" })
  async updateCursor(
    @CurrentUser() user: AuthUser,
    @Body() body: { deviceId: string; cursor: string },
  ) {
    return this.service.updateCursor(user.id, body.deviceId, body.cursor);
  }
}
