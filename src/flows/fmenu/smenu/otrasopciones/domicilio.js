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
import { flowHogar } from "./domicilio/hogar.js";
import { flowUbicacion } from "./domicilio/ubicacion.js";


/******************************************************************* */

const flowDomicilio = addKeyword(EVENTS.ACTION)
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, endFlow, state, provider }) => {
      const responseNumber = ctx.body.toUpperCase().trim();
      await state.update({ number: responseNumber });
      const savedName = await state.get("name");
      const savedOrder = await state.get("order");
      const savedNumber = await state.get("number");
      await flowDynamic(
        `🤳 ¿Podrías confirmar tu número ${savedName}?\nTu número es: ${savedNumber}\n🔸 Dime *SI* para confirmar o *NO* si necesitas corregirlo.`
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

      await provider.vendor.chatModify(
        {
          addChatLabel: {
            labelId: "5",
          },
        },
        ctx.key.remoteJid
      );
      await provider.vendor.chatModify(
        {
          removeChatLabel: {
            labelId: "7",
          },
        },
        ctx.key.remoteJid
      );

      if (response === "si") {
       
        await provider.vendor.chatModify(
          {
            addChatLabel: {
              labelId: "5",
            },
          },
          ctx.key.remoteJid
        );
        await provider.vendor.chatModify(
          {
            removeChatLabel: {
              labelId: "7",
            },
          },
          ctx.key.remoteJid
        );
        await flowDynamic("🏠 Ahora necesitamos la dirección completa de entrega.\nIndicanos: Nombre de la unidad\nNúmero de torre\nNúmero de apartamento\nDirección.")
        await flowDynamic("*(RECUERDA ESCRIBIR TODO EN UN SÓLO PÁRRAFO)*")
        return gotoFlow(flowHogar);
        //console.log(savedNumber);
        //return gotoFlow(flowpedidofin);
        //console.log(savedNumber);
      } else if (response === "no") {
        await flowDynamic(
          "Vuelve a indicarnos el número de manera correcta por favor"
        );
        return gotoFlow(flowDomicilio)
      } else {
        return fallBack("No es una de las opciones");
      }
    }
  );
  

  export{flowDomicilio}