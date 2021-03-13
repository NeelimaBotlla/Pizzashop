-- CREATE DATABASE AMD;

CREATE TABLE bases
(
    id  SERIAL PRIMARY KEY,
    size VARCHAR(20) UNIQUE NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0)
);

INSERT INTO bases (size, price) VALUES ('Regular', 1);
INSERT INTO bases (size, price) VALUES ('Medium', 2);
INSERT INTO bases (size, price) VALUES ('Large', 3);

CREATE TABLE ingredients(
    id SERIAL PRIMARY KEY,
    name VARCHAR(45) NOT NULL,
    price INTEGER NOT NULL CHECK (price >= 0),
    country VARCHAR(30) NOT NULL,
    stock INTEGER CHECK (stock >= 0),
    hide BOOLEAN DEFAULT false,
    UNIQUE (name, country)
);

INSERT INTO ingredients (name, price, country, stock) VALUES ('Tomato',3,'Germany',50);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Panner',8,'India',25);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Tomato',4,'Brazil',30);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Capsicum',2,'India',40);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Potato',3,'Germany',30);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Tomato',5,'India',30);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Sun dried Tomatoes',4,'India',64);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Olives',4,'Paris',30);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Capsicum',1,'Germany',60);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Pepper Powder',4,'India',20);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Chicken',2,'Germany',75);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Capsicum',1,'Italy',20);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Chicken',3,'Spain',25);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Paprika',4,'Spain',50);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Sweet Corn',1,'Germany',45);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Chicken',8,'Switzerland',30);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Sweet Corn',2,'Ireland',10);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Pepper powder',1,'Germany',75);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Onion',1,'Germany',80);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Sweet Corn',3,'Poland',15);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Onion',1,'UK',65);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Chilli flakes',4,'India',40);
INSERT INTO ingredients (name, price, country, stock) VALUES ('Onion',1,'Russia',45);

CREATE OR REPLACE FUNCTION hideRow() RETURNS TRIGGER AS
$BODY$
BEGIN
    IF NEW.hide <> OLD.hide THEN
        NEW.hide := NEW.hide;
    ELSIF NEW.stock = 0 THEN
        NEW.hide := TRUE;
    ELSIF NEW.stock > 0 AND OLD.stock = 0 THEN
        NEW.hide := FALSE;
    ELSE
        OLD.hide := NULL;
    END IF;
    RETURN NEW;
END;
$BODY$
LANGUAGE 'plpgsql';

CREATE TRIGGER hiding BEFORE UPDATE ON ingredients FOR EACH ROW EXECUTE PROCEDURE hideRow();

CREATE OR REPLACE PROCEDURE hideIngredient(
    ingredientId INTEGER
)
LANGUAGE PLPGSQL AS $$
BEGIN
    UPDATE ingredients 
    SET hide = TRUE 
    WHERE id = ingredientId;
    commit;
END;
$$;

CREATE OR REPLACE PROCEDURE showIngredient(
    ingredientId INTEGER
)
LANGUAGE PLPGSQL AS $$
BEGIN
    UPDATE ingredients SET hide = FALSE WHERE id = ingredientId;
END;
$$;

CREATE TABLE suppliers(
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) UNIQUE NOT NULL,
    hide BOOLEAN DEFAULT false
);

INSERT INTO suppliers (name) VALUES ('Vijay');
INSERT INTO suppliers (name) VALUES ('Jasper');
INSERT INTO suppliers (name) VALUES ('John Snow');
INSERT INTO suppliers (name) VALUES ('Arya');
INSERT INTO suppliers (name) VALUES ('Sansa');

CREATE OR REPLACE PROCEDURE hideSupplier(
    supplierId INTEGER
)
LANGUAGE PLPGSQL AS $$
BEGIN
    UPDATE suppliers SET hide = TRUE WHERE id = supplierId;
END;
$$;

CREATE OR REPLACE PROCEDURE showSupplier(
    supplierId INTEGER
)
LANGUAGE PLPGSQL AS $$
BEGIN
    UPDATE suppliers SET hide = FALSE WHERE id = supplierId;
END;
$$;

CREATE TABLE suppliedItems(
    supplierId INTEGER NOT NULL,
    ingredientId INTEGER NOT NULL,
    restockValue INTEGER CHECK (restockValue >= 0),
    PRIMARY KEY (supplierId, ingredientId),
    CONSTRAINT fk_supp_id FOREIGN KEY (supplierId) REFERENCES suppliers(id) ON DELETE CASCADE,
    CONSTRAINT fk_ingre_id FOREIGN KEY (ingredientId) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- SELECT si.supplierId, s.name supplierName, si.ingredientId, i.name ingredientName, i.country country, si.restockValue, s.hide supplierHidden, i.hide ingredientHide FROM suppliedItems si INNER JOIN 
-- suppliers s on s.id = si.supplierId INNER JOIN ingredients i on i.id = si.ingredientId ORDER BY i.id;

INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (1,2,12);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (1,4,11);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (1,5,6);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (1,6,15);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (1,10,26);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (1,21,51);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (2,2,32);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (2,7,3);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (2,15,25);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (2,16,70);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (2,20,61);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (2,21,43);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (3,3,39);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (3,5,29);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (3,9,36);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (3,12,31);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (3,19,20);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (4,9,50);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (4,11,35);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (4,14,40);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (4,18,12);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (5,7,15);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (5,13,47);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (5,17,7);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (5,19,34);
INSERT INTO suppliedItems (supplierId, ingredientId, restockValue) VALUES (5,21,50);

-- SELECT * FROM pg_available_extensions;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE orders(
    orderId uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
    baseId INTEGER NOT NULL,
    orderedAt TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    totalPrice INTEGER CHECK (totalPrice >= 0),
    CONSTRAINT fk_base_id FOREIGN KEY (baseId) REFERENCES bases(id) ON DELETE CASCADE
);

-- SELECT o.orderId orderId, o.baseId baseId, orderedAt, totalPrice, b.size baseSize FROM orders o JOIN bases b ON b.id = o.baseId ORDER BY o.orderedAt;

CREATE TABLE orderLogs(
    logId SERIAL PRIMARY KEY,
    orderId uuid NOT NULL,
    ingredientId INTEGER NOT NULL,
    quantity INTEGER CHECK (quantity >= 1),
    price INTEGER NOT NULL CHECK (price >= 0),
    CONSTRAINT fk_orderId FOREIGN KEY (orderId) REFERENCES orders(orderId) ON DELETE CASCADE,
    CONSTRAINT fk_ingredient FOREIGN KEY (ingredientId) REFERENCES ingredients(id) ON DELETE CASCADE
);

-- SELECT logid, orderId, ingredientId, quantity, o.price, i.name, i.country FROM orderLogs o JOIN ingredients i ON o.ingredientId = i.id;

CREATE OR REPLACE PROCEDURE decrement_stock(
    ingredientId INTEGER,
    quantity INTEGER
)
LANGUAGE PLPGSQL AS $$
BEGIN
    UPDATE ingredients SET stock = stock - quantity WHERE id = ingredientId AND stock >= quantity;
    commit;
END;
$$;

CREATE OR REPLACE PROCEDURE increment_stock(
    ingredientId INTEGER,
    quantity INTEGER
)
LANGUAGE PLPGSQL AS $$
BEGIN
    UPDATE ingredients SET stock = stock + quantity WHERE id = ingredientId;
    commit;
END;
$$;

CREATE OR REPLACE PROCEDURE add_price(
    id uuid,
    ingredientId INTEGER,
    price INTEGER
)
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    UPDATE orders SET totalPrice = totalPrice + price WHERE orderId = id;
    commit;
END;
$$;

CREATE OR REPLACE PROCEDURE sub_price(
    id uuid,
    price INTEGER
)
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    UPDATE orders SET totalPrice = totalPrice - price WHERE orderId = id;
    commit;
END;
$$;

CREATE OR REPLACE FUNCTION order_log()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
	IF NEW.stock < OLD.stock THEN
		 INSERT INTO orderLogs(orderId,ingredientId,quantity,price)
		 VALUES((SELECT orderId FROM orders ORDER BY orderedAt DESC LIMIT 1),OLD.id,(OLD.stock-NEW.stock),(OLD.price * (OLD.stock-NEW.stock)));
	END IF;
	RETURN NEW;
END;
$$;

CREATE TRIGGER order_logs
  BEFORE UPDATE
  ON ingredients
  FOR EACH ROW
EXECUTE PROCEDURE order_log();

SELECT * FROM bases;
SELECT * FROM ingredients;
SELECT * FROM suppliers;
SELECT * FROM suppliedItems;
SELECT * FROM orders;
SELECT * FROM orderLogs;

-- DROP TABLE orderLogs;
-- DROP TABLE orders;
-- DROP TABLE suppliedItems;
-- DROP TABLE suppliers;
-- DROP TABLE ingredients;
-- DROP TABLE bases;
