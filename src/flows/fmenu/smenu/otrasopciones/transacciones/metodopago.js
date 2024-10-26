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

/******************************************************************* */

const flowMetod = addKeyword(EVENTS.ACTION)
  .addAction(async (ctx, { flowDynamic, endFlow, state, provider }) => {
    /*const responsePayMethod = ctx.body.toUpperCase().trim();
    await state.update({ pm: responsePayMethod });*/
    const savedName = await state.get("name");
    const savedOrder = await state.get("order");
    const savedNumber = await state.get("number");
    const savedAddress = await state.get("address");
    //const savedPM = await state.get("pm");
    await flowDynamic(
      `💳 ¿Cómo prefieres pagar tu pedido? ${savedName}\n 🔸 1️⃣ Efectivo💵\n 🔸 2️⃣ Transferencia💳`
    );
  })
  .addAction(
    { capture: true },
    async (
      ctx,
      { flowDynamic, endFlow, gotoFlow, state, fallBack, provider }
    ) => {
      let response = ctx.body.toLowerCase().trim();
      const number = ctx.from;
      await state.update({ pm: null });
      await provider.vendor.chatModify(
        {
          addChatLabel: {
            labelId: "3",
          },
        },
        ctx.key.remoteJid
      );
      await provider.vendor.chatModify(
        {
          addChatLabel: {
            labelId: "6",
          },
        },
        ctx.key.remoteJid
      );

      if (response === "1") {

        await state.update({ pm: "Efectivo" });
        const savedType = await state.get("type").toLowerCase()??null;
        if(savedType==="local"){
          await flowDynamic("👌 ¡Perfecto! Te esperamos en *Comidas Rápidas El Pirry*🛎️\npara hacer la entrega de tu pedido 🍔🥤\n¡Gracias por tu preferencia! 🙏🤗")
          await flowDynamic("Enseguida un asesor te indicará el monto final.\n¡Por favor, espera un momento! 🙏")          
        }else if(savedType==="domicilio"){
          await flowDynamic(
            "Recuerda tener el monto exacto listo. Nuestro motorizado se comunicará contigo en cuanto llegue al lugar de entrega🛵\nGracias por preferir PIRRY'S PIZZA 🍕, ¡esperamos que disfrutes tu pedido!"
          );
        }

        //return gotoFlow(flowpedidofin);
        //console.log(savedNumber);
      } else if (response === "2") {
        await state.update({ pm: "Transferencia" });
        await flowDynamic(
          "💵 Si elegiste transferencia, nuestros canales de pago son: Ahorros Bancolombia No.54215816659 \nCódigo Qr:"
        );
        await provider.sendMedia(ctx.key.remoteJid, "./src/assets/qr.jpg");
        await flowDynamic("👌 ¡Perfecto! Te esperamos en *Comidas Rápidas El Pirry*🛎️\npara hacer la entrega de tu pedido 🍔🥤\n¡Gracias por tu preferencia! 🙏🤗")
        await flowDynamic(
          "Enseguida un asesor te indicará el monto final.\n¡Por favor, espera un momento! 🙏"
        );

        //return gotoFlow(flowpedidofin);
      } else {
        return fallBack("No es una de las opciones");
      }

      const savedName = await state.get("name") || null;
      const savedOrder = await state.get("order") || null;
      const savedNumber = await state.get("number") || null;
      const savedAddress = await state.get("address") || null;
      const savedType = await state.get("type") || null;
      const savedPm = await state.get("pm") || null;

      await flowDynamic (`👤Cliente: ${savedName}\n🛍️Orden: ${savedOrder}\n💵Método de pago: ${savedPm}\n\n⏱Recuerda que el tiempo promedio por pedido varía entre 5 y 20 minutos`)
    }
  );
export { flowMetod };
