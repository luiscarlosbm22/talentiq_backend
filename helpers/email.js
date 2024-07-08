import nodemailer from "nodemailer";

//Hacer tambein emailRegistro para Admin
export const emailRegistro = async (datos) => {
    const { email, id_servicio, token } = datos;

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "7c7829a033233d",
            pass: "489d4c64c20a60"
        }
    });


    //Informacion del email

    const info = await transport.sendMail({
        from: '"Meganet Portal - Administrador - Portal" <meganetperu@meganet.com>',
        to: email,
        subject: "Meganet - Comprueba tu Cuenta",
        text: "Comprueba tu cuenta en Meganet Portal",
        html: ` <p>Hola: ${email} Comprueba tu cuenta en Meganet</p>
        <p>Tu cuenta ya esta casi lista solo debes comprobarla en el siguiente enlace: </p>
        <a href="${process.env.FRONTEND_URL}/miportalmeganet/confirmar/${token}">Comprobar Cuenta</a>
        <p>Si tu no creaste esta cuenta, puedes ingnorar este mensaje</p>
        
        
        `,
    })
};

export const emailOlvidePasswordCliente = async (datos) => {
    const { email, id_servicio, token } = datos;

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "7c7829a033233d",
            pass: "489d4c64c20a60"
        }
    });


    //Informacion del email

    const info = await transport.sendMail({
        from: '"Meganet Portal - Cliente - Portal" <meganetperu@meganet.com>',
        to: email,
        subject: "Meganet - Reestablece tu Password",
        text: "Reestablece tu Password para entrar al Meganet Portal",
        html: ` <p>Hola: ${email} has solicitado reestablecer tu password</p>
        <p>Sigue el siguiente enlace para generar un nuevo password: </p>
        <a href="${process.env.FRONTEND_URL}/miportalmeganet/olvide-password/${token}">Reestablecer Password</a>
        <p>Si tu no solicitaste este cambio , puedes ingnorar este mensaje</p>
        
        
        `,
    })
};

export const emailOlvidePasswordAdmin = async (datos) => {
    const { email, nombres, token } = datos;

    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
            user: "7c7829a033233d",
            pass: "489d4c64c20a60"
        }
    });


    //Informacion del email

    const info = await transport.sendMail({
        from: '"Meganet Portal - Administrador - Portal" <meganetperu@meganet.com>',
        to: email,
        subject: "Meganet - Reestablece tu Password",
        text: "Reestablece tu Password para entrar al Administrador",
        html: ` <p>Hola: ${nombres} has solicitado reestablecer tu password</p>
        <p>Sigue el siguiente enlace para generar un nuevo password: </p>
        <a href="${process.env.FRONTEND_URL}/adminlogin/olvide-password/${token}">Reestablecer Password</a>
        <p>Si tu no solicitaste este cambio , puedes ingnorar este mensaje</p>
        
        
        `,
    })
};