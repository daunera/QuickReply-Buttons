function saveData(e){
  var res = e.formInput;
  var props = PropertiesService.getUserProperties();
  props.setProperties(res, true);
}

function deleteData(e){
  var props = PropertiesService.getUserProperties();
  props.deleteAllProperties();
  return buildCard('',e.clientPlatform);
}

function getValue(property, option){
  var propertyValue = PropertiesService.getUserProperties().getProperty(property);
  if(!propertyValue)
    return '';
  return propertyValue;
}