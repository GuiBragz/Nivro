import { InvestmentsService } from "./investments.service";
import { CreateInvestmentDto } from "./dto/create-investment.dto";
export declare class InvestmentsController {
    private readonly investmentsService;
    constructor(investmentsService: InvestmentsService);
    create(req: any, dto: CreateInvestmentDto): Promise<{
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
    getPortfolio(req: any): Promise<{
        total_invested: number;
        portfolio: {
            institution_name: string;
            balance: import("@prisma/client/runtime/library").Decimal;
        }[];
    }>;
}
//# sourceMappingURL=investments.controller.d.ts.map