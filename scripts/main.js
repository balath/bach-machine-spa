

function loadHome(){
	document.getElementById('home-msg').style.display = "block";
	document.getElementById('cont').innerHTML = '';
}

function loadPrologFile(){
	document.getElementById('home-msg').style.display = "none";
	document.getElementById('cont').innerHTML = '<embed src="files/bach-machine.html" type="text/html" width="90%" height="1000px"/>'; 	
	console.log("Hola");
}

function loadPecPDF(){
	document.getElementById('home-msg').style.display = "none";
	document.getElementById('cont').innerHTML = '<embed src="files/pec-pdf.pdf" type="application/pdf" width="90%" height="1000px"/>'; 	
}	


function formatNote(note){
	return note.replaceAll('_s','♯').replaceAll('_b','♭');	
}

const parseAnswer = function( answer ) { 
	const chords = answer.links.Chords.toJavaScript().flatMap(_ => _);
	const code = answer.links.Code.toJavaScript().flatMap(_ => _).map(_ => _.join(""));
	const codeHTML = code
		.map((cif,index) => cif + "\t" + formatNote(chords[index].toString()))
		.reduce((z,e) => z+"<p>"+e+"</p>");	
	document.getElementById('cont').innerHTML = codeHTML;
};

function generate(){
	let tono = document.getElementById('tonos').value;
	let session = pl.create();
	session.consult("bach.pl");
	session.query("coral(" + tono + ",(Chords,Code)).");
	session.answer(parseAnswer);
};