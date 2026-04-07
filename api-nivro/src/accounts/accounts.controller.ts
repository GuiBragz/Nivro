import { Controller, Get, Post, Body, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AccountsService } from "./accounts.service";
import { CreateAccountDto } from "./dto/create-account.dto";

@UseGuards(AuthGuard("jwt")) // 🔒 Tranca todas as rotas deste controller!
@Controller("accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Req() req, @Body() createAccountDto: CreateAccountDto) {
    // O JwtStrategy coloca os dados do usuário dentro de req.user
    const userId = req.user.userId;
    return this.accountsService.create(userId, createAccountDto);
  }

  @Get()
  async findAll(@Req() req) {
    const userId = req.user.userId;
    return this.accountsService.findAll(userId);
  }
}
