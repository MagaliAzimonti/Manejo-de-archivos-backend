const fs = require('fs');

class Contenedor{
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo
    }

    async getAll(){
        try {
            let productos = await fs.promises.readFile(this.nombreArchivo, "utf-8")
            return JSON.parse(productos)
        }  catch(error){
            console.log(error)
            throw new Error (error)
        }
    }

    async save(producto) {
        const productos = await this.getAll()
        const id = (productos[productos.length - 1]?.id ?? 0) + 1

        const guardarProducto = {id, ...producto}
        const guardarProductos = JSON.stringify([...productos, guardarProducto])

        try{
            await fs.promises.writeFile(this.nombreArchivo, guardarProductos)
            return id;
        } catch(error) {
            throw new Error(error)
        }
        } catch (error) {
            console.log(error)
        }

    async getById(id){
        const productos = await this.getAll()
        return productos.find(producto => producto.id === id)
    }

    async deleteById(id){
        const productos = await this.getAll()
        try {
            let producto = productos.fliter(prod => prod.id != id)
            await fs.promises.writeFile(this.nombreArchivo, JSON.stringify(producto, null, 2))
        } catch (error) {
            console.error(error)
        }
    }

    async deleteAll(){
        try {
            await fs.promises.writeFile(this.nombreArchivo, JSON.parse('[]'))
        } catch (error) {
            console.log(error)
        }
    }


    
}

(async () => {
    const contenedor = new Contenedor("tienda.json")

    const producto1 = await contenedor.save({title: 'Crema de manos Neroli Orquideas', price: '$1200', thumbnail: 'http://cdn.shopify.com/s/files/1/0079/0734/4497/products/semilla--flores-de-neroli-y-orquideas--crema-de-manos-frente.jpg?v=1632885626' })
    console.log(`Creado ${producto1}`)

})
