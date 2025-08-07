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
    newValues[3] = (h*1e12)/energy;   //ps
    newValues[4] = energy*1e3;        // meV
    newValues[5] = h*c*1e6/energy;    // um
    newValues[6] = energy/(h*1e9);   // GHz
    newValues[7] = 1e3*(h*1e12)/energy;//fs
    return newValues
};

var converter = function(sender){
    var c = 2.9979e8;
    var h = 4.135667516e-15;
    var elements = [
        document.getElementById("eV"),
        document.getElementById("nm"),
        document.getElementById("cm"),
        document.getElementById("ps"),
        document.getElementById("meV"),
        document.getElementById("um"),
        document.getElementById("GHz"),
        document.getElementById("fs")
    ];
    var energy = "1";
    var toSkip = "";
    switch(sender){
        case 'eV':
            energy = parseFloat(document.getElementById("eV").value);
            toSkip = document.getElementById("eV");
            break;
        case 'nm':
            energy = h*c*1e9/parseFloat(document.getElementById("nm").value);
            toSkip = document.getElementById("nm");
            break;
        case 'cm':
            energy = parseFloat(document.getElementById("cm").value)*(h*c*1e2);
            toSkip = document.getElementById("cm");
            break;
        case 'meV':
            energy = parseFloat(1e-3*document.getElementById("meV").value);
            toSkip = document.getElementById("meV");
            break;
        case 'um':
            energy = h*c*1e6/parseFloat(document.getElementById("um").value);
            toSkip = document.getElementById("um");
            break;
        case 'GHz':
            energy = h*1e9*parseFloat(document.getElementById("GHz").value);
            toSkip = document.getElementById("GHz");
            break;
        case 'ps':
            energy = h*1e12/parseFloat(document.getElementById("ps").value);
            toSkip = document.getElementById("ps");
            break;
        case 'fs':
            energy = 1e3*h*1e12/parseFloat(document.getElementById("fs").value);
            toSkip = document.getElementById("fs");
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
