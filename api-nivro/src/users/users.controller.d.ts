import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(createUserDto: CreateUserDto): Promise<{
        profile: {
            user_id: string;
            full_name: string;
            birth_date: Date;
            avatar_url: string | null;
        } | null;
    } & {
        id: string;
        email: string;
        cpf: string;
        phone: string;
        password_hash: string;
        status: import("@prisma/client").$Enums.UserStatus;
        created_at: Date;
        updated_at: Date;
    }>;
}
//# sourceMappingURL=users.controller.d.ts.map