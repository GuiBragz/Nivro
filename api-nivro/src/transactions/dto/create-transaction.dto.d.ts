import { TransactionType } from "@prisma/client";
export declare class CreateTransactionDto {
    account_id: string;
    amount: number;
    description: string;
    type: TransactionType;
    category_id?: string;
    tags?: string[];
    executed_at: string;
}
//# sourceMappingURL=create-transaction.dto.d.ts.map