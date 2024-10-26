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

/*********************************************************************** */

//import { flowpedidofin } from "./pedidofin.js";
import { flowMetod } from "../transacciones/metodopago.js";

/******************************************************************* */

const flowHogar = addKeyword(EVENTS.ACTION)
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, endFlow, state, provider }) => {
      const responseAddress = ctx.body.toUpperCase().trim();
      await state.update({ address: responseAddress });
      const savedName = await state.get("name");
      const savedOrder = await state.get("order");
      const savedNumber = await state.get("number");
      const savedAddress = await state.get("address");
      await flowDynamic(
        `📍 ¿Podrías confirmar tu dirección ${savedName}?\nTu dirección de entrega es: ${savedAddress}\n\n*Por favor, envíanos tu ubicación actual mediante la opción de localización en WhatsApp*`
      );
    }
  )
  .addAction(
    { capture: true },
    async (
      ctx,
      { flowDynamic, endFlow, gotoFlow, state, fallBack, provider }
    ) => {
      let response = ctx.body.toLowerCase().trim();
      const number = ctx.from;

      if(ctx.body.includes("_event_location_")){
        await flowDynamic(
          "👌 ¡Todo listo! confirmanos que los datos previamente enviados son los correctos"
        );
        await flowDynamic(
          "🔸 Dime *SI* para confirmar o *NO* si necesitas corregirlo.`"
        )
      }else{
        return fallBack("❗ Parece que no recibimos la ubicación correcta\nPor favor, envíanos tu ubicación actual para continuar.")
      }

    }
  ) .addAction(
    { capture: true },
    async (
      ctx,
      { flowDynamic, endFlow, gotoFlow, state, fallBack, provider }
    ) => {
      let response = ctx.body.toLowerCase().trim();
      const number = ctx.from;

      if (response === "si") {
        await flowDynamic(
          "🎉 ¡Listo! Tu pedido ha sido registrado.\nEl tiempo estimado de entrega es de 30 a 40 minutos. ¡Gracias por tu paciencia! 🍕⏳"
        );
        return gotoFlow(flowMetod)
        //return gotoFlow(flowpedidofin);
        //console.log(savedNumber);
      } else if (response === "no") {
        await flowDynamic(
          "Vuelve a indicarnos la dirección de manera correcta por favor"
        );
        return gotoFlow(flowHogar)
      } else {
        return fallBack("No es una de las opciones");
      }
    }
  );

  export{flowHogar}