import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'


///////////////////////////////////////////////////////////////////////
import { flowInitPedido } from './smenu/iniciarpedido.js'
//////////////////////////////////////////////////////////////////////

const flowMenu = addKeyword(EVENTS.ACTION)
.addAction(
    async (ctx, { flowDynamic,endFlow,provider }) => {

     await flowDynamic("🍔 ¡Has ingresado al Menú! 🍟\n¡Elige tu favorito y disfruta! 🍕🌭🥤👇")
     await provider.sendMedia(ctx.key.remoteJid, './src/assets/menu1.PNG')
     await provider.sendMedia(ctx.key.remoteJid, './src/assets/menu2.PNG')
     await flowDynamic("¿List@ para hacer tu pedido? 😋 \n Indicanos *SI* o *NO*")
     
}).addAction({capture:true},
    async (ctx, { flowDynamic,endFlow,fallBack,gotoFlow,provider }) => {

        let seleccionado = ctx.body.toLowerCase().trim()
        await provider.vendor.chatModify(
            {
                addChatLabel: {
                    labelId: '7'
                }
            }, ctx.key.remoteJid
        )

        if(seleccionado ==="si"){
            await flowDynamic("👨‍🍳 ¡Vamos a empezar con tu pedido! 🛎️")
            return gotoFlow(flowInitPedido)
        }else if(seleccionado ==="no"){
            return endFlow("Ok, recuerda que cuando estés listo puedes escribirnos nuevamente🙌")
        }else{
            return fallBack("No es una opción valida🚫")
        }
})


export{flowMenu}