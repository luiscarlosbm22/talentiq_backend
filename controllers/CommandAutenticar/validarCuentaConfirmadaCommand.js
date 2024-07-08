// validarCuentaConfirmadaCommand.js
class ValidarCuentaConfirmadaCommand {
    constructor(usuario) {
      this.usuario = usuario;
    }
  
    execute() {
      if (!this.usuario.confirmado) {
        throw new Error("Tu cuenta no ha sido confirmada");
      }
    }
  }
  
export default ValidarCuentaConfirmadaCommand ;
  