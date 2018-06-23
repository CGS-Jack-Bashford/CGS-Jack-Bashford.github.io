<?php

$name = $_POST['name'];
$email = $_POST['email'];
$talkAbout = $_POST['talkAbout'];
$emailBody = $_POST['emailBody'];

$to = "jack.bashford42@gmail.com";
$email_subject = "$name wants to talk to you"
$email_body = "$emailBody \n \n Sent from cgs-jack-bashford.github.io at a time.";
$headers = "From: $to";

mail($to,$subject,$body);

echo "Thanks!";
header('Location:https://cgs-jack-bashford.github.io');

 ?>
