<?php

$name = $_POST['name'];
$email = $_POST['email'];
$talkAbout = $_POST['talkAbout'];
$emailBody = $_POST['emailBody'];

$date = getdate();
$to = "jack.bashford42@gmail.com";
$email_subject = "$name wants to talk to you"
$email_body = "$emailBody \n \n Sent from cgs-jack-bashford.github.io at $date";
$headers = 

mail($to,$subject,$body);

 ?>
