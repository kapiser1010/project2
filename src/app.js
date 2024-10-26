import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'

const PORT = process.env.PORT ?? 3006

/*********************FLUJOS IMPORTADOS*********************** */
import { flowWelcome } from './flows/bienvenida.js'
//-----------------------------------------------------------
import { flowAboutus } from './flows/fmenu/aboutus.js'
import { flowMenu } from './flows/fmenu/menu.js'
//----------------------------------------------------------
import { flowInitPedido } from './flows/fmenu/smenu/iniciarpedido.js'
import { flowOrder } from './flows/fmenu/smenu/orden.js'
import { flowpedidofin } from './flows/fmenu/smenu/pedidofin.js'
//--------------------------------------------------------------
import { flowDomicilio } from './flows/fmenu/smenu/otrasopciones/domicilio.js'
//-------------------------------------------------------------------------------
import { flowHogar } from './flows/fmenu/smenu/otrasopciones/domicilio/hogar.js'
import { flowMetod } from './flows/fmenu/smenu/otrasopciones/transacciones/metodopago.js'
import { flowUbicacion } from './flows/fmenu/smenu/otrasopciones/domicilio/ubicacion.js'

/************************************************************* */

const main = async () => {
    const adapterFlow = createFlow([
        flowWelcome,
        flowAboutus,
        flowMenu,
        flowInitPedido,
        flowOrder,
        flowpedidofin,
        flowDomicilio,
        flowHogar,
        flowUbicacion,
        flowMetod
    ])
    
    const adapterProvider = createProvider(Provider, {
        writeMyself: 'host'
    })
    const adapterDB = new Database()

    const { handleCtx, httpServer } = await createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    adapterProvider.server.post(
        '/v1/messages',
        handleCtx(async (bot, req, res) => {
            const { number, message, urlMedia } = req.body
            await bot.sendMessage(number, message, { media: urlMedia ?? null })
            return res.end('sended')
        })
    )

    adapterProvider.server.post(
        '/v1/register',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('REGISTER_FLOW', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/samples',
        handleCtx(async (bot, req, res) => {
            const { number, name } = req.body
            await bot.dispatch('SAMPLES', { from: number, name })
            return res.end('trigger')
        })
    )

    adapterProvider.server.post(
        '/v1/blacklist',
        handleCtx(async (bot, req, res) => {
            const { number, intent } = req.body
            if (intent === 'remove') bot.blacklist.remove(number)
            if (intent === 'add') bot.blacklist.add(number)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            return res.end(JSON.stringify({ status: 'ok', number, intent }))
        })
    )

    // Cambia 'port' a 'PORT'
    httpServer(PORT) // Asegúrate de usar 'PORT' aquí
}

main()

