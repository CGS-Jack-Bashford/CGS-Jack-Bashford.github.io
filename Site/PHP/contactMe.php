<html>

    <head>

        <title>Submitted results</title>
        <meta http-equiv="refresh" content="5; url(../../index.html)" />

    </head>

    <body>

        <p>Thanks! I'll reply ASAP, but for now you'll be redirected back to the main page.</p>

    </body>

</html>

<?php

$name = $_POST['name'];
$email = $_POST['email'];
$talkAbout = $_POST['talkAbout'];
$emailBody = $_POST['emailBody'];

$date = getdate();
$to = "jack.bashford42@gmail.com";
$email_subject = "$name wants to talk to you"
$email_body = "$emailBody \n \n Sent from cgs-jack-bashford.github.io at $date";
$headers = "From: $to";

mail($to,$subject,$body);

 ?>
