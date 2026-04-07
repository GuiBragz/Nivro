"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
class CreateUserDto {
    @(0, class_validator_1.IsEmail)({}, { message: "E-mail inválido" })
    email;
    @(0, class_validator_1.IsNotEmpty)()
    @(0, class_validator_1.Length)(8, 20, { message: "A senha deve ter entre 8 e 20 caracteres" })
    password;
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.Matches)(/^[0-9]{11}$/, {
        message: "O CPF deve conter exatamente 11 dígitos numéricos",
    })
    cpf;
    @(0, class_validator_1.IsNotEmpty)()
    @(0, class_validator_1.IsString)()
    full_name;
    @(0, class_validator_1.IsDateString)({}, { message: "Data de nascimento deve estar no formato ISO (AAAA-MM-DD)" })
    birth_date;
    @(0, class_validator_1.IsString)()
    phone;
}
exports.CreateUserDto = CreateUserDto;
//# sourceMappingURL=create-user.dto.js.map