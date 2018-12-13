function insertButtons(e){
  var res = e.formInput;
  var check = validation(res);
  
  if (check === 'Ok'){
    check = '';
    var htmlContent = createButtonsTable(res);
    
    
    
    var response = CardService.newUpdateDraftActionResponseBuilder()
    .setUpdateDraftBodyAction(CardService.newUpdateDraftBodyAction()
                              .addUpdateContent(
                                htmlContent,
                                CardService.ContentType.MUTABLE_HTML)
                              .setUpdateType(
                                CardService.UpdateDraftBodyType.IN_PLACE_INSERT))
    .build();
    return response;
  } else {
    return buildCard(check, e.clientPlatform);
  }
}

function createButtonsTable(res){
  var texts = res.buttonTexts.split(',');
  
  var colorText = setColorText(res.colorText);
  var colorFill = setColorFill(res.colorFill);
  var colorBorder = setColorBorder(res.colorBorder, res.colorText);
  var borderRound = setBorderRound(res.borderRound);
  
  var buttonsTable = '<table><tr>';
  for (var i = 0; i < texts.length; i++) {
    var buttonText = texts[i].trim().replace(/;/g,',');
    buttonsTable += '<td>';
    buttonsTable += createButton(res.subject, res.replyAddress, buttonText, colorText, colorFill, colorBorder, borderRound);
    buttonsTable += '</td>';
  }
  buttonsTable += '</tr></table>';
  return buttonsTable;
}

function createButton(subject, address, text, colorText, colorFill, colorBorder, borderRound){
  var url = createMailToUrl(subject, address, text);
  var calculatedWidth = 100;
  if (text.length > 10)
    calculatedWidth += (text.length-10)*5;
  
  var buttonString = '';
  
  buttonString += '<div><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="';
  buttonString += url;
  buttonString += '" style="height:40px;v-text-anchor:middle;width:';
  buttonString += calculatedWidth;
  buttonString += 'px;" arcsize="13%" strokecolor="';
  buttonString += colorText;
  buttonString += '"fillcolor="';
  buttonString += colorFill;
  buttonString += '"><w:anchorlock/><center style="color:';
  buttonString += colorText;
  buttonString += ';font-family:sans-serif;font-size:13px;font-weight:bold;">';
  buttonString += text;
  buttonString += '</center></v:roundrect><![endif]--><a href="';
  buttonString += url;
  buttonString += '"style="background-color:';
  buttonString += colorFill;
  buttonString += ';border:1px solid ';
  buttonString += colorBorder;
  buttonString += ';border-radius:';
  buttonString += borderRound;
  buttonString += 'px;color:';
  buttonString += colorText;
  buttonString += ';display:inline-block;font-family:sans-serif;font-size:13px;font-weight:bold;line-height:40px;text-align:center;text-decoration:none;width:';
  buttonString += calculatedWidth;
  buttonString += 'px;-webkit-text-size-adjust:none;mso-hide:all;">';
  buttonString += text;
  buttonString += '</a></div>';
  
  return buttonString;
}

function createMailToUrl(subject, address, body){
  return 'mailto:'+address+'?subject=Re:+'+subject.replace(' ','+')+'&body='+body.replace(' ','+');
}

function setColorText(colorText){
  if(!colorText)
    colorText = '#4885ED';
  return colorText;
}

function setColorFill(colorFill){
  if(!colorFill)
    colorFill = '#FFFFFF';
  return colorFill;
}

function setColorBorder(colorBorder, colorText){
  if(!colorText && !colorBorder)
    colorBorder = '#4885ED';
  else if (!colorBorder)
    colorBorder = colorText;
  return colorBorder;
}

function setBorderRound(borderRound){
  if(!borderRound)
    borderRound = 5;
  return borderRound;
}