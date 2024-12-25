const { Pool } = require("pg");
const format = require('pg-format');
require('dotenv').config()
const pool = new Pool({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_DATABASE,
 allowExitOnIdle: true,
});


//const obtenerJoyas = async ({ limit = 10 }) => {
   // let consulta = "SELECT * FROM inventario LIMIT $1";
    //const { rows: inventario } = await pool.query(consulta, [limit]);
   // return inventario;
  // };



     //const obtenerMedicamentos = async ({ limit = 10, order_by = "id_ASC",
//page = 0}) => {
   // const [campo, direccion] = order_by.split("_")
    //const offset = page * limit
    //const formattedQuery = format('SELECT * FROM medicamentos order by
   //%s %s LIMIT %s OFFSET %s', campo, direccion, limit, offset);
    //pool.query(formattedQuery);
   // const { rows: medicamentos } = await pool.query(formattedQuery)
    //return medicamentos
  // }

  const obtenerJoyas = async ({ limit = 10, order_by = "id_ASC", page = 1 }) => {
    try {
        const [campo, direccion] = order_by.split("_");
        const offset = (Math.abs(page) - 1) * limit;
        const formattedQuery = format(
            "SELECT * FROM inventario order by %s %s LIMIT %s OFFSET %s",
            campo,
            direccion,
            limit,
            offset
        );
        const { rows: inventario } = await pool.query(formattedQuery);
        return inventario;
    } catch (error) {
        console.error("Error al obtener las joyas:", error);
        throw error; // Lanza el error para que sea manejado por quien llama a la función
    }
};

const obtenerJoyasFiltros = async ({ stock_min, precio_max, categoria, metal }) => {
    try {
        const filtros = [];
        const valores = [];

        if (precio_max) {
            filtros.push(`precio <= $${filtros.length + 1}`);
            valores.push(precio_max);
        }
        if (stock_min) {
            filtros.push(`stock >= $${filtros.length + 1}`);
            valores.push(stock_min);
        }
        if (categoria) {
            filtros.push(`categoria = $${filtros.length + 1}`);
            valores.push(categoria);
        }
        if (metal) {
            filtros.push(`metal = $${filtros.length + 1}`);
            valores.push(metal);
        }

        let consulta = "SELECT * FROM inventario";
        if (filtros.length > 0) {
            consulta += ` WHERE ${filtros.join(" AND ")}`;
        }

        const { rows: inventario } = await pool.query(consulta, valores);
        return inventario;
    } catch (error) {
        console.error("Error al obtener joyas con filtros:", error);
        throw error; // Lanza el error para que sea manejado por quien llama a la función
    }
};

const prepararHATEOAS = (inventario) => {
    const results = inventario.map((m) => {
        return {
            name: m.nombre,
            href: `/joyas/joya/${m.id}`,
        };
    }).slice(0, 6);
    const total = inventario.length;
    const HATEOAS = {
        total,
        results,
    };
    return HATEOAS;
};

    
   




   module.exports = {obtenerJoyas, obtenerJoyasFiltros, prepararHATEOAS}