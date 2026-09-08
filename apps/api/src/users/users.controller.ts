import {
  Controller,
  Get,
  Patch,
  Delete,
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
import { UsersService } from "./users.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ZValidationPipe } from "../common/pipes/z-validation.pipe";
import {
  updateUserSchema,
  changePasswordSchema,
} from "@expense-tracker/validation";
import { AuthUser } from "../common/decorators/current-user.decorator";

@ApiTags("Users")
@Controller("users")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("me")
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({ status: 200, description: "User profile retrieved" })
  async getMe(@CurrentUser() user: AuthUser) {
    return this.usersService.getMe(user.id);
  }

  @Patch("me")
  @ApiOperation({ summary: "Update current user profile" })
  @ApiResponse({ status: 200, description: "User profile updated" })
  async updateMe(
    @CurrentUser() user: AuthUser,
    @Body(new ZValidationPipe(updateUserSchema)) data: unknown,
  ) {
    return this.usersService.updateMe(user.id, data as never);
  }

  @Patch("me/password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Change password" })
  @ApiResponse({ status: 200, description: "Password changed" })
  async changePassword(
    @CurrentUser() user: AuthUser,
    @Body(new ZValidationPipe(changePasswordSchema))
    data: { currentPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(user.id, data);
  }

  @Delete("me")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete own account" })
  @ApiResponse({ status: 200, description: "Account deleted" })
  async deleteMe(@CurrentUser() user: AuthUser) {
    return this.usersService.deleteMe(user.id);
  }
}
