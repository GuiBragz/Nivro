import { TransactionsService } from "./transactions.service";
import { CreateTransactionDto } from "./dto/create-transaction.dto";
export declare class TransactionsController {
    private readonly transactionsService;
    constructor(transactionsService: TransactionsService);
    create(req: any, dto: CreateTransactionDto): Promise<{
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
    getDashboard(req: any): Promise<({
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
//# sourceMappingURL=transactions.controller.d.ts.map