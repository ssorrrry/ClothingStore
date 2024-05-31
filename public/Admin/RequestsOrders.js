$(document).ready(function(){
    $.ajax({
        type: "POST",
        url: "/orders",
        success: function(otvet){
            console.log(otvet);
            updateTable(otvet);
        },
        error: function(http, status, e)
        {
            console.log(http);
        }
    });

    $("#orders").on("click", "input[name=delete]", function(){
        let tr = $(this).closest('tr');
        id = tr.find("input[name=id]").val();
        
        let data = {
            id: id,
        };

        $.ajax({
            type: "POST",
            url: "/delete_orders",
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

    $("#orders").on("click", "input[name=update]", function(){
        let tr = $(this).closest('tr');
        let id = tr.find("input[name=id]").val();
        let method_obtaining = tr.find("select[name=method_obtaining]").val();
        let method_payment = tr.find("select[name=method_payment]").val();
        let product = tr.find("select[name=product]").val();
        let size = tr.find("select[name=size]").val();
        let quantity = tr.find("input[name=quantity]").val();

        let data = {
            id: id,
            method_obtaining: method_obtaining,
            method_payment: method_payment,
            product: product,
            size: size,
            quantity: quantity
        };

        $.ajax({
            type: "POST",
            url: "/update_orders",
            data: data,
            success: function(data){
                if(data['result']){
                    $("#log").text(data['answ']);
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
        newRow.append(`<td class='order_table'><input type='hidden' name='id' value='${data[i]['id']}'></td>`);
        newRow.append(`<td class='order_table'> ${data[i]['name']} </td>`);
        newRow.append(`<td class='order_table'> ${data[i]['telephone']} </td>`);
        newRow.append(`<td class='order_table'><select name='method_obtaining'>
                            <option ${data[i]['method_obtaining'] === 'Доставка' ? 'selected' : ''}>Доставка</option>
                            <option ${data[i]['method_obtaining'] === 'Самовывоз' ? 'selected' : ''}>Самовывоз</option>
                            </select></td>`);
        newRow.append(`<td class='order_table'><select name='method_payment'>
                            <option ${data[i]['method_payment'] === 'Карта' ? 'selected' : ''}>Карта</option>
                            <option ${data[i]['method_payment'] === 'Наличные' ? 'selected' : ''}>Наличные</option>
                        </select></td>`);

        let selectProduct = newRow.append(`<td class='order_table'><select name='product'></select></td>`);
        productRequest(data[i]['id_product'], selectProduct.find("select[name=product]"));

        newRow.append(`<td class='order_table'><select name='size'>
                            <option ${data[i]['size'] === 'S' ? 'selected' : ''}>S</option>
                            <option ${data[i]['size'] === 'M' ? 'selected' : ''}>M</option>
                            <option ${data[i]['size'] === 'L' ? 'selected' : ''}>L</option>
                        </select></td>`);
        newRow.append(`<td class='order_table'><input type='number' name='quantity' value='${data[i]['quantity']}' class='input_number'></td>`);
        newRow.append(`<td class='order_table'><input type='submit' value='Редактировать' name='update' class='submit-update'></td>`);
        newRow.append(`<td class='order_table'><input type='submit' value='Удалить' name='delete' class='submit-delete'></td>`);

        $("#orders").append(newRow);
    }
}

function productRequest(id, selectProduct)
{
    $.ajax({
        type: "POST",
        url: "/products",
        success: function(data){
            selectProduct.empty();
            for(let i = 0; i < data.length; i++)
            {
                let option;
                if (data[i]['id'] == id) {
                    option = `<option value="${data[i]['id']}" selected>${data[i]['title']}</option>`;
                }
                else{
                    option = `<option value="${data[i]['id']}">${data[i]['title']}</option>`;
                }
                selectProduct.append(option);
            }
        },
        error: function(http, status, e)
        {
            console.log(http);
        }
    });
}

