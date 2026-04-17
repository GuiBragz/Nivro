import "multer";
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  Param,
  UseGuards,
  BadRequestException,
  Put,
  UseInterceptors,
  UploadedFile,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";
import { TransactionsService } from "./transactions.service";

@UseGuards(AuthGuard("jwt"))
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Delete("clear-all")
  async clearAllHistory(@Req() req) {
    return this.transactionsService.clearHistory(req.user.userId);
  }

  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req) {
    return this.transactionsService.remove(id, req.user.userId);
  }

  @Post()
  async create(@Req() req, @Body() dto: any) {
    return this.transactionsService.create(req.user.userId, dto);
  }

  @Get("dashboard")
  async getDashboard(@Req() req) {
    return this.transactionsService.getDashboard(req.user.userId);
  }

  @Get("tags")
  async getTags(@Req() req) {
    return this.transactionsService.getTags(req.user.userId);
  }

  @Post("tags")
  async createTag(
    @Req() req,
    @Body() body: { name: string; color_hex?: string },
  ) {
    if (!body.name) {
      throw new BadRequestException("O nome da tag é obrigatório.");
    }
    return this.transactionsService.createTag(
      req.user.userId,
      body.name,
      body.color_hex,
    );
  }

  @Put(":id")
  async update(@Param("id") id: string, @Req() req, @Body() dto: any) {
    return this.transactionsService.update(id, req.user.userId, dto);
  }

  @Post("import")
  @UseInterceptors(FileInterceptor("file"))
  async importExtrato(
    @Req() req,
    @Body("account_id") accountId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.transactionsService.importCsv(req.user.userId, accountId, file);
  }
}
