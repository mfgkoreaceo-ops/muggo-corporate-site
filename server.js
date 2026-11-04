require('./backend/server.cjs').createApp().server.listen(Number(process.env.PORT || 4173), process.env.HOST || '127.0.0.1', () => console.info('MUGGO admin server started'));
