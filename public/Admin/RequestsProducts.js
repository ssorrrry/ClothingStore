$(document).ready(function(){
    $.ajax({
        type: "POST",
        url: "/products",
        success: function(otvet){
            updateTable(otvet);
        },
        error: function(http, status, e)
        {
            console.log(http);
        }
    });

    $.ajax({
        type: "POST",
        url: "/category",
        success: function(data){
            let category = $("table[name=new_product]").find("select[name=category]");
            category.empty();
            for(let i = 0; i < data.length; i++)
            {
                category.append(`<option value="${data[i]['id']}">${data[i]['name']}</option>`);
            }
        },
        error: function(http, status, e)
        {
            console.log(http);
        }
    });

    
    $("input[name=create]").click(function(){
        let formCreate = $("table[name=new_product]");

        let title = formCreate.find("input[name=title]").val();
        formCreate.find("input[name=title]").val('');
        let description = formCreate.find("input[name=description]").val();
        formCreate.find("input[name=description]").val('');
        let color = formCreate.find("input[name=color]").val();
        formCreate.find("input[name=color]").val('');
        let image = formCreate.find("input[name=image]").val();
        formCreate.find("input[name=image]").val('');
        let price = formCreate.find("input[name=price]").val();
        formCreate.find("input[name=price]").val('');
        let category = formCreate.find("select[name=category]").val();
        formCreate.find("select[name=category]").val('');
        let article = formCreate.find("input[name=article]").val();
        formCreate.find("input[name=article]").val('');

        if (title && description && color && image && price && category && article) {
            let data = {
                title: title,
                description: description,
                color: color,
                image: image,
                price: price,
                category: category,
                article: article,
            };

            $.ajax({
                type: "POST",
                url: "/create_product",
                data: data,
                success: function(data){
                    if(data['result']){
                        let newRow = $("<tr>");
                        newRow.append(`<td class='td_product'><img src = ../${data['image']}></td>`);
                        newRow.append(`<td class='td_product'><input type='hidden' name='id' value='${data['id']}'><br>`);
                        newRow.append(`<input type='text' name='title' value='${data['title']}' class='input_text'><br><br>`);
                        newRow.append(`<textarea class='textarea' name='description'>${data['description']}</textarea></br>`);


                        let selectCategory = newRow.append(`<select name='category'></select><br>`);
                        categoryRequest(data['category'], selectCategory.find('select[name="category"]'));

                        newRow.append(`Цвет: <input type='text' name='color' value='${data['color']}' class='input_text'></br>`);
                        newRow.append(`Арт.: <input type='text' name='article' value='${data['article']}' class='input_text'></br>`);
                        newRow.append(`Путь до изображения: <input type='text' name='image' value='${data['image']}' class='input_text'></br>`);
                        newRow.append(`Цена: <input type='number' name='price' value='${data['price']}' class='input_number'></br></br>`);
                        newRow.append(`<input type='submit' name='update' value='Редактировать' class='submit-update'>`);
                        newRow.append(`<input type='submit' name='delete' value='Удалить' class='submit-delete'></td></tr>`);

                        $("#products").append(newRow);
                        
                        $("#log").text(data['answ']);
                    }
                    
                },
                error: function(http, status, e)
                {
                    console.log(http);
                }
            });
        } else {
            $("#log").text("Не все поля заполнены");
        }
    });
    

    $("#products").on("click", "input[name=delete]", function(){
        let tr = $(this).closest('tr');
        let id = tr.find('input[name=id]').val();

        let data = {
            id: id,
        };

        $.ajax({
            type: "POST",
            url: "/delete_product",
            data: data,
            success: function(data){
                if(data['result']){
                    $("#log").text(data['answ']);
                    tr.remove();
                }
            },
            error: function(http, status, e)
            {
                console.log(http);
            }
        });
    });

    $("#products").on("click", "input[name=update]", function()
    {
        let tr = $(this).closest('tr');
        let id = tr.find('input[name=id]').val();
        let title = tr.find('input[name=title]').val();
        let description = tr.find('textarea[name=description]').val();
        let color = tr.find('input[name=color]').val();
        let image = tr.find('input[name=image]').val();
        let price = tr.find('input[name=price]').val();
        let category = tr.find('select[name=category]').val();
        let article = tr.find('input[name=article]').val();

        console.log(id);

        let data = {
            status: 'update',
            id: id,
            title: title,
            description: description,
            color: color,
            image: image,
            price: price,
            category: category,
            article: article,
        };

        $.ajax({
            type: "POST",
            url: "/update_products",
            data: data,
            success: function(data){

                if(data['result']){
                    $("#log").text(data['answ']);
                    if(data['data']['image']){
                        tr.find("img").attr('src', `../${data['data']['image']}`);
                    }
                }
                else{
                    $("#log").text(data['err']);
                }
            },
            error: function(http, status, e)
            {
                console.log(http);
            }
        });

    });
});

function updateTable(data)
{
    for(let i = 0; i < data.length; i++)
    {
        let newRow = $("<tr>");
        newRow.append(`<td class='td_product'><img src = ../${data[i]['image']}></td>`);
        newRow.append(`<td class='td_product'><input type='hidden' name='id' value='${data [i]['id']}'><br>`);
        newRow.append(`<input type='text' name='title' value='${data[i]['title']}' class='input_text'><br><br>`);
        newRow.append(`<textarea class='textarea' name='description'>${data[i]['description']}</textarea></br>`);


        let selectCategory = newRow.append(`<select name='category'></select><br>`);
        categoryRequest(data[i]['id_category'], selectCategory.find('select[name="category"]'));

        newRow.append(`Цвет: <input type='text' name='color' value='${data[i]['color']}' class='input_text'></br>`);
        newRow.append(`Арт.: <input type='text' name='article' value='${data[i]['article']}' class='input_text'></br>`);
        newRow.append(`Путь до изображения: <input type='text' name='image' value='${data[i]['image']}' class='input_text'></br>`);
        newRow.append(`Цена: <input type='number' name='price' value='${data[i]['price']}' class='input_number'></br></br>`);
        newRow.append(`<input type='submit' name='update' value='Редактировать' class='submit-update'>`);
        newRow.append(`<input type='submit' name='delete' value='Удалить' class='submit-delete'></td></tr>`);

        $("#products").append(newRow);

    }
}

function categoryRequest(id, selectCategory)
{
    $.ajax({
        type: "POST",
        url: "/category",
        success: function(data){
            selectCategory.empty();
            for(let i = 0; i < data.length; i++)
            {
                let option;
                if (data[i]['id'] == id) {
                    option = `<option value="${data[i]['id']}" selected>${data[i]['name']}</option>`;
                }
                else{
                    option = `<option value="${data[i]['id']}">${data[i]['name']}</option>`;
                }
                selectCategory.append(option);
            }
        },
        error: function(http, status, e)
        {
            console.log(http);
        }
    });
}

