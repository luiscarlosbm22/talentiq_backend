// autenticarUsuarioCommand.js
import Usuario from "../../models/Usuario.js";

class AutenticarUsuarioCommand {
    constructor({ email, password }) {
        this.email = email;
        this.password = password;
    }

    async execute() {
        if (this.email) {
            return await Usuario.findOne({ email: this.email });
        }
        return null;
    }
}

export default AutenticarUsuarioCommand;
