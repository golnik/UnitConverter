var calculator = function(energy){
    var c = 2.9979e8;
    var h = 4.135667516e-15;
    var newValues = [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ];

    newValues[0] = energy;            //eV
    newValues[1] = (h*c*1e9)/energy;  //nm
    newValues[2] = energy/(h*c*1e2);  //cm-1
    newValues[3] = 1e3*(h*1e12)/energy;//fs
    newValues[4] = energy*0.0367492929;//Hartree
    newValues[5] = h*c*1e6/energy;    // um
    newValues[6] = energy/(h*1e12);   // THz
    newValues[7] = 170.017573254/energy;//aut
    return newValues
};

var converter = function(doc,sender){
    var c = 2.9979e8;
    var h = 4.135667516e-15;
    var elements = [
        doc.getElementById("eV"),
        doc.getElementById("nm"),
        doc.getElementById("cm"),
        doc.getElementById("fs"),
        doc.getElementById("hartree"),
        doc.getElementById("um"),
        doc.getElementById("THz"),
        doc.getElementById("aut")
    ];
    var energy = "1";
    var toSkip = "";
    switch(sender){
        case 'eV':
            energy = parseFloat(doc.getElementById("eV").value);
            toSkip = doc.getElementById("eV");
            break;
        case 'nm':
            energy = h*c*1e9/parseFloat(doc.getElementById("nm").value);
            toSkip = doc.getElementById("nm");
            break;
        case 'cm':
            energy = parseFloat(doc.getElementById("cm").value)*(h*c*1e2);
            toSkip = doc.getElementById("cm");
            break;
        case 'hartree':
            energy = parseFloat(27.211386245981*doc.getElementById("hartree").value);
            toSkip = doc.getElementById("hartree");
            break;
        case 'um':
            energy = h*c*1e6/parseFloat(doc.getElementById("um").value);
            toSkip = doc.getElementById("um");
            break;
        case 'THz':
            energy = h*1e12*parseFloat(doc.getElementById("THz").value);
            toSkip = doc.getElementById("THz");
            break;
        case 'fs':
            energy = 1e3*h*1e12/parseFloat(doc.getElementById("fs").value);
            toSkip = doc.getElementById("fs");
            break;
        case 'aut':
            energy = 170.017573254/parseFloat(doc.getElementById("aut").value);
            toSkip = doc.getElementById("aut");
            break;
        default:
            energy="1";
    }
    var newValues = calculator(energy);
    for (var ii=0;ii<8;ii++) {
        if (elements[ii] === toSkip) {
            continue
        }
        elements[ii].value = newValues[ii].toFixed(6);
    }
};
