require('./backend/server.cjs').server.listen(Number(process.env.PORT || 4173), process.env.HOST || '127.0.0.1', () => console.info('MUGGO preview: http://127.0.0.1:' + (process.env.PORT || 4173)));
