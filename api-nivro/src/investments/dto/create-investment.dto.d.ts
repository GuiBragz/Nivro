declare enum InvestmentOperation {
    BUY = "BUY",// Aporte (Aumenta saldo do investimento)
    SELL = "SELL",// Resgate (Diminui saldo do investimento)
    DIVIDEND = "DIVIDEND"
}
export declare class CreateInvestmentDto {
    account_id: string;
    operation: InvestmentOperation;
    amount: number;
    asset_name: string;
    tags?: string[];
    executed_at: string;
}
export {};
//# sourceMappingURL=create-investment.dto.d.ts.map