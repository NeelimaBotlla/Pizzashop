const express = require("express")
const app = express();
const cors = require("cors");
const pool = require("./api");

app.use(cors());
app.use(express.json());

//api's for pizzaBase table
app.get("/api/v1/bases", async (req, res) => {
    try {
        const pizzaBases = await pool.query("SELECT * FROM bases ORDER BY id");
        res.json(pizzaBases.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/bases/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const pizzaBases = await pool.query("SELECT * FROM bases WHERE id = $1", [id]);
        res.json(pizzaBases.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.post("/api/v1/bases", async (req, res) => {
    try {
        const { size } = req.body;
        const { price } = req.body;
        const newBase = await pool.query("INSERT INTO bases (size, price) VALUES ($1, $2) RETURNING *", [size, price]);
        res.json(newBase.rows);
    } catch (err) {
        console.error(err.message);
        res.json(err.message);
    }
})

app.put("/api/v1/bases/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { size } = req.body;
        const { price } = req.body;
        const updateBase = await pool.query("UPDATE bases SET size = $1, price = $2 WHERE id = $3 RETURNING *", [size, price, id]);
        res.json(updateBase.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.delete("/api/v1/bases/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM bases WHERE id = $1", [id]);
        res.json("Deleted Pizza Base Successfully");
    } catch (err) {
        console.error(err.message);
    }
})

//api's for ingredients table
app.get("/api/v1/ingredients", async (req, res) => {
    try {
        const pizzaIngredients = await pool.query("SELECT * FROM ingredients ORDER BY id");
        res.json(pizzaIngredients.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/ingredients/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const pizzaIngredients = await pool.query("SELECT * FROM ingredients WHERE id = $1", [id]);
        res.json(pizzaIngredients.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/showIngredients", async (req, res) => {
    try {
        const pizzaIngredients = await pool.query("SELECT * FROM ingredients WHERE hide=false ORDER BY id");
        res.json(pizzaIngredients.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/ingredientNames", async (req, res) => {
    try {
        const pizzaIngredientNames = await pool.query("SELECT DISTINCT name FROM ingredients");
        res.json(pizzaIngredientNames.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/countries/:name", async (req, res) => {
    try {
        const { name } = req.params;
        const countries = await pool.query("SELECT DISTINCT id, country FROM ingredients WHERE name = $1", [name]);
        res.json(countries.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.post("/api/v1/ingredients", async (req, res) => {
    try {
        const { name } = req.body;
        const { price } = req.body;
        const { country } = req.body;
        const { stock } = req.body;
        const newIngredient = await pool.query("INSERT INTO ingredients (name, price, country, stock) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, price, country, stock]);
        res.json(newIngredient.rows);
    } catch (err) {
        console.error(err.message);
        res.json(err.message);
    }
})

app.put("/api/v1/ingredients/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const { price } = req.body;
        const { country } = req.body;
        const updateIngredient = await pool.query("UPDATE ingredients SET name = $1, price = $2, country = $3 WHERE id = $4 RETURNING *",
            [name, price, country, id]);
        res.json(updateIngredient.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.delete("/api/v1/ingredients/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM ingredients WHERE id = $1", [id]);
        res.json("Deleted Ingredient Successfully");
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/ingredients/hide/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`CALL hideIngredient(${id})`);
        res.json("Hidden Ingredient");
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/ingredients/show/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`CALL showIngredient(${id})`);
        res.json("Ingredient available");
    } catch (err) {
        console.error(err.message);
    }
})

//api's for suppliers table
app.get("/api/v1/suppliers", async (req, res) => {
    try {
        const getSuppliers = await pool.query("SELECT * FROM suppliers ORDER BY id");
        res.json(getSuppliers.rows);
    } catch (err) {
        console.log(err.message);
    }
})

app.get("/api/v1/validSuppliers", async (req, res) => {
    try {
        const getSuppliers = await pool.query("SELECT * FROM suppliers WHERE hide = false ORDER BY id");
        res.json(getSuppliers.rows);
    } catch (err) {
        console.log(err.message);
    }
})

app.get("/api/v1/suppliers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getSuppliers = await pool.query("SELECT * FROM suppliers WHERE id = $1",[id]);
        res.json(getSuppliers.rows);
    } catch (err) {
        console.log(err.message);
    }
})

app.post("/api/v1/suppliers", async (req, res) => {
    try {
        const { name } = req.body;
        const newSupplier = await pool.query("INSERT INTO suppliers(name) VALUES($1) RETURNING *",[name]);
        res.json(newSupplier.rows);
    } catch (err) {
        console.error(err.message);
        res.json(err.message);
    }
})

app.put("/api/v1/suppliers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const updateSupplier = await pool.query("UPDATE suppliers SET name = $1 WHERE id = $2 RETURNING *",[name, id]);
        res.json(updateSupplier.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.delete("/api/v1/suppliers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM suppliers WHERE id = $1",[id]);
        res.json("Deleted Supplier Successfully");
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/suppliers/hide/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`CALL hideSupplier(${id})`);
        res.json("Hidden Supplier");
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/suppliers/show/:id", async(req, res) => {
    try {
        const { id } = req.params;
        await pool.query(`CALL showSupplier(${id})`);
        res.json("Supplier available");
    } catch (err) {
        console.error(err.message);
    }
})

//api's for suppliedItems table
app.get("/api/v1/suppliedItems", async (req, res) => {
    try {
        const getSuppliedItems = await pool.query("SELECT si.supplierId, s.name supplierName, si.ingredientId, i.name ingredientName, i.country country, si.restockValue FROM suppliedItems si INNER JOIN suppliers s on s.id = si.supplierId INNER JOIN ingredients i on i.id = si.ingredientId ORDER BY i.id, s.id");
        res.json(getSuppliedItems.rows);
    } catch (err) {
        console.log(err.message);
    }
})

app.get("/api/v1/suppliedItems/supplier/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getSuppliers = await pool.query("SELECT * FROM suppliedItems WHERE supplierId = $1",[id]);
        res.json(getSuppliers.rows);
    } catch (err) {
        console.log(err.message);
    }
})

app.get("/api/v1/suppliedItems/ingredient/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getSuppliers = await pool.query("SELECT * FROM suppliedItems JOIN suppliers ON supplierId=id WHERE ingredientid=$1",[id]);
        res.json(getSuppliers.rows);
    } catch (err) {
        console.log(err.message);
    }
})

app.post("/api/v1/suppliedItems", async (req, res) => {
    try {
        const { supplierId } = req.body;
        const { ingredientId } = req.body;
        const { restockValue } = req.body;
        const newSuppliedItem = await pool.query("INSERT INTO suppliedItems(supplierId, ingredientId, restockValue) VALUES($1, $2, $3) RETURNING *",[supplierId, ingredientId, restockValue]);
        res.json(newSuppliedItem.rows);
    } catch (err) {
        console.error(err.message);
        res.json(err.message);
    }
})

app.put("/api/v1/suppliedItems/:supplierId/:ingredientId", async (req, res) => {
    try {
        const { supplierId } = req.params;
        const { ingredientId } = req.params;
        const { stock } = req.body;
        const updateSuppliedItem = await pool.query("UPDATE suppliedItems SET restockValue = $1 WHERE supplierId = $2 and ingredientId = $3 RETURNING *",[stock, supplierId, ingredientId]);
        res.json(updateSuppliedItem.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.delete("/api/v1/suppliedItems/:supplierId/:ingredientId", async (req, res) => {
    try {
        const { supplierId } = req.params;
        const { ingredientId } = req.params;
        await pool.query("DELETE FROM suppliedItems WHERE supplierId = $1 and ingredientId = $2",[supplierId, ingredientId]);
        res.json("Deleted Supplied Item Successfully");
    } catch (err) {
        console.error(err.message);
    }
})

//api's for Orders table
app.get("/api/v1/orders", async (req, res) => {
    try {
        const getOrders = await pool.query("SELECT orderId, baseId, orderedAt, totalPrice, b.size baseSize FROM orders o JOIN bases b ON b.id = o.baseId ORDER BY o.orderedAt");
        res.json(getOrders.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/lastOrder", async (req, res) => {
    try {
        const getOrders = await pool.query("SELECT orderId, baseId, orderedAt, totalPrice, b.size baseSize, b.price basePrice FROM orders o JOIN bases b ON b.id = o.baseId ORDER BY o.orderedAt DESC LIMIT 1");
        res.json(getOrders.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/orders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const getOrders = await pool.query("SELECT orderId, baseId, orderedAt, totalPrice, b.size baseSize, b.price basePrice FROM orders o JOIN bases b ON b.id = o.baseId WHERE o.orderId = $1",[id]);
        res.json(getOrders.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.post("/api/v1/orders", async (req, res) => {
    try {
        const { baseId } = req.body;
        const { basePrice } = req.body;
        const newOrder = await pool.query("INSERT INTO orders(baseId, totalPrice) VALUES($1, $2) RETURNING *",[baseId, basePrice]);
        res.json(newOrder.rows);
    } catch (err) {
        console.error(err.message);
        res.json(err.message);
    }
})

app.put("/api/v1/orders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { baseId } = req.body;
        const { basePrice } = req.body;
        const { previousBasePrice } = req.body;
        const updateOrder = await pool.query("UPDATE orders SET baseId = $1, totalPrice = totalPrice-$2+$3 WHERE orderId = $4 RETURNING *",[baseId, previousBasePrice, basePrice, id]);
        res.json(updateOrder.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.delete("/api/v1/orders/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM orders WHERE orderId = $1", [id]);
        res.json("Deleted Order Successfully")
    } catch (err) {
        console.error(err.message);
    }
})

//api's to get and delete Order Logs based on order id and ingredient id
app.get("/api/v1/orderLogs/:order_id/:ingredient_id", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { ingredientId } = req.params;
        const ordersLog = await pool.query("SELECT * FROM orderLogs WHERE orderId = $1 AND ingredientId = $2", [orderId, ingredientId]);
        res.json(ordersLog.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.delete("/api/v1/orderLogs/:order_id/:ingredient_id", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { ingredientId } = req.params;
        await pool.query("DELETE FROM orderLogs WHERE orderId = $1 AND ingredientId = $2", [orderId, ingredientId]);
        res.json("Ingredient Deleted Successfully from Order");
    } catch (err) {
        console.error(err.message);
    }
})


//api's to get and delete orderLogs based on order id
app.get("/api/v1/orderLogs/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;
        const ordersLog = await pool.query("SELECT logid, orderId, ingredientId, quantity, o.price, i.name, i.country FROM orderLogs o JOIN ingredients i ON o.ingredientId = i.id and orderId = $1", [orderId]);
        res.json(ordersLog.rows);
    } catch (err) {
        console.error(err.message);
    }
})

app.delete("/api/v1/orderLogs/:logId", async (req, res) => {
    try {
        const { logId } = req.params;
        await pool.query("DELETE FROM orderLogs WHERE logId = $1", [logId]);
        res.json("OrderLogs Deleted Successfully");
    } catch (err) {
        console.error(err.message);
    }
})

//general functions
app.get("/api/v1/addPrice/:orderId/:price", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { price } = req.params;
        await pool.query("CALL add_price($1, $2)",[orderId, price]);
        res.json("Added price successfully");
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/decrementIngredient/:ingId/:q", async (req, res) => {
    try {
        const { ingId } = req.params;
        const { q } = req.params;
        await pool.query("CALL decrement_stock($1, $2)",[ingId, q]);
        res.json("Added ingredient successfully");
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/subPrice/:orderId/:price", async (req, res) => {
    try {
        const { orderId } = req.params;
        const { price } = req.params;
        await pool.query("CALL sub_price($1, $2)",[orderId, price]);
        res.json("Subtracted price successfully");
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/api/v1/incrementIngredient/:ingId/:q", async (req, res) => {
    try {
        const { ingId } = req.params;
        const { q } = req.params;
        await pool.query("CALL increment_stock($1, $2)",[ingId, q]);
        res.json("Deleted ingredient successfully");
    } catch (err) {
        console.error(err.message);
    }
})

app.listen(8080, () => {
    console.log("Server has started on port 8080")
});