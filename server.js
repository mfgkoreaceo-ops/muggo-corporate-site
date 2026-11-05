const { createApp } = require('./backend/server.cjs');
const app = createApp();
if (require.main === module && !process.env.VERCEL) {
  app.server.listen(Number(process.env.PORT || 4173), process.env.HOST || '127.0.0.1', () => console.info('MUGGO admin server started'));
}
module.exports = app.server;
