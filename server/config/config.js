//    puerto   //
process.env.PORT = process.env.PORT || 3000;


// entorno

process.env.PORT = process.env.PORT || 'dev';



//   base de datos

let urlDB;

if (process.env.PORT === 'dev') {
    urlDB = 'mongodb://localhost:27017/union';
} else {
    urlDB = 'mongodb+srv://Bryan:Bryan1996@cluster0.vfala.mongodb.net/union'
}

process.env.URLDB = urlDB;