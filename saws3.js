var console = {};
console.log = function(){};

/*
Carlos bucket
http://acs.amazonaws.com/groups/global/AllUsers
*/

const 
{ 
	S3Client
	,
	GetObjectCommand
	,
	ListObjectsCommand
	,
	ListBucketsCommand
	,
	CreateBucketCommand
	,
	PutObjectCommand
	
} = require("@aws-sdk/client-s3");

require('./persistence');

Object.prototype.V3_TO_BINARY = function(callback) {
	(
		async () => {
			try {
				const response = this;
				let buffer = [];

				if(response.Body)
				{
					response.Body.on('data', chunk => {
						buffer.push(chunk);
					});
					response.Body.on('end', () => {
						let result = Buffer.concat(buffer);
						callback(result)
					});
				}
				else
				{
					callback(response)
				}
			}
			catch (error) {
				//console.error(error);
			}
		}
	)();
}
Object.prototype.GET_V3 = function(callback)
{
	let command = this;
	(
		async () => {
			try {
				const response = await s3.send(command);
				response.V3_TO_BINARY
				(
					function(data)
					{
						callback(data);
					}
				);
			}
			catch (error) 
			{
				//console.error(error);
				callback(undefined);
			}
		}
	)();
}

const AWS_ACCESS_KEY = process.env['AWS_ACCESS_KEY'];
const AWS_SECRET_ACCESS_KEY = process.env['AWS_SECRET_ACCESS_KEY'];

/*
const bucket_name = "operfin-namibia";
const folder = "external_leads";
const region = "eu-west-1";
*/

//Africa (Cape Town) af-south-1

const bucket_name = 'autosalud';
const region = 'us-east-2';

var s3 = undefined;

String.prototype.RESERVACION_PATH = function(sede)
{
	if(sede)
	{
		return `db/appointments_db___year__/${sede}/__mes__-__year__/__mes__-__year__.json`;
	}
	else
	{
		return `db/appointments_db___year__/__mes__-__year__/__mes__-__year__.xlsx`;
	}
}
String.prototype.EXCEL_TO_JSON_AWS3 = function(path, index, callback)
{
	var t = this;
	t.EXCEL_TO_PERSISTENCE_AWS3
	(
		path
		,
		index
		,
		function()
		{
			path.GET_PERSISTENCE
			(
				function(pers)
				{	
					path.SET_PERSISTENCE_AWS3
					(
						pers
						,
						callback
					);
				}
			);
		}
	);
}
String.prototype.EXCEL_TO_PERSISTENCE_AWS3 = function(path, index, callback)
{
	var t = this;
	t.LOAD_BINARY_AWS3
	(
		function(body)
		{	
			if(body)
			{
				t.SAVE_BINARY
				(
					body
					,
					function(res)
					{
						t.EXCEL_TO_PERSISTENCE
						(
							path
							,
							index ? index : 0
							,
							callback
						);
					}
				);	
			}
			else
			{
				console.log('this path dont have body: ' + t);
			}
		}
	);
}
String.prototype.LOGIN_AWS = function(callback) {
	console.log('AWS LOGIN:');

	try {
		s3 = new S3Client
			({
				region: region,
				paramValidation: false,
				credentials:
				{
					accessKeyId: AWS_ACCESS_KEY,
					secretAccessKey: AWS_SECRET_ACCESS_KEY
				}
			});

		console.log('s3:');
		console.log(s3);

		callback();
	} catch (ex) {
		console.log('LOGIN_AWS ERROR:');
		console.log(ex);
	}
};
String.prototype.SHOW_AWS = function(callback, limit) {
	console.log('GET_FOLDERS_AWS:');
	var params = {
		Bucket: bucket_name,
		MaxKeys: limit ? limit : 999,
		Prefix: `${this}`
	};
	new ListObjectsCommand(params)
	.GET_V3
	(
		function(data)
		{
			callback(data);
		}
	);
};
String.prototype.LIST_BUCKET_AWS = function() {
	console.log('LIST_BUCKET_AWS:');
	var params = {};
	new ListBucketsCommand(params)
	.GET_V3
	(
		function(data)
		{
			callback(data);
		}
	);
};
String.prototype.CREATE_BUCKET_AWS = function(callback) {
	console.log('CREATE_BUCKET:');
	var params = {
		Bucket: bucket_name,
		CreateBucketConfiguration: {
			LocationConstraint: 'US'
		}
	};
	new CreateBucketCommand(params)
	.GET_V3
	(
		function(data)
		{
			callback(data);
		}
	);
};
String.prototype.CREATE_FOLDER = function(callback) {

	var params =
	{
		Bucket: bucket_name,
		Key: `${this}`
	}
	//PutObjectCommand
	new PutObjectCommand(params)
	.GET_V3
	(
		function(data)
		{
			callback(data);
		}
	);
}
String.prototype.SAVE_AWS3 = function(data, callback, contentType) {

	var params =
	{
		Bucket: bucket_name,
		Key: `${this}`,
		Body: data.toString(),
		ContentType: contentType ? contentType : 'application/json'
	}
	new PutObjectCommand(params)
	.GET_V3
	(
		function(data)
		{
			callback(data);
		}
	);
};
String.prototype.LOAD_AWS3 = function(callback) {
	let params = {
		Bucket: bucket_name,
		Key: `${this}`
	};
	new GetObjectCommand(params)
	.GET_V3
	(
		function(data)
		{
			callback(data ? data.toString() : false);
		}
	);
};
String.prototype.EXIST_PERSISTENCE_AWS3 = function(callback, predicate) {
	this.toString().LOAD_AWS3
	(
		function(data)
		{
			if(data)
			{
				if(predicate)
				{
					var ls = data.match(/{[\s\S]*?}/g);
					var lss = ls.map(n => n.replace('\n','').replace('\t',''));
					var lo = lss.map(JSON.parse);

					var r = lo.filter(predicate);
					var b = r.length > 0;
					
					callback ? callback(b) : '';
				}
				else
				{
					callback ? callback(true) : '';
				}
			}
			else
			{
				callback ? callback(false) : '';
			}
		}
	);
}
String.prototype.GET_PERSISTENCE_AWS3 = function(callback) {

	this.toString().LOAD_AWS3
	(
		function(data) 
		{
			if (data) 
			{
				if(data[0] == "[")
				{
					var arr = data.TO_OBJECT();
					callback(arr);
				}
				else
				{
					var ls = data.match(/{[\s\S]*?}/g);
					var lss = ls.map(n => n.replace('\n','').replace('\t',''));
					var lo = lss.map(JSON.parse);
					callback(lo);
				}
			}
			else {
				callback(undefined);
			}
		}
	);
};
String.prototype.SET_PERSISTENCE_AWS3 = function(object, callback) {
	var data = object.TO_JSON();
	this.SAVE_AWS3
	(
		data
		,
		callback
	);
};
String.prototype.REMOVE_PERSISTENCE_AWS3 = function(method, predicate) {
	var pth = this;
	this.GET_PERSISTENCE_AWS3(function(object) {
		if (object) {
			object = object.REMOVE_ALL(predicate);
			pth.SET_PERSISTENCE_AWS3(object);
		}
		method(object);
	});
};
String.prototype.SELECT_PERSISTENCE_AWS3 = function(method, predicate) {
	this.GET_PERSISTENCE_AWS3(function(object) {
		if (object) {
			method(object.filter(predicate));
		} else {
			method(undefined);
		}
	});
};
String.prototype.ADD_PERSISTENCE_AWS3 = function(
	method,
	add,
	predicate,
	is_update,
	index,
) {
	console.log('ADD_PERSISTENCE_AWS3:');

	var rute = this;

	try {
		this.GET_PERSISTENCE_AWS3(function(object) {
			if (object == undefined) {
				object = [];
			}
			if (predicate == undefined) {
				object.push(add);
				rute.SET_PERSISTENCE_AWS3
				(
					object
					,
					function(info)
					{
						method(object, true);
					}
				);
				return;
			}
			
			var i = object.findIndex(predicate);
			if(is_update)
			{
				if(i != -1)
				{
					console.log('ADD LO VOY A DAR UPDATE');
					object = object.SUPER_ALL(predicate, add);
					console.log('UPDATE::');
					console.log(object);
				}
				else
				{
					//por esto podria suceder algun problema estar atento.
					console.log('VOY A DAR PUSH');
					object.push(add);
					console.log('PUSH');
				}
			}
			else
			{
				if(i != -1)
				{
					console.log(
						'OBJETO REPETIDO (ESTE ES UN OBJETO UNICO DB_PERSISTENCE AWS3) :'
					);
					console.log(object[i]);
					console.log('VS');
					console.log(add);
					method(undefined, false);
					return;	
				}
				else
				{
					if (typeof index === 'undefined') {
						object.push(add);
					} else {
						object.INSERT(index, add);
					}
				}
			}
			console.log(object);
			rute.SET_PERSISTENCE_AWS3
			(
				object
				,
				function(info)
				{
					method(object, true);
				}
			);
		});
	} catch (ex) {
		console.log(ex);
		method(undefined, false);
	}
	console.log('END ADD_PERSISTENCE AWS3:');
};
String.prototype.FIND_PERSISTENCE_AWS3 = function(method, predicate) {
	console.log('FIND_PERSISTENCE AWS3:');
	
	this.GET_PERSISTENCE_AWS3(function(object) {
		if (object == undefined) {
			method(undefined);
			return;
		}

		var f = object.find(predicate);

		method(f);
	});
};
String.prototype.DOWNLOAD_AWS_PDF = function(callback, manually) {
	let params = {
		Bucket: bucket_name,
		Key: `${this}`
	};
	var THIS = this;
	new GetObjectCommand(params)
	.GET_V3
	(
		function(data)
		{
			callback(data)
		}
	)
};
String.prototype.SAVE_BINARY_AWS3 = function(data, callback) {

	let params = 
	{
		Bucket: bucket_name,
		Key: `${this}`,
		Body: data,
	}
	//PutObjectCommand
	new PutObjectCommand(params)
	.GET_V3
	(
		function(data)
		{
			callback(data)
		}
	)
}
String.prototype.LOAD_BINARY_AWS3 = function(callback) {
	let params = {
		Bucket: bucket_name,
		Key: `${this}`
	};
	new GetObjectCommand(params)
	.GET_V3
	(
		function(data)
		{
			callback(data);
		}
	)
}
String.prototype.RESERVACION_PRO = function()
{
	var t = this;
	for(let i = 1; i < 13; i++)
	{
		var year = new Date().getFullYear();
		let dir = t.PROPS
			({
				mes:i
				,
				year:new Date().getFullYear()
			});
		
		dir['EXIST_PERSISTENCE'.DB_TYPE()]
		(
			function(b)
			{
				if(b)
				{
					let j_dir = dir.replaceAll('.xlsx', '.json');
					j_dir['EXIST_PERSISTENCE'.DB_TYPE()]
					(
						function(bb)
						{
							console.log(j_dir);
							console.log(bb);
							
							if(bb)
							{
								
							}
							else
							{
								dir.EXCEL_TO_JSON_AWS3
								(
									j_dir
									,
									0
									,
									function()
									{
										
									}
								);
							}
						}
					)
				}
				else
				{
					
				}
			}
		)
	}	
}