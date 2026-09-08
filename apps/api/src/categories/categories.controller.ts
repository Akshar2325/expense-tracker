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
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { ZValidationPipe } from "../common/pipes/z-validation.pipe";
import {
  createCategorySchema,
  updateCategorySchema,
} from "@expense-tracker/validation";
import { AuthUser } from "../common/decorators/current-user.decorator";

@ApiTags("Categories")
@Controller("categories")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "List all categories" })
  @ApiQuery({
    name: "type",
    required: false,
    enum: ["EXPENSE", "INCOME", "BOTH"],
  })
  @ApiResponse({ status: 200, description: "Categories retrieved" })
  async findAll(@CurrentUser() user: AuthUser, @Query("type") type?: string) {
    return this.categoriesService.findAll(user.id, type);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get category by ID" })
  @ApiResponse({ status: 200, description: "Category retrieved" })
  @ApiResponse({ status: 404, description: "Category not found" })
  async findOne(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.categoriesService.findOne(user.id, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Create a new category" })
  @ApiResponse({ status: 201, description: "Category created" })
  async create(
    @CurrentUser() user: AuthUser,
    @Body(new ZValidationPipe(createCategorySchema)) data: unknown,
  ) {
    return this.categoriesService.create(user.id, data as never);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update category" })
  @ApiResponse({ status: 200, description: "Category updated" })
  async update(
    @CurrentUser() user: AuthUser,
    @Param("id") id: string,
    @Body(new ZValidationPipe(updateCategorySchema)) data: unknown,
  ) {
    return this.categoriesService.update(user.id, id, data as never);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Delete category" })
  @ApiResponse({ status: 200, description: "Category deleted" })
  async delete(@CurrentUser() user: AuthUser, @Param("id") id: string) {
    return this.categoriesService.delete(user.id, id);
  }
}
