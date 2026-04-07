import { Controller, Post, Get, Body, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { InvestmentsService } from "./investments.service";
import { CreateInvestmentDto } from "./dto/create-investment.dto";

@UseGuards(AuthGuard("jwt"))
@Controller("investments")
export class InvestmentsController {
  constructor(private readonly investmentsService: InvestmentsService) {}

  @Post()
  async create(@Req() req, @Body() dto: CreateInvestmentDto) {
    return this.investmentsService.create(req.user.userId, dto);
  }

  @Get("portfolio")
  async getPortfolio(@Req() req) {
    return this.investmentsService.getPortfolio(req.user.userId);
  }
}
