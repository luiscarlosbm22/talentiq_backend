import nodemailer from "nodemailer";

export const emailRegistro = async (datos) => {
    const { email, id_servicio, token } = datos;

    const transport = nodemailer.createTransport({
        host: "smtp.zoho.com",
        port: 465,
        secure: true,
        auth: {
            user: "ventas@meganet.pe",
            pass: "MenDark@0809"
        }
    });

    // const transport = nodemailer.createTransport({
    //     host: "sandbox.smtp.mailtrap.io",
    //     port: 2525,
    //     auth: {
    //         user: "7c7829a033233d",
    //         pass: "489d4c64c20a60"
    //     }
    // });


    //Informacion del email

    const info = await transport.sendMail({
        from: '"TalentIQ - Portal" <ventas@meganet.pe>',
        to: email,
        subject: "TalentIQ - Comprueba tu Cuenta",
        text: "Comprueba tu cuenta en TalentIQ",
        html: ` <p>Hola: ${email} Comprueba tu cuenta en TalentIQ</p>
        <p>Tu cuenta ya esta casi lista solo debes comprobarla en el siguiente enlace: </p>
        <a href="${process.env.FRONTEND_URL}/login/confirmar/${token}">Comprobar Cuenta</a>
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
        from: '"TalentIQ Portal - Cliente - Portal" <prueba@prueba.com>',
        to: email,
        subject: "TalentIQ - Reestablece tu Password",
        text: "Reestablece tu Password para entrar al TalentIQ Portal",
        html: ` <p>Hola: ${email} has solicitado reestablecer tu password</p>
        <p>Sigue el siguiente enlace para generar un nuevo password: </p>
        <a href="${process.env.FRONTEND_URL}/miportalTalentIQ/olvide-password/${token}">Reestablecer Password</a>
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
        from: '"TalentIQ Portal - Administrador - Portal" <TalentIQperu@TalentIQ.com>',
        to: email,
        subject: "TalentIQ - Reestablece tu Password",
        text: "Reestablece tu Password para entrar al Administrador",
        html: ` <p>Hola: ${nombres} has solicitado reestablecer tu password</p>
        <p>Sigue el siguiente enlace para generar un nuevo password: </p>
        <a href="${process.env.FRONTEND_URL}/adminlogin/olvide-password/${token}">Reestablecer Password</a>
        <p>Si tu no solicitaste este cambio , puedes ingnorar este mensaje</p>
        
        
        `,
    })
};