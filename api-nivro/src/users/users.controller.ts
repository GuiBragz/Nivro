import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Req,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  @UsePipes(new ValidationPipe())
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // 👇 Rotas novas protegidas abaixo 👇

  @UseGuards(AuthGuard("jwt")) // Exige o Token!
  @Get("profile")
  async getProfile(@Req() req) {
    // O id vem de dentro do token JWT interceptado
    return this.usersService.getProfile(req.user.userId);
  }

  @UseGuards(AuthGuard("jwt")) // Exige o Token!
  @Put("profile")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }
}
