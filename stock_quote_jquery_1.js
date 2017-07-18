window.portfolio = { symbols: [], total: 0.0 }

$(function() {
  $('#quote').on('submit', function(event) {
    event.preventDefault();
    var symbol = $("input[name='symbol']").val();
    getStockPrice(symbol);
  })

  $('body').on('click', '.fa-minus-circle', function(event) {
    event.preventDefault();
    var symbol = $($(event.target).closest('a')).data('symbol')
    $(event.target).parents("tr").remove();
    var index = window.portfolio.symbols.indexOf(symbol)
    if (index !== -1) {
      window.portfolio.symbols.splice(index, 1);
      $.getJSON( "https://ucexchange.herokuapp.com/stocks.json", function( stocks ) {
        for (var i = 0; i < stocks.length; ++i) {
          if (stocks[i].symbol === symbol) {
            window.portfolio.total -= parseFloat(stocks[i].rounded_price);
            $("#portfolio_value").text("$ " + window.portfolio.total.toFixed(2))
          }
        }
      });
    }
  });

  $('body').on('click', '.fa-plus-circle', function(event) {
    event.preventDefault();
    var symbol = $($(event.target).closest('a')).data('symbol')
    window.portfolio.symbols.push(symbol);
    $.getJSON( "https://ucexchange.herokuapp.com/stocks.json", function( stocks ) {
      for (var i = 0; i < stocks.length; ++i) {
        if (stocks[i].symbol === symbol) {
          var tr_element = $("<tr></tr>");
          var td1 = $('<td data-symbol="' + symbol + '">' + symbol + "</td>");
          var td2 = $("<td>" + stocks[i].rounded_price + "</td>");
          var minus_button = $('<td><a href="" data-symbol="'+ symbol + '" class="add"><i class="fa fa-lg fa-minus-circle"></i></a></td>');
          tr_element.append(td1);
          tr_element.append(td2);
          tr_element.append(minus_button);
          $('#portfolio tbody').append(tr_element);

          window.portfolio.total += parseFloat(stocks[i].rounded_price);
          $("#portfolio_value").text("$ " + window.portfolio.total.toFixed(2))
        }
      }
    });
  });

  $('#refresh_portfolio').on('click', function(event) {
    event.preventDefault();
    $('#portfolio tbody').html("");
    window.portfolio.total = 0.0;
    $.getJSON("https://ucexchange.herokuapp.com/stocks.json", function( stocks ) {
      for (var i = 0; i < stocks.length; ++i) {
        if (window.portfolio.symbols.indexOf(stocks[i].symbol) != -1) {
          window.portfolio.total += parseFloat(stocks[i].rounded_price);

          var tr_element = $("<tr></tr>");
          var td1 = $('<td data-symbol="' + stocks[i].symbol + '">' + stocks[i].symbol + "</td>");
          var td2 = $("<td>" + stocks[i].rounded_price + "</td>");
          var add_button = $('<td><a href="" data-symbol="'+ stocks[i].symbol + '" class="add"><i class="fa fa-lg fa-plus-circle"></i></a></td>');
          tr_element.append(td1);
          tr_element.append(td2);
          tr_element.append(add_button);
          $('#portfolio tbody').append(tr_element);
        }
      }
      $("#portfolio_value").text("$ " + window.portfolio.total.toFixed(2))

    });
  });

  $('#refresh_stocks').on('click', function(event) {
    $('#all_stocks tbody').html("");
    $.getJSON("https://ucexchange.herokuapp.com/stocks.json", function( stocks ) {
      for (var i = 0; i < stocks.length; ++i) {
        var tr_element = $("<tr></tr>");
        var td1 = $('<td data-symbol="' + stocks[i].symbol + '">' + stocks[i].symbol + "</td>");
        var td2 = $("<td>" + stocks[i].rounded_price + "</td>");
        var add_button = $('<td><a href="" data-symbol="'+ stocks[i].symbol + '" class="add"><i class="fa fa-lg fa-plus-circle"></i></a></td>');
        tr_element.append(td1);
        tr_element.append(td2);
        tr_element.append(add_button);
        $('#all_stocks tbody').append(tr_element);
      }
    });
  });
});

function showPrice(symbol, price) {
  $("#price").html("<h1>" + symbol + ": " + price);
};

function getStockPrice(symbol, displayer) {
  $.getJSON( "https://ucexchange.herokuapp.com/stocks.json", function( stocks ) {
    for (var i = 0; i < stocks.length; ++i) {
      if (stocks[i].symbol === symbol) {
        var h1 = $("<h1>" + stocks[i].symbol + ": " + stocks[i].rounded_price + "</h1>")
        var add_button = $(' <a href="" data-symbol="'+ stocks[i].symbol + '" class="add"><i class="fa fa-lg fa-plus-circle"></i></a>');
        h1.append(add_button);
        $("#price").html(h1);
      }
    }
  });
};
