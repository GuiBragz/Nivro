import { JwtService } from "@nestjs/jwt";
import { PrismaService } from "../prisma.service";
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(email: string, pass: string): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
        };
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map