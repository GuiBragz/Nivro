import { AccountsService } from "./accounts.service";
import { CreateAccountDto } from "./dto/create-account.dto";
export declare class AccountsController {
    private readonly accountsService;
    constructor(accountsService: AccountsService);
    create(req: any, createAccountDto: CreateAccountDto): Promise<{
        id: string;
        type: import("@prisma/client").$Enums.AccountType;
        institution_name: string;
        balance: import("@prisma/client/runtime/library").Decimal;
        credit_limit: import("@prisma/client/runtime/library").Decimal | null;
        closing_day: number | null;
        due_day: number | null;
        user_id: string;
    }>;
    findAll(req: any): Promise<{
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
//# sourceMappingURL=accounts.controller.d.ts.map