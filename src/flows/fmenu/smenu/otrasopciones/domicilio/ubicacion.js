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

const flowUbicacion = addKeyword([EVENTS.ACTION])
  .addAction(
    { capture: true },
    async (ctx, { flowDynamic, fallBack,endFlow, state, provider }) => {
      
      console.log(ctx.body)

      if(ctx.body.includes("_event_location_")){
        await flowDynamic(
          "Listo lo tomaremos en cuenta al enviar el pedido a esa ubicación"
        );
        await flowDynamic(
          "Indicanos si tu ubicación actual es correcta *SI* o *NO*"
        )
      }else{
        return fallBack("Esa no es una ubicación, por favor envianos tu ubicación actual para continuar‼")
      }
      
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

      if (response === "si") {
        await flowDynamic(
          "🤙Todo listo, tu pedido ha sido tomado.\nRecuerda que el tiempo promedio por pedido es de 30 a 40 minutos🕐"
        );
        return gotoFlow(flowMetod);
        //return gotoFlow(flowpedidofin);
        //console.log(savedNumber);
      } else if (response === "no") {
        await flowDynamic(
          "Vuelve a indicarnos la dirección de manera correcta por favor👐"
        );
        return gotoFlow(flowUbicacion);
      } else {
        return fallBack("No es una de las opciones🚫");
      }
    }
  );

export { flowUbicacion };
