import React, {useState, useEffect} from "react";
import * as SQLite from 'expo-sqlite';

async function openDatabase(db, dbName) {
    db = await SQLite.openDatabaseAsync(dbName);
}

const enviarDatos = () => {

    let db;
    const dbName = 'db.db';
    const [isLoading , setLoading] = useState(false);

    useEffect(() => {
        openDatabase(db, dbName).then(r =>
            console.log("Base de Datos Iniciada.")
        );
    });

}

export default enviarDatos;