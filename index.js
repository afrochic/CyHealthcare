const express = require("express");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

const covidRoutes = require('./routes/covid.js')

app.use(express.static('public'))
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(express.json({ limit: '30mb' }))

app.set('view engine', 'ejs')
app.set("views", __dirname + "/views")
app.set("view options", { layout: false })

app.use('/covid', covidRoutes);

app.get("/", function (req, res) {
  res.render('../views/table.ejs')
});

app.listen(port, function () {
  console.log(`app listening on port ${port}!`);
});