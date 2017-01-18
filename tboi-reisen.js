const fs = require('fs');
const args = process.argv.slice(2);

//Regexes
const regex = {
	import_statement: /^import\s+(.+)\s+from\s+["'](.+)['"];?$/igm,
	import_include_statement: /^import\s+["'](.+)['"];?$/igm,
	mod_variable: /^(?:local)\s+(.+)\s+=\s+RegisterMod\(.+\);?$/im
}

const args_flags = args.filter(a => a.slice(0, 2) === '--').reduce((flags, i) => {flags[i.slice(2)] = true; return flags;}, {});
const [in_filename, out_filename] = args.filter(a => a.slice(0, 2) !== '--');

if(!in_filename){
	console.log("First argument should be input filename");
	return;
}
if(!out_filename){
	console.log("Second argument should be output filename");
	return;
}

compile();

if(args_flags['watch']){
	console.log("Watching file "+in_filename);
	fs.watchFile(in_filename, {interval: 1500}, (curr, prev) => {
		compile();
	});
}

function compile(){

	console.log(`[${(new Date()).getMinutes()}:${(new Date()).getSeconds()}]Compiling...`);

	const input = fs.readFileSync(in_filename).toString();
	const mod_variable = regex.mod_variable.exec(input)[1];

	let output = input;

	if(!args_flags['no-import']){
		output = output.replace(regex.import_statement, (substr, variable, file_to_import, i) => 
			`local ${variable} = (function() ${fs.readFileSync(file_to_import).toString()} end)()`
		);
		output = output.replace(regex.import_include_statement, (substr, file_to_import, i) => 
			fs.readFileSync(file_to_import).toString()
		);
	}

	if(!args_flags['no-dbg']){
		output += '\n' + require('./tboi-reisen-dbg-script.js')(mod_variable);
	}

	fs.writeFileSync(out_filename, output);

	console.log(`[${(new Date()).getMinutes()}:${(new Date()).getSeconds()}]Done!`);
}