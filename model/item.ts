import { Column, Primary } from 'sqlite-ts'

export class Item {
    @Primary()
    id: number = 0

    @Column('NVARCHAR')
    content: string = ""

    @Column('BOOLEAN')
    done: boolean = false
}
