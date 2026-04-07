"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
@(0, common_1.Controller)("users")
class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    @(0, common_1.Post)("register")
    @(0, common_1.UsePipes)(new common_1.ValidationPipe()) // Ativa as validações do DTO automaticamente
    async register(
    @(0, common_1.Body)()
    createUserDto) {
        return this.usersService.create(createUserDto);
    }
}
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map