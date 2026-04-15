import { Controller, Post, Get, Body, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AccountsService } from "./accounts.service";

@UseGuards(AuthGuard("jwt"))
@Controller("accounts")
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  async create(@Req() req, @Body() body: any) {
    return this.accountsService.create(req.user.userId, body);
  }

  @Get()
  async findAll(@Req() req) {
    return this.accountsService.findAll(req.user.userId);
  }

  @Get("balance")
  async getBalance(@Req() req) {
    return this.accountsService.getBalance(req.user.userId);
  }
}
