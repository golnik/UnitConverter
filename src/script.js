/* ====================================
    Global Variable & Data Definitions
   ====================================*/

   var h = 2. * Math.PI;    //Planck constant in atomic units
   var c = 137.03599917721; //speed of light in atomic units
   var z = 376.730313413;   //impedance of free space in Ohm

   class Unit{
    constructor(name) {
      this.name = name;
      this.unit = new Array();
      this.factor = new Array();
    }
    addConversion(unit,factor){
      this.unit.push(unit);
      this.factor.push(factor);
    }
    convert(sourceIndex,targetIndex,value){
      var sourceFactor = this.factor[sourceIndex];
      var targetFactor = this.factor[targetIndex];
      var result = (value / sourceFactor) * targetFactor;

      return result;
    }
  }

  var Units = new Array();
  indx = 0

  // linear unit conversions here

  //length
  Units[indx] = new Unit("Length");
  Units[indx].addConversion("Bohr (au)",1.0);
  Units[indx].addConversion("Å",0.52917721090380);
  Units[indx].addConversion("nm",0.052917721090380);
  Units[indx].addConversion("cm",0.52917721090380E-8);
  Units[indx].addConversion("m",0.52917721090380E-10);
  indx += 1;
  
  //time
  Units[indx] = new Unit("Time");
  Units[indx].addConversion("atomic unit",1.0);
  Units[indx].addConversion("attosecond",24.188843265864);
  Units[indx].addConversion("femtosecond",24.188843265864/1000);
  Units[indx].addConversion("second", 24.188843265864E-18)
  indx += 1;

  //mass
  Units[indx] = new Unit("Mass");
  Units[indx].addConversion("electron mass", 1.0)
  Units[indx].addConversion("amu",5.48579909044197E-4);
  Units[indx].addConversion("grams",9.1093837139E-28);
  Units[indx].addConversion("kilograms", 9.1093837139E-31)
  indx += 1;
  
  //EnergyUnit class is now for all conversions that are not linearly related
  class EnergyUnit extends Unit{
    constructor(name) {
      super(name);
      this.type = new Array();
    }
    addConversion(unit,factor,type){ //here type indicates: 0 - energy units, 1 - wavelength, 2 - field strength, 3 - field intensity 
      super.addConversion(unit,factor);
      this.type.push(type);
    }
    convert(sourceIndex,targetIndex,value){
      var type1 = this.type[sourceIndex];
      var type2 = this.type[targetIndex];
      var sourceFactor = this.factor[sourceIndex];
      var targetFactor = this.factor[targetIndex];
  
      var result = 0.;

      // different equations used based on starting and target units
      switch (type1) {
        // if units are of the same type, we convert them as usual
        case type2:
          result = super.convert(sourceIndex,targetIndex,value);
          break;
        // if converting energy to wavelength (and vise-versa)
        case 0:
        case 1:  
          result = h*c / (value / sourceFactor) * targetFactor;
          break;   
      }
      return result;
    }
  }

  // energy <-> Wavelength
  Units[indx] = new EnergyUnit("Energy/Wavelength");
  Units[indx].addConversion("Hartree (au)",1.0,0);
  Units[indx].addConversion("eV",27.211386245988,0);
  Units[indx].addConversion("nm",0.052917721090380,1);
  indx += 1;

  class FieldUnit extends EnergyUnit{

    convert(sourceIndex,targetIndex,value){
      var type1 = this.type[sourceIndex];
      var type2 = this.type[targetIndex];
      var sourceFactor = this.factor[sourceIndex];
      var targetFactor = this.factor[targetIndex];
  
      var result = 0.;

      // different equations used based on starting and target units
      switch (type1) {
        // if units are of the same type, we convert them as usual
        case type2:
          result = super.convert(sourceIndex,targetIndex,value);
          break;
        // if converting field strength to field intensity
        case 0:        
          result = targetFactor * Math.pow(value/sourceFactor, 2) /z;
          break;
        // if converting field intensity to field strength 
        case 1:             
          result = targetFactor * Math.pow(z * value/sourceFactor, 1/2);
          break;    
      }
      return result;
    }
  }

  /*field strength <-> field intensity, 
  V/m and W/m^2 factors are "reference 1" to ease conversions*/
  Units[indx] = new FieldUnit("Field Strength and Intensity");
  Units[indx].addConversion("au of electric field",1.94469037E-12, 0);
  Units[indx].addConversion("V/nm",1E-9, 0);
  Units[indx].addConversion("V/m",1, 0);
  // field intensity units
  Units[indx].addConversion("W/cm\u00B2",1E-4, 1);
  Units[indx].addConversion("W/m\u00B2",1, 1);

  indx += 1;
  
  //cross section
  
  /* ===========
      Functions
     =========== */
  function UpdateUnitMenu(propMenu, unitMenu) {
    // Updates the units displayed in the unitMenu according to the selection of property in the propMenu.
    var i;
    i = propMenu.selectedIndex;
    FillMenuWithArray(unitMenu, Units[i].unit);
  }
  
  function FillMenuWithArray(myMenu, myArray) {
    // Fills the options of myMenu with the elements of myArray.
    // !CAUTION!: It replaces the elements, so old ones will be deleted.
    var i;
    myMenu.length = myArray.length;
    for (i = 0; i < myArray.length; i++) {
      myMenu.options[i].text = myArray[i];
    }
  }
  
  function CalculateUnit(sourceForm, targetForm) {
    // A simple wrapper function to validate input before making the conversion
    var sourceValue = sourceForm.unit_input.value;
  
    // First check if the user has given numbers or anything that can be made to one...
    //sourceValue = parseFloat(sourceValue);
    if (!isNaN(sourceValue) || sourceValue == 0) {
      // If we can make a valid floating-point number, put it in the text box and convert!
      sourceForm.unit_input.value = sourceValue;
      ConvertFromTo(sourceForm, targetForm);
    }
  }
  
  function ConvertFromTo(sourceForm, targetForm) {
    // Converts the contents of the sourceForm input box to the units specified in the targetForm unit menu and puts the result in the targetForm input box.In other words, this is the heart of the whole script...
    var propIndex;
    var sourceIndex;
    var sourceFactor;
    var targetIndex;
    var targetFactor;
    var result;
    var explanation = document.getElementById('explanation');
  
    // Start by checking which property we are working in...
    propIndex = document.property_form.the_menu.selectedIndex;
  
    // Let's determine what unit are we converting FROM and TO
    sourceIndex = sourceForm.unit_menu.selectedIndex;
    targetIndex = targetForm.unit_menu.selectedIndex;
  
    value = sourceForm.unit_input.value;
    result = Units[propIndex].convert(sourceIndex,targetIndex,value);
  
    // All that's left is to update the target input box:
    // optionally one can use .toExponential() to display number in scientific notation
    if(Math.abs(result)>1E+3 || Math.abs(result)<1E-3){
      result = result.toExponential();
    } 

    targetForm.unit_input.value = result;

    var type1 = Units[propIndex].type[sourceIndex];
    var type2 = Units[propIndex].type[targetIndex];

    // update explanation for cross magnitude conversions (nonlinear)
    /*switch (type1) {
      case type2: 
        explanation.textContent = "";
        break;
      // if wavelength <-> energy conversion 
      case 0:
      case 1:
        explanation.textContent = "E = hc/\u03BB";
        break;  
      // if field strength <-> field intensity conversion 
      case 2:
      case 3:
        explanation.textContent = "I \u221D E\u00B2";
        break;    
    }*/
  }

  // This fragment initializes the property dropdown menu using the data defined above in the 'Data Definitions' section
  window.onload = function(e) {
    var property = new Array();
    for (const Unit of Units){
      property.push(Unit.name);
    }
  
    FillMenuWithArray(document.property_form.the_menu, property);
    UpdateUnitMenu(document.property_form.the_menu, document.form_A.unit_menu);
    UpdateUnitMenu(document.property_form.the_menu, document.form_B.unit_menu)
  }
  
  // Restricting textboxes to accept numbers + navigational keys only
  document.getElementByClass('numbersonly').addEventListener('keydown', function(e) {
    var key = e.keyCode ? e.keyCode : e.which;
  
    if (!([8, 9, 13, 27, 46, 110, 190].indexOf(key) !== -1 ||
        (key == 65 && (e.ctrlKey || e.metaKey)) || // Select All 
        (key == 67 && (e.ctrlKey || e.metaKey)) || // Copy
        (key == 86 && (e.ctrlKey || e.metaKey)) || // Paste
        (key >= 35 && key <= 40) || // End, Home, Arrows
        (key >= 48 && key <= 57 && !(e.shiftKey || e.altKey)) || // Numeric Keys
        (key >= 96 && key <= 105) // Numpad
        (key == 190) // Numpad
      )) e.preventDefault();
  });