import express from 'express'
import path from 'path'
import sqlite from 'sqlite3'
import {Db, SQLite3Driver} from 'sqlite-ts'
import {Item} from './model/item'
import bodyParser from 'body-parser'
import {env} from 'node:process'

const PORT = env.PORT

async function main() {

    const app = express()

    // setup database
    const entities = {
        Item
    }
    const sqliteDb = new sqlite.Database(':memory:')
    const db = await Db.init({
            driver: new SQLite3Driver(sqliteDb),
            entities,
            createTables: true
        })


    const urlencodedParser = bodyParser.urlencoded({ extended: false })

    app.set('view engine', 'ejs')
    app.set('views', path.join(__dirname, 'views'))


    // return view with list of items
    app.get('/', async (_req, res) => {
        const list = await db.tables.Item.select()
        res.render('list', {list: list})
    } )

    // add item
    app.post('/items/add', urlencodedParser, async (req, res) => {
        await db.tables.Item.insert({
            content: req.body.content,
            done: (req.body.done == "on"),
        })
        res.redirect('/')
    })

    // remove item
    app.post('/items/:id/delete', urlencodedParser, async (req, res) => {
        await db.tables.Item.delete()
            .where(c => c.equals({ content: req.params.id }))
        res.redirect('/')
    })

    // update status of item
    app.post('/items/:id/update', urlencodedParser, async (req, res) => {
        await db.tables.Item.update({
            done: (req.body.done == "on"),
            content: req.body.content
        })
        .where(c => c.equals({ id: req.params.id }))
        res.redirect('/')
    })

    app.listen(PORT)
    console.log('Express started on port ' + PORT)
}

main()
