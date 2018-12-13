var SECONDARY_COLOR = '#24978d';

function buildAddOn(e) {
  return [buildCard('',e.clientPlatform)];
}

function buildCard(status, platform){
  var card = CardService.newCardBuilder();
  
  card.addCardAction(CardService.newCardAction()
                     .setText('About')
                     .setOpenLink(CardService.newOpenLink().setUrl('https://github.com/daunera/QuickReply-Buttons/blob/master/README.md')));
  
  card.addCardAction(CardService.newCardAction()
                     .setText('Delete my saved data')
                     .setOnClickAction(CardService.newAction().setFunctionName('deleteData')));
  
  card.setHeader(CardService.newCardHeader()
                 .setTitle('Create your own reply buttons')
                 .setImageUrl('https://www.gstatic.com/images/icons/material/system/2x/library_add_black_24dp.png'));
  
  card.addSection(buildSection(status, platform));
  
  return card.build();
}

function buildSection(status, platform){
  var section = CardService.newCardSection();
  
  if(platform === 'android' || platform === 'ios'){
    section.addWidget(CardService.newTextParagraph().setText('<font color="#ff0000">'+status+'</font>'));
  }
  
  section.addWidget(CardService.newTextParagraph().setText('<br><b><font color="'+SECONDARY_COLOR+'">Mail</font></b>'));
  
  section.addWidget(buildTextInput('subject', 'Response Subject (required)', 'Without "Re:" prefix, usually same as your mail subject'));
  section.addWidget(buildTextInput('replyAddress', 'Reply Address (required)', 'Where the buttons\' link will point'));
  
  section.addWidget(CardService.newTextParagraph().setText('<br><b><font color="'+SECONDARY_COLOR+'">Button</font></b>'));
  
  section.addWidget(buildTextInput('buttonTexts', 'Button Texts (required)', 'Separate by comma, whitespace allowed, but trimmed'));
  section.addWidget(buildTextInput('colorText', 'Text Color (Hex code)', 'By default Google blue (#4885ed)'));
  section.addWidget(buildTextInput('colorFill', 'Fill Color (Hex code)', 'By default white'));
  section.addWidget(buildTextInput('colorBorder', 'Border Color (Hex code)', 'By default same as text color'));
  section.addWidget(buildTextInput('borderRound', 'Border Round', 'Number between 1 and 10, by default 5'));
  
  if(platform === 'web' || !platform){
    section.addWidget(CardService.newTextParagraph().setText('<font color="#ff0000">'+status+'</font>'));
  }
  
  section.addWidget(CardService.newButtonSet()
                    .addButton(CardService.newTextButton()
                               .setText('Insert buttons')
                               .setOnClickAction(CardService.newAction()
                                                 .setFunctionName('insertButtons'))));
  
  return section;
}

function buildTextInput(fieldName, title, hint, value){
  
  var textInput = CardService.newTextInput()
  .setFieldName(fieldName)
  .setTitle(title)
  .setOnChangeAction(CardService.newAction().setFunctionName('saveData'));
  
  if (hint) {
    textInput.setHint(hint)
  }
  
  if (value) {
    textInput.setValue(value);
  } else
    textInput.setValue(getValue(fieldName));
  
  return textInput;
}
