const {Client} = require('whatsapp-web.js');
const qrcode = require ('qrcode-terminal');
//let PE = [{}] //Arreglo para almacenar los mensajes pendientes

const client = new Client();
let IndicadorMasivo;

const path = require('path');
const { strict } = require('assert');
//Definicion de la ruta donde se encuentran el archivo para los envios masivos
const route = path.dirname('Z:/Privada/Joseph Carballo/MASIVOS/SUBIDA MASIVA.xlsx' + path.join('/SUBIDA MASIVA.xlsx'))
console.log (route);

//Metodo para generar el codigo qr
client.on ('qr', (qr)=>{
    console.log ('QR:',qr)
    qrcode.generate(qr,{small:true})
});

//Cuando se logra la conexion entrara en el siguiente bloque de codigo.
client.on ('ready', ()=>{
    console.log('Nueva sesion creada')

    client.on ('message_create', (Sended) =>{
        //console.log ('sended:',Sended.body + "\n"+"Enviado por mi:" + Sended.fromMe)

        if (Sended.fromMe === false){
            IndicadorMasivo= false;
        }       
        if (Sended.body === "!CANCELAR"){
            IndicadorMasivo=false;
                for (let S of PE){
                    PE.splice(0,PE.length);
                }
                for (let A of ENV){
                    ENV.splice(0, ENV.length);
                }
                for (let D of NR){
                    NR.splice(0, NR.length);
                }
                console.log("####-Limpiando caché-####")
                console.log (ENV, NR);
        }
        //!MASIVO es la palabra clave para el empezar el envio
        if (Sended.body === '!MASIVO'){
            const ENV = [{}]; //Arreglo para almacenar los mensajes enviados
            const NR = [{}]; //Arreglo para almacenar los Numeros no registrados
            const readerS = require ('xlsx')     
             IndicadorMasivo = true
            
             //Se definen las las variables para leer el archivo excel
            const dat = readerS.readFile(route)
            let sheet_name_list= dat.SheetNames
            let xlData = readerS.utils.sheet_to_json(dat.Sheets[sheet_name_list[0]])
            //console.log (xlData)


            //Se recorre el arreglo que tiene la informacion del excel
            console.log("Tamaño inicial del arreglo de mensajes enviados: ")
            console.log(ENV.length)
            console.log("Listado de números a verificar:")
                for (let D of xlData){
                    console.log(D.NUMERO)
                    let number = '506' + D.NUMERO
                    let msgg = D.MENSAJE;
                    let chatid =  number + "@c.us"
                    let IDMSJ = D.IDMSG
                    let now = new Date()
                    let fecha = now.toLocaleDateString()
                    //por cada recorrido al arreglo se verifica que el numero este registrado en whatsapp
                    client.isRegisteredUser(chatid).then(function(isRegistered) {
                        if(isRegistered) {
                            client.sendMessage(chatid, msgg);
                            //Si se envia el mensaje, se guarda dentro del arreglo de Enviados
                            ENV.push({IDMS:IDMSJ, Mensaje:msgg, Numero:number, Envio: 'Enviado: ', Hora: fecha,});
                        }else{
                            //Si NO se envia el mensaje, se guarda dentro del arreglo de No Registrados
                            NR.push({IDMS:IDMSJ, Mensaje:msgg, Numero:number, Envio: 'No Enviado: ', Hora: fecha,});
                        }
                    }); 
                }
                //console.log("REGISTROS DEL ARREGLO ENV")
                //console.log(ENV)
                //console.log("REGISTROS DEL ARREGLO NR")
                //console.log(NR)
                setTimeout(() => {
                    if (ENV.length > 1) {
                        //Despues de recorrer el arreglo con la totalidad de los masivos se genera el informe de envio
                        let reader = require ('xlsx')
                        let exc = reader.utils.book_new()
                        let workSheet1 = reader.utils.json_to_sheet(NR)
                        let workSheet2 = reader.utils.json_to_sheet(ENV)
                        reader.utils.book_append_sheet(exc, workSheet1, 'NO REGISTRADO EN WHATSAPP')
                        reader.utils.book_append_sheet(exc, workSheet2, 'ENVIADOS')
                        reader.writeFile(exc, 'Z:/Privada/Joseph Carballo/MASIVOS/REPORTE ENVÍO.xlsx')               
                        for (let A of ENV){
                            ENV.splice(0, ENV.length);
                        }
                        for (let D of NR){
                            NR.splice(0, NR.length);
                        }
                    }
                    console.log("####-Informe Generado-####")
                }, 5000);
        }
    });//fin de la funcion client.on
});

client.initialize();      


