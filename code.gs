function buildAddOn(e) {
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);

  var cards = [];
  cards.push(buildCard());
  var help;

  return cards;
}

function buildCard(){
  var card = CardService.newCardBuilder();
  
  card.setHeader(CardService.newCardHeader()
    .setTitle('Create draft with buttons')
    .setImageUrl('https://www.gstatic.com/images/icons/material/system/2x/library_add_black_24dp.png'));
  
  var section = buildSection();
  card.addSection(section);
  
  return card.build();
}

function buildSection(){
  var section = CardService.newCardSection().setHeader('<font color="#48B84F">Mail</font>');
  
  section.addWidget(CardService.newTextInput()
    .setFieldName('subject')
    .setTitle('Subject*')
    .setValue(getState('subject'))
    .setOnChangeAction(CardService.newAction().setFunctionName('rememberAction')));
  section.addWidget(CardService.newTextInput()
    .setFieldName('replyAddress')
    .setTitle('Reply Address*')
    .setValue(getState('replyAddress'))
    .setSuggestions(suggestEmail())
    .setOnChangeAction(CardService.newAction().setFunctionName('rememberAction')));
    
  section.addWidget(CardService.newTextParagraph().setText('<br><b><font color="#48B84F">Button</font></b>'));
  
  section.addWidget(CardService.newTextInput()
    .setFieldName('buttonTexts')
    .setTitle('Button Texts*')
    .setValue(getState('buttonTexts'))
    .setHint('Separete by comma')
    .setOnChangeAction(CardService.newAction().setFunctionName('rememberAction')));
  section.addWidget(CardService.newTextInput()
    .setFieldName('colorText')
    .setTitle('Text & Border Color (Hex code)*')
    .setValue(getState('colorText'))
    .setSuggestions(CardService.newSuggestions().addSuggestion('#48B84F'))
    .setOnChangeAction(CardService.newAction().setFunctionName('rememberAction')));
  section.addWidget(CardService.newTextInput()
    .setFieldName('colorFill')
    .setTitle('Fill Color (Hex code)*')
    .setValue(getState('colorFill'))
    .setSuggestions(CardService.newSuggestions().addSuggestion('#FFFFFF'))
    .setOnChangeAction(CardService.newAction().setFunctionName('rememberAction')));
  section.addWidget(CardService.newTextInput()
    .setFieldName('borderRound')
    .setTitle('Border Round')
    .setHint('Number between 1 and 10')
    .setValue(getState('borderRound'))
    .setOnChangeAction(CardService.newAction().setFunctionName('rememberAction')));
  section.addWidget(CardService.newSelectionInput()
    .setType(CardService.SelectionInputType.CHECK_BOX)
    .setFieldName('remember')
    .addItem('Rembember the sets', 'rememberBox', getState('remember'))
    .setOnChangeAction(CardService.newAction().setFunctionName('rememberAction')));
    
  section.addWidget(CardService.newTextParagraph().setText('<font color="#FF0000">*required fields</font>'));
  
  var notifyAction = CardService.newAction().setFunctionName('notifyUser');
  var validateButton = CardService.newTextButton()
  .setText('Validate')
  .setOnClickAction(notifyAction);
  
  var composeAction = CardService.newAction().setFunctionName('createNewMail');
  var composeButton = CardService.newTextButton()
    .setText('Create')
    .setComposeAction(composeAction, CardService.ComposedEmailType.STANDALONE_DRAFT);
  
  section.addWidget(CardService.newButtonSet()
   .addButton(validateButton)
   .addButton(composeButton));
    
  return section;
}

function createButtonsTable(subject, address, text, colorFill, colorText, borderRound){
  var texts = text.split(',');
  
  var buttonsTable = '<table><tr>';
  for (var i = 0; i < texts.length; i++) {
    buttonsTable += '<td>';
    buttonsTable += createButton(subject, address, texts[i], colorFill, colorText, borderRound);
    buttonsTable += '</td>';
  }
  buttonsTable += '</tr></table>';
  return buttonsTable;
}

function createButton(subject, address, text, colorFill, colorText, borderRound){
  var url = createMailToUrl(subject, address, text);
  var defaultBorderRound = borderRound == undefined ? 5 : borderRound;
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
  buttonString += colorText;
  buttonString += ';border-radius:';
  buttonString += defaultBorderRound;
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

function createNewMail(e){
  Logger.log('createNewMail called');
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  var res = e['formInput'];
  var valid = validation(res);
  Logger.log('Cvalid: '+valid);
  if(valid == true){
    var buttonsCode = createButtonsTable(res['subject'],res['replyAddress'],res['buttonTexts'],res['colorFill'],res['colorText'],res['borderRound']);
    var draft = GmailApp.createDraft('',res['subject'], '',{htmlBody: "Text here <br>"+buttonsCode})
    return CardService.newComposeActionResponseBuilder().setGmailDraft(draft).build();
  }
  else{
    return null;
  }
}

function notifyUser(e){
  Logger.log('notifyUser called');
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  var res = e['formInput'];
  var valid = validation(res);
  Logger.log('Nvalid: '+valid);
  if(valid == true){
    valid = "Everything's okay"
  }
  return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText(valid)
        .setType(CardService.NotificationType.INFO))
      .build()
}

function rememberAction(e){
  var res = e['formInput'];
  var props = PropertiesService.getUserProperties();
  if('remember' in res){
    if('replyAddress' in res)
      props.setProperty('replyAddress', res['replyAddress']);
    else
      props.deleteProperty('replyAddress');
    if('subject' in res)
      props.setProperty('subject', res['subject']);
    else
      props.deleteProperty('subject');
    if('buttonTexts' in res)
      props.setProperty('buttonTexts', res['buttonTexts']);
    else
      props.deleteProperty('buttonTexts');
    if('colorFill' in res)
      props.setProperty('colorFill', res['colorFill']);
    else
      props.deleteProperty('colorFill');
    if('colorText' in res)
      props.setProperty('colorText', res['colorText']);
    else
      props.deleteProperty('colorText');
    if('borderRound' in res)
      props.setProperty('borderRound', res['borderRound']);
    else
      props.deleteProperty('borderRound');
    props.setProperty('remember', res['remember']);
  } 
  else{
    props.deleteAllProperties();
  }
}

function getState(property){
  var propertyValue = PropertiesService.getUserProperties().getProperty(property);
  if(property == 'remember'){
    if(propertyValue == null)
      return false;
    return true;
  }
  if(propertyValue == undefined)
      return '';
  return propertyValue;
}

function suggestEmail(){
  var suggestions = CardService.newSuggestions();
  
  var emailBase = Session.getActiveUser().getEmail();
  var emailArray = emailBase.split('@');
  
  var emailAnswer = emailArray[0]+'+answer@'+emailArray[1];
  var emailReply = emailArray[0]+'+reply@'+emailArray[1];
  
  suggestions.addSuggestions([emailBase,emailAnswer,emailReply]);
  
  return suggestions;

}

function validation(res){

  var emptyFields = [];
  if(!('subject' in res))
    emptyFields.push('Subject');
  if(!('replyAddress' in res))
    emptyFields.push('Reply Address');
  else{
    if(!(validateEmail(res['replyAddress'])))
      return 'Wrong Reply Address email format';
  }
  if(!('buttonTexts' in res))
    emptyFields.push('Button Texts');
  if(!('colorText' in res))
    emptyFields.push('Text & Border Color');
  else{
    if(!(validateHex(res['colorText'])))
      return 'Wrong Text Color Hex Code format';
  }
  if(!('colorFill' in res))
    emptyFields.push('Fill Color');
  else{
    if(!(validateHex(res['colorFill'])))
      return 'Wrong Fill Color Hex Code format';
  }
  if(emptyFields.length == 0)
    return true;
  else if (emptyFields.length == 1)
    return 'Empty field: '+emptyFields[0];
  else{
    var errorEmpty = 'Empty fields: ';
    for(var i = 0; i < emptyFields.length; i++){
      errorEmpty += emptyFields[i];
      if(i != emptyFields.length-1)
        errorEmpty += ', ';
    }
    return errorEmpty;
  }
}

function validateEmail(string){
  //TODO: validate email
  /*var pattern = new RegExp('.+@.+');
  Logger.log('email: '+string);
  Logger.log('test: '+pattern.test(string));
  //return pattern.test(string);*/
  return true;
}

function validateHex(string){
  var pattern = new RegExp('#[1,2,3,4,5,6,7,8,9,a,b,c,d,e,f,A,B,C,D,E,F]{6}');
  return pattern.test(string);
}