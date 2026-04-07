"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const bcrypt = __importStar(require("bcrypt"));
@(0, common_1.Injectable)()
class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        // 1. Verificar se E-mail ou CPF já existem (Segurança de duplicidade)
        const userExists = await this.prisma.user.findFirst({
            where: { OR: [{ email: data.email }, { cpf: data.cpf }] },
        });
        if (userExists) {
            throw new common_1.BadRequestException("E-mail ou CPF já cadastrados no sistema.");
        }
        // 2. Criptografar a senha (Hash)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);
        // 3. Salvar no Supabase (Transaction para garantir que User e Profile sejam criados juntos)
        return this.prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    password_hash: hashedPassword,
                    cpf: data.cpf,
                    phone: data.phone,
                    profile: {
                        create: {
                            full_name: data.full_name,
                            birth_date: new Date(data.birth_date),
                        },
                    },
                },
                include: { profile: true },
            });
            // Remove a senha do retorno por segurança
            delete user.password_hash;
            return user;
        });
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map