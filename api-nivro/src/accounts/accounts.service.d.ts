import { PrismaService } from "../prisma.service";
import { CreateAccountDto } from "./dto/create-account.dto";
export declare class AccountsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: CreateAccountDto): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.AccountType;
        institution_name: string;
        balance: import("@prisma/client/runtime/library").Decimal;
        credit_limit: import("@prisma/client/runtime/library").Decimal | null;
        closing_day: number | null;
        due_day: number | null;
        user_id: string;
    }>;
    findAll(userId: string): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.AccountType;
        institution_name: string;
        balance: import("@prisma/client/runtime/library").Decimal;
        credit_limit: import("@prisma/client/runtime/library").Decimal | null;
        closing_day: number | null;
        due_day: number | null;
        user_id: string;
    }[]>;
}
//# sourceMappingURL=accounts.service.d.ts.map