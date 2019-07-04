module.exports = (name) => {
  return `
    cd ${name} &&
    npm install &&
    rm .cliConf.json &&
    npm run serve
  `
}