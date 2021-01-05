public without sharing class FAA_ContactFormController {
    
    // method to submit case from web
    @AuraEnabled
    public static Case submitCase(Case caseRecord, Account account) {
        //check if contact is already there in sf
        List<Account> searchContact=[select id,personcontactid from account where ispersonaccount=true and (personemail=:account.PersonEmail or (firstname=:account.FirstName and lastname=:account.LastName and phone=:account.Phone))];
        if(searchContact != null && searchContact.size()>0){
            account.Id = searchContact[0].Id;
            caseRecord.contactId=searchContact[0].personcontactid;
            
        }
        //get contact recordtype id
        Id accountRecordTypeId = Schema.SObjectType.Account.getRecordTypeInfosByDeveloperName().get('FAA_Account').getRecordTypeId();
        if(accountRecordTypeId != null)
         account.recordTypeId=accountRecordTypeId;
        try {
         upsert account;
         //set contact id to the case object
         caseRecord.accountid=account.Id;
         caseRecord.origin='Web';
         caseRecord.status='New';
         AssignmentRule AR = new AssignmentRule();
         //Fetching the assignment rules on case
         AR = [select id from AssignmentRule where SobjectType = 'Case' and Active = true limit 1];
         Database.DMLOptions dmlOpts = new Database.DMLOptions();
         //Creating the DMLOptions for "Assign using active assignment rules" checkbox
         //dmlOpts.assignmentRuleHeader.assignmentRuleId= AR.id;
         //Creating the DMLOptions for "notify contact using auto response rules" checkbox
         dmlOpts.EmailHeader.triggerAutoResponseEmail= true;
         caseRecord.setOptions(dmlOpts);
         //get case recordtypeid
         Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('FAA_Inquiries').getRecordTypeId();
         if(caseRecordTypeId != null)
          caseRecord.recordTypeId=caseRecordTypeId;
        insert caseRecord;
        //get the casenumber of the inserted case
        caseRecord=[select id,casenumber from case where id=:caseRecord.Id];
         
        }catch (DMLException e) {
            throw new AuraHandledException(e.getDmlMessage(0));    
        }
        
        return caseRecord;
    }
    
    /*@AuraEnabled
    public static Contact saveContact(Contact contact) {
        List<Contact> searchContact=[select id from contact where email=:contact.email];
        if(searchContact != null && searchContact.size()>0){
            contact.Id = searchContact[0].Id;
        }
        Id contactRecordTypeId = Schema.SObjectType.Contact.getRecordTypeInfosByDeveloperName().get('FAA_Contact').getRecordTypeId();
        if(contactRecordTypeId != null)
         contact.recordTypeId=contactRecordTypeId;
        try {
         upsert contact;
        }catch (DMLException e) {
            throw new AuraHandledException(e.getDmlMessage(0));    
        }
        return contact;
    }

    @AuraEnabled
    public static Case saveCase(Case caseRecord, string contactId) {
        caseRecord.contactid=contactId;
        caseRecord.origin='Web';
        caseRecord.status='New';
        //Fetching the assignment rules on case
        AssignmentRule AR = new AssignmentRule();
        AR = [select id from AssignmentRule where SobjectType = 'Case' and Active = true limit 1];

        //Creating the DMLOptions for "Assign using active assignment rules" checkbox
        Database.DMLOptions dmlOpts = new Database.DMLOptions();
        dmlOpts.assignmentRuleHeader.assignmentRuleId= AR.id;
        dmlOpts.EmailHeader.triggerAutoResponseEmail= true;
        caseRecord.setOptions(dmlOpts);
        Id caseRecordTypeId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('FAA_Inquiries').getRecordTypeId();
        if(caseRecordTypeId != null)
        caseRecord.recordTypeId=caseRecordTypeId;
        try {
         insert caseRecord;
         caseRecord=[select id,casenumber from case where id=:caseRecord.Id];
        }catch (DMLException e) {
            throw new AuraHandledException(e.getDmlMessage(0));    
        }
        return caseRecord;
    }*/

    // method to fetch picklist values from an object
    @AuraEnabled
    public static List<String> getPicklistvalues(String objectName, String field_apiname,Boolean nullRequired){
        List<String> optionlist = new List<String>();       
        Map<String,Schema.SObjectType> gd = Schema.getGlobalDescribe(); 
        Map<String, Schema.SObjectField> field_map = gd.get(objectName.toLowerCase()).getDescribe().fields.getMap();        
        List<Schema.PicklistEntry> picklistValues = field_map.get(field_apiname).getDescribe().getPickListValues();       
        if(nullRequired == true){
            optionlist.add('--None--');
        }       
        for (Schema.PicklistEntry pv : picklistValues) {
            optionlist.add(pv.getValue());
        }
        return optionlist;
    }

    //method to search case from the casenumber and contact email
    @AuraEnabled
    public static Case searchCase(String caseNumber, string contactEmail) {
        Case caseRecordFound;
        try {
            List<case> caseLst=[select format(createddate),status,caseNumber from case where caseNumber=:caseNumber and contact.email=:contactEmail limit 1];
            if(caseLst != null && caseLst.size()==1){
                caseRecordFound=caseLst[0];
            }   
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());    
        }
        return caseRecordFound;
    }

    @AuraEnabled
    public static Knowledge__DataCategorySelection checkDataCategoryAssignedToArticle(String articleId) {
        Boolean isDataCategoryMapped;
        Knowledge__DataCategorySelection dataCategorySelection;
        //boolean ispagerefresh=false;
        List<Knowledge__DataCategorySelection> knowledgerecord=[SELECT Id, ParentId,parent.title FROM Knowledge__DataCategorySelection where parentid=:articleId limit 1];
        if(knowledgerecord != null && knowledgerecord.size()==1){
            dataCategorySelection=knowledgerecord[0];
            isDataCategoryMapped=true;
        }
        else
         isDataCategoryMapped=false;  
         /*Knowledge__kav knowKav=[SELECT Id, KnowledgeArticleId, PublishStatus, Title, FAA_hasDataCategory__c FROM Knowledge__kav where id=:articleId];
         if(!knowKav.FAA_hasDataCategory__c && isDataCategoryMapped){
            knowKav.FAA_hasDataCategory__c=true;
            update knowKav;
            ispagerefresh=true;
         }
         else if(!isDataCategoryMapped && knowKav.FAA_hasDataCategory__c){
            knowKav.FAA_hasDataCategory__c=false;
            update knowKav;
            ispagerefresh=true;
         }*/
          
         return dataCategorySelection;
    }
    
    @AuraEnabled
    public static void publishArt(string knowledgeArticleId,date scheduledate,boolean flagasnew) {
        try{
            Id articleId=[SELECT Id, KnowledgeArticleId FROM KnowledgeArticleVersion where id=:knowledgeArticleId].KnowledgeArticleId;
        if(scheduledate == null)
          KbManagement.PublishingService.publishArticle(articleId, flagasnew);
        else
          KbManagement.PublishingService.scheduleForPublication(articleId, scheduledate);
        }catch (Exception e) {
            throw new AuraHandledException(e.getMessage());    
        }
    }

}