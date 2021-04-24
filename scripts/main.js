
function loadHome(){
	document.getElementById('home-msg').style.display = "flex";
	document.getElementById('cont').innerHTML = '';
	document.getElementById('pass-msg').style.display = "none";
}

function loadPrologFile(){
	document.getElementById('home-msg').style.display = "none";
	document.getElementById('pass-msg').style.display = "flex";
}

function passPrologFile(){
	const pass = document.getElementById('pass-box').value;
	const passSecret = process.env.PASSWORD;
	if (pass == passSecret) {
		document.getElementById('cont').innerHTML = '<embed src="files/bach-machine.html" type="text/html" width="90%" height="1000px"/>'; 	
		document.getElementById('pass-msg').style.display = "none";
	}
}

function loadPecPDF(){
	alert('El archivo de la memoria está en construcción');
	//document.getElementById('home-msg').style.display = "none";
	//document.getElementById('cont').innerHTML = '<embed src="files/pec-pdf.pdf" type="application/pdf" width="90%" height="1000px"/>'; 	
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

/*Midi
window.onload = function () {
	MIDI.loadPlugin({
		soundfontUrl: "./js/util/",
		instrument: "acoustic_grand_piano",
		onprogress: function(state, progress) {
			console.log(state, progress);
		},
		onsuccess: function() {
			var delay = 0; // play one note every quarter second
			var note = 50; // the MIDI note
			var velocity = 127; // how hard the note hits
			// play the note
			MIDI.setVolume(0, 127);
			MIDI.noteOn(0, note, velocity, delay);
			MIDI.noteOff(0, note, delay + 0.75);
		}
	});
};*/