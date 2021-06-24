console.log('Empieza a ejecutarse el altaFoto');
        
const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });
const docClient = new aws.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

aws.config.update({region: 'eu-west-1'});

exports.handler = function(event, context) {

    // Obtenemos los objetos 
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    console.log('bucket:', bucket);
    console.log('key:', key);
    
    var rutaFoto = key.split('/');
    console.log('rutaFoto:', rutaFoto);
    
    var params = {
        TableName: 'vecinos',
           Key:{
            nombre_usuario: rutaFoto[0]
         },
        UpdateExpression: 'set foto_perfil = :foto',
        ExpressionAttributeValues:{
          ':foto': key
        },
        ReturnValues:'UPDATED_NEW'
    };

    console.log('Vamos a asignarle foto de perfil al vecino: ' +  rutaFoto[0]);
    
    docClient.update(params, function(err, data) {
       
    if (err) console.log(err);
    else console.log(data);
});
};
