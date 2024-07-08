// obtenerCamposEspecificosCommand.js
class ObtenerCamposEspecificosCommand {
    constructor(usuario) {
      this.usuario = usuario;
    }
  
    execute() {
      const camposEspecificos = {};
  
      if (this.usuario.__t === "Cliente") {
        camposEspecificos.nombres = this.usuario.nombres;
        camposEspecificos.apellidos = this.usuario.apellidos;
      } else if (this.usuario.__t === "Admin") {
        camposEspecificos.nombres = this.usuario.nombres;
        camposEspecificos.apellidos = this.usuario.apellidos;
        
      }
  
      return camposEspecificos;
    }
  }
  
export default ObtenerCamposEspecificosCommand;
  