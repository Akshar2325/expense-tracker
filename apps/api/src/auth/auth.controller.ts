import { Controller, Post, Body, HttpCode, HttpStatus } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { ZValidationPipe } from "../common/pipes/z-validation.pipe";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@expense-tracker/validation";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Register a new user" })
  @ApiResponse({ status: 201, description: "User registered successfully" })
  @ApiResponse({ status: 409, description: "Email already exists" })
  async register(@Body(new ZValidationPipe(registerSchema)) body: unknown) {
    return this.authService.register(body as never);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Sign in with email and password" })
  @ApiResponse({ status: 200, description: "Login successful" })
  @ApiResponse({ status: 401, description: "Invalid credentials" })
  async login(@Body(new ZValidationPipe(loginSchema)) body: unknown) {
    return this.authService.login(body as never);
  }

  @Post("refresh")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Refresh access token" })
  @ApiResponse({ status: 200, description: "Tokens refreshed" })
  @ApiResponse({ status: 401, description: "Invalid refresh token" })
  async refresh(
    @Body(new ZValidationPipe(refreshTokenSchema))
    body: {
      refreshToken: string;
    },
  ) {
    return this.authService.refresh(body.refreshToken);
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Sign out and revoke session" })
  async logout(@Body() body: { userId?: string }) {
    const userId = body.userId || "";
    return this.authService.logout(userId);
  }

  @Post("forgot-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Request password reset email" })
  async forgotPassword(
    @Body(new ZValidationPipe(forgotPasswordSchema)) _body: { email: string },
  ) {
    // Generate token, send email (stub for now)
    return {
      success: true,
      message: "If the email exists, a reset link has been sent.",
    };
  }

  @Post("reset-password")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Reset password with token" })
  async resetPassword(
    @Body(new ZValidationPipe(resetPasswordSchema))
    _body: {
      token: string;
      password: string;
    },
  ) {
    // Verify token, update password (stub for now)
    return { success: true, message: "Password reset successfully." };
  }
}
