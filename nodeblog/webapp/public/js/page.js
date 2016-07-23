$(document).ready(function() {

    $(".button-collapse").sideNav();
    $('.parallax').parallax();
    var url = window.location;
    $('.fb-share-button').attr('data-href', url);


});
$(window).on("load", function() {
    $('.pre-loader').hide();
});



function resumeRedirect() {
    console.log("hello");
}

function submitContact() {
    var values = {};
    values.name = $('#name').val();
    values.email = $('#useremail').val()
    values.message = $('#message').val();
    values.talk = [];
    var checkArray = ['job', 'project', 'startup', 'gameofthrones', 'multiverse', 'date', 'other'];
    for (var i in checkArray) {
        if ($('#' + checkArray[i]).is(":checked")) {
            values.talk.push(checkArray[i]);
        }
    }
    if (values.email) {
        $.ajax({
            url: "/contact/submit",
            type: "post",
            data: (values),
            success: function(response) {
                console.log(response)

                Materialize.toast('Sending!', 2000, 'rounded');

                setTimeout(function() {

                        Materialize.toast('Sent!', 2000, 'rounded');

                    },
                    2000);
                setTimeout(function() {
                        window.location.reload();


                    },
                    3000);



            },
            error: function(jqXHR, textStatus, errorThrown) {
                    console.log(textStatus, errorThrown);
                    window.location.href = window.location.href;
                }
                //    $('#name').val(null);
                // $('#email').val('')
                // $('#message').val('');


        });
    }


}


function getResume() {
    $('#modal1').openModal();



}