import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: Record<string, string>): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
        };
    }>;
}
//# sourceMappingURL=auth.controller.d.ts.map