
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

const reduceToHtmlParagraphs = (acc, string) => `${acc} <p>${string}</p>`;

const makeHtmlDiv = content => `<div>${content}</div>`;

const parseAnswer = answer => { 
	const chords = answer.links.Chords.toJavaScript().flatMap(_ => _).map(_ => formatNote(_.join(' - '))).reduce(reduceToHtmlParagraphs);
	const code = answer.links.Code.toJavaScript().flatMap(_ => _).map(_ => _.join("")).reduce(reduceToHtmlParagraphs);
	document.getElementById('cont').innerHTML = `${makeHtmlDiv(code)} ${makeHtmlDiv(chords)}`;
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