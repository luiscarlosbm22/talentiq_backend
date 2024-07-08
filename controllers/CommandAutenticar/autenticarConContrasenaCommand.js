// autenticarConContraseñaCommand.js
class AutenticarConContrasenaCommand {
    constructor(usuario, password) {
      this.usuario = usuario;
      this.password = password;
    }
  
    async execute() {
      if (await this.usuario.comprobarPassword(this.password)) {
        return true;
      }
      throw new Error("Contraseña incorrecta");
    }
  }
  
export default AutenticarConContrasenaCommand;
  