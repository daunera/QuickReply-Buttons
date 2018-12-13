function validation(res){  
  var req = checkRequired(res);
  var color = checkHexaColors(res.colorText, res.colorFill, res.colorBorder);
  var num = checkNumber(res.borderRound);
  if (req !== 'Ok')
    return req;
  else if (!checkEmailFormat(res.replyAddress))
    return 'Wrong email format!';
  else if (color !== 'Ok')
    return color;
  else if (num !== 'Ok')
    return num;
  else
    return 'Ok';
  
}

function checkRequired(res){
  var subject = !res.subject ? 1 : 0;
  var replyAddress = !res.replyAddress ? 1 : 0;
  var buttonTexts = !res.buttonTexts ? 1 : 0;
  
  var result = subject + replyAddress + buttonTexts;
  if(result === 0)
    return 'Ok';
  else{
    var end;
    if (result > 1)
      end = ' fields!';
    else
      end = ' field!';
    
    var errText = 'Empty '
    
    if (subject === 1)
      errText += 'Response Subject, ';
    if (replyAddress === 1)
      errText += 'Reply Address, ';
    if (buttonTexts === 1)
      errText += 'ButtonTexts, ';
    
    return errText.substr(0, errText.length-2)+end;
  }
}

function checkEmailFormat(email){
  var regExpPattern = /\S+@\S+\.\S+/;
  return regExpPattern.test(email);
}

function checkHexaColors(colorText, colorFill, colorBorder){
  var text = !colorText ? 0 : (checkHexaColorFormat(colorText) ? 0 : 1);
  var fill = !colorFill ? 0 : (checkHexaColorFormat(colorFill) ? 0 : 1);
  var border = !colorBorder ? 0 : (checkHexaColorFormat(colorBorder) ? 0 : 1)
  
  var result = text + fill + border;
  if(result === 0)
    return 'Ok';
  else{
    var end;
    if (result > 1)
      end = ' color fields!';
    else
      end = ' color field!';
    
    var errText = 'Wrong hexa format in '
    
    if (text === 1)
      errText += 'Text, ';
    if (fill === 1)
      errText += 'Fill, ';
    if (border === 1)
      errText += 'Border, ';
    
    return errText.substr(0, errText.length-2)+end;
  }
}

function checkHexaColorFormat(color) {
  var regExpPattern = /#[0-9,a-f,A-F]{6}$/;
  return regExpPattern.test(color);
}

function checkNumber(number){
  if(!number)
    return 'Ok';
  else{
    if (!checkNumberFormat(number))
      return 'Wrong Border Round number format!';
    else if (!checkNumberRange(number))
      return 'Border Round has to be between 1 and 10!';
    else
      return 'Ok';
     
  }
}

function checkNumberFormat(number){
  var regExpPattern = /^[0-9]*$/;
  return regExpPattern.test(number);
}

function checkNumberRange(number){
  var num = parseInt(number,10);
  if (num > 0 && num < 11)
    return true;
  else
    return false;
}