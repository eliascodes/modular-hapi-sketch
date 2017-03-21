/*
 * Configure logging here (e.g. using `good` plugin)
 */

process.on('uncaughtException', (err) => console.log(err));
process.on('unhandledRejection', (err) => console.log(err));
