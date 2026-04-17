import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Req,
  UsePipes,
  ValidationPipe,
  UseGuards,
  UseInterceptors, // 👈 Importado
  UploadedFile, // 👈 Importado
} from "@nestjs/common";
import "multer";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express"; // 👈 Importado para ler arquivos
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

  // 👇 Rotas protegidas abaixo 👇

  @UseGuards(AuthGuard("jwt"))
  @Get("profile")
  async getProfile(@Req() req) {
    return this.usersService.getProfile(req.user.userId); // Verifica se o seu JWT usa req.user.userId ou req.user.sub
  }

  @UseGuards(AuthGuard("jwt"))
  @Put("profile")
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  async getMe(@Req() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Delete("me")
  @UseGuards(AuthGuard("jwt"))
  async deleteAccount(@Req() req) {
    return this.usersService.deleteUser(req.user.userId);
  }

  // 👇 ROTA ADICIONADA: UPLOAD DE FOTO (AVATAR) 👇
  @Post("avatar")
  @UseGuards(AuthGuard("jwt"))
  @UseInterceptors(FileInterceptor("file")) // "file" é o nome do campo que o app vai mandar
  async uploadAvatar(@Req() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.uploadAvatar(req.user.userId, file);
  }
}
