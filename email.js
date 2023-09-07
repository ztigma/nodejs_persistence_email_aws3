var nodemailer = require('nodemailer');
const EMAIL_SERVER = process.env['EMAIL_SERVER'];
const EMAIL_PORT = process.env['EMAIL_PORT'];

const EMAIL_USER = process.env['EMAIL_USER'];
const EMAIL_PASS = process.env['EMAIL_PASS'];

var transporter = nodemailer.createTransport
(
  	{//ionos
  		host: EMAIL_SERVER
		,
 		port: EMAIL_PORT
   		,
	 	auth:
   		{
	 		user: EMAIL_USER
			,
   			pass: EMAIL_PASS
		}
	}
);
transporter.verify
(
	function(error, success) 
	{
		console.log('VERIFY:');
		if (error)
		{
			console.log(error);
		} 
		else
		{
			console.log('Email Servers are ready to take our messages.');
		}
	}
);
var mailOptions =
{
	from: 'youremail@gmail.com',
	to: 'myfriend@yahoo.com',
	subject: 'Sending Email using Node.js',
	text: 'That was easy!'
};

class EmailOptions 
{
	constructor(n) 
	{
		this.from = EMAIL_USER;
		this.to = n.to;
		this.subject = n.title ? n.title : 'QuickCar Correo de confirmacion';
		this.html = n.text;
	}
}
String.prototype.CONFIRMATION_EMAIL_TEXT = function() 
{
	return `
	<table
	style="
	width: 60vmax; padding: 1vmax; margin: auto;
	border-collapse: collapse; text-align: center;
	background-color: #ecf0f1;
	">
	<tbody>
 	<tr>
	<td>
		<div 
  		style=
		"
  			width:100%
	 		;
			height:20vh
   			;
	  		background:url('__img__') center center / contain no-repeat
	 		;
	 	"
  		>
  		</div>
	</td>
	</tr>
	<tr>
	<td>
		<div 
  		style=
		"
  			width:auto
	 		;
			height:auto
   			;
	  		font-size:40px
	 		;
			font-weight:bold
   			;
	  		color:gray
	 		;
	 	"
  		>
			QuickCar
  		</div>
	</td>
	</tr>
	<tr>
	<td>
		Este es un correo de pruebas de confirmacion de registro enviado por un servidor de QuickCar.
  		<a href="__href__">
			Confirmar Correo
  		</a>
	</td>
	</tr>
	</tbody>
	</table>	
	`
	;
}
String.prototype.REPASS_EMAIL_TEXT = function() 
{
	return `
	<table
	style="
	width: 60vmax; padding: 1vmax; margin: auto;
	border-collapse: collapse; text-align: center;
	background-color: #ecf0f1;
	">
	<tbody>
	<tr>
	<td>
		este es un correo de pruebas de confirmacion de registro enviado por un servidor de IONOS.
	</td>
	</tr>
	</tbody>
	</table>
 	`
	;
}
/**
	from, to, subject, text
*/
String.prototype.SEND_EMAIL = function(callback, text, title)
{
	console.log(this.toString());
	transporter.sendMail
	(
		new EmailOptions({ to: this.toString(), text: text, title: title })
		,
		function(error, info) {
			if (error) {
				console.log('EMAIL ERROR:');
				console.log(error);
				callback(false);
			}
			else {
				console.log('Email sent: ' + info.response);
				callback(true);
			}
		}
	);
}
/*
	TIPOS DE FORMULARIOS SEGUN SU SERVIDOR DE EMPRESA:

	hostinger:
 	{
		host: 'smtp.hostinger.com'
		,
		port: 465
		,
		auth:
		{
			user: EMAIL_USER
			,
			pass: EMAIL_PASS
			,
		}
	}
,
 	gmail:
  	{
		service: 'gmail'
		,
  		host: 'smtp.gmail.com'
		,
		port:465
		,
		auth:
		{
			user: EMAIL_USER,
   			pass: EMAIL_PASS
		}
	}
,
	outlook:
 	{
  		service: 'outlook'
		,
		port:587
		,
  		auth: 
  		{
    		user: EMAIL_USER
			,
    		pass: EMAIL_PASS
			,
 		}
	}
,
	ionos:
 	{
  		host:'smtp.ionos.es'
		,
 		port:465
   		,
	 	auth:
   		{
	 		user: EMAIL_USER
			,
   			pass: EMAIL_PASS
		}
	}
*/