const { Telegraf} = require('telegraf');
const axios = require('axios');
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN); 



const helpMessage = '¡Ey! Soy el FreeDbot el asistente que te sacará de apuros. Si necesitas algo, solo dímelo y estaré listo para ayudarte.'


bot.start((ctx) => {
    ctx.reply('Hola');
  });
  
bot.help((ctx) => {
    ctx.reply(helpMessage);
  });

  bot.command('buscar', async (ctx) => {
    try {
      const apiKey = process.env.API_KEY; // Reemplaza con tu propia clave de API de CORE
      const searchTerm = ctx.message.text.split(' ').slice(1).join(' '); // Obtener el término de búsqueda del mensaje del usuario
  
      const resultsPerPage = 10;
      const totalPages = 1;
  
      const allResults = []; // Almacenar todos los resultados
  
      for (let page = 1; page <= totalPages; page++) {
        // Construir la URL de la solicitud GET a la API de CORE con el número de página actual
        const url = `https://api.core.ac.uk/v3/search/outputs?apiKey=${apiKey}&q=${searchTerm}&page=${page}&pageSize=${resultsPerPage}`;
  
        // Realizar la solicitud GET a la API de CORE
        const response = await axios.get(url);
  
        // Procesar la respuesta de la API de CORE
        const results = response.data.results;
  
        // Agregar los resultados actuales a la lista de resultados
        allResults.push(...results);
      }
  
      // Obtener los títulos de los resultados
      const titles = allResults.map(result => result.title);
  
      // Unir los títulos en un solo string separados por saltos de línea
      const titlesString = titles.join('\n');
  
      // Enviar la respuesta al usuario de Telegram con los títulos
      ctx.reply(`¡Se encontraron ${allResults.length} resultados para "${searchTerm}" en CORE!\n\n${titlesString}`);
    } catch (error) {
      console.error('Error al realizar la solicitud a la API de CORE:', error);
      ctx.reply('Lo siento, ocurrió un error al buscar en CORE. Por favor, intenta nuevamente más tarde.');
    }
  });

  

  
  bot.launch();