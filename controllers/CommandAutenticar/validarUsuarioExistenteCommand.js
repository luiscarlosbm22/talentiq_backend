// validarUsuarioExistenteCommand.js
class ValidarUsuarioExistenteCommand {
    constructor(usuario) {
      this.usuario = usuario;
    }
  
    execute() {
      if (!this.usuario) {
        throw new Error("El usuario no existe");
      }
    }
  }
  
export default  ValidarUsuarioExistenteCommand;
  