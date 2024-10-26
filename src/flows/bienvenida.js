import { join } from 'path'
import { createBot, createProvider, createFlow, addKeyword, utils, EVENTS } from '@builderbot/bot'
import { MemoryDB as Database } from '@builderbot/bot'
import { BaileysProvider as Provider } from '@builderbot/provider-baileys'


//FLUJOS IMPORTADOS

import { flowMenu } from './fmenu/menu.js'
//import { flowHorario } from './fmenu/horario.js'
import { flowAboutus } from './fmenu/aboutus.js'


const saludos = [
    // Español
    "HOLA",
    "Hi",
    "hi",
    "hola",
    "Hola",
    "BUENAS",
    "buenas",
    "Buenas",
    "BUENOS DIAS",
    "buenos dias",
    "Buenos dias",
    "BUENAS TARDES",
    "buenas tardes",
    "Buenas tardes",
    "BUENAS NOCHES",
    "buenas noches",
    "Buenas noches",
    "QUE TAL",
    "que tal",
    "Que tal",
    "COMO ESTAS",
    "como estas",
    "Como estas",
    "SALUDOS",
    "saludos",
    "Saludos",
    "QUE PASA",
    "que pasa",
    "Que pasa",
    "Oe parce",
    "OE PARCE",
    "oe parce",
    "¿QUÉ MÁS?",
    "¿Qué más?",
    "¿qué más?",
    "QUE MAS",
    "que mas",
    "Que mas",
    "¿QUIUBO?",
    "¿Quiubo?",
    "¿quiubo?",
    "QUIUBO",
    "quiubo",
    "Quiubo",
    "¿QUIUBOLE?",
    "¿Quiúbole?",
    "¿quiúbole?",
    "QUIUBOLE",
    "quiúbole",
    "Quiúbole",
    "¿QUÉ MÁS PUES?",
    "¿Qué más pues?",
    "¿qué más pues?",
    "QUE MAS PUES",
    "que mas pues",
    "Que mas pues",
    
    // Inglés
    "HELLO",
    "hello",
    "Hello",
    "GOOD MORNING",
    "good morning",
    "Good morning",
    "GOOD AFTERNOON",
    "good afternoon",
  ];

const flowWelcome = addKeyword(["test",...saludos],{sensitive:true})
    .addAnswer("Hola soy *Axel* tu asistente virtual😊\nEn *Comidas Rápidas El Pirry*🍔🍟 hemos automatizado la toma de pedidos para agilizar y mejorar nuestro servicio🚀\n¡Espero que te guste!🙌")
    .addAnswer("¡Estamos listos para tomar tu pedido! 🛎️🍔\n🔸*1️⃣* Menú\n🔸*2️⃣* Sobre nosotros")
    .addAction(
        { capture: true, sensitive: true },
        async (ctx, { endFlow, flowDynamic, gotoFlow, fallBack,state, provider }) => {
            let opcion = ctx.body;
            //await state.clear
            const seleccionado = opcion.toLowerCase();

            await provider.vendor.chatModify(
                {
                    addChatLabel: {
                        labelId: '8'
                    }
                }, ctx.key.remoteJid
            )
            if (seleccionado === "1") {
                await provider.vendor.readMessages([ctx.key]);
                return gotoFlow(flowMenu);

            }else if (seleccionado === "2") {
                await provider.vendor.readMessages([ctx.key]);
                return gotoFlow(flowAboutus);

            }else{
                return fallBack("No es una opción valida🚫");
            }
    });

export { flowWelcome }