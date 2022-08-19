import express from 'express'
import path from 'path'
import sqlite from 'sqlite3'
import {Db, SQLite3Driver} from 'sqlite-ts'
import {Item} from './model/item'

const PORT = 3000

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

    app.set('view engine', 'ejs')
    app.set('views', path.join(__dirname, 'views'))


    // return view with list of items
    app.get('/', async (req, res) => {
        const list = await db.tables.Item.select()
        res.render('list', {list: list})
    } )

    // add item
    app.get('/items/:content', async (req, res) => {
        const result = await db.tables.Item.upsert({
            content: req.params.content,
            done: false
        })
        res.redirect('/')
    })

    // remove item
    app.get('/items/:content/delete', async (req, res) => {
        const result = await db.tables.Item.delete()
            .where(c => c.equals({ content: req.params.content }))
        res.redirect('/')
    })

    // update status of item
    app.get('/items/:content/:done', async (req, res) => {
        const result = await db.tables.Item.update({done: (req.params.done == "true")})
            .where(c => c.equals({ content: req.params.content }))
        res.redirect('/')
    })


    app.listen(PORT)
    console.log('Express started on port ' + PORT)
}

main()
