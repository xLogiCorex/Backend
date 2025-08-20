const { Sequelize } = require("sequelize");

const dbHandler = new Sequelize('project', 'root', '', {
    host: '127.1.1.1',
    dialect: 'mysql'
});

(async () => {
    try {
        await dbHandler.authenticate();
        console.log("Kapcsolódva az adatbázishoz.");

    const [indexes] = await dbHandler.query(`
        SELECT TABLE_NAME, INDEX_NAME FROM INFORMATION_SCHEMA.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE() AND INDEX_NAME != 'PRIMARY';
        `);

    if (indexes.length === 0) {
        console.log("Nincsenek törölhető indexek.");
        process.exit(0);
        }

    for (const idx of indexes) {
        const sql = `ALTER TABLE \`${idx.TABLE_NAME}\` DROP INDEX \`${idx.INDEX_NAME}\``;
        console.log("Futtatom:", sql);
        await dbHandler.query(sql);
        }

    console.log("Minden index törölve (kivéve a PRIMARY kulcsokat).");
    process.exit(0);
    } 
    catch (err) {
        console.error("Hiba:", err);
        process.exit(1);
    }
})();