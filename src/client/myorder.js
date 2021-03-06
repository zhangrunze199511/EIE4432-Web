import $ from './common';
import '../../style/myorder.css';
const arrowSpan = '&nbsp <span class="caret"></span>'
let cuisine = '';
let uid = '';


function searchOrder(params) {
    const data = {
        "user_id":uid
    };
    $.post('/EIE4432-WEB/src/server/api/myorder.php',data, (data, status, xhr)=> {
        console.log(data);
        if(status === 'success') {
            const orders = data.orders;
            $('.grid').empty();
            if (orders.length === 0) {
                $('.grid').append('<h3 class="text-center">No order found</h3>');
                return;
            }
            orders.forEach(order => {
                console.log(order);
                // let cuisinesString = '';
                // order.cuisines.forEach(cuisine => {
                //     cuisinesString += (cuisine+' · ');
                // });
                // cuisinesString = cuisinesString.substr(0,cuisinesString.length-2)
                // const costNTimeString = order.average_cost + ' ' + order.start_time + ' - ' + order.end_time;

                $('.grid').append(`
                    <div class="infoblock-item " data-order_id="${order.order_id}">
                        <div style="display:inline-block ;position:relative">
                            <img class="infoblock-item-img" id="img-${order.order_id}" src=${order.thumbnail_image ? order.thumbnail_image : '../../public/no_image.jpg'} alt=${order.order_id} data-order_id="${order.order_id}"/>
                        </div>
                        <div class="infoblock-inner-text">
                            <p class="order-info">Restaurant Name: ${order.restaurant}</p>
                            <p class="order-info">Order Time: ${order.Ordertime}</p>
                            <p class="order-info order-status" data-order_id="${order.order_id}">Order Status: ${order.Orderstatus}</p>
                            <button class="btn btn-warning cancelbtn" data-order_id="${order.order_id}" value="Cancel">
                                <span class="glyphicon glyphicon-remove" aria-hidden="true">&nbsp</span>Cancel
                            </button>
                        </div>
                    </div>
                `);
                if(order.Orderstatus != 'waiting') {
                    $(`[data-order_id="${order.order_id}"].cancelbtn`).hide();
                }
            });



            $(".cancelbtn").click(decideOrder);

            console.log(orders);

        } else {
            console.log(status);
            console.log(data);
            console.log(xhr);
            alert('fail to load order information');

        } 
    
    }, 'json').fail(() => {
        alert('fail to load order information');

    });

}

function decideOrder(e){
    const tgt = e.currentTarget;
    const orderid = $(tgt).data("order_id");

    const data= {
        'order_id':orderid,
        'user_id':uid
    };
    console.log(data);
    $.post('/EIE4432-WEB/src/server/api/cancelOrder.php',data,(data,status)=>{
        if(status==="success"){
            $(`[data-order_id="${orderid}"].cancelbtn`).hide();
            $(`[data-order_id="${orderid}"].order-status`).text('Order Status: canceled');


            alert("Order has been cancelled successfully!")
        }
    },"json").fail(()=>{
        alert("111");
    });
}


$(() => {
    console.log('ready');
    uid = $('#uid').val();
    $('#logout-btn').click(()=> {
        $.cookie('uid', null);
        $.cookie('rid', null);
        $.cookie('uname', null);
        $.cookie('rname', null);
        window.location.href = "/EIE4432-WEB/src/server/login.php";
    });

    searchOrder();
});