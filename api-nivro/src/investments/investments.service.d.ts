import { PrismaService } from "../prisma.service";
import { CreateInvestmentDto } from "./dto/create-investment.dto";
export declare class InvestmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, data: CreateInvestmentDto): Promise<{
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
    getPortfolio(userId: string): Promise<{
        total_invested: number;
        portfolio: {
            institution_name: string;
            balance: import("@prisma/client/runtime/library").Decimal;
        }[];
    }>;
}
//# sourceMappingURL=investments.service.d.ts.map