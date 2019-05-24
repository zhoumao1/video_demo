$(function () {
	$.ajax({
		url: '../data.json',
		type: 'get',
		error: function (err) {
			if(err) console.log(err);;
		},
		success: function (ret) {
			console.table(ret);
			var tempCont = $('#movie-temp').html();
			var htmlText = _.template(tempCont);
			var NewHtml = htmlText({data: ret});
			$("#movie-row").html(NewHtml);
		}
	})
})
