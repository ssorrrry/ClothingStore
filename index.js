const express = require("express");
let session = require('express-session');
const path = require("path");
const mysql = require("mysql2");
const body_parser = require("body-parser");
const ejs = require("ejs");

const urlencodedParser = body_parser.urlencoded({
    extended: false
});

const app = express();
app.set('view engine','ejs');
app.set('views','views');

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: '1foenfh',
    cookie: {maxAge: 90000},
    resave: true,
    saveUninitialized: false
}));

const connection = mysql.createConnection({
    host: "127.0.0.1",
    user: 'root',
    database: 'lime',
    password: ''
});

connection.connect(function(err){
    if(err){
        return console.log("Ошибка");
    }
    else{
        return console.log("Соединение с БД установлено");
    }
});

app.get("/", function(req, res){
    res.status(200).set('Content-Type', 'text/html').sendFile(path.join(__dirname, "public/Lime.html"));
});

app.get("/Registration", function(req, res){
    res.status(200).set('Content-Type', 'text/html').sendFile(path.join(__dirname, "public/Registration.html"));
});

app.post("/log_in", urlencodedParser, function(req, res){
    let login = req.body.login;
    let password = req.body.password;

    connection.query("SELECT id, status FROM users WHERE login = ? AND password = ?", [login, password], function(err, result){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о пользователях");
            return;
        }
        if(result.length != 0){
            req.session.user = result[0].id;
            if(result[0].status == 'user'){
                res.status(200).set('Content-Type', 'application/json').send({
                    'result': true,
                    'data': "/"
                });
            }
            else{
                res.status(200).set('Content-Type', 'application/json').send({
                    'result': true,
                    'data': "/Admin"
                });
            }
        }
        else{
            res.status(200).set('Content-Type', 'application/json').send({
                'result': false,
                'data': "Неверный логин или пароль"
            });
        }
    });    
});

app.post("/register", urlencodedParser, function(req, res){
    let login = req.body.login;
    let password = req.body.password;

    connection.query("SELECT * FROM users WHERE login = ?", [login], function(err, result){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о пользователях");
            return;
        }
        if(result.length != 0){
            res.status(200).set('Content-Type', 'text/plain').send("Пользователь с таким логином уже существует");
        }
        else{
            connection.query("INSERT INTO users (id, login, password, status) VALUES (NULL, ?, ?, 'user')", [login, password], function(err, result){
                res.status(200).set('Content-Type', 'text/plain').send("Вы успешно зарегистрировались! Введите свои данные для входа");
            });
        }

    });
});

app.get("/log_out", function(req, res){
    req.session.destroy(function(err){
        if(err){
            console.log("Ошибка при завешении сессии");
        }
        else{
            res.status(200).set('Content-Type', 'text/plain').redirect("/");
        }
    }); 
});

app.post("/check_session", urlencodedParser, function(req, res){
    let isExists;
    if(req.session.user){
        isExists = true;
    }
    else{
        isExists = false;
    }
    res.status(200).set('Content-Type', 'application/json').send(isExists);
});

app.get("/ProductCatalog", function(req, res){
    connection.query("SELECT title, image, price, article, id_category FROM products", function(err, content){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о товарах");
            return;
        }
        res.status(200).set('Content-Type', 'text/html').render("ProductCatalog.ejs",{
            'products': content
        });
    });
});

app.post("/category", urlencodedParser,function(req, res){
    connection.query("SELECT * FROM category", function(err, content){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о категориях");
            return;
        }
        res.status(200).set('Content-Type', 'application/json').send(content);
    });
});


// //Фильтрация товаров

// app.post("/productsFilter", urlencodedParser,function(req, res){
//     let id_category = req.body.id_category;
//     if(id_category > 0){
//         connection.query("SELECT title, image, price, article FROM products WHERE id_category = ?", [id_category],function(err, content){
//             if (err) {
//                 res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о категориях");
//                 return;
//             }
//             res.status(200).set('Content-Type', 'application/json').send(content);
//         });
//     }
//     else{
//         connection.query("SELECT title, image, price, article FROM products", function(err, content){
//             if (err) {
//                 res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о категориях");
//                 return;
//             }
//             res.status(200).set('Content-Type', 'application/json').send(content);
//         });
//     }
// });

app.get("/ProductCatalog/Product/:article", function(req, res){
    let article = req.params.article;
    connection.query("SELECT * FROM products WHERE article = ?", [article], function(err, content){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о категориях");
            return;
        }
        if(content.length != 0){
            res.status(200).set('Content-Type', 'text/html').render("Product.ejs",{
                'product': content[0]
            });
        }
    });
});

app.post("/add_basket", urlencodedParser, function(req, res){
    let id_product = req.body.id_product;
    let size = req.body.size;

    if(req.session.user){
        if(!req.session.basket){
            req.session.basket = [];
        }
        let existingItemIndex = req.session.basket.findIndex(item => item.id_product === id_product && item.size === size);

        if(existingItemIndex !== -1){
            req.session.basket[existingItemIndex].quantity += 1;
        }
        else{
            req.session.basket.push({
                'id_product': id_product,
                'size': size,
                'quantity': 1
            }); 
        }
        
        res.status(200).set('Content-Type', 'text/plain').send("Товар добавлен в корзину");
    }
    else{
        res.status(200).set('Content-Type', 'text/plain').send("Вы не авторизованы");
    }
});

app.get("/Basket", function(req, res){
    if(req.session.basket && req.session.basket.length > 0){
        let productIds = req.session.basket.map(function(item){
            return parseInt(item.id_product);
        });
        connection.query("SELECT id, title, price, image FROM products WHERE id IN (?)", [productIds], function(err, result){
            if (err) {
                res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о товарах");
                return;
            }
            let productMap = {};
            result.forEach(function(product) {
                productMap[product.id] = product;
            });

            let productsInBasket = req.session.basket.map(function(item) {
                let productId = parseInt(item.id_product);
                let productInfo = productMap[productId];

                if(productInfo) {
                    return {
                        id: productId,
                        title: productInfo.title,
                        price: productInfo.price,
                        image: productInfo.image,
                        size: item.size,
                        quantity: item.quantity
                    };
                } else {
                    return {};
                }
            });

            res.status(200).set('Content-Type', 'text/html').render("Basket.ejs",{
                'products': productsInBasket
            });
        });
    }
    else{
        res.status(200).set('Content-Type', 'text/html').render("Basket.ejs",{
            'products': []
        });
    }
});

app.post("/delete_pr_basket", urlencodedParser, function(req, res){
    let id = req.body.id;
    let size = req.body.size;

    let existingItemIndex = req.session.basket.findIndex(item => item.id_product === id && item.size === size);

    if(existingItemIndex !== -1){
        req.session.basket.splice(existingItemIndex, 1);
        res.status(200).set('Content-Type', 'application/json').send({
            result: true
        });
    }

    console.log(req.session.basket);
});

app.post("/update_pr_basket", urlencodedParser, function(req, res){
    let id = req.body.id;
    let size = req.body.size;
    let quantity = req.body.quantity;

    let existingItemIndex = req.session.basket.findIndex(item => item.id_product === id && item.size === size);

    if(existingItemIndex !== -1){
        req.session.basket[existingItemIndex].quantity = quantity;
        res.status(200).set('Content-Type', 'application/json').send({
            result: true
        });
    }
});

app.post("/clear_basket", urlencodedParser, function(req, res){
    req.session.basket = null;
    res.status(200).set('Content-Type', 'application/json').send({
        result: true
    });
});

app.get("/BuyForm", function(req, res){
    res.status(200).set('Content-Type', 'text/html').sendFile(path.join(__dirname, "public/BuyForm.html"));
});
app.post("/buy", urlencodedParser, function(req, res){
    let name = req.body.name;
    let telephone = req.body.telephone;
    let method_obtaining = req.body.method_obtaining;
    let method_payment = req.body.method_payment;

    let promises = [];

    for(let i = 0; i < req.session.basket.length; i++){
        let promise = new Promise((resolve, reject) => {
            connection.query("INSERT INTO orders (id, name, telephone, method_obtaining, method_payment, id_product, size, quantity) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)", [name, telephone, method_obtaining, method_payment, req.session.basket[i].id_product, req.session.basket[i].size, req.session.basket[i].quantity], function(err, result){
                if (err) {
                    reject(err);
                } else {
                    req.session.basket[i] = null;
                    resolve();
                }
            });
        });
        promises.push(promise);
    }

    Promise.all(promises)
    .then(() => {
        req.session.basket = [];
        console.log(req.session.basket);
        res.status(200).set('Content-Type', 'application/json').send({
            'result': true,
            'answ': "Заказ успешно оформлен!"
        });
    })
    .catch(error => {
        console.error("Ошибка", error);
        res.status(500).set('Content-Type', 'application/json').send({
            result: false,
            error: "При оформлении заказа произошла ошибка"
        });
    });
});

app.get("/Admin", function(req, res){
    res.status(200).set('Content-Type', 'text/html').sendFile(path.join(__dirname, "public/Admin/Admin.html"));
});

app.post("/create_category", urlencodedParser, function(req, res){
    let name = req.body.name;

    connection.query("SELECT * FROM category WHERE name = ?", [name], function(err, result){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о категориях");
            return;
        }
        if(result.length == 0){
            connection.query("INSERT INTO category (id, name) VALUES (NULL, ?)", [name], function(error, otvet){
                if (error) {
                    res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о товарах");
                    return;
                }
                res.status(200).set('Content-Type', 'application/json').send({
                    'result': true,
                    'name': name,
                    'id': otvet.insertId,
                    'answ': "Запись создана"
                });
            });
        }
        else{
            res.status(200).set('Content-Type', 'application/json').send({
                'result': false,
                'err': "Запись с таким именем уже существует"
            });
        }
    });
});

app.post("/delete_category", urlencodedParser, function(req, res){
    let id = req.body.id;
    
    connection.query("DELETE FROM category WHERE id = ?", [id], function(err, result){
        if(err){
            res.status(200).set('Content-Type', 'application/json').send({
                'result': false
            });
        }
        else{
            res.status(200).set('Content-Type', 'application/json').send({
                'result': true,
                'answ': "Запись удалена"
            });
        }
    });
});

app.post("/update_category", urlencodedParser, function(req, res){
    let id = req.body.id;
    let new_name = req.body.name;

    connection.query("SELECT * FROM category WHERE id = ?", [id], function(err, result){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о категории");
            return;
        }
        if(result[0].name == new_name){
            res.status(200).set('Content-Type', 'application/json').send({
                "result": false,
                'err': "Измените название"
            });
        }
        else{
            connection.query("SELECT * FROM category WHERE name = ?", [new_name], function(error, otvet){
                if (error) {
                    res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о категории");
                    return;
                }
                if(otvet.length == 0){
                    connection.query("UPDATE category SET name = ? WHERE id = ?", [new_name, id], function(oshibka, data){
                        if (oshibka) {
                            res.status(500).set('Content-Type', 'text/plain').send("Ошибка изменения категории");
                            return;
                        }
                        res.status(200).set('Content-Type', 'application/json').send({
                            'result': true,
                            'answ': "Запись изменена"
                        });
                    });
                }
                else{
                    res.status(200).set('Content-Type', 'application/json').send({
                        'result': false,
                        'err': "Запись с таким именем уже существует"
                    });
                }
            });
        }
    });
});

app.post("/products", urlencodedParser, function(req, res){
    connection.query("SELECT * FROM products", function(err, content){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о товарах");
            return;
        }
        res.status(200).set('Content-Type', 'application/json').send(content);
    });
});
app.post("/create_product", urlencodedParser, function(req, res){
    let title = req.body.title;
    let description = req.body.description;
    let color = req.body.color;
    let image = req.body.image;
    let price = req.body.price;
    let category = req.body.category;
    let article = req.body.article;

    connection.query("INSERT INTO products (id, title, description, color, image, price, id_category, article) VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)", [title, description, color, image, price, category, article], function(err, result){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка добавления товара");
            return;
        }
        res.status(200).set('Content-Type', 'application/json').send({
            'result': true,
            'answ': "Запись добавлена",
            'id': result.insertId,
            'title': title,
            'description': description,
            'color': color,
            'image': image,
            'price': price,
            'category': category,
            'article': article
        });
    });
});

app.post("/delete_product", urlencodedParser, function(req, res){
    let id = req.body.id;

    connection.query("DELETE FROM products WHERE id = ?", [id], function(err, result){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка удаления товара");
            return;
        }
        res.status(200).set('Content-Type', 'application/json').send({
            'result': true,
            'answ': "Запись удалена"
        });
    });
});

app.post("/update_products", urlencodedParser, function(req, res){
    let id = req.body.id;
    let title = req.body.title;
    let description = req.body.description;
    let color = req.body.color;
    let image = req.body.image;
    let price = req.body.price;
    let category = req.body.category;
    let article = req.body.article;

    connection.query("SELECT * FROM products WHERE id = ?", [id], function(err, result){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о товарe");
            return;
        }
        let query = 'UPDATE products SET';
        let data = {};
        if(title != result[0].title){
            query += ` title = ?,`;
            data['title'] = title;
        }
        if(description != result[0].description){
            query += ` description = ?,`;
            data['description'] = description;
        }
        if(color != result[0].color){
            query += ` color = ?,`;
            data['color'] = color;
        }
        if(image != result[0].image){
            query += ` image = ?,`;
            data['image'] = image;
        }
        if(price != result[0].price){
            query += ` price = ?,`;
            data['price'] = price;
        }
        if(category != result[0].id_category){
            query += ` id_category = ?,`;
            data['category'] = category;
        }
        if(article != result[0].article){
            query += ` article = ?,`;
            data['article'] = article;
        }
        query = query.slice(0, -1);
        query += ` WHERE id = ?`;
        if(Object.keys(data).length > 0){
            data['id'] = id;
            connection.query(query, Object.values(data), function(error, otvet){
                if (error) {
                    res.status(500).set('Content-Type', 'text/plain').send("Ошибка изменения информации о товаре");
                    return;
                }
                res.status(200).set('Content-Type', 'application/json').send({
                    'result': true,
                    'data': data,
                    'answ': "Запись изменена"
                });
            });
        }
        else{
            res.status(200).set('Content-Type', 'application/json').send({
                'result': false,
                'err': "Внесите изменения"
            });
        }
        
    });
});

app.post("/orders", urlencodedParser, function(req, res){
    connection.query("SELECT * FROM orders", function(err, result){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о заках");
            return;
        }
        res.status(200).set('Content-Type', 'application/json').send(result);
    });
});

app.post("/delete_orders", urlencodedParser, function(req, res){
    let id = req.body.id;

    connection.query("DELETE FROM orders WHERE id = ?", [id], function(err, result){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка удаления заказа");
            return;
        }
        res.status(200).set('Content-Type', 'application/json').send({
            'result': true,
            'answ': "Запись удалена"
        });
    });
});

app.post("/update_orders", urlencodedParser, function(req, res){
    let id = req.body.id;
    let method_obtaining = req.body.method_obtaining;
    let method_payment = req.body.method_payment;
    let product = req.body.product;
    let size = req.body.size;
    let quantity = req.body.quantity;

    connection.query("SELECT * FROM orders WHERE id = ?", [id], function(err, result){
        if (err) {
            res.status(500).set('Content-Type', 'text/plain').send("Ошибка чтения информации о заказе");
            return;
        }
        let query = 'UPDATE orders SET';
        let data = {};
        if(method_obtaining != result[0].method_obtaining){
            query += ` method_obtaining = ?,`;
            data['method_obtaining'] = method_obtaining;
        }
        if(method_payment != result[0].method_payment){
            query += ` method_payment = ?,`;
            data['method_payment'] = method_payment;
        }
        if(product != result[0].id_product){
            query += ` id_product = ?,`;
            data['product'] = product;
        }
        if(size != result[0].size){
            query += ` size = ?,`;
            data['size'] = size;
        }
        if(quantity != result[0].quantity){
            query += ` quantity = ?,`;
            data['quantity'] = quantity;
        }
        query = query.slice(0, -1);
        query += ` WHERE id = ?`;

        if(Object.keys(data).length > 0){
            data['id'] = id;
            connection.query(query, Object.values(data), function(error, otvet){
                if (error) {
                    res.status(500).set('Content-Type', 'text/plain').send("Ошибка изменения информации о заказе");
                    return;
                }
                res.status(200).set('Content-Type', 'application/json').send({
                    'result': true,
                    'data': data,
                    'answ': "Запись изменена"
                });
            });
        }
        else{
            res.status(200).set('Content-Type', 'application/json').send({
                'result': false,
                'err': "Внесите изменения"
            });
        }
        
    });

});

app.use(function(req, res){
    res.status(404).set('Content-Type', 'text/html').sendFile(path.join(__dirname, "public/Error.html"));
});

app.listen(3000, function(){
    console.log("Приложение запущено");
});
