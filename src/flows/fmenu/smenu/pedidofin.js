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

///////////////////////////////////////////////////////////////////////
//import { flowInitPedido } from "./smenu/iniciarpedido.js";
//import { flowpedidofin } from "./otrasopciones/pedidofin.js";
import { flowDomicilio } from "./otrasopciones/domicilio.js";
import { flowMetod } from "./otrasopciones/transacciones/metodopago.js";

//////////////////////////////////////////////////////////////////////

const flowpedidofin = addKeyword(EVENTS.ACTION)
  .addAction(
    async (ctx, { flowDynamic, endFlow, state, fallBack, provider }) => {
      let response = ctx.body.toLowerCase().trim();
      const number = ctx.from;

      await flowDynamic("*1️⃣* Recojer en el local🏪");
    }
  )
  .addAction(
    { capture: true },
    async (
      ctx,
      { flowDynamic, endFlow, fallBack, state, gotoFlow, provider }
    ) => {
      let seleccionado = ctx.body.toLowerCase().trim();

      const savedName = await state.get("name");
      const savedOrder = await state.get("order");

      if (seleccionado === "1") {
        await state.update({ type: "Local" });
        await flowDynamic(
        "Perfecto🎉 Te esperamos en nuestro local *Comidas Rápidas El Pirry*🍔\n📍 Cra 56A No. 10B Sur - 33, Guayabal\n📍 La Colinita (En el parque del HG)"
        );
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
        await provider.vendor.chatModify(
          {
            removeChatLabel: {
              labelId: "2",
            },
          },
          ctx.key.remoteJid
        );
        return gotoFlow(flowMetod);
        //return gotoFlow(flowInitPedido)
      } else if (seleccionado === "2") {
        await state.update({ type: "Domicilio" });
        await flowDynamic(`🤳 Para continuar, indícanos tu número de celular, por favor. 📱 ${savedName}`);
        return gotoFlow(flowDomicilio);
      } else {
        return fallBack("No es una opción valida🚫");
      }
    }
  );

export { flowpedidofin };
