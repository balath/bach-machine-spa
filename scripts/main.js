
function loadHome(){
	document.getElementById('home-msg').style.display = "block";
	document.getElementById('cont').innerHTML = '';
}

function loadPrologFile(){
	document.getElementById('home-msg').style.display = "none";
	document.getElementById('cont').innerHTML = '<embed src="files/bach-machine.html" type="text/html" width="90%" height="1000px"/>'; 	
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

//Midi

function listInputsAndOutputs( midiAccess ) {
  for (var entry of midiAccess.inputs) {
    var input = entry[1];
    console.log( "Input port [type:'" + input.type + "'] id:'" + input.id +
      "' manufacturer:'" + input.manufacturer + "' name:'" + input.name +
      "' version:'" + input.version + "'" );
  }

  for (var entry of midiAccess.outputs) {
    var output = entry[1];
    console.log( "Output port [type:'" + output.type + "'] id:'" + output.id +
      "' manufacturer:'" + output.manufacturer + "' name:'" + output.name +
      "' version:'" + output.version + "'" );
  }
}
var midi = null;  // global MIDIAccess object

function onMIDISuccess( midiAccess ) {
  console.log( "MIDI ready!" );
  midi = midiAccess;  // store in the global (in real usage, would probably keep in an object instance)
  listInputsAndOutputs(midi);
}

function onMIDIFailure(msg) {
  console.log( "Failed to get MIDI access - " + msg );
}

navigator.requestMIDIAccess().then( onMIDISuccess, onMIDIFailure );




function sendMiddleC( midiAccess, portID ) {
  var noteOnMessage = [0x90, 60, 0x7f];    // note on, middle C, full velocity
  var output = midiAccess.outputs.get(portID);
  output.send( noteOnMessage );  //omitting the timestamp means send immediately.
  output.send( [0x80, 60, 0x40], window.performance.now() + 1000.0 ); // Inlined array creation- note off, middle C,
                                                                      // release velocity = 64, timestamp = now + 1000ms.
}