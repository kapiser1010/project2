import { join } from "path";
import {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  utils,
  EVENTS,
} from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { BaileysProvider as Provider } from "@builderbot/provider-baileys";
import { flowWelcome } from "../bienvenida.js";

const flowAboutus = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, { flowDynamic, endFlow, provider }) => {
    await provider.vendor.chatModify(
      {
          addChatLabel: {
              labelId: '7'
          }
      }, ctx.key.remoteJid
  )
    await flowDynamic(
       "🍔 ¡Hola! Nos alegra que estés aquí en *Comidas Rápidas El Pirry*! 🎉\nTe recibiremos con una sonrisa 😊 y un ambiente cálido 🏪."
    );

    await flowDynamic(
      "📍 Te esperamos en nuestro local\nCra,56A No.10B Sur - 33 Guayabal - La Colinita (EN EL PARQUE DEL HG)"
    );

    await flowDynamic(
      "Nuestros horarios de atención son🕐:\n Lunes a Domingos de 6 PM - 12 AM"
    );

    await flowDynamic(
      "¡Pregunta lo que necesites, estamos aquí para ayudarte! 🤗 ¡\nEsperamos verte pronto y que disfrutes de una deliciosa comida! 🍽️👌"
    );

    await flowDynamic("1️⃣ Para regresar al menú\n2️⃣ Para finalizar la atención");
  }
).addAction({capture:true},
  async (ctx, { flowDynamic,gotoFlow, endFlow, provider }) => {
    let seleccion = ctx.body
   if(seleccion==="1"){
    return gotoFlow(flowWelcome)
   }else if(seleccion==="2"){
    return endFlow("Gracias por comunicarte con Pirys pizza🍕")
   }else{
    return endFlow("Selección no valida, comunicación finalizada")
   }
  }
);
export { flowAboutus };
