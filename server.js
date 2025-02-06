const http = require('http');
const { parse } = require('url');
const { StringDecoder } = require('string_decoder');

let dataStore = {}; //simular um BD

const server = http.createServer((req, res) => {
    const parseUrl = parse(req.url, true);
    const path = parseUrl.replace(/^\/+|\/+$/g, ''); //removendo caracteres especiais
    const method = req.method.toUpperCase();
    const decoder = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', (chunck) => {
        buffer += decoder.write(chunck);
    });

    req.on('end', () => {
        buffer += decoder.end();
        const body = buffer ? JSON.parse(buffer) : {};

        if(path === 'items'){
            switch(method){
                case 'GET':
                    res.writeHead(200, {'Content-Type' : 'application/json'});
                    res.end(JSON.stringify({data: dataStore || {} } ));
                    break;
                case 'POST':
                    const id = Date.now().toString();
                    body.id = id;
                    dataStore[id] = body;
                    res.writeHead(201, {'Content-Type' : 'application/json'});
                    res.end(JSON.stringify({message: 'Item criado', id }));
                    break;
                case "PUT":
                    if(!body.id || !dataStore[body.id]){
                        res.writeHead(404, {'Content-Type' : 'application/json'});
                        res.end(JSON.stringify({message: 'Item não encontrado'}));
                    }else{
                        dataStore[body.id] = body;
                        res.writeHead(200, {'Content-Type' : 'application/json'});
                        res.end(JSON.stringify({message: 'Item atualizado' }));
                    }
                case 'DELETE':
                default:
            }
        }

    });


});