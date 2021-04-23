
function loadHome(){
	document.getElementById('home-msg').style.display = "block";
	document.getElementById('cont').innerHTML = '';
}

function loadPrologFile(){
	document.getElementById('home-msg').style.display = "none";
	document.getElementById('cont').innerHTML = '<embed src="files/bach-machine.html" type="text/html" width="90%" height="1000px"/>'; 	
}

function loadPecPDF(){
	document.getElementById('home-msg').style.display = "none";
	document.getElementById('cont').innerHTML = '<embed src="files/pec-pdf.pdf" type="application/pdf" width="90%" height="1000px"/>'; 	
}	

//Management of Prolog harmony generation

const prologFile = 'bach.pl';

const formatNote = note => note.replaceAll('_s','♯').replaceAll('_b','♭');	

const makeChordsTable = content => `<table id="chords-table"><tr><th>Cifrado</th><th>Acordes</th></tr>${content}</table>`;

const parseAnswer = answer => { 
	const chords = answer.links.Chords.toJavaScript().flatMap(_ => _).map(_ => formatNote(_.join(' - ')));
	const code = answer.links.Code.toJavaScript().flatMap(_ => _).map(_ => _.join(""));
	const tableRows = code
		.map((code,index) => `<td>${code}</td><td>${chords[index]}</td>`)
		.reduce((acc,row) => `${acc} <tr>${row}</tr>`);
	
	document.getElementById('cont').innerHTML = `${makeChordsTable(tableRows)}`;
};

function generate(){	
	const tono = document.getElementById('tonos').value;
	//Creating a session with Tau-Prolog
	let session = pl.create();
	session.consult(prologFile);
	//Using query coral/2
	session.query(`coral(${tono},(Chords,Code)).`);
	session.answer(parseAnswer);
};