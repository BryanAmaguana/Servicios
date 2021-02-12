
//    puerto   //
process.env.PORT = process.env.PORT || 3050;


// entorno

process.env.PORT = process.env.PORT || 'dev';

//vencimineto de token
//60 segundos
//60minutos
//24  horas
//30 dias

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//SEED  de autentificacion

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

//   base de datos

let urlDB;

if (process.env.PORT === 'dev') {
    urlDB = 'mongodb://localhost:27017/union';
   // urlDB = 'mongodb+srv://Bryan:Bryan1996@cluster0.vfala.mongodb.net/union'
} else {
   // urlDB = 'mongodb+srv://Bryan:Bryan1996@cluster0.vfala.mongodb.net/union'
   urlDB = 'mongodb://localhost:27017/union';
}

process.env.URLDB = urlDB;