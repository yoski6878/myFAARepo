trigger FAACaseTrigger on Case (before insert) {
  Database.DMLOptions dmlOpts = new Database.DMLOptions();
  dmlOpts.EmailHeader.triggerAutoResponseEmail= true;
  for(Case caseObj:Trigger.new){
    if(caseObj.origin == 'Phone'){
     caseObj.setOptions(dmlOpts);
    }
  }
}