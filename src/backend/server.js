const express = require('express')

const app = express()
const port = process.env.PORT || 2525

app.use(express.static('public'))

app.listen(port, () => console.log(`Server Running at http://localhost:${port}`))