import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Req,
  Param,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";

@UseGuards(AuthGuard("jwt"))
@Controller("transactions")
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Delete(":id")
  async remove(@Param("id") id: string, @Req() req) {
    // No nosso JWT, o ID do usuário está em req.user.userId
    return this.transactionsService.remove(id, req.user.userId);
  }

  @Post()
  async create(@Req() req, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(req.user.userId, dto);
  }

  @Get("dashboard")
  async getDashboard(@Req() req) {
    return this.transactionsService.getDashboard(req.user.userId);
  }
  @Get("categories")
  async getCategories(@Req() req) {
    // Busca todas as tags/categorias que o usuário já criou
    return this.prismaService.tag.findMany({
      where: { user_id: req.user.userId },
      orderBy: { name: "asc" },
    });
  }
}
