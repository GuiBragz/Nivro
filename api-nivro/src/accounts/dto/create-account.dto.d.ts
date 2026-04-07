import { AccountType } from "@prisma/client";
export declare class CreateAccountDto {
    type: AccountType;
    institution_name: string;
    balance?: number;
    credit_limit?: number;
    closing_day?: number;
    due_day?: number;
}
//# sourceMappingURL=create-account.dto.d.ts.map