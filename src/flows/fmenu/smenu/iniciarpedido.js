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

import { flowpedidofin } from "./pedidofin.js";
import {flowOrder} from "./orden.js"
/******************************************************************* */

const flowInitPedido = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic, endFlow, state, provider }) => {
    await flowDynamic(
      "Para comenzar, ¿podrías decirme tu nombre completo por favor? 😊"
    );
  })
  .addAction({ capture: true }, async (ctx, { flowDynamic,gotoFlow,endFlow, state, provider }) => {
    const responseName = ctx.body.toUpperCase().trim();
    await state.update({ name: responseName });
    const savedName = await state.get('name');
    await provider.vendor.chatModify(
      {
        addChatLabel: {
          labelId: "2",
        },
      },
      ctx.key.remoteJid
    );
    
    await flowDynamic(
     `${savedName} , ✨ ¡Ahora indicanos tu pedido con todos los detalles\n*POR EJEMPLO*: 👀 Hamburguesa especial con salsa de la casa ajo, papas a la francesa y una Coca Cola 1.5 litros🌭🍔🍟🥤`
    );
    await flowDynamic("*Salsas de la casa*: Rosada, Ajo, Verde y Mandinga\n*Salsas tradicionales*: Rosada, Piña, Roja, Mayonesa, Showy, Barbecue(BBQ)") 
    await flowDynamic("(RECUERDA ESCRIBIR TODO EN UN SOLO MENSAJE)😉‼")
    return gotoFlow(flowOrder)
  })

export { flowInitPedido };
