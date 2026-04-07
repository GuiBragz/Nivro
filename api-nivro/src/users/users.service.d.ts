import { PrismaService } from "../prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: CreateUserDto): Promise<{
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
//# sourceMappingURL=users.service.d.ts.map