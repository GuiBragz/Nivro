import { PrismaService } from "../prisma.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
export declare class TransactionsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: CreateTransactionDto): Promise<{
        id: string;
        created_at: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        user_id: string;
        account_id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        executed_at: Date;
        description: string;
        category_id: string | null;
    }>;
    getDashboard(userId: string): Promise<({
        account: {
            type: import("@prisma/client").$Enums.AccountType;
            institution_name: string;
        };
        tags: {
            id: string;
            name: string;
            user_id: string;
            color_hex: string;
        }[];
    } & {
        id: string;
        created_at: Date;
        type: import("@prisma/client").$Enums.TransactionType;
        user_id: string;
        account_id: string;
        amount: import("@prisma/client/runtime/library").Decimal;
        executed_at: Date;
        description: string;
        category_id: string | null;
    })[]>;
}
//# sourceMappingURL=transactions.service.d.ts.map